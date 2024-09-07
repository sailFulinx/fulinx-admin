interface ThemeListParams {
  themeName?: string | null
}

interface ThemeData {
  /* Theme ID */
  id: number

  /* Theme Name */
  themeName: string

  /* Theme Type, 1: open 2: describe 3: custom */
  themeType: number

  /* Theme Author */
  themeAuthor: string

  /* Theme Version */
  themeVersion: string

  /* Theme Thumb File ID */
  themeThumbFileId: number

  themeThumbFileVo: FileData

  /* Theme Config */
  themeConfig: string

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

interface ThemeRequest {
  /* Theme Name */
  themeName: string

  /* Theme Type */
  themeType: number | null

  /* Theme Author */
  themeAuthor: string

  /* Theme Version */
  themeVersion: string

  /* Theme Thumb File ID */
  themeThumbFileId?: number | null

  themeThumbFileVo?: FileData

  /* Theme Config */
  themeConfig?: string
}

interface ThemeConfigRequest {
  /* Theme Config */
  themeConfig: string
}

interface ThemeRemoveRequest {
  ids: number[]
}

interface LinkData {
  linkUrl: string
  linkValue: string
  label: string
  linkType: string
  children: LinkData[]
}

interface MenuData {
  id: number
  label: string
  linkUrl?: string
  linkType?: string
  linkValue?: string
  link?: LinkData
  menuType?: string
  isDropDownCustom?: boolean
  image?: FileData
  children?: MenuData[]
}

interface ComponentConfig {
  content: any
  status: boolean
}

interface ComponentData {
  backendComponentCode: string
  componentConfig: ComponentConfig
  componentName: string
  isRequiredAliasName: boolean
  aliasName: string
  id: number
  sort: number
  frontComponentIdentifyCode: string
}

interface ReadContentData {
  readContentValue: number
  readContentType: string
}

interface ThemeContentDataType {
  id: number
  themeContentCode: string
  themeContentName: string
  components: ComponentData[]
}
