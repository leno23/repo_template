import { defineStore } from 'pinia'
import { AssetsPreview } from '@/types/architecture'

export interface ArchitectureStoreModel {
  modules: string[];
  country: string[];
  regions: string[];
  accounts: number[];
  assetTypes: string[];
  provider: string[];
  originData: AssetsPreview;
}

export const useArchitectureStore = defineStore({
  id: 'architecture',
  state: (): ArchitectureStoreModel => ({
    modules: ['country', 'region', 'provider', 'vpc', 'asset'],
    country: [],
    regions: [],
    accounts: [],
    assetTypes: [],
    provider: [],
    originData: {
      region_assets: [],
      vpc_assets: []
    }
  }),
  actions: {
    setOriginData (originData: AssetsPreview) {
      this.originData = originData
    },
    setCountries (countries: string[]) {
      this.country = countries
    },
    setProvider (providers: string[]) {
      this.provider = providers
    },
    setAssetTypes (assetTypes: string[]) {
      this.assetTypes = assetTypes
    }
  }
})
