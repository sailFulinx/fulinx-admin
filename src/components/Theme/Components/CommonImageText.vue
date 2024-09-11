<script setup name="CommonImageText" lang="ts">
import { hasContentElements } from '@/utils'
import { ElMessage } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const formRef = ref()
interface FormData {
  content: {
    image: FileData
    width: number
    height: number
    alt: string
    text: string[]
  }
  status: boolean
}

const createForm = (): FormData => {
  return {
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
      text: [''],
    },
    status: true,
  }
}

const form = ref<FormData>(createForm()) // 使用createForm正确初始化form

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

const handleAddText = () => {
  form.value.content.text.push('') // 新增一行文字内容
  form.value.content.text = [...form.value.content.text] // 重新赋值以确保响应式更新
}

const handleRemove = (index: number) => {
  form.value.content.text.splice(index, 1) // 删除指定的文字内容
  form.value.content.text = [...form.value.content.text] // 重新赋值以确保响应式更新
}

async function getFormData() {
  const fileRes = uploadSingleRef.value.getFileData()
  if (!fileRes || !fileRes.fileData || fileRes.fileData.id === 0) {
    ElMessage.error('请上传图片')
    return false
  }
  if (!form.value.content.text || form.value.content.text.length === 0) {
    ElMessage.error('请输入文字')
    return false
  }
  form.value.content.image = fileRes.fileData
  return form.value
}

function setFormData(formData: FormData) {
  if (hasContentElements(formData.content)) {
    form.value = { ...formData }
  } else {
    form.value = createForm()
  }
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
        <ElInputNumber v-model="form.content.width" :min="1" :max="500" placeholder="请输入宽度" />
        像素(px)
      </ElFormItem>
      <ElFormItem label="图片高度">
        <ElInputNumber v-model="form.content.height" :min="1" :max="500" placeholder="请输入高度" />
        像素(px)
      </ElFormItem>
      <ElFormItem label="Alt标签">
        <ElInput v-model="form.content.alt" placeholder="请输入Alt标签" />
      </ElFormItem>
      <ElFormItem label="文字" required>
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
