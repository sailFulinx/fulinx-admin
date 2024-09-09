<script setup name="ProductDetail" lang="ts">
import { createCategoryApi, editCategoryApi, listCategoryApi } from '@/api/category'
import { useLocale } from '@/hooks/useLocale'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['getList'])
const { t: $t } = useLocale()

const languages = useGetLanguageList() as LanguageData[]

const id = ref<number>(0)

const uploadRef = ref()

const dialogVisible = ref(false)

const loading = reactive({
  init: false,
  categories: false,
})

let form = reactive<CategoryData>({
  id: 0,
  categoryDescription: '',
  languageCode: '',
  languageId: null,
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
  languageId: [{ required: true, type: 'number', message: $t('category.rules.languageId'), trigger: 'change' }],
  parentId: [{ required: true, type: 'number', message: $t('category.rules.parentId'), trigger: 'change' }],
  categoryName: [{ required: true, type: 'string', message: $t('category.rules.categoryName'), trigger: 'blur' }],
  metaTitle: [{ required: true, type: 'string', message: $t('category.rules.metaTitle'), trigger: 'blur' }],
  status: [{ required: true, type: 'boolean', message: $t('category.rules.status'), trigger: 'change' }],
})

const cascaderProps = {
  value: 'id',
  checkStrictly: true,
  label: 'categoryName',
  children: 'children',
  disabled: 'disabled',
}

// Category
const categoriesData = ref<ListCategoryRes>({
  list: [],
  total: 0,
})

const disableCategoryById = (categories: CategoryData[], id: number) => {
  return categories.map(item => {
    if (item.id === id) {
      item.disabled = true
      // 如果当前节点的 id 匹配，设置所有子节点的 disabled 为 true
      disableAllChildren(item.children)
    }

    // 递归处理子节点
    if (item.children && item.children.length > 0) {
      disableCategoryById(item.children, id)
    }

    return item
  })
}

const disableAllChildren = children => {
  if (!children || children.length === 0) {
    return
  }

  children.forEach(child => {
    child.disabled = true
    disableAllChildren(child.children)
  })
}

const getCategoriesData = async () => {
  loading.categories = true
  const { data } = await listCategoryApi({ languageId: form.languageId }).catch(error => {
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
  if (id.value !== 0) {
    newCategories = disableCategoryById(newCategories, id.value)
  }
  categoriesData.value.list = newCategories
  loading.categories = false
}

const handleChangeCategory = () => {}

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
  await editCategoryApi(form.id, form).catch(error => {
    loading.init = false
    throw error
  })
  ElMessage.success($t('success.edit'))
  loading.init = false
}

const formRef = ref()

const isEdit = ref(false)

const languageDisabled = ref<boolean>(false)
const cascaderDisabled = ref<boolean>(false)

const resetForm = () =>
  reactive<CategoryData>({
    id: 0,
    categoryDescription: '',
    languageCode: '',
    languageId: null,
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

const openDialog = async (isEditValue: boolean, val?: CategoryData & CommonField) => {
  languageDisabled.value = false
  cascaderDisabled.value = false
  form = resetForm()
  dialogVisible.value = true
  isEdit.value = isEditValue
  if (isEditValue && val) {
    id.value = val.id
    form = val
  } else if (!isEditValue && val && val.parentIds && val.parentIds?.length > 0) {
    form.languageId = val.languageId
    languageDisabled.value = true
    cascaderDisabled.value = true
    form.parentIds = [...val.parentIds, val.id]
  }
  await getCategoriesData()
}

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
  const categoryFileVo = uploadRef.value.getFileData()
  form.categoryFileId = categoryFileVo.fileData.id
  if (isEdit.value) {
    await editCategory()
  } else {
    await createCategory()
  }
  emit('getList')
  dialogVisible.value = false
}

defineExpose({
  openDialog,
})
</script>

<template>
  <ElDrawer v-model="dialogVisible" :title="isEdit ? $t('category.edit') : $t('category.create')" size="50%">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem label="语言" prop="languageId">
        <ElSelect v-model="form.languageId" :disabled="languageDisabled" @change="getCategoriesData">
          <ElOption v-for="item in languages" :key="item.id" :value="item.id" :label="item.languageName" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('category.parentId')" prop="parentId">
        <div v-loading="loading.categories">
          <ElCascader
            v-model="form.parentIds"
            :props="cascaderProps"
            :options="categoriesData.list"
            :show-all-levels="false"
            :disabled="cascaderDisabled"
            @change="handleChangeCategory"
          />
        </div>
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
      <ElFormItem :label="$t('category.metaKeywords')" prop="metaKeywords">
        <ElInput
          v-model="form.metaKeywords"
          class="input-line"
          maxlength="155"
          :placeholder="$t('category.placeholder.metaKeywords')"
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
      <ElFormItem :label="$t('category.status')" prop="status">
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <EBtn @click="dialogVisible = false">
          取消
        </EBtn>
        <EBtn type="primary" @click="handleSave">
          提交
        </EBtn>
      </div>
    </template>
  </ElDrawer>
</template>
