<script setup name="CommonImageMulti" lang="ts">
import { ElMessage } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})
interface FormData {
  content: {
    images: FileData[]
  }
  status: boolean
}
let form = reactive<FormData>({
  content: {
    images: [],
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

const getRemovedFiles = (val: number) => {
  const file = form.content.images?.[val]
  if (file && file.id) {
    form.content.images?.splice(val, 1)
  }
}

const uploadRef = ref()
async function getFormData() {
  await nextTick()
  const fileRes = uploadRef.value.getFileData()
  if (!fileRes || !fileRes.fileDataList || fileRes.fileDataList.length === 0) {
    ElMessage.error('请上传图片')
    return false
  }
  form.content.images = fileRes.fileDataList
  return form
}

async function setFormData(formData) {
  await nextTick()
  uploadRef.value.setFileData(formData.content.images)
  form = formData
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
        <UploadMultiImage ref="uploadRef" @remove-file="getRemovedFiles" />
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
