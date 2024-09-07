<script setup name="CommonText" lang="ts">
import { ElMessage } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

interface FormData {
  content: {
    contentData: ReadContentData
  }
  status: boolean
}

const form = reactive<FormData>({
  content: {
    contentData: {
      readContentType: '',
      readContentValue: 0,
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

const moduleReadContentRef = ref()

async function getFormData() {
  form.content.contentData = await moduleReadContentRef.value.getReadContentData()
  if (
    !form.content.contentData
    || !form.content.contentData.readContentValue
    || !form.content.contentData.readContentType
  ) {
    ElMessage.error('请配置内容')
    return false
  }
  return form
}

async function setFormData(formData: FormData) {
  await nextTick()
  await moduleReadContentRef.value.setReadContentData(formData.content.contentData)
  form.status = formData.status
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div>
    <ElForm ref="formRef" :model="form" label-width="140px">
      <ElFormItem label="内容" required>
        <ModuleReadContent ref="moduleReadContentRef" />
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
