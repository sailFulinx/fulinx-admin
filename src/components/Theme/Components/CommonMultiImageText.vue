<script setup name="CommonImageText" lang="ts">
import { hasContentElements } from '@/utils'
import { ElMessage } from 'element-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const formRef = ref()

interface MultiImageTextItem {
  id: number
  image: FileData
  imageLink: LinkData
  width: number
  height: number
  alt: string
  title: string
  textList: string[]
  buttonText: string
  buttonLink: LinkData
}

interface FormData {
  content: {
    imageTextList: MultiImageTextItem[]
  }
  status: boolean
}
const createForm = (): FormData => {
  return {
    content: {
      imageTextList: [],
    },
    status: true,
  }
}
let form = reactive<FormData>(createForm())
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
  const file = form.content.imageTextList?.[val]
  if (file && file.id) {
    form.content.imageTextList?.splice(val, 1)
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
  form.content.imageTextList = fileRes.fileDataList
  return form
}

async function setFormData(formData: FormData) {
  await nextTick()
  if (hasContentElements(formData.content)) {
    if (formData.content.imageTextList && Array.isArray(formData.content.imageTextList)) {
      uploadRef.value.setFileData(formData.content.imageTextList)
    }
    form = { ...formData }
  } else {
    form = reactive({ ...createForm() })
  }
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div>
    <ElForm ref="formRef" v-model="form" label-width="60px" class="mt-2">
      <ElFormItem label="图片" required>
        <UploadMultiImageText ref="uploadRef" @remove-file="getRemovedFiles" />
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
