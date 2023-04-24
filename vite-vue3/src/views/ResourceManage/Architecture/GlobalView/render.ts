import { AssetsPreview, ArchitecturePaintParams, ModelInterface } from '@/types/architecture'
import { get, uniqBy, uniqWith } from 'lodash'

export interface BusinessAssetPreview {
  id: string,
  type: string | null,
  count: number | null,
  children: Array<BusinessAssetPreview> | undefined
}

export interface HierarchyResult {
  id: number
  x: number
  y: number
  data: BusinessAssetPreview
  children: HierarchyResult[]
}

function pushModel (nodes: any[], data: any) {
  nodes.push({
    id: data.id,
    shape: data.isRoot ? 'business-item' : 'asset-item',
    label: data.type,
    width: data.isRoot ? 200 : 50,
    height: 50,
    attrs: {
      body: {
        fill: '#5F95FF',
        stroke: 'transparent'
      }
    },
    data
  })
}

function pushEdge (edges: any[], sourceId: string, targetId: string) {
  edges.push({
    source: sourceId,
    target: targetId,
    router: { name: 'manhattan' },
    connector: { name: 'rounded' },
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeWidth: 1,
        targetMarker: null
      }
    }
  })
}

export function prepareData (businessInfo: any, params: AssetsPreview, includeParams: ArchitecturePaintParams): ModelInterface {
  const modules = includeParams.modules
  const countryParams = includeParams.countries
  const providers = includeParams.providers
  const assetTypes = includeParams.assetTypes
  const vpcAssets = params.vpc_assets
  const regionAssets = params.region_assets
  const model: ModelInterface = { nodes: [], edges: [] }
  const source = {
    id: String(businessInfo.business_id),
    isRoot: true,
    type: 'business',
    children: []
  }
  pushModel(model.nodes, source)
  const countries = []
  const regions = []
  // 处理国家
  if (modules.includes('country')) {
    uniqBy(vpcAssets.concat(regionAssets), 'country_en').filter(
      (item: any) => countryParams.includes(item.country_en)
    ).forEach((item: any) => {
      const data = {
        id: item.country_en,
        name: item.country_zh,
        code: item.country,
        children: [],
        type: 'country'
      }
      pushModel(model.nodes, data)
      pushEdge(model.edges, source.id, data.id)
      countries.push(data)
    })
  }
  // 处理厂商
  if (modules.includes('provider')) {
    uniqWith(
      vpcAssets.concat(regionAssets),
      (a: any, b: any) => {
        if (modules.includes('country')) {
          return a.country_en === b.country_en && a.provider_key === b.provider_key
        } else {
          return a.provider_key === b.provider_key
        }
      }
    ).filter(item => providers.includes(item.provider_key) && (!modules.includes('country') || countryParams.includes(item.country_en))).forEach((item: any) => {
      const data = {
        id: modules.includes('country') ? `${item.country_en}#${item.provider_key}` : item.provider_key,
        name: item.provider_key,
        children: [],
        type: 'provider'
      }
      pushModel(model.nodes, data)
      pushEdge(model.edges, modules.includes('country') ? item.country_en : source.id, data.id)
      regions.push(data)
    })
  }
  // 处理地域
  if (modules.includes('region')) {
    uniqWith(
      vpcAssets.concat(regionAssets),
      (a: any, b: any) => a.region === b.region && a.provider_key === b.provider_key
    ).filter(
      item => providers.includes(item.provider_key) && (!modules.includes('country') || countryParams.includes(item.country_en))
    ).forEach((item: any) => {
      const data = {
        id: `${item.provider_key}#${item.region}`,
        name: item.region_name,
        children: [],
        type: 'region'
      }
      pushModel(model.nodes, data)
      let targetId = source.id
      if (modules.includes('provider') && modules.includes('country')) {
        targetId = `${item.country_en}#${item.provider_key}`
      } else if (modules.includes('provider') && !modules.includes('country')) {
        targetId = item.provider_key
      } else if (modules.includes('country')) {
        targetId = item.country_en
      }
      pushEdge(model.edges, targetId, data.id)
      regions.push(data)
    })
  }
  // 处理vpc
  if (assetTypes.includes('vpc') && modules.includes('asset')) {
    // 展开vpc
    if (modules.includes('vpc')) {
      vpcAssets.filter(
        (item: any) => (!modules.includes('provider') || providers.includes(item.provider_key)) && (!modules.includes('country') || countryParams.includes(item.country_en))
      ).forEach((item: any) => {
        const data = {
          id: `${item.provider_key}#${item.vpc}`,
          name: item.vpc_name,
          children: [],
          type: 'vpc'
        }
        pushModel(model.nodes, data)
        let targetId = source.id
        if (modules.includes('region')) {
          targetId = `${item.provider_key}#${item.region}`
        } else if (modules.includes('provider') && modules.includes('country')) {
          targetId = `${item.country_en}#${item.provider_key}`
        } else if (modules.includes('provider') && !modules.includes('country')) {
          targetId = item.provider_key
        } else if (modules.includes('country')) {
          targetId = item.country_en
        }
        pushEdge(model.edges, targetId, data.id)
        regions.push(data)
      })
    } else {
      // 合并vpc
      uniqWith(
        vpcAssets,
        (a: any, b: any) => {
          if (modules.includes('region')) {
            return a.region === b.region && a.provider_key === b.provider_key
          }
          if (modules.includes('provider') && modules.includes('country')) {
            return a.country_en === b.country_en && a.provider_key === b.provider_key
          }
          if (modules.includes('provider')) {
            return a.provider_key === b.provider_key
          }
          return true
        }
      ).filter(
        (item: any) => (!modules.includes('provider') || providers.includes(item.provider_key)) && (!modules.includes('country') || countryParams.includes(item.country_en))
      ).forEach((item: any) => {
        let id = 'vpc'
        let count = 1
        if (modules.includes('region')) {
          id = `${item.provider_key}#${item.region}#vpc`
          count = vpcAssets.filter((vpc: any) => vpc.region === item.region && item.provider_key === vpc.provider_key).length
        } else if (modules.includes('provider') && modules.includes('country')) {
          id = `${item.country_en}#${item.provider_key}#vpc`
          count = vpcAssets.filter((vpc: any) => vpc.country_en === item.country_en && item.provider_key === vpc.provider_key).length
        } else if (modules.includes('provider')) {
          id = `${item.provider_key}#vpc`
          count = vpcAssets.filter((vpc: any) => item.provider_key === vpc.provider_key).length
        } else {
          count = vpcAssets.length
        }
        const data = {
          id,
          name: id,
          children: [],
          type: 'vpc',
          count
        }
        pushModel(model.nodes, data)
        let targetId = source.id
        if (modules.includes('region')) {
          targetId = `${item.provider_key}#${item.region}`
        } else if (modules.includes('provider') && modules.includes('country')) {
          targetId = `${item.country_en}#${item.provider_key}`
        } else if (modules.includes('provider') && !modules.includes('country')) {
          targetId = item.provider_key
        } else if (modules.includes('country')) {
          targetId = item.country_en
        }
        pushEdge(model.edges, targetId, data.id)
      })
    }
  }
  // 处理资产
  if (modules.includes('asset')) {
    // 处理挂载到vpc的资产
    vpcAssets.filter(
      (item: any) => (!modules.includes('provider') || providers.includes(item.provider_key)) && (!modules.includes('country') || countryParams.includes(item.country_en))
    ).every((item: any) => {
      assetTypes.filter(t => t !== 'vpc').forEach(asset => {
        if (!get(item, `${asset}_count`, null)) {
          return true
        }
        let id = `${item.provider_key}#${item.vpc}#${asset}`
        if (!modules.includes('vpc') || !assetTypes.includes('vpc')) {
          if (modules.includes('region')) {
            id = `${item.provider_key}#${item.region}#${asset}`
          } else if (modules.includes('provider')) {
            id = `${item.country_en}#${item.provider_key}#${asset}`
          } else if (modules.includes('country')) {
            id = `${item.country_en}#${asset}`
          } else {
            id = asset
          }
        }
        const temp = model.nodes.find(node => node.id === id)
        if (temp) {
          temp.data.count += get(item, `${asset}_count`, 0)
          return true
        }
        const data = {
          id,
          name: asset,
          children: [],
          type: 'asset',
          assetType: asset,
          count: get(item, `${asset}_count`, 0)
        }
        pushModel(model.nodes, data)
        let targetId = source.id
        if (modules.includes('vpc') && assetTypes.includes('vpc')) {
          targetId = `${item.provider_key}#${item.vpc}`
        } else if (assetTypes.includes('vpc') && !modules.includes('vpc')) {
          targetId = 'vpc'
          if (modules.includes('region')) {
            targetId = `${item.provider_key}#${item.region}#vpc`
          } else if (modules.includes('provider') && modules.includes('country')) {
            targetId = `${item.country_en}#${item.provider_key}#vpc`
          } else if (modules.includes('provider')) {
            targetId = `${item.provider_key}#vpc`
          }
        } else if (modules.includes('region')) {
          targetId = `${item.provider_key}#${item.region}`
        } else if (modules.includes('provider') && modules.includes('country')) {
          targetId = `${item.country_en}#${item.provider_key}`
        } else if (modules.includes('provider') && !modules.includes('country')) {
          targetId = item.provider_key
        } else if (modules.includes('country')) {
          targetId = item.country_en
        }
        pushEdge(model.edges, targetId, data.id)
      })
      return true
    })
    // 处理不挂载vpc，只挂载region的资产
    regionAssets.filter(
      (item: any) => (!modules.includes('provider') || providers.includes(item.provider_key)) && (!modules.includes('country') || countryParams.includes(item.country_en))
    ).every((item: any) => {
      assetTypes.filter(t => t !== 'vpc').forEach(asset => {
        if (!get(item, `${asset}_count`, null)) {
          return true
        }
        let id = asset
        if (modules.includes('region')) {
          id = `${item.provider_key}#${item.region}#${asset}`
        } else if (modules.includes('provider')) {
          id = `${item.country_en}#${item.provider_key}#${asset}`
        } else if (modules.includes('country')) {
          id = `${item.country_en}#${asset}`
        } else {
          id = asset
        }
        const temp = model.nodes.find(node => node.id === id)
        if (temp) {
          temp.data.count += get(item, `${asset}_count`, 0)
          return true
        }
        const data = {
          id,
          name: asset,
          children: [],
          type: 'asset',
          assetType: asset,
          count: get(item, `${asset}_count`, 0)
        }
        pushModel(model.nodes, data)
        let targetId = source.id
        if (modules.includes('region')) {
          targetId = `${item.provider_key}#${item.region}`
        } else if (modules.includes('provider') && modules.includes('country')) {
          targetId = `${item.country_en}#${item.provider_key}`
        } else if (modules.includes('provider') && !modules.includes('country')) {
          targetId = item.provider_key
        } else if (modules.includes('country')) {
          targetId = item.country_en
        }
        pushEdge(model.edges, targetId, data.id)
      })
      return true
    })
  }

  return model
}
