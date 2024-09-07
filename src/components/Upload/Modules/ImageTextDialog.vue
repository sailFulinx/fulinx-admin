<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'

const emit = defineEmits(['save'])

const picLinkRef = ref()

const buttonLinkRef = ref()

const dialogVisible = ref(false)

const formRef = ref()

let form = reactive<FileTextData>({
  id: 0,
  originalFileName: '',
  fileName: '',
  fileContentType: '',
  fileExtensionName: '',
  path: '',
  fileUrl: '',
  sha256: '',
  fileLink: {
    linkUrl: '',
    linkValue: '',
    label: '',
    linkType: '',
    children: [],
  },
  width: 150,
  height: 150,
  alt: '',
  title: '',
  textList: [],
  buttonText: '',
  buttonLink: {
    linkUrl: '',
    linkValue: '',
    label: '',
    linkType: '',
    children: [],
  },
})

const handleAddText = () => {
  form.textList.push('')
  console.log(form.textList)
}

const init = () => {
  form = reactive<FileTextData>({
    id: 0,
    originalFileName: '',
    fileName: '',
    fileContentType: '',
    fileExtensionName: '',
    path: '',
    fileUrl: '',
    sha256: '',
    fileLink: {
      linkUrl: '',
      linkValue: '',
      label: '',
      linkType: '',
      children: [],
    },
    width: 150,
    height: 150,
    alt: '',
    title: '',
    textList: [],
    buttonText: '',
    buttonLink: {
      linkUrl: '',
      linkValue: '',
      label: '',
      linkType: '',
      children: [],
    },
  })
}

const handleVisible = async (val?: FileTextData) => {
  dialogVisible.value = true
  if (val) {
    init()
    form = Object.assign(form, val)
    await nextTick()
    picLinkRef.value.setLinkData(form.fileLink)
    buttonLinkRef.value.setLinkData(form.buttonLink)
  }
}

const changeLinkType = (val: { linkType: string, linkUrl: string, linkValue: string }) => {
  if (!form.fileLink) {
    return
  }
  form.fileLink.linkType = val.linkType
  form.fileLink.linkUrl = val.linkUrl
  form.fileLink.linkValue = val.linkValue
}

const setFormData = (val: FileTextData) => {
  form = val
}

const getFormData = () => {
  return form
}

const handleSave = async () => {
  form.fileLink = await picLinkRef.value.getLinkData()
  form.buttonLink = await buttonLinkRef.value.getLinkData()
  dialogVisible.value = false
  emit('save', form)
  init()
}

defineExpose({
  getFormData,
  setFormData,
  handleVisible,
})
</script>

<template>
  <ElDialog v-model="dialogVisible" :title="`编辑${form.originalFileName}`">
    <ElForm ref="formRef" v-model="form" label-width="100px">
      <ElFormItem label="图片链接">
        <ModuleLink ref="picLinkRef" :link-data="form.fileLink" @change-link-type="changeLinkType" />
      </ElFormItem>
      <ElFormItem label="图片宽度" class="mt-5">
        <ElInputNumber v-model="form.width" :min="1" :max="2000" placeholder="请输入Logo宽度" />
        像素(px)
      </ElFormItem>
      <ElFormItem label="图片高度" class="mt-5">
        <ElInputNumber v-model="form.height" :min="1" :max="2000" placeholder="请输入Logo高度" />
        像素(px)
      </ElFormItem>
      <ElFormItem label="图片Alt标签" class="mt-5">
        <ElInput v-model="form.alt" placeholder="请输入Alt标签" />
      </ElFormItem>
      <ElFormItem label="标题" class="mt-5">
        <ElInput v-model="form.title" placeholder="请输入标题" />
      </ElFormItem>
      <ElFormItem label="文字" class="mt-5">
        <template #default>
          <EBtn type="primary" @click="handleAddText">
            增加一行文字
          </EBtn>
          <div v-for="(item, index) in form.textList" :key="index" class="w-full mt-5">
            <ElInput v-model="form.textList[index]" placeholder="请输入描述">
              <template #append>
                <ElButton :icon="Delete" @click="form.textList.splice(index, 1)" />
              </template>
            </ElInput>
          </div>
        </template>
      </ElFormItem>

      <ElFormItem label="按钮文字" class="mt-5">
        <ElInput v-model="form.buttonText" placeholder="请输入按钮标题" />
      </ElFormItem>
      <ElFormItem label="按钮链接" class="mt-5">
        <ModuleLink ref="buttonLinkRef" :link-data="form.fileLink" @change-link-type="changeLinkType" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">
          取消
        </ElButton>
        <ElButton type="primary" @click="handleSave">
          确定
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>
