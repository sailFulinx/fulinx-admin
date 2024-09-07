interface FileData {
  id?: number
  uid?: number
  originalFileName: string
  fileName: string
  fileContentType: string
  fileExtensionName: string
  path: string
  fileUrl: string
  sha256?: string
}

interface FileTextData {
  id?: number
  uid?: number
  originalFileName: string
  fileName: string
  fileContentType: string
  fileExtensionName: string
  path: string
  fileUrl: string
  sha256?: string
  fileLink: LinkData
  width: number
  height: number
  alt: string
  title: string
  textList: string[]
  buttonText: string
  buttonLink: LinkData
}
