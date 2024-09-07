<script setup name="CommonImageText" lang="ts">
import { ElMessage } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})
interface FormData {
  content: {
    image: FileData
    width: number
    height: number
    alt: string
    text: string
  }
  status: boolean
}
const form = ref<FormData>({
  content: {
    image: {
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
    text: '',
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
  if (!form.value.content.text || form.value.content.text === '') {
    ElMessage.error('请输入文本内容')
    return false
  }
  form.value.content.image = fileRes.fileData
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
      <ElFormItem label="图片" required>
        <UploadSingleImage ref="uploadSingleRef" :image-data="form.content.image" />
      </ElFormItem>
      <ElFormItem label="图片宽度">
        <ElInputNumber v-model="form.content.width" :min="1" :max="500" placeholder="请输入Logo宽度" />
        像素(px)
      </ElFormItem>
      <ElFormItem label="图片高度">
        <ElInputNumber v-model="form.content.height" :min="1" :max="500" placeholder="请输入Logo高度" />
        像素(px)
      </ElFormItem>
      <ElFormItem label="Alt标签">
        <ElInput v-model="form.content.alt" placeholder="请输入Alt标签" />
      </ElFormItem>
      <ElFormItem label="文字" required>
        <ElInput v-model="form.content.text" type="textarea" rows="2" placeholder="请输入文字" />
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
