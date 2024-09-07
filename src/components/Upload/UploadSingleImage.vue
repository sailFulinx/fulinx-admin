<script lang="ts" setup>
import { uploadFileApi } from '@/api/file'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, type UploadProps } from 'element-plus'

const props = defineProps({
  imageData: {
    type: Object as () => FileData,
  },
})

const loading = ref(false)

const imageUrl = ref('')

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
  () => props.imageData,
  val => {
    if (val) {
      if (val.fileUrl) {
        const image = sourceUrl + val.fileUrl
        imageUrl.value = image
      } else {
        imageUrl.value = ''
      }
      fileData.value = { ...val }
    }
  },
  { immediate: true, deep: true },
)

const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/gif') {
    ElMessage.error('图片必须是PNG或JPG或GIF格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 20) {
    ElMessage.error('Picture size can not exceed 20MB!')
    return false
  }
  return true
}

const handleUpload = async ({ file }) => {
  loading.value = true
  const formData = new FormData()
  formData.append('file', file)
  formData.append('uploadPath', 'uploads/images')
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
    class="avatar-uploader"
    action
    accept=".jpg,.jpeg,.png,.gif"
    :http-request="handleUpload"
    :show-file-list="false"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
  >
    <img v-if="imageUrl" class="h-48 w-48 rounded" :src="imageUrl">
    <ElIcon v-else class="avatar-uploader-icon">
      <Plus />
    </ElIcon>
  </ElUpload>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 1200px;
  height: 100px;
  display: block;
}
</style>

<style>
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
</style>
