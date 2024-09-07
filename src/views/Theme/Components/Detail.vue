d
<script setup lang="ts">
import { createTheme, editTheme, showTheme } from '@/api/theme'
import { useTagsViewStore } from '@/stores/modules/tagsView'
import { ElMessage } from 'element-plus'

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const rules = reactive({
  languageId: [{ required: true, type: 'number', message: '语言必须选择', trigger: 'blur' }],
  themeName: [{ required: true, type: 'string', message: '网站名称必须填写', trigger: 'blur' }],
  domain: [{ required: true, type: 'string', message: '域名必须填写', trigger: 'blur' }],
  metaTitle: [{ required: true, type: 'string', message: '元标题必须填写', trigger: 'blur' }],
  themeThumbFileId: [{ required: true, type: 'number', message: 'Logo必须选择', trigger: 'blur' }],
})

const id = Number(useRoute().params.id)

const loading = reactive({
  init: false,
  button: false,
})

const themeFormRef = ref()

const themeForm = ref<ThemeRequest>({
  themeName: '',
  themeType: 3,
  themeAuthor: '',
  themeVersion: '',
  themeThumbFileId: null,
  themeThumbFileVo: {
    id: 0,
    originalFileName: '',
    fileName: '',
    path: '',
    fileUrl: '',
    fileExtensionName: '',
    fileContentType: '',
  },
})

const themeThumb = ref<FileData>({
  id: 0,
  originalFileName: '',
  fileName: '',
  path: '',
  fileUrl: '',
  fileExtensionName: '',
  fileContentType: '',
})

const uploadThemeThumbRef = ref()

const pageTitle = computed(() => (props.isEdit ? '编辑网站' : '添加网站'))

const getThemeData = async () => {
  loading.init = true
  try {
    const { data } = await showTheme(id)
    if (data.themeThumbFileVo) {
      themeThumb.value = data.themeThumbFileVo
    }
    uploadThemeThumbRef.value.setFileData(data.themeThumbFileVo)
    Object.assign(themeForm.value, data)
  } catch (error) {
    console.error('Failed to fetch theme data:', error)
  } finally {
    loading.init = false
  }
}

const init = async () => {
  if (props.isEdit && id) {
    await getThemeData()
  }
}

const tagsViewStore = useTagsViewStore()

const deleteTagView = (refresh: boolean) => {
  if (refresh) {
    tagsViewStore.delCachedView()
  }
  tagsViewStore.delVisitedView(router.currentRoute.value)
  router.push({ name: 'ThemeList' })
}

const save = async () => {
  const themeThumb = uploadThemeThumbRef.value.getFileData()
  themeForm.value.themeThumbFileId = themeThumb.fileData.id
  const valid = await themeFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  if (props.isEdit) {
    await editTheme(id, themeForm.value).catch(err => {
      throw err
    })
  } else {
    await createTheme(themeForm.value).catch(err => {
      throw err
    })
  }
  deleteTagView(true)
  ElMessage({
    message: '保存成功',
    type: 'success',
    duration: 2000,
  })
}

const closeViewTag = () => {
  deleteTagView(true)
}

onMounted(() => {
  init()
})
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <ElRow type="flex" justify="space-between" align="middle">
        <div>
          <h4>{{ pageTitle }}</h4>
        </div>
        <div>
          <EBtn size="small" :loading="loading.button" @click="closeViewTag()">
            取消
          </EBtn>
          <EBtn size="small" type="primary" icon="el-icon-document-add" :loading="loading.button" @click="save">
            保存
          </EBtn>
        </div>
      </ElRow>
    </div>
    <div class="view-main theme-card">
      <ElForm ref="themeFormRef" :model="themeForm" :rules="rules" label-width="120px">
        <ElRow :gutter="20" type="flex" justify="center">
          <ElCol :span="24">
            <ElCard shadow="never">
              <ElFormItem label="主题名称" prop="themeName">
                <ElInput
                  v-model="themeForm.themeName"
                  class="input-line"
                  minlength="1"
                  maxlength="120"
                  placeholder="请输入主题名称"
                />
              </ElFormItem>
              <ElFormItem label="主题作者" prop="themeAuthor">
                <ElInput
                  v-model="themeForm.themeAuthor"
                  class="input-line"
                  minlength="1"
                  maxlength="120"
                  placeholder="主题作者，少于120个字符"
                />
              </ElFormItem>
              <ElFormItem label="主题版本" prop="themeVersion">
                <ElInput
                  v-model="themeForm.themeVersion"
                  class="input-line"
                  minlength="1"
                  maxlength="120"
                  placeholder="主题版本，少于120个字符"
                />
              </ElFormItem>
              <ElFormItem label="主题效果图" prop="themeThumbFileId">
                <UploadSingleImage
                  ref="uploadThemeThumbRef"
                  :image-data="themeThumb"
                  class="mr-2"
                  style="width: 200px"
                />
              </ElFormItem>
            </ElCard>
          </ElCol>
        </ElRow>
      </ElForm>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
