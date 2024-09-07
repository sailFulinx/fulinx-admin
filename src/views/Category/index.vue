<script setup name="Category" lang="ts">
import { paginationCategoryApi, removeCategoryApi } from '@/api/category'
import { usePreferenceStore } from '@/stores/modules/preference'
import { ElMessage } from 'element-plus'

import CategoryDialog from './Components/CategoryDialog.vue'

const { t: $t } = useI18n()
const loading = reactive({
  init: false,
})

const listPayload = reactive<CategoryListParams & Pagination>({
  categoryName: null,
  languageId: usePreferenceStore().preference?.language?.id,
  id: null,
  status: null,
  isDelete: null,
  pageNumber: 1,
  pageSize: 20,
})

const listData = ref<ListCategoryRes>({
  list: [],
  total: 0,
})

const getList = async () => {
  loading.init = true
  const { data } = await paginationCategoryApi(listPayload).catch(error => {
    loading.init = true
    throw error
  })
  listData.value = { ...data }
  loading.init = false
}
getList()

watch(
  () => usePreferenceStore().preference?.language?.id,
  val => {
    if (val) {
      listPayload.languageId = val
      getList()
    }
  },
)

const paginationList = (val: PaginationComponentData) => {
  if (val) {
    listPayload.pageSize = val.limit
    listPayload.pageNumber = val.page
  }
  getList()
}

const categoryDialogRef = ref()

const selection = ref<CategoryData & CommonField[]>()

const deleteIds = ref<number[]>([])

// 选中
const handleSelectionChange = (e: CategoryData & CommonField[]) => {
  deleteIds.value = []
  if (e.length === 0) {
    return
  }
  selection.value = e
  selection.value.forEach(item => {
    deleteIds.value.push(item.id)
  })
}

const handleCreate = () => {
  categoryDialogRef.value.openDialog(false)
}

const handleEdit = (val: CategoryData & CommonField) => {
  categoryDialogRef.value.openDialog(true, val)
}

const handleCreateSubCategory = (val: CategoryData & CommonField) => {
  categoryDialogRef.value.openDialog(false, val)
}

const handleDelete = async (val: CategoryData & CommonField) => {
  deleteIds.value = [val.id]
  await handleMultiDelete()
}

const handleMultiDelete = async () => {
  if (deleteIds.value.length === 0) {
    ElMessage({
      message: $t('warning.emptySelection'),
      type: 'warning',
    })
    return
  }
  loading.init = true
  const payload = {
    ids: deleteIds.value,
  }
  await removeCategoryApi(payload).catch(error => {
    loading.init = false
    throw error
  })
  await getList()
  ElMessage.success($t('success.remove'))
  loading.init = false
  deleteIds.value = []
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <Sticky>
        <div class="flex justify-between">
          <div class="flex items-center">
            <div class="mr-3">
              {{ $t('category.name') }}
            </div>
            <div class="flex items-center">
              <ElInput
                v-model="listPayload.categoryName"
                class="mr-3"
                clearable
                style="width: 300px"
                :placeholder="`请输入${$t('category.categoryName')}`"
                @clear="getList"
              />
              <EBtn type="default" plain @click="getList">
                <Icon icon="ep:search" />
              </EBtn>
            </div>
          </div>
          <div>
            <EBtn @click="handleCreate">
              {{ $t('common.create') }}
            </EBtn>
            <EBtn type="danger" @click="handleMultiDelete">
              {{ $t('common.remove') }}
            </EBtn>
          </div>
        </div>
      </Sticky>
    </div>

    <div v-if="!loading.init" class="view-main">
      <ElTable
        :data="listData.list"
        stripe
        row-key="id"
        style="width: 100%"
        tooltip-effect="dark"
        highlight-current-row
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn ref="tableRef" type="selection" stripe row-key="id" width="55" />
        <ElTableColumn prop="id" :label="`${$t('common.id')}`" width="120" />
        <ElTableColumn prop="categoryName" :label="`${$t('category.categoryName')}`" />
        <ElTableColumn fixed="right" :label="`${$t('common.action')}`" width="230">
          <template #default="scope">
            <EBtn text type="default" @click="handleCreateSubCategory(scope.row)">
              <Icon icon="ep:plus" />
            </EBtn>
            <EBtn text type="primary" @click="handleEdit(scope.row)">
              <Icon icon="ep:edit-pen" />
            </EBtn>
            <EBtn text type="danger" @click="handleDelete(scope.row)">
              <Icon icon="ep:delete" />
            </EBtn>
          </template>
        </ElTableColumn>
      </ElTable>

      <Pagination
        v-show="listData.total > listPayload.pageSize"
        v-model:page="listPayload.pageNumber"
        v-model:limit="listPayload.pageSize"
        :total="listData.total"
        @pagination="paginationList"
      />

      <CategoryDialog ref="categoryDialogRef" @get-list="getList" />
    </div>
  </div>
</template>
