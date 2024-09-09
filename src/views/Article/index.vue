<script setup lang="ts">
import { articlePagination, removeArticle } from '@/api/article'
import { convertStatus } from '@/utils/article'
import { ElMessage } from 'element-plus'

const listResult = ref<TableResponse<ArticleData & CommonField>>({
  list: [],
  total: 0,
})

const loading = reactive({
  list: false,
  del: false,
})
const listQuery = reactive<ArticleListParams & Pagination>({
  articleName: '',
  pageSize: 20,
  pageNumber: 1,
})
const selectedList = ref<number[]>([])

const getList = async () => {
  loading.list = true
  if (listQuery.articleName === '') {
    listQuery.articleName = null
  }
  const { data } = await articlePagination(listQuery).catch(err => {
    loading.list = false
    throw err
  })
  listResult.value = data
  loading.list = false
}

const init = async () => {
  loading.list = true
  await getList()
}

const pagination = (val: PaginationComponentDataType) => {
  if (val) {
    listQuery.pageSize = val.limit
    listQuery.pageNumber = val.page
  }
  getList()
}

const selectedArticleItem = val => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}
const handleDelete = async row => {
  loading.list = true
  await removeArticle({ ids: [row.id] }).catch(err => {
    loading.list = false
    throw err
  })
  getList()
  ElMessage({
    message: '删除成功',
    type: 'success',
    duration: 2000,
  })
}
const handleMultiDelete = async () => {
  loading.list = true
  if (selectedList.value.length === 0) {
    ElMessage({
      message: '您没有选择哦',
      type: 'error',
      duration: 2000,
    })
    loading.list = false
    return
  }
  await removeArticle({ ids: selectedList.value }).catch(err => {
    loading.list = false
    throw err
  })
  loading.list = false
  getList()
  ElMessage({
    message: '删除成功',
    type: 'success',
    duration: 2000,
  })
}
const handleCreate = () => {
  router.push({ name: 'CreateArticle' })
}

const handleRedirectEdit = val => {
  router.push({ name: 'EditArticle', params: { id: Number(val.id) } })
}
init()
</script>

<template>
  <div class="view-page">
    <div class="view-header">
      <ElRow type="flex" justify="space-between" align="middle">
        <div>
          <ElInput
            v-model="listQuery.articleName"
            clearable
            placeholder="请输入内容名称"
            style="width: 200px"
            class="filter-item mr-5"
            @clear="getList"
          />
          <EBtn class="filter-item" plain type="primary" @click="getList">
            搜索
          </EBtn>
        </div>
        <div>
          <EBtn type="danger" @click="handleMultiDelete">
            删除
          </EBtn>
          <EBtn type="primary" icon="el-icon-edit" class="pl-15" @click="handleCreate">
            新增
          </EBtn>
        </div>
      </ElRow>
    </div>
    <div class="view-main">
      <ElTable
        v-loading="loading.list"
        :data="listResult.list"
        row-key="id"
        tooltip-effect="dark"
        default-expand-all
        highlight-current-row
        border
        @selection-change="selectedArticleItem"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn label="类型" width="120">
          <template #default="scope">
            <span>{{ scope.row.articleTypeLabel }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="标题">
          <template #default="scope">
            <span>{{ scope.row.articleName }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="状态" width="120">
          <template #default="scope">
            <span>{{ convertStatus(scope.row.status) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" header-align="center" width="220" align="center" class-name="pl-15 fixed-width">
          <template #default="scope">
            <span class="mr-5">
              <EBtn type="primary" size="small" @click="handleRedirectEdit(scope.row)">编辑</EBtn>
            </span>
            <span>
              <EBtn size="small" type="danger" :loading="loading.del" @click="handleDelete(scope.row)">删除</EBtn>
            </span>
          </template>
        </ElTableColumn>
      </ElTable>
      <Pagination
        v-show="listResult.total > 0"
        v-model:page="listQuery.pageNumber"
        v-model:limit="listQuery.pageSize"
        :total="listResult.total"
        @pagination="pagination"
      />
    </div>
  </div>
</template>
