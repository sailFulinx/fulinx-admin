d
<script setup lang="ts">
import { createArticle, editArticle, fetchArticleTypeListApi, showArticle } from '@/api/article'
import { listCategoryApi } from '@/api/category'
import { fetchLanguageListApi } from '@/api/language'
import { articleStatuses } from '@/data/article'
import { useTagsViewStore } from '@/stores/modules/tagsView'
import { convertCustomTypeValue } from '@/utils/article'
import { ElInput, ElMessage } from 'element-plus'

import Customs from './Customs.vue'

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const id = Number(useRoute().params.id)

const sourceUrl = import.meta.env.VITE_RESOURCE_URL

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

const customVisible = ref(false)

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
  customs: '',
})

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
      customs.value = JSON.parse(data.customs)
    }
    Object.assign(articleForm.value, data)
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

const selectedCategoryValue = ref<string[] | number[] | any>([])

const handleRemoveCategory = val => {
  // articleForm.value.deletedCategoryIds?.push(val.pop())
  // articleForm.value.deletedCategoryIds = [...new Set(articleForm.value.deletedCategoryIds)]
}

// Define a variable to hold the previous selected categories
let previousSelectedCategories = ref<string[] | number[] | any>([])

// Watch for changes in selectedCategoryValue
watch(
  () => selectedCategoryValue.value,
  (newVal, oldVal) => {
    // 扁平化新值和旧值
    const flatNewVal = newVal.flat()
    console.log(flatNewVal)
    const flatOldVal = oldVal.flat()

    // 找出被删除的项
    const removedCategories = flatOldVal.filter(item => !flatNewVal.includes(item))

    if (removedCategories) {
      // 去重并添加到 deletedCategoryIds 中
      const uniqueRemovedCategories = [...new Set(removedCategories)] as number[]
      articleForm.value.deletedCategoryIds?.push(...uniqueRemovedCategories)
    }

    // 更新 previousSelectedCategories
    previousSelectedCategories.value = [...flatNewVal]
  },
)

const handleChangeCategory = val => {
  console.log(val)
}

const uploadRef = ref()
const tagsViewStore = useTagsViewStore()

const deleteTagView = (refresh: boolean) => {
  if (refresh) {
    tagsViewStore.delCachedView()
  }
  tagsViewStore.delVisitedView(router.currentRoute.value)
  router.push({ name: 'Article' })
}

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

const handleRemoveCustom = index => {
  customs.value.splice(index, 1)
}

const handleEditCustom = index => {
  customVisible.value = true
  currentCustomData.value = customs.value[index]
  customRef.value.setFormData(currentCustomData.value)
}

const cancelEditCustomData = () => {
  customVisible.value = false
  initCustomData()
}

const getCustomData = val => {
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

const save = async () => {
  if (selectedCategoryValue.value.length > 0) {
    selectedCategoryValue.value.map(item => {
      if (item.length > 1) {
        articleForm.value.categoryIds?.push(item.pop())
      } else {
        articleForm.value.categoryIds?.push(item[0])
      }
    })
  }
  const files = uploadRef.value.getFileData()
  if (files.fileDataList && files.fileDataList.length > 0) {
    files.fileDataList.map(item => {
      articleForm.value.fileIds?.push(item.id)
    })
  }
  articleForm.value.articleDescription = editorRef.value.getEditData()
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
  articleForm.value.customs = JSON.stringify(customs.value)
  if (props.isEdit) {
    await editArticle(id, articleForm.value).catch(err => {
      throw err
    })
  } else {
    await createArticle(articleForm.value).catch(err => {
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

const closeViewTag = () => {}

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
      <ElForm ref="articleFormRef" :model="articleForm" :rules="rules" label-width="90px">
        <ElRow :gutter="20" type="flex" justify="center">
          <ElCol :span="24">
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
              <ElFormItem label="状态" prop="status">
                <ElSelect v-model="articleForm.status">
                  <ElOption v-for="item in articleStatuses" :key="item.id" :value="item.value" :label="item.label" />
                </ElSelect>
              </ElFormItem>
              <ElFormItem label="分类" prop="categoryId">
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
            </ElCard>
          </ElCol>
        </ElRow>
      </ElForm>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
