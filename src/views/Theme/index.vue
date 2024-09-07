<script setup lang="ts">
import { removeTheme, themePagination } from '@/api/theme'
import { ElMessage } from 'element-plus'

const listResult = ref<TableResponse<ThemeData & CommonField>>({
  list: [],
  total: 0,
})

const loading = reactive({
  list: false,
  del: false,
})
const listQuery = reactive<ThemeListParams & Pagination>({
  themeName: '',
  pageSize: 20,
  pageNumber: 1,
})
const selectedList = ref<number[]>([])

const init = async () => {
  loading.list = true
  await getList()
}

const getList = async () => {
  loading.list = true
  if (listQuery.themeName === '') {
    listQuery.themeName = null
  }
  const { data } = await themePagination(listQuery).catch(err => {
    loading.list = false
    throw err
  })
  if (data.list) {
    data.list.forEach(item => {
      if (item.themeThumbFileVo) {
        item.themeThumbFileVo.fileUrl = `${import.meta.env.VITE_RESOURCE_URL + item.themeThumbFileVo.fileUrl}?x-oss-process=image/resize,w_200`
      }
    })
  }

  listResult.value = data
  loading.list = false
}

const pagination = (val: PaginationComponentDataType) => {
  if (val) {
    listQuery.pageSize = val.limit
    listQuery.pageNumber = val.page
  }
  getList()
}

const selectedThemeItem = val => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}
const handleDelete = async row => {
  loading.list = true
  await removeTheme({ ids: [row.id] }).catch(err => {
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
  await removeTheme({ ids: selectedList.value }).catch(err => {
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
  router.push({ name: 'CreateTheme' })
}

const handleRedirectEdit = val => {
  router.push({ name: 'EditTheme', params: { id: Number(val.id) } })
}

const handleSettingComponent = val => {
  router.push({ name: 'EditThemeComponent', params: { id: Number(val.id) } })
}
init()
</script>

<template>
  <div class="view-page">
    <div class="view-header">
      <ElRow type="flex" justify="space-between" align="middle">
        <div>
          <ElInput
            v-model="listQuery.themeName"
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
          <EBtn type="primary" class="pl-15" @click="handleCreate">
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
        @selection-change="selectedThemeItem"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn label="主题名称">
          <template #default="scope">
            <span>{{ scope.row.themeName }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="效果图">
          <template #default="scope">
            <ElImage :src="scope.row.themeThumbFileVo.fileUrl" style="width: 100px; height: auto" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" header-align="center" width="220" align="center" class-name="pl-15 fixed-width">
          <template #default="scope">
            <span class="mr-5">
              <EBtn type="primary" size="small" @click="handleRedirectEdit(scope.row)">编辑</EBtn>
            </span>
            <span class="mr-5">
              <EBtn type="warning" plain size="small" @click="handleSettingComponent(scope.row)">设置</EBtn>
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
