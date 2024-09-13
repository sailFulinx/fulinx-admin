interface CreateCategoryParams {
  categoryDescription?: string
  languageCode: string
  languageId: number | null
  categoryName: string
  fileId?: number | null
  metaDescription?: string
  metaKeywords?: string
  metaTitle: string
  parentId: number | null
  status: boolean | number | null
  parentIds?: number[]
}

interface RemoveCategoryParams {
  ids: number[]
}

interface UpdateCategoryParams {
  categoryDescription?: string
  languageCode: string
  languageId: number | null
  categoryName: string
  fileId?: number | null
  metaDescription?: string
  metaKeywords?: string
  metaTitle: string
  parentId: number | null
  status: boolean | number | null
  fileVo?: (FileData & CommonField) | null
  parentIds?: number[]
}

interface CategoryListParams {
  categoryName?: string | null
  languageId?: number | null
}

interface CategoryData {
  id: number
  categoryDescription?: string
  languageCode: string
  languageId: number | null
  categoryName: string
  categorySlug?: string
  children?: (CategoryData & CommonField)[]
  categoryFileId: number | null
  categoryFileVo: FileData
  linkUrl: string | null
  metaDescription: string
  metaKeywords: string
  metaTitle: string
  parentId: number | null
  status: boolean | number | null
  parentIds?: number[]
  disabled?: boolean
}

interface ListCategoryRes {
  list: (CategoryData & CommonField)[]
  total: number
}
