<script setup name="RoleBase" lang="ts">
import { fetchPermissionListApi } from '@/api/permission'
import { ElMessage, ElTree } from 'element-plus'
import { debounce } from 'lodash'

const props = defineProps({
  formData: {
    type: Object as () => RoleDataType,
    default: null,
  },
})
const loading = ref(false)
let form = reactive<RoleDataType>({
  id: 0,
  roleName: '',
  permissionIds: [],
  deletedPermissionIds: [],
})

const screenHeight = window.innerHeight - 330

const treeRef = ref<InstanceType<typeof ElTree>>()

const treeProps = {
  value: 'id',
  label: 'permissionName',
  children: 'children',
}

const setCheckedKeys = (val: number[]) => {
  if (val.length > 0) {
    treeRef.value!.setCheckedKeys(val, false)
  }
}

const resetChecked = () => {
  if (treeRef.value) {
    treeRef.value!.setCheckedKeys([], false)
  }
}

watch(
  () => props.formData,
  val => {
    if (val) {
      resetChecked()
      form = val
      if (!form.deletedPermissionIds) {
        form.deletedPermissionIds = []
      }
      if (form.rolePermissions && form.rolePermissions.length > 0) {
        const ids: number[] = []
        form.rolePermissions.map(item => {
          ids.push(item.permissionId)
        })
        setCheckedKeys(ids)
      }
    }
  },
  { immediate: true, deep: true },
)
const { t: $t } = useI18n()

const rules = reactive({
  roleName: [{ required: true, type: 'string', message: $t('user.rules.roleName'), trigger: 'blur' }],
  permissionIds: [{ required: true, type: 'array', message: $t('user.rules.permission'), trigger: 'change' }],
})

const formRef = ref()

// 列表
const listPermissionData = ref<TableResponse<PermissionDataType & CommonField>>({
  list: [],
  total: 0,
})
// 获取列表数据
const getList = debounce(async () => {
  loading.value = true
  const { data } = await fetchPermissionListApi().catch((err: any) => {
    loading.value = false
    throw err
  })
  listPermissionData.value = { ...data }
  loading.value = false
}, 100)

async function init() {
  await Promise.all([getList()])
}
init()

const getChecked = () => {
  form.permissionIds = []
  form.deletedPermissionIds = []
  // 当前的节点KEY
  const checkedKeys = treeRef.value?.getCheckedKeys()
  if (checkedKeys && checkedKeys?.length > 0) {
    checkedKeys?.map(item => {
      form.permissionIds?.push(Number(item))
    })
  }

  // 计算出被删除的节点KEY
  const oldIds: number[] = []
  if (form.rolePermissions && form.rolePermissions.length > 0) {
    form.rolePermissions?.map(item => {
      oldIds.push(item.permissionId)
    })
  }

  if (oldIds.length > 0) {
    oldIds.map(item => {
      if (form.permissionIds?.indexOf(item) === -1) {
        form.deletedPermissionIds?.push(item)
      }
    })
  }
}

async function getFormData() {
  getChecked()
  form.permissionIds = [...new Set(form.permissionIds)]
  form.deletedPermissionIds = [...new Set(form.deletedPermissionIds)]
  if (form.permissionIds?.length === 0) {
    ElMessage({
      message: $t('role.error.permissionEmpty'),
      type: 'error',
      duration: 5 * 1000,
    })
    return
  }
  const valid = await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  return form
}

defineExpose({
  getFormData,
})
</script>

<template>
  <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
    <ElFormItem :label="$t('role.roleName')" prop="roleName">
      <ElInput
        v-model="form.roleName"
        class="input-line"
        clearable
        show-word-limit
        minlength="1"
        maxlength="120"
        :placeholder="$t('user.placeholder.roleName')"
      />
    </ElFormItem>
    <ElFormItem :label="$t('role.permission')" prop="permissionIds">
      <ElTree
        ref="treeRef"
        :highlight-current="true"
        node-key="id"
        show-checkbox
        default-expand-all
        :data="listPermissionData.list"
        :item-size="48"
        :height="screenHeight"
        :props="treeProps"
      />
    </ElFormItem>
  </ElForm>
</template>
