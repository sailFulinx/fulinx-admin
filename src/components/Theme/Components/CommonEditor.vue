<script setup name="CommonText" lang="ts">
import { ElMessage } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

interface FormData {
  content: {
    richText: string
  }
  status: boolean
}

const editorRef = ref()

const form = reactive<FormData>({
  content: {
    richText: '',
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

async function getFormData() {
  form.content.richText = editorRef.value.getEditData()
  if (form.content.richText === '') {
    ElMessage.error('请输入文字内容')
    return false
  }
  return form
}

async function setFormData(formData: FormData) {
  await nextTick()
  form.content.richText = formData.content.richText
  editorRef.value.setEditData(form.content.richText)
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
      <ElFormItem label="文字内容" required>
        <Editor ref="editorRef" v-model="form.content.richText" :height="300" />
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
