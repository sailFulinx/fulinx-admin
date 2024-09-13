<script setup name="CommonText" lang="ts">
import { ElMessage } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

interface FormData {
  content: {
    text: string[]
  }
  status: boolean
}

const form = reactive<FormData>({
  content: {
    text: [''],
  },
  status: true,
})

const rules = reactive({
  'content.text': [{ required: true, type: 'string', message: '请输入文字内容', trigger: 'blur' }],
})

onMounted(() => {
  if (!props.componentData) {
    return
  }
  setFormData(props.componentData)
})

const formRef = ref()

const handleAddText = () => {
  form.content.text.push('') // 新增一行文字内容
  form.content.text = [...form.content.text] // 重新赋值以确保响应式更新
}

const handleRemove = (index: number) => {
  form.content.text.splice(index, 1) // 删除指定的文字内容
  form.content.text = [...form.content.text] // 重新赋值以确保响应式更新
}

async function getFormData() {
  if (form.content.text.length === 0 || form.content.text[0] === '') {
    ElMessage.error('请输入文字内容')
    return false
  }
  return form
}

function setFormData(formData: FormData) {
  if (formData.content.text && Array.isArray(formData.content.text)) {
    form.content.text = [...formData.content.text] // 确保重新赋值，触发响应式
  }

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
      <ElFormItem label="文字内容" required>
        <div v-for="(item, index) in form.content.text" :key="index" class="w-full mb-4">
          <div class="flex">
            <ElInput v-model="form.content.text[index]" placeholder="请输入文字内容" />
            <EBtn text type="danger" class="ml-5" @click="handleRemove(index)">
              <Icon icon="ep:delete" />
            </EBtn>
          </div>
        </div>
        <EBtn @click="handleAddText">
          <Icon icon="ep:plus" />
          增加一行文字
        </EBtn>
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
