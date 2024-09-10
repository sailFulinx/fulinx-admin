<script setup name="ThemeSubMenu" lang="ts">
import Sortable from 'sortablejs'

const props = defineProps<{
  componentData: MenuData[]
}>()

let id = 1

const moduleSubMenuFormRef = ref()
const subMenus = ref<MenuData[]>([])
const sortable = ref<Sortable | null>(null)
const dialogVisible = ref(false)
const subMenuTableRef = ref()
const themeLinkRef = ref()
const currentSubMenu = ref<MenuData>({
  id: 0,
  label: '',
  linkUrl: '',
  linkType: '',
  linkValue: '',
  isSettingCustomRoute: false,
  customRoute: '',
})
const isEditMenu = ref(false)

watch(
  () => props.componentData,
  val => {
    if (val && val.length > 0) {
      subMenus.value = val
    } else {
      subMenus.value = []
    }
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  nextTick(() => {
    setMenuTableSort()
  })
})

function setMenuTableSort() {
  if (subMenuTableRef.value) {
    const el = subMenuTableRef.value.$el.querySelector('.el-table__body-wrapper > table > tbody')
    if (el) {
      sortable.value = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        animation: 150,
        setData: dataTransfer => {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const subMenusData = subMenus.value
          const oldIndex = evt.oldIndex as number
          const newIndex = evt.newIndex
          const temp = subMenusData[oldIndex]
          if (!newIndex) {
            return
          }
          if (oldIndex < newIndex) {
            // Move down
            for (let i = oldIndex; i < newIndex; i++) {
              subMenusData[i] = subMenusData[i + 1]
            }
          } else if (oldIndex > newIndex) {
            // Move up
            for (let i = oldIndex; i > newIndex; i--) {
              subMenusData[i] = subMenusData[i - 1]
            }
          }
          subMenusData[newIndex] = temp
        },
        // onUpdate: () => {
        //   subMenus.value = subMenus.value
        // },
      })
    }
  }
}

async function addSubMenu() {
  currentSubMenu.value = {
    id: id++,
    label: '',
    linkType: '',
    linkUrl: '',
    linkValue: '',
    isSettingCustomRoute: false,
    customRoute: '',
  }
  dialogVisible.value = true
  await nextTick()
  themeLinkRef.value.setLinkData(currentSubMenu.value)
}

async function editMenu(val: MenuData) {
  dialogVisible.value = true
  isEditMenu.value = true
  currentSubMenu.value = val
  await nextTick()
  themeLinkRef.value.setLinkData(currentSubMenu.value)
}

function removeMenu(val: MenuData) {
  subMenus.value = subMenus.value.filter(item => item.id !== val.id)
}

async function submitSubMenu() {
  const linkData = await themeLinkRef.value.getLinkData()
  currentSubMenu.value.linkType = linkData.linkType
  currentSubMenu.value.linkUrl = linkData.linkUrl
  currentSubMenu.value.linkValue = linkData.linkValue
  currentSubMenu.value.isSettingCustomRoute = linkData.isSettingCustomRoute
  currentSubMenu.value.customRoute = linkData.customRoute

  if (isEditMenu.value) {
    subMenus.value = subMenus.value.map(item => {
      return item.id === currentSubMenu.value.id ? { ...currentSubMenu.value } : item
    })
  } else {
    subMenus.value.push({ ...currentSubMenu.value })
  }
  dialogVisible.value = false
  isEditMenu.value = false
}

function getFormData() {
  return subMenus.value
}

defineExpose({
  getFormData,
})
</script>

<template>
  <div class="w-full">
    <div class="w-full">
      <ElButton type="primary" size="small" class="mb-5" style="height: 36px; line-height: 36px" @click="addSubMenu">
        添加菜单
      </ElButton>
    </div>
    <ElTable ref="subMenuTableRef" :data="subMenus" class="w-full">
      <ElTableColumn label="菜单名称" align="left">
        <template #default="{ row }">
          <span>{{ row.label }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" align="right">
        <template #default="{ row }">
          <EBtn type="text" @click="() => editMenu(row)">
            修改
          </EBtn>
          <EBtn type="text" style="color: red" @click="() => removeMenu(row)">
            删除
          </EBtn>
        </template>
      </ElTableColumn>
    </ElTable>
    <ElDialog v-model="dialogVisible" title="子菜单" width="50%">
      <ElForm ref="moduleSubMenuFormRef" label-width="120px">
        <ElFormItem label="菜单名称" required>
          <ElInput
            v-model="currentSubMenu.label"
            class="input-line"
            minlength="1"
            maxlength="60"
            placeholder="菜单名称"
          />
        </ElFormItem>
        <ElFormItem label="链接" required class="mt-5">
          <ModuleLink ref="themeLinkRef" :link-data="currentSubMenu" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <EBtn @click="dialogVisible = false">
          取 消
        </EBtn>
        <EBtn type="primary" @click="submitSubMenu">
          确 定
        </EBtn>
      </template>
    </ElDialog>
  </div>
</template>
