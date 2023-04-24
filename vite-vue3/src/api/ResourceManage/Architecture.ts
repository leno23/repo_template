import { request } from '@/common/utils/request'
import { AssetsPreview } from '@/types/architecture'

export const reqBusinessAssetPreview = (id: number) => request<AssetsPreview>({
  url: '/architecture/preview/',
  method: 'GET',
  params: {
    business_id: id
  }
})
