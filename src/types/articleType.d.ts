interface ArticleListParams {
  articleName?: string | null
  articleId?: number | null | string
}

interface ArticleData {
  articleDescription: string
  articleName: string
  categoryId: number
  categoryIds: Record<string, unknown>[]
  fileList: {
    fileContentType: string
    fileExtensionName: string
    fileName: string
    fileUrl: string
    id: number
    isDelete: number
    originalFileName: string
    path: string
    recordCreateName: string
    recordCreateTime: Record<string, unknown>
    recordUpdateName: string
    recordUpdateTime: Record<string, unknown>
    recordVersion: number
    remark: string
    sha256: string
    userId: number
  }[]
  id: number
  isDelete: number
  metaDescription: string
  metaTitle: string
  isCustomLayout: boolean
  customs: string
  recordCreateName: string
  recordCreateTime: Record<string, unknown>
  recordUpdateName: string
  recordUpdateTime: Record<string, unknown>
  recordVersion: number
  remark: string
  status: number
  tags: {
    articleId: number
    id: number
    isDelete: number
    recordCreateName: string
    recordCreateTime: Record<string, unknown>
    recordUpdateName: string
    recordUpdateTime: Record<string, unknown>
    recordVersion: number
    remark: string
    tag: string
  }[]
}

interface ArticleRequest {
  languageId: number | null
  articleType: number | null
  articleDescription: string
  articleName: string
  categoryIds?: number[]
  deletedCategoryIds?: number[]
  fileIds?: number[]
  fileList?: FileData[]
  deletedFileIds?: number[]
  metaDescription?: string
  metaTitle: string
  status: number | boolean
  tags?: string[]
  deletedTagIds?: number[]
  isCustomLayout: boolean
  customs: string
}

interface ArticleRemoveRequest {
  ids: number[]
}

interface TagItemType {
  tag: string
  id: number
}

interface ArticleTypeListParams {
  articleTypeCode: string | null
}

interface ArticleTypeData {
  code: string
  id: number
  articleTypeName: string
}

interface ListArticleTypeRes {
  list: ArticleTypeData[]
  total: number
}

interface CustomDataType {
  id: number
  customType: string
  customTitle: string
  customContent: any
}
