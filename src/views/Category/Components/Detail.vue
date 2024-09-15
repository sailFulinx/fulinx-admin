<script setup name="ProductDetail" lang="ts">
import { resolve } from 'node:path'
import { createCategoryApi, editCategoryApi, listCategoryApi, showCategoryApi } from '@/api/category'
import { useLocale } from '@/hooks/useLocale'
import { useAppStore } from '@/stores/app'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'
import { convertCustomTypeValue } from '@/utils/general'
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

const sourceUrl = useFileRootUrl()

const id = Number(useRoute().params.id as unknown)

const languages = useGetLanguageList() as LanguageData[]

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const activeLanguageTab = ref<string>('')

const languageTabs = ref<LanguageData[]>([])

const uploadRefs = ref<(ComponentPublicInstance | null)[]>([])

const editorRefs = ref<(ComponentPublicInstance | null)[]>([])

const loading = reactive({
  init: false,
  categories: false,
})

// 创建category内容
const createCategoryContent = (languageData: LanguageData): CategoryDetailItem => {
  return {
    languageId: languageData.id,
    languageName: languageData.languageName,
    categoryName: '',
    categoryDescription: '',
    categoryFileId: 0,
    metaDescription: '',
    metaTitle: '',
  }
}

// 创建category请求参数
const createFormData = () => {
  return {
    parentId: 0,
    parentIds: [],
    status: true,
    categoryDetailVoList: [createCategoryContent(selectLanguage.value)],
  }
}

const form = reactive<CategoryRequestParams>(createFormData())

const cascaderProps = {
  value: 'id',
  checkStrictly: true,
  label: 'categoryName',
  children: 'children',
  disabled: 'disabled',
}

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

const customVisible = ref(false)

const currentCustomData = ref({
  id: 0,
  customTitle: '',
  customContent: '',
})

const customRef = ref()

const customs = ref<any[]>([])

const initCustomData = () => {
  currentCustomData.value = {
    id: 0,
    customTitle: '',
    customContent: '',
  }
  customRef.value.setFormData(currentCustomData.value)
}

const handleAddCustom = () => {
  customVisible.value = true
}

const handleRemoveCustom = (index: number) => {
  customs.value.splice(index, 1)
}

const handleEditCustom = (index: number) => {
  customVisible.value = true
  currentCustomData.value = customs.value[index]
  customRef.value.setFormData(currentCustomData.value)
}

const cancelEditCustomData = () => {
  customVisible.value = false
  initCustomData()
}

const getCustomData = (val: CustomDataType) => {
  if (val.id === 0) {
    val.id = customs.value.length + 1
    customs.value.push(val)
  } else {
    customs.value.forEach((item, index) => {
      if (item.id === val.id) {
        customs.value[index] = val
      }
    })
  }
  initCustomData()
  customVisible.value = false
}

const handleAddCategoryDetail = () => {
  // 查询languageTabs中存不存在此languageName, 如果存在，抛出错误，不存在则添加
  let valid = true
  form.categoryDetailVoList.forEach(item => {
    if (item.languageId === selectLanguage.value.id) {
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
  form.categoryDetailVoList.push(createCategoryContent(selectLanguage.value))
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

const itemRefs: Array<any> = []
const setItemRefs = (el: HTMLElement | ComponentPublicInstance | HTMLAttributes, item: number) => {
  if (el) {
    itemRefs.push({
      id: item,
      el,
    })
  }
}

// onMounted(() => {
//   console.log(itemRefs)
// })

const getCategoryData = async () => {
  loading.init = true
  const { data } = await showCategoryApi(id).catch(error => {
    loading.init = false
    throw error
  })

  Object.assign(form, data)
  form.categoryDetailVoList = data.categoryDetailDoList

  if (form.parentIds && form.parentIds[0] !== 0) {
    form.parentIds.unshift(0)
  }
  loading.init = false
  return form
}

onMounted(async () => {
  console.log(editorRefs?.value)
  // console.log(props.isEdit)
  if (props.isEdit) {
    const res = await getCategoryData()
    await nextTick(() => {
      res.categoryDetailVoList.forEach((item, index) => {
        if (editorRefs?.value[index]) {
          editorRefs?.value[index].setEditorData(item.categoryDescription)
        }
      })
    })
  }
})

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

// const init = async () => {
//   if (props.isEdit) {
//     await getCategoryData()
//   }
// }

// await init()
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
  // 校验categoryRequestForm下的所有表单项
  form.categoryDetailVoList.forEach((item, index) => {
    if (!item.categoryName) {
      ElMessage({
        type: 'error',
        message: $t('category.error.categoryName'),
      })
      return false
    }
    if (!item.languageId) {
      ElMessage({
        type: 'error',
        message: $t('category.error.languageName'),
      })
      return false
    }
    if (!item.metaTitle) {
      ElMessage({
        type: 'error',
        message: $t('category.error.metaTitle'),
      })
      return false
    }
    if (uploadRefs.value[index]) {
      const categoryFileVo = uploadRefs.value[index].getFileData()
      item.categoryFileId = categoryFileVo.fileData.id
    }
    if (editorRefs.value[index]) {
      item.categoryDescription = editorRefs.value[index].getEditorData()
    }
    return item
  })

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
            <Icon icon="ant-design:save-outlined" class="mr-1" />
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card">
      <ElForm ref="formRef" :model="form" label-width="120px">
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

          <ElFormItem :label="$t('category.status')" prop="status" required>
            <ElSwitch v-model="form.status" />
          </ElFormItem>
        </ElCard>
        <ElCard shadow="never">
          <template #header>
            <div class="flex justify-between">
              <div>分类内容</div>
              <div class="flex items-center justify-start">
                <ElSelect
                  v-model="selectLanguage"
                  placeholder="请选择"
                  value-key="id"
                  filterable
                  clearable
                  class="mr-3"
                  style="width: 200px"
                >
                  <ElOption v-for="item in languages" :key="item.id" :label="item.languageName" :value="item" />
                </ElSelect>
                <EBtn size="default" plain type="primary" @click="handleAddCategoryDetail">
                  <Icon icon="ep:plus" class="mr-1" />
                  新增语言
                </EBtn>
              </div>
            </div>
          </template>

          <ElTabs v-model="activeLanguageTab">
            <ElTabPane
              v-for="(item, index) in form.categoryDetailVoList"
              :key="item"
              :label="item.languageName"
              :name="item.languageName"
            >
              <ElFormItem :label="$t('category.categoryName')" prop="categoryName" required>
                <ElInput
                  v-model="item.categoryName"
                  class="input-line"
                  clearable
                  show-word-limit
                  minlength="1"
                  maxlength="120"
                  :placeholder="$t('category.placeholder.categoryName')"
                />
              </ElFormItem>
              <ElFormItem :label="$t('category.metaTitle')" prop="metaTitle" required>
                <ElInput
                  v-model="item.metaTitle"
                  class="input-line"
                  minlength="1"
                  maxlength="60"
                  :placeholder="$t('category.placeholder.metaTItle')"
                />
              </ElFormItem>
              <ElFormItem :label="$t('category.metaDescription')" prop="metaDescription">
                <ElInput
                  v-model="item.metaDescription"
                  class="input-line"
                  type="textarea"
                  rows="4"
                  maxlength="160"
                  :placeholder="$t('category.placeholder.metaDescription')"
                />
              </ElFormItem>
              <ElFormItem :label="$t('category.description')" prop="categoryDescription">
                <Editor ref="editorRefs" v-model="item.categoryDescription" />
              </ElFormItem>
              <ElFormItem :label="$t('category.image')">
                <UploadSingleImage
                  :ref="el => (uploadRefs[index] = el)"
                  :image-data="item.categoryFileVo"
                  class="mr-2"
                />
              </ElFormItem>
              <ElFormItem label="自定义信息" class="flex flex-wrap">
                <div class="w-full mb-5">
                  <EBtn @click="handleAddCustom">
                    添加自定义信息
                  </EBtn>
                </div>
                <div v-if="customs.length > 0" class="w-full mb-5">
                  <ElTable :data="customs">
                    <ElTableColumn label="标题" prop="customTitle" />
                    <ElTableColumn label="类型">
                      <template #default="scope">
                        <span>{{ convertCustomTypeValue(scope.row.customType) }}</span>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn label="内容" prop="customContent">
                      <template #default="scope">
                        <div v-if="scope.row.customType === 'text'">
                          {{ scope.row.customContent }}
                        </div>
                        <div v-if="scope.row.customType === 'editor'">
                          <div v-html="scope.row.customContent" />
                        </div>
                        <div v-if="scope.row.customType === 'image'">
                          <div v-for="item in scope.row.customContent" :key="item">
                            <div class="flex justify-start mb-5 space-x-0 sm:space-x-2 overflow-x-auto">
                              <ElImage class="w-32 sm:w-40" :src="`${sourceUrl}${item.fileUrl}`" fit="contain" />
                            </div>
                          </div>
                        </div>
                        <div v-if="scope.row.customType === 'video'">
                          <div class="flex justify-start mb-5 space-x-0 sm:space-x-2 overflow-x-auto">
                            <video
                              class="w-32 sm:w-40"
                              :src="`${sourceUrl}${scope.row.customContent.fileUrl}`"
                              fit="contain"
                            />
                          </div>
                        </div>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn label="操作">
                      <template #default="scope">
                        <EBtn @click="handleEditCustom(scope.$index)">
                          修改
                        </EBtn>
                        <EBtn @click="handleRemoveCustom(scope.$index)">
                          删除
                        </EBtn>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
                <div v-show="customVisible" class="w-full mb-5">
                  <Customs
                    ref="customRef"
                    @get-custom-data="getCustomData"
                    @cancel-edit-custom-data="cancelEditCustomData"
                  />
                </div>
              </ElFormItem>
            </ElTabPane>
          </ElTabs>
        </ElCard>
      </ElForm>
    </div>
  </div>
</template>
