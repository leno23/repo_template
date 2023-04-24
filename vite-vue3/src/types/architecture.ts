export interface AssetsPreview {
  region_assets: [];
  vpc_assets: []
}

export interface ArchitecturePaintParams {
  modules: string[];
  countries: string[];
  providers: string[];
  assetTypes: string[];
}

export interface ModelInterface {
  nodes: Array<any>
  edges: Array<any>
}
