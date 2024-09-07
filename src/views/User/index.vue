<script setup lang="ts">
import { approvalAvatarApi, fetchUserPaginationApi, removeUserApi, updateUserStatus } from '@/api/user'
import { ElMessage } from 'element-plus'

const listResult = ref<TableResponse<UserDataType & CommonField>>({
  list: [],
  total: 0,
})

const loading = reactive({
  list: false,
  del: false,
})
const listQuery = reactive<UserListParams & Pagination>({
  telephone: '',
  pageSize: 20,
  pageNumber: 1,
})
const selectedList = ref<number[]>([])

const init = async () => {
  loading.list = true
  await getList()
}

const handleApprovalUserAvatar = async (userId: number, approvalType: number) => {
  await approvalAvatarApi({ userId, approvalType }).catch(err => {
    throw err
  })
  await getList()
  ElMessage({
    message: '操作成功',
    type: 'success',
    duration: 2000,
  })
}

const getList = async () => {
  loading.list = true
  if (listQuery.telephone === '') {
    listQuery.telephone = null
  }
  const { data } = await fetchUserPaginationApi(listQuery).catch(err => {
    loading.list = false
    throw err
  })
  listResult.value = data
  console.log(listResult.value)
  loading.list = false
}

const pagination = (val: PaginationComponentDataType) => {
  if (val) {
    listQuery.pageSize = val.limit
    listQuery.pageNumber = val.page
  }
  getList()
}
const selectedUserItem = val => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}
const handleDelete = async row => {
  loading.list = true
  await removeUserApi({ ids: [row.id] }).catch(err => {
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
  await removeUserApi({ ids: selectedList.value }).catch(err => {
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

const handleUpdateStatus = async (idValue: number, status: number) => {
  const payload = {
    userId: idValue,
    status,
  }
  await updateUserStatus(payload).catch(err => {
    throw err
  })
  getList()
  ElMessage({
    message: '操作成功',
    type: 'success',
    duration: 2000,
  })
}
const handleCreate = () => {
  router.push({ name: 'CreateUser' })
}

const handleRedirectEdit = val => {
  router.push({ name: 'EditUser', params: { id: Number(val.id) } })
}
init()
</script>

<template>
  <div class="view-page">
    <div class="view-header">
      <ElRow type="flex" justify="space-between" align="middle">
        <div>
          <ElInput
            v-model="listQuery.telephone"
            clearable
            placeholder="请输入手机号码"
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
        @selection-change="selectedUserItem"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn label="最新头像">
          <template #default="scope">
            <div v-if="scope.row.userAvatar !== null">
              <img :src="scope.row.userAvatar.fileUrl" :width="200" :height="200">
              <div class="mt-5">
                <EBtn
                  v-if="scope.row.userAvatarStatus === 0"
                  type="primary"
                  @click="handleApprovalUserAvatar(scope.row.id, 1)"
                >
                  审核通过
                </EBtn>
                <EBtn v-else type="danger" @click="handleApprovalUserAvatar(scope.row.id, 0)">
                  审核拒绝
                </EBtn>
              </div>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="手机号码">
          <template #default="scope">
            <span>{{ scope.row.telephone }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="昵称" prop="nickname" />
        <ElTableColumn label="职位" prop="post" />
        <ElTableColumn label="简介" prop="personalInformation" />
        <ElTableColumn label="性别">
          <template #default="scope">
            {{ scope.row.gender === 1 ? '男' : '女' }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="生日" prop="birthday" />
        <ElTableColumn label="公司名称" prop="company" />
        <ElTableColumn label="操作" header-align="center" width="220" align="center" class-name="pl-15 fixed-width">
          <template #default="scope">
            <span class="mr-5">
              <EBtn
                v-if="scope.row.status === 0"
                size="small"
                type="primary"
                @click="handleUpdateStatus(scope.row.id, 1)"
              >
                启用
              </EBtn>
              <EBtn v-else size="small" type="danger" @click="handleUpdateStatus(scope.row.id, 0)">禁用</EBtn>
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
