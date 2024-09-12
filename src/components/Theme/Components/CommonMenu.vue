<script setup name="ThemeHeaderMenu" lang="ts">
import { menuTypes } from '@/data/theme'
import { hasContentElements } from '@/utils'
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

const createMenuData = (index: number = 0): MenuData => ({
  id: index + 1,
  label: `Menu ${index}`,
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

// 当前菜单
const currentMenu = ref<MenuData | null>(null)

const menus = ref<MenuData[]>([])

onMounted(() => {
  menus.value = props.componentData.content
  currentMenu.value = menus.value[0]
  if (currentMenu.value && moduleLinkRef.value) {
    moduleLinkRef.value.setLinkData(currentMenu.value.link)
  }
})

/**
 * 更改链接类型
 */
function changeLinkType(val: LinkData) {
  if (!currentMenu.value) {
    return
  }
  if (!currentMenu.value.link) {
    return
  }
  currentMenu.value.link = { ...val }
}

/**
 * 更改当前菜单
 */
async function changeCurrentMenu(index: number) {
  const selectMenu = menus.value[index]
  await saveMenuData()
  currentMenu.value = selectMenu
  moduleLinkRef.value.setLinkData(selectMenu.link)
}

/**
 * 增加菜单
 */
async function addMenu() {
  const maxMenus = 50
  const menusLength = menus.value.length
  if (menusLength >= maxMenus) {
    ElMessage.error(`菜单最多不超过 ${maxMenus} 个`)
    return
  }
  await saveMenuData() // 保存当前菜单数据
  const newMenu = createMenuData(menusLength)
  menus.value.push(newMenu)
  nextTick(() => {
    currentMenu.value = newMenu // 设置当前选中的菜单
    moduleLinkRef.value.setLinkData(newMenu.link) // 更新链接数据
  })
}

/**
 * 移除菜单
 */
function removeMenu(val: number) {
  menus.value.splice(val, 1)
  currentMenu.value = menus.value[0]
  handleChangeMenuSort()
}

// 保存菜单数据
async function saveMenuData() {
  if (!currentMenu.value || !hasContentElements(currentMenu.value)) {
    return
  }
  if (!currentMenu.value.id || !currentMenu.value.label) {
    // ElMessage.error('请填写菜单名称')
    return
  }
  const linkData = await moduleLinkRef.value.getLinkData()
  currentMenu.value.link = { ...linkData }
  // 获取子菜单
  if (themeSubMenuRef.value) {
    currentMenu.value.children = themeSubMenuRef.value.getFormData()
  }
  // 如果isDropDownCustom 为false，且当前菜单链接类型是category，则需要设置children
  if (!currentMenu.value.isDropDownCustom && currentMenu.value.link && currentMenu.value.link?.linkType === 'category') {
    currentMenu.value.children = currentMenu.value.link.children || []
  }
  if (currentMenu.value.menuType === 'megaMenu') {
    const image = uploadSingleRef.value.getFileData()
    currentMenu.value.image = image.fileData
  }
  menus.value.forEach((item, index) => {
    if (currentMenu.value && item.id === currentMenu.value.id) {
      menus.value[index] = currentMenu.value
    }
  })
}

/**
 * 改变菜单排序
 */
function handleChangeMenuSort() {
  menus.value.forEach((item, index) => {
    item.id = index + 1
  })
}

/**
 * 拖动结束事件
 */
function dragEnd() {
  handleChangeMenuSort()
}

/**
 * 获取表单数据
 */
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
  <div class="flex px-3 py-3">
    <div class="w-1/4 pr-2">
      <div class="border border-gray-200 px-3 py-3">
        <VueDraggable v-model="menus" item-key="id" @start="dragging = true" @end="dragEnd">
          <div v-for="(item, index) in menus" :key="index" class="w-full mb-3">
            <div
              class="w-full flex items-center justify-between px-4 py-3 rounded border cursor-pointer transition duration-200"
              :class="[
                item.id === currentMenu?.id ? 'bg-blue-400 text-white' : 'bg-white text-black hover:bg-gray-100',
              ]"
              @click="changeCurrentMenu(index)"
            >
              <div class="flex items-center space-x-2">
                <span><Icon icon="ant-design:holder-outlined" /></span>
                <span>{{ item.label }}</span>
              </div>
              <div class="flex items-center" @click.stop="removeMenu(index)">
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
    <div v-if="currentMenu" class="w-3/4 pl-2">
      <ElCard shadow="never">
        <template #header>
          <span>{{ currentMenu?.label }}</span>
        </template>
        <ElForm ref="formRef" label-width="160px">
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
            <ModuleLink ref="moduleLinkRef" :link-data="currentMenu?.link" @change-link-type="changeLinkType" />
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
          <div v-if="currentMenu?.menuType === 'dropDown'">
            <ElFormItem v-if="currentMenu.link?.linkType === 'category'" label="是否自定义下拉菜单" required>
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
          <ElFormItem v-if="currentMenu?.menuType === 'megaMenu'" label="子级菜单" required>
            <div style="width: 100%">
              <ModuleSubMenu ref="themeSubMenuRef" :component-data="currentMenu.children || []" />
            </div>
          </ElFormItem>
          <ElFormItem label="图片" required>
            <UploadSingleImage ref="uploadSingleRef" :image-data="currentMenu?.image" />
          </ElFormItem>
        </ElForm>
      </ElCard>
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
