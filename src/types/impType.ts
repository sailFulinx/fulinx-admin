type ImpListResponseDataType = {
  fileId: number
  id: number
  importStatus: number
  importType: number
} & CommonField

interface ImpRequestQueryParameterType {}

type ImpLogResponseDataType = {
  fileId: number
  fileVo: {
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
  } | null
  id: number
  importLogList: {
    fileId: number
    id: number
    impContent: string
    impFailedReason: string
    impId: number
    impLogStatus: number
    isDelete: number
    recordCreateName: string
    recordCreateTime: Record<string, unknown>
    recordUpdateName: string
    recordUpdateTime: Record<string, unknown>
    recordVersion: number
    remark: string
  }[]
  importStatus: number
  importType: number
} & CommonField
