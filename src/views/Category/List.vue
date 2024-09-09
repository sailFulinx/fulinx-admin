<script setup name="Category" lang="ts">
import { paginationCategoryApi, removeCategoryApi } from '@/api/category'
import { useLocale } from '@/hooks/useLocale'
import { ElMessage } from 'element-plus'

const { t: $t } = useLocale()
const loading = reactive({
  init: false,
})
const listPayload = reactive<CategoryListParams & Pagination>({
  categoryName: '',
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

const paginationList = (val: PaginationComponentData) => {
  if (val) {
    listPayload.pageSize = val.limit
    listPayload.pageNumber = val.page
  }
  getList()
}

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
  router.push({ name: 'CreateCategory' })
}

const handleEdit = (val: CategoryData & CommonField) => {
  router.push({ name: 'EditCategory', params: { id: Number(val.id) } })
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
          <div>
            <span>{{ $t('router.category') }}</span>
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
        <ElTableColumn fixed="right" :label="`${$t('common.action')}`" width="150">
          <template #default="scope">
            <EBtn size="small" type="primary" @click="handleEdit(scope.row)">
              {{ $t('common.edit') }}
            </EBtn>
            <EBtn size="small" type="danger" @click="handleDelete(scope.row)">
              {{ $t('common.remove') }}
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
    </div>
  </div>
</template>
