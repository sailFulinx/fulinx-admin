d
<script setup lang="ts">
import { createArticle, editArticle, fetchArticleTypeListApi, showArticle } from '@/api/article'
import { listCategoryApi } from '@/api/category'
import { fetchLanguageListApi } from '@/api/language'
import { articleStatuses } from '@/data/article'
import { components } from '@/data/component'
import { useTagsViewStore } from '@/stores/tagsView'
import { convertCustomTypeValue } from '@/utils/general'
import { ElInput, ElMessage } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const id = Number(useRoute().params.id)

const uploadRef = ref()

const vueDraggableRef = ref()

const sourceUrl = useFileRootUrl()

const rules = reactive({
  articleType: [{ required: true, type: 'number', message: '内容类型必填', trigger: 'change' }],
  languageId: [{ required: true, type: 'number', message: '语言必须选择', trigger: 'change' }],
  articleName: [{ required: true, type: 'string', message: '内容名称必须填写', trigger: 'blur' }],
  status: [{ required: true, type: 'boolean', message: '状态必填', trigger: 'change' }],
  articleDescription: [{ required: true, type: 'string', message: '内容描述必须填写', trigger: 'blur' }],
  metaTitle: [{ required: true, type: 'string', message: '元标题必须填写', trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
})

const pageTitle = computed(() => (props.isEdit ? '编辑内容' : '添加内容'))

const articleTypePayload = reactive<ArticleTypeListParams>({
  articleTypeCode: null,
})

const articleTypes = ref<ListArticleTypeRes>({
  list: [],
  total: 0,
})

const getArticleTypeList = async () => {
  const { data } = await fetchArticleTypeListApi(articleTypePayload).catch(error => {
    throw error
  })
  articleTypes.value = { ...data }
}

getArticleTypeList()

const languagePayload = reactive<LanguageListParams>({
  languageCode: null,
})

const languages = ref<ListLanguageRes>({
  list: [],
  total: 0,
})

const getLanguageList = async () => {
  const { data } = await fetchLanguageListApi(languagePayload).catch(error => {
    throw error
  })
  languages.value.list = data.list
}

getLanguageList()

const articleFormRef = ref()

const customs = ref<any[]>([])

const customRef = ref()

const currentComponentRef = ref()

const customVisible = ref(false)

// Define a variable to hold the previous selected categories
const previousSelectedCategories = ref<string[] | number[] | any>([])

const currentCustomData = ref({
  id: 0,
  customTitle: '',
  customContent: '',
})

const articleForm = ref<ArticleRequest>({
  languageId: null,
  articleType: null,
  articleDescription: '',
  articleName: '',
  fileIds: [],
  fileList: [],
  categoryIds: [],
  deletedCategoryIds: [],
  deletedFileIds: [],
  metaDescription: '',
  metaTitle: '',
  status: true,
  tags: [],
  deletedTagIds: [],
  isCustomLayout: false,
  customs: '',
})

const customLayouts = ref<ComponentData[]>([])

const categories = ref<any[]>([])

const inputTagValue = ref<TagItemType>({
  id: 0,
  tag: '',
})
const inputTagVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const tags = ref<TagItemType[]>([])

const handleClose = (index: number) => {
  if (tags.value && tags.value.length > 0) {
    if (tags.value[index].id && tags.value[index]) {
      articleForm.value.deletedTagIds?.push(tags.value[index].id)
    }
    tags.value.splice(index, 1)
  }
}

const showInput = () => {
  inputTagVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputTagValue.value.tag.length >= 3) {
    tags.value.push({ id: 0, tag: inputTagValue.value.tag })
  }
  inputTagVisible.value = false
  inputTagValue.value.tag = ''
}

const getCategories = async () => {
  try {
    const { data } = await listCategoryApi()
    categories.value = data.list
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const editorRef = ref()

const selectedCategoryValue = ref<string[] | number[] | any>([])

const getArticleData = async () => {
  loading.init = true
  try {
    const { data } = await showArticle(id)
    editorRef.value.setEditData(data.articleDescription)
    selectedCategoryValue.value = data.categoryIds
    tags.value = data.tags
    if (data.fileList) {
      uploadRef.value.setFileData(data.fileList)
    }
    if (data.customs) {
      (data.isCustomLayout ? customLayouts : customs).value = JSON.parse(data.customs)
    }
    Object.assign(articleForm.value, {
      ...data,
      isCustomLayout: Boolean(data.isCustomLayout), // 将数值 1 转为 true
    })
    articleForm.value.categoryIds = []
    previousSelectedCategories.value = [...data.categoryIds]
  } catch (error) {
    console.error('Failed to fetch article data:', error)
  } finally {
    loading.init = false
  }
}

const getRemovedFiles = (val: number) => {
  const file = articleForm.value.fileList?.[val]
  if (file && file.id) {
    articleForm.value.deletedFileIds?.push(file.id)
    articleForm.value.fileList?.splice(val, 1)
  }
}

const init = async () => {
  if (props.isEdit && id) {
    await getArticleData()
  }
}

const cascaderProps = {
  expandTrigger: 'hover' as const,
  label: 'categoryName',
  value: 'id',
  multiple: true,
}

const handleRemoveCategory = (val: number[]) => {
  console.log(val)
  // articleForm.value.deletedCategoryIds?.push(val.pop())
  // articleForm.value.deletedCategoryIds = [...new Set(articleForm.value.deletedCategoryIds)]
}

// Watch for changes in selectedCategoryValue
watch(
  () => selectedCategoryValue.value,
  (newVal, oldVal) => {
    // 扁平化新值和旧值
    const flatNewVal = newVal.flat()
    const flatOldVal = oldVal.flat()

    // 找出被删除的项
    const removedCategories = flatOldVal.filter((item: number[]) => !flatNewVal.includes(item))

    if (removedCategories) {
      // 去重并添加到 deletedCategoryIds 中
      const uniqueRemovedCategories = [...new Set(removedCategories)] as number[]
      articleForm.value.deletedCategoryIds?.push(...uniqueRemovedCategories)
    }

    // 更新 previousSelectedCategories
    previousSelectedCategories.value = [...flatNewVal]
  },
)

const handleChangeCategory = (val: number[]) => {
  console.log(val)
}

// const tagsViewStore = useTagsViewStore()

// const deleteTagView = (refresh: boolean) => {
//   if (refresh) {
//     tagsViewStore.delCachedView()
//   }
//   tagsViewStore.delVisitedView(router.currentRoute.value)
//   router.push({ name: 'Article' })
// }

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

const closeViewTag = () => { }

// 动态导入所有组件
const componentModules = import.meta.glob('@/components/Theme/Components/*.vue')

// 动态获取组件
const getComponent = (componentCode: string) => {
  const componentPath = `/src/components/Theme/Components/${componentCode}.vue`
  if (componentModules[componentPath]) {
    return defineAsyncComponent(componentModules[componentPath] as () => Promise<any>)
  } else {
    console.error(`Component not found: ${componentCode}`)
    return null
  }
}

// 添加组件Dialog是否显示
const addComponentDialogVisible = ref<boolean>(false)

// 添加组件
const handleAddComponent = () => {
  addComponentDialogVisible.value = true
}

const dragging = ref(false)

function sortCurrentThemeContentComponents() {
  customLayouts.value.forEach((item, index) => {
    item.sort = index + 1
  })
}

function dragEnd() {
  sortCurrentThemeContentComponents()
}

// 设置组件Dialog是否显示
const settingComponentDialogVisible = ref<boolean>(false)

const createComponentData = (): ComponentData => {
  return {
    backendComponentCode: '',
    componentConfig: {
      content: {},
      status: true,
    },
    componentName: '',
    isRequiredAliasName: false,
    aliasName: '',
    id: 0,
    sort: 0,
    frontComponentIdentifyCode: '',
  }
}

// 组件选择的数据
const selectComponentData = ref<ComponentData>(createComponentData())

// 当前设置的组件
const currentComponentData = ref<ComponentData | null>(null)

const aliasName = ref<string>('')

// 设置组件
const handleSettingComponent = async (item: ComponentData) => {
  if (!item.isRequiredAliasName) {
    item.isRequiredAliasName = true
    item.aliasName = item.componentName
  }
  aliasName.value = item.aliasName
  currentComponentData.value = item
  settingComponentDialogVisible.value = true
}

// 删除组件
const handleRemoveComponent = (index: number) => {
  customLayouts.value.splice(index, 1)
}

// 保存当前主题内容数据
const handleSaveCustomLayouts = () => {
  if (customLayouts.value.length > 0) {
    // 计算相同的 backendComponentCode 数量
    const sameComponentCount = customLayouts.value.filter(
      component => component.backendComponentCode === selectComponentData.value.backendComponentCode,
    ).length
    if (sameComponentCount > 0) {
      // 如果存在相同组件，编号从 1 开始
      selectComponentData.value.frontComponentIdentifyCode = `${selectComponentData.value.backendComponentCode}${sameComponentCount + 1}`
    } else {
      // 如果不存在相同组件，编号也从 1 开始
      selectComponentData.value.frontComponentIdentifyCode = `${selectComponentData.value.backendComponentCode}1`
    }
  } else {
    // 如果没有其他组件，编号从 1 开始
    selectComponentData.value.frontComponentIdentifyCode = `${selectComponentData.value.backendComponentCode}1`
  }

  // 设置 id 和排序，保证唯一
  const newComponentData = { ...selectComponentData.value } // 创建新对象副本
  newComponentData.id = customLayouts.value.length + 1
  newComponentData.sort = customLayouts.value.length + 1

  customLayouts.value.push(newComponentData)

  // 重置 selectComponentData
  selectComponentData.value = createComponentData()

  addComponentDialogVisible.value = false
}

// 保存当前组件数据
const handleSaveCurrentComponentData = async () => {
  if (currentComponentRef.value && typeof currentComponentRef.value.getFormData === 'function') {
    const formData = await currentComponentRef.value.getFormData()
    if (!formData) {
      return
    }
    customLayouts.value.map(item => {
      if (item.frontComponentIdentifyCode === currentComponentData.value?.frontComponentIdentifyCode) {
        item.componentConfig = formData
        item.aliasName = aliasName.value
      }
    })
  } else {
    console.error('Component does not have getFormData method')
  }
  currentComponentRef.value = null
  settingComponentDialogVisible.value = false
  currentComponentData.value = null
}

const save = async () => {
  if (selectedCategoryValue.value.length > 0) {
    selectedCategoryValue.value.map((item: number[]) => {
      if (item && item.length > 1) {
        articleForm.value.categoryIds?.push(item.pop() as number)
      } else {
        articleForm.value.categoryIds?.push(item[0])
      }
    })
  }
  const valid = await articleFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  if (tags.value.length > 0) {
    articleForm.value.tags = tags.value.map(item => item.tag)
  }
  if (articleForm.value.isCustomLayout) {
    articleForm.value.customs = JSON.stringify(customLayouts.value)
  } else {
    articleForm.value.customs = JSON.stringify(customs.value)
    articleForm.value.articleDescription = editorRef.value.getEditData()
    const files = uploadRef.value.getFileData()
    if (files.fileDataList && files.fileDataList.length > 0) {
      files.fileDataList.map((item: FileData) => {
        articleForm.value.fileIds?.push(item.id as number)
      })
    }
  }
  if (props.isEdit) {
    await editArticle(id, articleForm.value).catch(err => {
      throw err
    })
  } else {
    await createArticle(articleForm.value).catch(err => {
      throw err
    })
  }
  // deleteTagView(true)
  ElMessage({
    message: '保存成功',
    type: 'success',
    duration: 2000,
  })
}

onMounted(() => {
  getCategories()
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
      <ElForm ref="articleFormRef" :model="articleForm" :rules="rules" label-width="120px">
        <ElCard shadow="never">
          <ElFormItem label="内容类型" prop="articleType">
            <ElSelect v-model="articleForm.articleType">
              <ElOption
                v-for="item in articleTypes.list"
                :key="item.id"
                :value="item.id"
                :label="item.articleTypeName"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem v-if="articleForm.articleType === 2" label="是否自定义布局" prop="isCustomLayout">
            <ElSwitch v-model="articleForm.isCustomLayout" />
          </ElFormItem>
          <ElFormItem label="状态" prop="status">
            <ElSelect v-model="articleForm.status">
              <ElOption v-for="item in articleStatuses" :key="item.id" :value="item.value" :label="item.label" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem v-if="articleForm.articleType !== 2" label="分类" prop="categoryId">
            <ElCascader
              v-model="selectedCategoryValue"
              :options="categories"
              :props="cascaderProps"
              clearable
              filterable
              @remove-tag="handleRemoveCategory"
              @change="handleChangeCategory"
            />
          </ElFormItem>
          <ElFormItem label="语言" prop="languageId">
            <ElSelect v-model="articleForm.languageId">
              <ElOption v-for="item in languages.list" :key="item.id" :value="item.id" :label="item.languageName" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="标题" prop="articleName">
            <ElInput
              v-model="articleForm.articleName"
              class="input-line"
              minlength="1"
              maxlength="120"
              placeholder="标题，少于120个字符"
            />
          </ElFormItem>
          <ElFormItem label="元标题" prop="metaTitle">
            <ElInput
              v-model="articleForm.metaTitle"
              class="input-line"
              minlength="1"
              maxlength="60"
              placeholder="元标题，少于60个字符"
            />
          </ElFormItem>
          <ElFormItem label="元描述" prop="metaDescription">
            <ElInput
              v-model="articleForm.metaDescription"
              class="input-line"
              type="textarea"
              rows="4"
              maxlength="160"
              placeholder="描述，少于160个字符"
            />
          </ElFormItem>
          <div v-if="!articleForm.isCustomLayout">
            <ElFormItem label="内容标签">
              <ElTag
                v-for="(tag, index) in tags"
                :key="index"
                closable
                :disable-transitions="false"
                class="mr-2"
                @close="handleClose(index)"
              >
                {{ tag.tag }}
              </ElTag>
              <ElInput
                v-if="inputTagVisible"
                ref="InputRef"
                v-model="inputTagValue.tag"
                class="w-20"
                size="small"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <ElButton v-else class="button-new-tag" size="small" @click="showInput">
                + 新标签
              </ElButton>
            </ElFormItem>
            <ElFormItem label="图片">
              <UploadMultiImage ref="uploadRef" @remove-file="getRemovedFiles" />
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
            <ElFormItem label="内容" prop="articleDescription">
              <Editor ref="editorRef" v-model="articleForm.articleDescription" :height="300" />
            </ElFormItem>
          </div>
        </ElCard>
        <ElCard v-if="articleForm.isCustomLayout" shadow="never" class="mt-5">
          <template #header>
            <div class="card-header">
              <div class="flex justify-between items-center">
                <span>组件</span>
                <div class="flex justify-between">
                  <div class="flex items-center justify-between cursor-pointer" @click="handleAddComponent">
                    <span><Icon icon="ant-design:plus-outlined" class="mr-1" /></span>
                    <span>添加</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <VueDraggable ref="vueDraggableRef" v-model="customLayouts" item-key="sort" @start="dragging = true" @end="dragEnd">
            <div
              v-for="(item, index) in customLayouts" :key="index"
              class="w-full mb-3 h-9 flex justify-between items-center border-1 border-gray-300 px-6 py-6 cursor-pointer"
            >
              <span class="flex flex-grow items-center">
                <Icon icon="ant-design:holder-outlined" class="mr-1" />
                <ElTag type="info" class="mr-1">排序：{{ item.sort }}</ElTag>
                <ElTag type="warning" class="mr-1">{{ item.componentName }}</ElTag>
                <ElTag v-if="item.aliasName" class="mr-1">{{ item.aliasName }}</ElTag>
                <ElTag :type="`${item.componentConfig.status ? 'success' : 'danger'}`">{{ item.componentConfig.status ? '启用' : '禁用' }}</ElTag>
              </span>
              <span class="flex">
                <EBtn text @click="handleSettingComponent(item)">设置</EBtn>
                <EBtn text type="danger" @click="handleRemoveComponent(index)">删除</EBtn>
              </span>
            </div>
          </VueDraggable>
        </ElCard>
      </ElForm>
    </div>
    <ElDialog v-model="addComponentDialogVisible" title="添加组件">
      <ElSelect v-model="selectComponentData" value-key="id" placeholder="请选择">
        <ElOption v-for="item in components" :key="item.id" :label="item.componentName" :value="item" />
      </ElSelect>
      <template #footer>
        <div class="dialog-footer">
          <EBtn @click="addComponentDialogVisible = false">
            取消
          </EBtn>
          <EBtn type="primary" @click="handleSaveCustomLayouts">
            提交
          </EBtn>
        </div>
      </template>
    </ElDialog>

    <ElDialog v-model="settingComponentDialogVisible" title="设置组件" width="70%">
      <div v-if="currentComponentData?.isRequiredAliasName">
        <ElForm label-width="140px">
          <ElFormItem label="组件别名" required>
            <ElInput v-model="aliasName" placeholder="请输入组件别名" />
          </ElFormItem>
        </ElForm>
      </div>
      <!-- 使用Vue3的动态组件，根据backendComponentCode获取对应的组件，动态展示 -->
      <component
        :is="getComponent(currentComponentData.backendComponentCode)"
        v-if="currentComponentData && currentComponentData.componentConfig"
        ref="currentComponentRef"
        :component-data="currentComponentData.componentConfig"
        v-bind="currentComponentData"
      />
      <template #footer>
        <div class="dialog-footer">
          <EBtn @click="settingComponentDialogVisible = false">
            取消
          </EBtn>
          <EBtn type="primary" @click="handleSaveCurrentComponentData">
            提交
          </EBtn>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped></style>
