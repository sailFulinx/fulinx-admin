<script lang="ts" setup>
import { uploadFileApi } from '@/api/file'
import { Delete, Plus } from '@element-plus/icons-vue'
import { ElIcon, ElImage, ElMessage, ElUpload, type UploadFile, type UploadProps } from 'element-plus'

const emit = defineEmits(['removeFile'])

const loading = ref(false)
const beforeUploadFileDataList = ref<UploadFile[]>([])
const fileDataList = ref<FileData[]>([])
const uploadProgress = ref<{ [key: string]: number }>({})

const sourceUrl = import.meta.env.VITE_RESOURCE_URL

const handleExceed = (files: File[]) => {
  ElMessage.error('您最多只能上传10张图片!')
}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  const isJPGOrPNG = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png'
  const isLt50M = rawFile.size / 1024 / 1024 < 50

  if (!isJPGOrPNG) {
    ElMessage.error('Picture must be JPG or PNG format!')
    return false
  }
  if (!isLt50M) {
    ElMessage.error('Picture size cannot exceed 50MB!')
    return false
  }
  return true
}

const handleRemove = (index: number) => {
  emit('removeFile', index)
  fileDataList.value.splice(index, 1)
}

const processUpload = async (formData: FormData) => {
  loading.value = true
  try {
    const { data } = await uploadFileApi(formData)
    return data
  } catch (error) {
    ElMessage.error('Error uploading file!')
    console.error('Error uploading file:', error)
  } finally {
    loading.value = false
  }
}

const handleUpload = async ({ file }) => {
  beforeUploadFileDataList.value.push(file)
  const formData = new FormData()
  formData.append('file', file)
  const res = await processUpload(formData)
  if (res) {
    fileDataList.value.push(res)
  }
}

const handleSuccess = (response: any, uploadFile: UploadFile) => {
  beforeUploadFileDataList.value = beforeUploadFileDataList.value.filter(item => item.uid !== uploadFile.uid)
  delete uploadProgress.value[uploadFile.uid]
}

const handleProgress = (event: { percent: number }, uploadFile: UploadFile) => {
  uploadProgress.value[uploadFile.uid] = event.percent
}

const getFileData = () => {
  return { fileDataList: JSON.parse(JSON.stringify(fileDataList.value)) }
}

const setFileData = (fileList: FileData[]) => {
  if (fileList.length === 0) {
    return
  }
  fileDataList.value = fileList
}

defineExpose({ getFileData, setFileData })
</script>

<template>
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-5">
    <div v-for="(item, index) in fileDataList" :key="index" class="flex flex-col items-center">
      <div class="image-area flex justify-center align-center relative">
        <ElImage :src="`${sourceUrl}${item.fileUrl}`" class="image mb-2" />
        <div v-if="uploadProgress[item.uid]" class="progress-bar">
          <div class="progress-bar-inner" :style="{ width: `${uploadProgress[item.uid]}%` }" />
        </div>
      </div>
      <ElIcon class="mb-2" @click="handleRemove(index)">
        <Delete />
      </ElIcon>
    </div>
    <ElUpload
      :loading="loading"
      class="avatar-uploader"
      :multiple="true"
      action=""
      accept=".jpg,.jpeg,.png"
      :file-list="beforeUploadFileDataList"
      list-type="picture-card"
      :http-request="handleUpload"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-progress="handleProgress"
      :limit="10"
    >
      <ElIcon class="avatar-uploader-icon">
        <Plus />
      </ElIcon>
    </ElUpload>
  </div>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 180px;
  height: 180px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  text-align: center;
}
.image-area {
  width: 140px;
  height: 140px;
  position: relative;
}
.image {
  width: 148px;
  height: auto;
  overflow: hidden;
}
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.1);
}
.progress-bar-inner {
  height: 100%;
  background-color: #409eff;
  transition: width 0.2s ease;
}
</style>
