<script setup name="ThemeHeaderMenu" lang="ts">
import { menuTypes } from '@/data/theme'
import { ElMessage } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps<{
  componentData: {
    content: MenuData[]
  }
}>()

const moduleLinkRef = ref()
const themeSubMenuRef = ref()
const formRef = ref()
const dragging = ref(false)
const uploadSingleRef = ref()

// 当前菜单
const currentMenu = ref<MenuData>({
  id: 0,
  label: '首页',
  link: {
    linkType: 'home',
    linkUrl: '/',
    label: '',
    linkValue: '/',
    children: [],
  },
  menuType: 'none',
  isDropDownCustom: false,
  image: {
    id: 0,
    originalFileName: '',
    fileName: '',
    fileContentType: '',
    fileExtensionName: '',
    path: '',
    fileUrl: '',
    sha256: '',
  },
  children: [],
})

const menus = ref<MenuData[]>([
  {
    id: 0,
    label: '首页',
    link: {
      linkType: 'home',
      linkUrl: '/',
      label: '',
      linkValue: '/',
      children: [],
    },
    menuType: 'none',
    isDropDownCustom: false,
    image: {
      id: 0,
      originalFileName: '',
      fileName: '',
      fileContentType: '',
      fileExtensionName: '',
      path: '',
      fileUrl: '',
      sha256: '',
    },
    children: [],
  },
])

watch(
  () => props.componentData,
  val => {
    if (val && val.content && val.content[0]) {
      menus.value = val.content
      // currentMenu.value = menus.value[0]
    }
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  moduleLinkRef.value.setLinkData(currentMenu.value.link)
})

function sortMenuId() {
  menus.value.forEach((item, index) => {
    item.id = index
  })
}

function changeLinkType(val: { linkType: string, linkUrl: string, linkValue: string }) {
  if (!currentMenu.value.link) {
    return
  }
  currentMenu.value.link.linkType = val.linkType
  currentMenu.value.link.linkUrl = val.linkUrl
  currentMenu.value.link.linkValue = val.linkValue
}

async function changeMenu(index: number) {
  const selectMenu = menus.value[index]
  await saveMenuData()
  currentMenu.value = selectMenu
  moduleLinkRef.value.setLinkData(selectMenu.link)
}

async function addMenu() {
  const menusLength = menus.value.length
  if (menusLength >= 50) {
    ElMessage.error('菜单最多不超过50个')
    return
  }
  await saveMenuData()
  const newMenu: MenuData = {
    label: `Menu ${menusLength}`,
    id: menusLength,
    link: {
      linkType: 'home',
      linkUrl: '/',
      label: '',
      linkValue: '/',
      children: [],
    },
    menuType: 'none',
    isDropDownCustom: false,
    image: {
      id: 0,
      originalFileName: '',
      fileName: '',
      fileContentType: '',
      fileExtensionName: '',
      path: '',
      fileUrl: '',
      sha256: '',
    },
    children: [],
  }
  menus.value.push(newMenu)
  nextTick(() => {
    currentMenu.value = newMenu
  })
  moduleLinkRef.value.setLinkData(newMenu.link)
}

// 保存菜单数据
async function saveMenuData() {
  const linkData = await moduleLinkRef.value.getLinkData()
  currentMenu.value.link = { ...linkData }
  if (currentMenu.value.isDropDownCustom) {
    currentMenu.value.children = themeSubMenuRef.value.getFormData()
  }
  if (currentMenu.value.menuType === 'megaMenu') {
    const image = uploadSingleRef.value.getFileData()
    currentMenu.value.image = image.fileData
    currentMenu.value.children = themeSubMenuRef.value.getFormData()
  }
  menus.value[currentMenu.value.id] = currentMenu.value
}

function removeMenu(val: number) {
  menus.value.splice(val, 1)
  currentMenu.value = menus.value[0]
  sortMenuId()
}

function dragEnd() {
  sortMenuId()
}

async function getFormData() {
  await saveMenuData()
  const form = {
    content: menus.value,
    status: true,
  }
  return form
}

defineExpose({
  getFormData,
})
</script>

<template>
  <div>
    <div class="flex px-3 py-3">
      <div class="w-1/3 pr-2">
        <div class="border border-gray-200 px-3 py-3">
          <VueDraggable v-model="menus" item-key="id" @start="dragging = true" @end="dragEnd">
            <div v-for="(item, index) in menus" :key="item.id" class="w-full mb-3">
              <div
                class="w-full flex items-center justify-between px-4 py-3 rounded border cursor-pointer transition duration-200"
                :class="[
                  item.id === currentMenu.id ? 'bg-blue-400 text-white' : 'bg-white text-black hover:bg-gray-100',
                ]"
                @click="changeMenu(index)"
              >
                <div class="flex items-center space-x-2">
                  <span><Icon icon="ant-design:holder-outlined" /></span>
                  <span>{{ item.label }}</span>
                </div>
                <div v-if="index > 0" class="flex items-center" @click.stop="removeMenu(index)">
                  <Icon icon="ant-design:close-outlined" />
                </div>
              </div>
            </div>
          </VueDraggable>

          <ElButton icon="el-icon-plus" class="w-full" @click="addMenu">
            新增一级菜单
          </ElButton>
        </div>
      </div>
      <div class="w-2/3 pl-2">
        <ElCard shadow="never">
          <template #header>
            <span>{{ currentMenu.label }}</span>
          </template>
          <ElForm ref="formRef" label-width="120px">
            <ElFormItem label="菜单名称" required>
              <ElInput
                v-model="currentMenu.label"
                class="input-line"
                minlength="1"
                maxlength="60"
                placeholder="菜单名称"
              />
            </ElFormItem>
            <ElFormItem label="链接" required>
              <ModuleLink ref="moduleLinkRef" :link-data="currentMenu.link" @change-link-type="changeLinkType" />
            </ElFormItem>
            <ElFormItem label="菜单类型" required>
              <ElRadioGroup v-model="currentMenu.menuType">
                <ElRadioButton
                  v-for="(menuType, index) in menuTypes"
                  :key="index"
                  :value="menuType.code"
                  :label="menuType.code"
                >
                  {{ menuType.title }}
                </ElRadioButton>
              </ElRadioGroup>
            </ElFormItem>
            <!-- 下拉菜单 -->
            <div v-if="currentMenu.menuType === 'dropDown'">
              <ElFormItem v-if="currentMenu.link?.linkType === 'category'" label="是否自定义" required>
                <ElSwitch v-model="currentMenu.isDropDownCustom" />
              </ElFormItem>
              <ElFormItem
                v-if="currentMenu.isDropDownCustom || currentMenu.link?.linkType !== 'category'"
                label="下拉菜单"
                required
              >
                <ModuleSubMenu ref="themeSubMenuRef" :component-data="currentMenu.children || []" />
              </ElFormItem>
            </div>
            <!-- 超级菜单 -->
            <ElFormItem v-if="currentMenu.menuType === 'megaMenu'" label="子级菜单" required>
              <div style="width: 100%">
                <ModuleSubMenu ref="themeSubMenuRef" :component-data="currentMenu.children || []" />
              </div>
            </ElFormItem>
            <ElFormItem label="图片" required>
              <UploadSingleImage ref="uploadSingleRef" :image-data="currentMenu.image" />
            </ElFormItem>
          </ElForm>
        </ElCard>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h3 {
  padding: 20px;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #e3dee4;
  border-top: 1px solid #e3dee4;
}
:deep(.el-radio-button) {
  .el-radio-button__inner {
    min-width: 100px;
  }
}
</style>
