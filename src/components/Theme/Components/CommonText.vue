<script setup name="CommonText" lang="ts">
const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

interface FormData {
  content: {
    text: string
  }
  status: boolean
}

const form = reactive<FormData>({
  content: {
    text: '',
  },
  status: true,
})

const rules = reactive({
  'content.text': [{ required: true, type: 'string', message: '请输入文字内容', trigger: 'blur' }],
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

const formRef = ref()

async function getFormData() {
  const valid = await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  return form
}

function setFormData(formData: FormData) {
  form.content.text = formData.content.text
  form.status = formData.status
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div>
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="140px">
      <ElFormItem label="文字内容" prop="content.text">
        <ElInput v-model="form.content.text" placeholder="请输入文字内容" />
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
