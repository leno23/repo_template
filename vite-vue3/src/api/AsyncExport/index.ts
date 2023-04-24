import { request } from '@/common/utils/request'

export interface AsyncExportItem {
  id: 2,
  created_by: string
  created_at: string
  updated_by: null | string,
  updated_at: null | string,
  // is_deleted: false,
  // deleted_by: null,
  // deleted_at: null,
  description: null | string,
  assets: string[],
  account_ids: number[]
  keywords: string[],
  file_name: string
  final_file_name: null | string,
  // download_path: null | string,
  status: 'pending' | 'success' | 'fail'
}

export const reqAsyncExportList = () => request<{results: AsyncExportItem[], count: number}>({ url: '/assets/export/' })

export interface AsyncExportPayload {
  assets: string[]
  account_ids: number[]
  keywords: []
  file_name: string
}

export const reqCreateAsyncExport = (data: AsyncExportPayload) => request<null>({
  url: '/assets/export/',
  method: 'POST',
  data
})

// 刷新指定导出的下载路径
export const reqFlushDownloadUrl = (id: number) => request<string>({ url: `/assets/export/${id}/flush_download_path/` })
