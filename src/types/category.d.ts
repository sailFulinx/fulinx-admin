interface CategoryDetailItem {
  /* Language Id */
  languageId: number

  /* Language Name */
  languageName: string

  /* Category Name */
  categoryName: string

  /* Category Description */
  categoryDescription?: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription?: string

  /* Category File ID */
  categoryFileId?: number

  categoryFileVo?: FileData

  /* Customs */
  customs?: string
}

interface RemoveCategoryParams {
  ids: number[]
}

interface CategoryListParams {
  /* ID */
  id?: number

  /* Language Code */
  languageCode?: string

  /* Category Name */
  categoryName?: string

  /* Status, 0: Disabled 1: Enabled */
  status?: boolean

  /* 删除标识 */
  isDelete?: number
}

interface CategoryData {
  /* Category ID */
  id: number

  /* Parent ID */
  parentId: number

  /* Parent Ids */
  parentIds: number[]

  /* Category File ID */
  categoryFileId: number

  /* */
  categoryFileVo: FileData

  /* Language Id */
  languageId: number

  /* Language Code */
  languageCode: string

  /* Category Name */
  categoryName: string

  /* Category Description */
  categoryDescription: string

  /* Customs */
  customs: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription: string

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  disabled: boolean

  /* Children */
  children: CategoryData[]
}

interface CategoryShowData {
  /* Category ID */
  id: number

  /* Parent ID */
  parentId: number

  /* Parent Ids */
  parentIds: string[]

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  /* Category Detail Do List */
  categoryDetailDoList: CategoryDetailItem[]

  /* Soft Delete Flag */
  isDelete: number

  /* Remark */
  remark: string

  /* Record Version */
  recordVersion: number

  /* Record Create Name */
  recordCreateName: string

  /* Record Update Name */
  recordUpdateName: string

  /* Record Create Time */
  recordCreateTime: string

  /* Record Update Time */
  recordUpdateTime: string
}

interface ListCategoryRes {
  list: (CategoryData & CommonField)[]
  total: number
}

interface CategoryRequestParams {
  /* Parent Id */
  parentId: number

  parentIds: number[]

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  /* 新增分类详情请求参数 */
  categoryDetailVoList: CategoryDetailItem[]

  categoryDetailDoList?: CategoryDetailItem[]
}
