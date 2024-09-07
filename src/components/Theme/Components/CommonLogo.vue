<script setup name="CommonLogo" lang="ts">
import { ElMessage } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})
interface FormData {
  content: {
    logo: FileData
    width: number
    height: number
    alt: string
  }
  status: boolean
}
const form = ref<FormData>({
  content: {
    logo: {
      id: 0,
      originalFileName: '',
      fileName: '',
      fileContentType: '',
      fileExtensionName: '',
      path: '',
      fileUrl: '',
      sha256: '',
    },
    width: 151,
    height: 24,
    alt: '',
  },
  status: true,
})
watch(
  () => props.componentData,
  val => {
    if (val) {
      setFormData(val)
    }
  },
  { immediate: true },
)
const uploadSingleRef = ref()
async function getFormData() {
  const fileRes = uploadSingleRef.value.getFileData()
  if (!fileRes || !fileRes.fileData || fileRes.fileData.id === 0) {
    ElMessage.error('请上传图片')
    return false
  }
  form.value.content.logo = fileRes.fileData
  return form.value
}

function setFormData(formData) {
  form.value = formData
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div>
    <ElForm ref="formRef" v-model="form" label-width="140px">
      <ElFormItem label="网站Logo" required>
        <UploadSingleImage ref="uploadSingleRef" :image-data="form.content.logo" />
      </ElFormItem>
      <ElFormItem label="Logo宽度">
        <ElInputNumber v-model="form.content.width" :min="1" :max="500" placeholder="请输入Logo宽度" />
        像素(px)
      </ElFormItem>
      <ElFormItem label="Logo高度">
        <ElInputNumber v-model="form.content.height" :min="1" :max="500" placeholder="请输入Logo高度" />
        像素(px)
      </ElFormItem>
      <ElFormItem label="Alt标签">
        <ElInput v-model="form.content.alt" placeholder="请输入Alt标签" />
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
