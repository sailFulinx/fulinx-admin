<script setup name="ProductDetail" lang="ts">
import { createCategoryApi, editCategoryApi, listCategoryApi, showCategoryApi } from '@/api/category'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'
import { ElMessage } from 'element-plus'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const { t: $t } = useLocale()

const id = Number(useRoute().params.id as unknown)

const languages = useGetLanguageList() as LanguageData[]

const language = usePreferenceStore().preference?.language

const uploadRef = ref()

const loading = reactive({
  init: false,
  categories: false,
})

const form = reactive<CategoryData>({
  id: 0,
  categoryDescription: '',
  languageCode: '',
  languageId: language.id,
  categoryName: '',
  categoryFileId: null,
  linkUrl: '',
  categoryFileVo: {
    id: 0,
    originalFileName: '',
    fileName: '',
    fileContentType: '',
    fileExtensionName: '',
    path: '',
    fileUrl: '',
    sha256: '',
  },
  metaDescription: '',
  metaKeywords: '',
  metaTitle: '',
  parentId: null,
  status: true,
  parentIds: [],
})

const rules = reactive({
  parentId: [{ required: true, type: 'number', message: $t('category.rules.parentId'), trigger: 'blur' }],
  categoryName: [{ required: true, type: 'string', message: $t('category.rules.categoryName'), trigger: 'blur' }],
  metaTitle: [{ required: true, type: 'string', message: $t('category.rules.metaTitle'), trigger: 'blur' }],
  status: [{ required: true, type: 'boolean', message: $t('category.rules.status'), trigger: 'blur' }],
  isMenu: [{ required: true, type: 'boolean', message: $t('category.rules.isMenu'), trigger: 'blur' }],
})

const selectLanguage = ref<LanguageData>({
  id: 0,
  code: '',
  languageName: '',
})

const cascaderProps = {
  value: 'id',
  checkStrictly: true,
  label: 'categoryName',
  children: 'children',
  disabled: 'disabled',
}

const activeLanguageTab = ref<string>('')

const languageTabs = ref<LanguageData[]>([])

watch(
  () => usePreferenceStore().preference?.language,
  val => {
    if (val) {
      activeLanguageTab.value = val.languageName
      languageTabs.value.push(val)
    }
  },
  { immediate: true },
)

const handleAddContent = () => {
  // 查询languageTabs中存不存在此languageName, 如果存在，抛出错误，不存在则添加
  let valid = true
  languageTabs.value.forEach(item => {
    if (item.languageName === selectLanguage.value.languageName) {
      ElMessage({
        type: 'error',
        message: $t('category.error.languageNameExist'),
      })
      valid = false
    }
  })
  if (!valid) {
    return
  }
  languageTabs.value.push(selectLanguage.value)
}

// Language
const categoriesData = ref<ListCategoryRes>({
  list: [],
  total: 0,
})

const disableAllChildren = (children: CategoryData[]) => {
  if (!children || children.length === 0) {
    return
  }

  children.forEach(child => {
    child.disabled = true
    if (child.children) {
      disableAllChildren(child.children)
    }
  })
}

const disableCategoryById = (categories: CategoryData[], id: number) => {
  return categories.map(item => {
    if (item.id === id) {
      item.disabled = true
      // 如果当前节点的 id 匹配，设置所有子节点的 disabled 为 true
      if (item.children) {
        disableAllChildren(item.children)
      }
    }

    // 递归处理子节点
    if (item.children && item.children.length > 0) {
      disableCategoryById(item.children, id)
    }

    return item
  })
}

const getCategoriesData = async () => {
  loading.categories = true
  const { data } = await listCategoryApi().catch(error => {
    loading.categories = false
    throw error
  })
  let newCategories: any[] = []
  if (data.list.length !== 0) {
    newCategories[0] = {
      id: 0,
      categoryName: '一级栏目',
      children: data.list,
    }
  } else {
    newCategories[0] = {
      id: 0,
      categoryName: '一级栏目',
    }
  }
  newCategories = disableCategoryById(newCategories, id)
  categoriesData.value.list = newCategories
  loading.categories = false
}

getCategoriesData()

const handleChangeCategory = () => {}

const getCategoryData = async () => {
  loading.init = true
  const { data } = await showCategoryApi(id).catch(error => {
    loading.init = false
    throw error
  })
  Object.assign(form, data)
  console.log(form)
  if (form.parentIds && form.parentIds[0] !== 0) {
    form.parentIds.unshift(0)
  }
  loading.init = false
}

const createCategory = async () => {
  loading.init = true
  await createCategoryApi(form).catch(error => {
    loading.init = false
    throw error
  })
  ElMessage.success($t('success.create'))
  loading.init = false
}

const editCategory = async () => {
  loading.init = true
  await editCategoryApi(id, form).catch(error => {
    loading.init = false
    throw error
  })
  ElMessage.success($t('success.edit'))
  loading.init = false
}

const init = async () => {
  if (props.isEdit) {
    await getCategoryData()
  }
}

init()
// const tagsViewStore = useTagsViewStore()

// const deleteTagView = (refresh: boolean) => {
//   if (refresh) {
//     tagsViewStore.delCachedView()
//   }
//   tagsViewStore.delVisitedView(router.currentRoute.value)
//   router.push({ name: 'Category' })
// }

const formRef = ref()
const handleSave = async () => {
  form.parentId = form.parentIds?.at(-1) as number
  const valid = await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  console.log(uploadRef.value)
  const categoryFileVo = uploadRef.value.getFileData()
  form.categoryFileId = categoryFileVo.fileData.id
  if (props.isEdit) {
    await editCategory()
  } else {
    await createCategory()
  }
  // deleteTagView(true)
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between">
        <div>
          <span>{{ title }}</span>
        </div>
        <div>
          <!-- <EBtn @click="deleteTagView(true)">
            {{ $t('common.cancel') }}
          </EBtn> -->
          <EBtn type="primary" @click="handleSave">
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card">
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
        <ElCard class="mb-5" shadow="never">
          <template #header>
            <div class="card-header">
              <span>基础信息</span>
            </div>
          </template>
          <ElFormItem :label="$t('category.parentId')" required>
            <div v-loading="loading.categories">
              <ElCascader
                v-model="form.parentIds"
                :props="cascaderProps"
                :options="categoriesData.list"
                :show-all-levels="false"
                @change="handleChangeCategory"
              />
            </div>
          </ElFormItem>

          <ElFormItem :label="$t('category.status')" prop="status">
            <ElSwitch v-model="form.status" />
          </ElFormItem>
        </ElCard>
        <ElCard shadow="never">
          <template #header>
            <div class="flex justify-between">
              <div>分类内容</div>
              <div class="flex items-center justify-start">
                <ElSelect v-model="selectLanguage" placeholder="请选择" value-key="id" filterable clearable class="mr-3" style="width: 200px">
                  <ElOption
                    v-for="item in languages"
                    :key="item.id"
                    :label="item.languageName"
                    :value="item"
                  />
                </ElSelect>
                <EBtn size="default" plain type="primary" @click="handleAddContent">
                  <Icon icon="ep:plus" class="mr-1" />
                  新增语言
                </EBtn>
              </div>
            </div>
          </template>

          <ElTabs v-model="activeLanguageTab">
            <ElTabPane
              v-for="item in languageTabs"
              :key="item"
              :label="item.languageName"
              :name="item.languageName"
            >
              <ElFormItem label="语言" prop="categoryName">
                <ElSelect v-model="languageTab.id">
                  <ElOption v-for="item in languages" :key="item.id" :value="item.id" :label="item.languageName" />
                </ElSelect>
              </ElFormItem>
              <ElFormItem :label="$t('category.categoryName')" prop="categoryName">
                <ElInput
                  v-model="form.categoryName"
                  class="input-line"
                  clearable
                  show-word-limit
                  minlength="1"
                  maxlength="120"
                  :placeholder="$t('category.placeholder.categoryName')"
                />
              </ElFormItem>
              <ElFormItem :label="$t('category.metaTitle')" prop="metaTitle">
                <ElInput
                  v-model="form.metaTitle"
                  class="input-line"
                  minlength="1"
                  maxlength="60"
                  :placeholder="$t('category.placeholder.metaTItle')"
                />
              </ElFormItem>
              <ElFormItem :label="$t('category.metaDescription')" prop="metaDescription">
                <ElInput
                  v-model="form.metaDescription"
                  class="input-line"
                  type="textarea"
                  rows="4"
                  maxlength="160"
                  :placeholder="$t('category.placeholder.metaDescription')"
                />
              </ElFormItem>
              <ElFormItem :label="$t('category.description')" prop="categoryDescription">
                <Editor v-model="form.categoryDescription" class="z-0" />
              </ElFormItem>
              <ElFormItem :label="$t('category.image')">
                <UploadSingleImage ref="uploadRef" :image-data="form.categoryFileVo" class="mr-2" />
              </ElFormItem>
            </ElTabPane>
          </ElTabs>
        </ElCard>
      </ElForm>
    </div>
  </div>
</template>
