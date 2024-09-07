<script lang="ts" setup>
import { uploadFileApi } from '@/api/file'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, type UploadProps } from 'element-plus'

const props = defineProps({
  videoData: {
    type: Object as () => FileData,
  },
})

const loading = ref(false)

const videoUrl = ref('')

const fileData = ref<FileData>({
  id: 0,
  originalFileName: '',
  fileName: '',
  fileContentType: '',
  fileExtensionName: '',
  path: '',
  fileUrl: '',
  sha256: '',
})

const sourceUrl = import.meta.env.VITE_RESOURCE_URL

watch(
  () => props.videoData,
  val => {
    if (val) {
      if (val.fileUrl) {
        videoUrl.value = sourceUrl + val.fileUrl
      } else {
        videoUrl.value = ''
      }
      fileData.value = { ...val }
    }
  },
  { immediate: true, deep: true },
)

const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  videoUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  if (rawFile.type !== 'video/mp4' && rawFile.type !== 'video/ogg' && rawFile.type !== 'video/webm') {
    ElMessage.error('视频必须是MP4, OGG或WEBM格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 1000) {
    ElMessage.error('视频大小不能超过1000MB!')
    return false
  }
  return true
}

const handleUpload = async ({ file }) => {
  loading.value = true
  const formData = new FormData()
  formData.append('file', file)
  formData.append('uploadPath', 'uploads/videos')
  const { data } = await uploadFileApi(formData).catch(err => {
    loading.value = false
    throw err
  })
  fileData.value = { ...data }
  loading.value = false
}

const setFileData = data => {
  fileData.value = data
}

const getFileData = () => {
  return {
    fileData: fileData.value,
  }
}

defineExpose({
  getFileData,
  setFileData,
})
</script>

<template>
  <ElUpload
    :loading="loading"
    class="video-uploader"
    action=""
    accept=".mp4,.ogg,.webm"
    :http-request="handleUpload"
    :show-file-list="false"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
  >
    <video v-if="videoUrl" class="h-48 w-48 rounded" :src="videoUrl" controls />
    <ElIcon v-else class="video-uploader-icon">
      <Plus />
    </ElIcon>
  </ElUpload>
</template>

<style scoped>
.video-uploader .video {
  width: 200px;
  height: 150px;
  display: block;
}
</style>

<style>
.video-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.video-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.video-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  text-align: center;
}
</style>
