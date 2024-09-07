<script setup name="CommonVideo" lang="ts">
import { ElMessage } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})
interface FormData {
  content: {
    video: FileData
  }
  status: boolean
}
const formRef = ref()
const form = ref<FormData>({
  content: {
    video: {
      id: 0,
      originalFileName: '',
      fileName: '',
      fileContentType: '',
      fileExtensionName: '',
      path: '',
      fileUrl: '',
      sha256: '',
    },
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
const uploadRef = ref()
async function getFormData() {
  const fileRes = uploadRef.value.getFileData()
  if (!fileRes || !fileRes.fileData || fileRes.fileData.id === 0) {
    ElMessage.error('请上传视频')
    return false
  }
  form.value.content.video = fileRes.fileData
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
      <ElFormItem label="视频" required>
        <UploadVideo ref="uploadRef" :video-data="form.content.video" />
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
