interface SiteListParams {
  siteName?: string | null
}

interface SiteData {
  /* Site ID */
  id: number

  themeId: number | null

  themeVo: ThemeData

  /* Domain */
  domain: string

  /* Language ID */
  languageId: number

  /* Site Name */
  siteName: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription: string

  /* Logo File ID */
  logoFileId: number

  /* Favicon File ID */
  faviconFileId: number

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  logoFileVo?: FileData
  faviconFileVo?: FileData

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

interface SiteRequest {
  themeId: number | null

  /* Domain */
  domain: string

  /* Language ID */
  languageId: number | null

  /* Site Name */
  siteName: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription?: string

  /* Logo File ID */
  logoFileId: number | null

  /* Favicon File ID */
  faviconFileId?: number | null

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean | number

  logoFileVo?: FileData
  faviconFileVo?: FileData
}

interface SiteRemoveRequest {
  ids: number[]
}
