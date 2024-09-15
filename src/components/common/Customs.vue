<script setup lang="ts">
import { customTypes } from '@/data/general'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['getCustomData', 'cancelEditCustomData'])

const customEditorRef = ref()

const uploadRef = ref()

const formRef = ref()

const form = reactive<CustomDataType>({
  id: 0,
  customType: 'text',
  customTitle: '',
  customContent: '',
})

const rules = reactive({
  customTitle: [{ required: true, type: 'string', message: '请输入标题', trigger: 'blur' }],
})

const getRemovedFiles = (val: number) => {
  const file = form.customContent.fileList?.[val]
  if (file && file.id) {
    form.customContent.deletedFileIds?.push(file.id)
    form.customContent.fileList?.splice(val, 1)
  }
}

const setFormData = async (data: CustomDataType) => {
  form.id = data.id
  form.customTitle = data.customTitle
  form.customContent = data.customContent
  form.customType = data.customType
  if (form.customType === 'editor') {
    await nextTick()
    customEditorRef.value.setEditorData(data.customContent)
  }

  if (form.customType === 'image') {
    await nextTick()
    uploadRef.value.setFileData(data.customContent)
  }

  if (form.customType === 'video') {
    await nextTick()
    uploadRef.value.setFileData(data.customContent)
  }
}

const getFormData = () => {
  return form
}

const saveFormData = async () => {
  const valid = await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }

  try {
    if (form.customType === 'editor') {
      await nextTick()
      form.customContent = customEditorRef?.value?.getEditorData()
    }
    if (form.customType === 'image') {
      await nextTick()
      const fileRes = uploadRef.value.getFileData()
      if (!fileRes || !fileRes.fileDataList || fileRes.fileDataList.length === 0) {
        ElMessage.error('请上传图片')
        return false
      }
      form.customContent = fileRes.fileDataList
    }
    if (form.customType === 'video') {
      await nextTick()
      const fileRes = uploadRef.value.getFileData()
      if (!fileRes || !fileRes.fileData || fileRes.fileData.id === 0) {
        ElMessage.error('请上传视频')
        return false
      }
      form.customContent = fileRes.fileData
    }
    const data = { ...form }
    emit('getCustomData', data)
  } catch (error) {
    console.log(error)
  }
}

const cancelEdit = () => {
  emit('cancelEditCustomData')
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div>
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="140px" class="w-full mb-5">
      <ElFormItem label="自定义信息标题" class="flex w-full mb-5" style="margin-bottom: 20px" prop="customTitle">
        <ElInput v-model="form.customTitle" />
      </ElFormItem>
      <ElFormItem label="自定义信息内容" class="flex w-full mb-5" style="margin-bottom: 20px">
        <ElSelect v-model="form.customType" placeholder="请选择信息类型">
          <ElOption v-for="item in customTypes" :key="item.id" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem v-if="form.customType === 'text'" label="文本内容" class="mb-20" style="margin-bottom: 20px">
        <ElInput v-model="form.customContent" :rows="4" type="textarea" />
      </ElFormItem>
      <ElFormItem v-if="form.customType === 'editor'" label="富文本内容" class="mb-5" style="margin-bottom: 20px">
        <Editor ref="customEditorRef" v-model="form.customContent" />
      </ElFormItem>
      <ElFormItem v-if="form.customType === 'image'" label="图片内容" class="mb-5" style="margin-bottom: 20px">
        <UploadMultiImage ref="uploadRef" @remove-file="getRemovedFiles" />
      </ElFormItem>
      <ElFormItem v-if="form.customType === 'video'" label="视频内容" class="mb-5" style="margin-bottom: 20px">
        <UploadVideo ref="uploadRef" :video-data="form.customContent" />
      </ElFormItem>
    </ElForm>
    <div class="flex justify-end">
      <EBtn @click="cancelEdit">
        取消
      </EBtn>
      <EBtn type="primary" @click="saveFormData">
        保存
      </EBtn>
    </div>
  </div>
</template>
