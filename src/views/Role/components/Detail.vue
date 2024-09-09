<script setup name="RoleDetail" lang="ts">
import { createRoleApi, editRoleApi, fetchRoleDetailApi } from '@/api/role'
import { useLocale } from '@/hooks/useLocale'
import { ElMessage } from 'element-plus'

import { debounce } from 'lodash'
import Base from './Base.vue'

const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
  actionType: {
    type: String as () => 'none' | 'add' | 'edit',
    default: 'none',
  },
})
const emit = defineEmits(['getList', 'handleChangeVisible'])
const activeTab = ref('base')
const { t: $t } = useLocale()
const pageTitle = ref('')

const disabled = ref(false)

const form = reactive<RoleDataType>({
  id: 0,
  roleName: '',
  permissionIds: [],
})

const loading = reactive({
  init: true,
  button: false,
})

const id = ref(0)
const actionType = ref('none')

watch(
  [() => props.id, () => props.actionType],
  ([newPropId, newPropActionType]) => {
    if (newPropId || newPropId === 0) {
      id.value = newPropId
    }
    if (newPropActionType) {
      actionType.value = newPropActionType
      if (actionType.value === 'add') {
        id.value = 0
        form.id = 0
        form.roleName = ''
        form.permissionIds = []
      } else {
        disabled.value = false
      }
    }
    init()
  },
  { immediate: true },
)

async function init() {
  loading.init = true
  if (actionType.value === 'add' && id.value === 0) {
    pageTitle.value = $t('common.create') + $t('role.name')
    disabled.value = true
  } else {
    if (id.value !== 0) {
      await getDetail(id.value)
      pageTitle.value = $t('common.edit') + $t('role.name')
    }
  }
  loading.init = false
}

init()

const getDetail = async (id: number) => {
  loading.init = true
  const { data } = await fetchRoleDetailApi(id).catch(err => {
    throw err
  })
  Object.assign(form, data)
  loading.init = false
}

const baseFormRef = ref()

// 保存
const save = debounce(async () => {
  await handleSubmit()
}, 600)

async function handleSubmit() {
  if (activeTab.value === 'base') {
    if (actionType.value === 'edit' && id.value) {
      await editRoleBase()
      await getDetail(id.value)
    } else {
      await createRoleBase()
    }
  }
  loading.button = false
}

/**
 * 修改
 */
async function editRoleBase() {
  loading.button = true
  const postData = await baseFormRef.value?.getFormData()
  if (postData) {
    await editRoleApi(id.value, postData).catch(err => {
      loading.button = false
      throw err
    })
    emit('getList')
    ElMessage({
      message: $t('success.edit'),
      type: 'success',
    })
  }
  loading.button = false
}

/**
 * 新增
 */
async function createRoleBase() {
  loading.button = true
  const postData = await baseFormRef.value.getFormData()
  if (postData) {
    await createRoleApi(postData).catch(err => {
      loading.button = false
      throw err
    })
    emit('getList')
    emit('handleChangeVisible')
    ElMessage({
      message: $t('success.create'),
      type: 'success',
    })
  }
  loading.button = false
}

function handleChangeTab() {}

function handleChangeActiveTab(val: string) {
  activeTab.value = val
}

function handleCancel() {
  emit('handleChangeVisible')
}

defineExpose({
  handleChangeActiveTab,
})
</script>

<template>
  <div>
    <div class="view-header">
      <ElRow type="flex" justify="space-between" align="middle">
        <div>
          <h4>{{ pageTitle }}</h4>
        </div>
        <div>
          <EBtn
            class="filter-item"
            size="small"
            type="default"
            icon="Close"
            :loading="loading.button"
            @click="handleCancel"
          >
            取消
          </EBtn>
          <EBtn
            class="filter-item"
            size="small"
            type="primary"
            icon="DocumentAdd"
            :loading="loading.button"
            @click="save"
          >
            保存
          </EBtn>
        </div>
      </ElRow>
    </div>
    <div class="view-main">
      <ElTabs v-model="activeTab" class="demo-tabs" @tab-click="handleChangeTab">
        <ElTabPane :label="$t('role.tab.base')" name="base">
          <ElCard v-loading="loading.init" shadow="never">
            <ElRow type="flex" justify="center">
              <ElCol>
                <Base ref="baseFormRef" :form-data="form" />
              </ElCol>
            </ElRow>
          </ElCard>
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>
