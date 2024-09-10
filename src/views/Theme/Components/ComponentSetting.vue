<script setup lang="ts">
import { editThemeConfig, showTheme } from '@/api/theme'
import { components } from '@/data/component'
import { themeContents } from '@/data/theme'
import { ElMessage } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

const id = Number(useRoute().params.id)

const currentComponentRef = ref()

const vueDraggableRef = ref()

// 动态导入所有组件
const componentModules = import.meta.glob('@/components/Theme/Components/*.vue')

// 添加组件Dialog是否显示
const addComponentDialogVisible = ref<boolean>(false)

// 设置组件Dialog是否显示
const settingComponentDialogVisible = ref<boolean>(false)

// 组件选择的数据
const selectComponentData = ref<ComponentData>({
  backendComponentCode: '',
  componentConfig: {
    content: {},
    status: true,
  },
  componentName: '',
  isRequiredAliasName: false,
  aliasName: '',
  id: 0,
  sort: 0,
  frontComponentIdentifyCode: '',
})

// 当前主题内容
const currentThemeContentData = ref<ThemeContentDataType>({
  id: 0,
  themeContentCode: '',
  themeContentName: '',
  components: [],
})

// 当前设置的组件
const currentComponentData = ref<ComponentData>({
  backendComponentCode: '',
  componentConfig: {
    content: {},
    status: true,
  },
  componentName: '',
  isRequiredAliasName: false,
  aliasName: '',
  id: 0,
  sort: 0,
  frontComponentIdentifyCode: '',
})

// 模板数据
const themeContentData = ref<ThemeContentDataType[]>([])

// 当前主题内容组件列表数据
const currentThemeContentComponentsData = ref<ComponentData[]>([])

const aliasName = ref<string>('')
// 设置组件
const handleSettingComponent = async (item: ComponentData) => {
  if (!item.isRequiredAliasName) {
    item.isRequiredAliasName = true
    item.aliasName = item.componentName
  }
  aliasName.value = item.aliasName
  currentComponentData.value = item
  settingComponentDialogVisible.value = true
}

// 删除组件
const handleRemoveComponent = (index: number) => {
  currentThemeContentComponentsData.value.splice(index, 1)
}

// 更改设置的组件内容
const handleChangeThemeContent = (item: ThemeContentDataType) => {
  currentThemeContentComponentsData.value = []
  currentThemeContentData.value = item
  currentThemeContentComponentsData.value = item.components
}

const dragging = ref(false)

function sortCurrentThemeContentComponents() {
  currentThemeContentComponentsData.value.forEach((item, index) => {
    item.sort = index + 1
  })
}

function dragEnd() {
  sortCurrentThemeContentComponents()
}

// 添加组件
const handleAddComponent = () => {
  addComponentDialogVisible.value = true
}

// 保存当前主题内容数据
const handleSaveCurrentThemeContentData = () => {
  if (currentThemeContentComponentsData.value.length > 0) {
    // 计算相同的backendComponentCode数量
    const sameComponentCount = currentThemeContentComponentsData.value.filter(
      component => component.backendComponentCode === selectComponentData.value.backendComponentCode,
    ).length

    // 设置frontComponentIdentifyCode
    selectComponentData.value.frontComponentIdentifyCode = `${selectComponentData.value.backendComponentCode}${sameComponentCount}`
  } else {
    selectComponentData.value.frontComponentIdentifyCode = `${selectComponentData.value.backendComponentCode}0`
  }
  selectComponentData.value.sort = currentThemeContentComponentsData.value.length + 1
  currentThemeContentComponentsData.value.push(selectComponentData.value)
  addComponentDialogVisible.value = false
}

// 保存当前组件数据
const handleSaveCurrentComponentData = async () => {
  if (currentComponentRef.value && typeof currentComponentRef.value.getFormData === 'function') {
    const formData = await currentComponentRef.value.getFormData()
    if (!formData) {
      return
    }
    currentThemeContentComponentsData.value.map(item => {
      if (item.frontComponentIdentifyCode === currentComponentData.value.frontComponentIdentifyCode) {
        item.componentConfig = formData
        item.aliasName = aliasName.value
      }
    })
    settingComponentDialogVisible.value = false
  } else {
    console.error('Component does not have getFormData method')
  }
}

// 保存主题内容数据
const save = async () => {
  if (themeContentData.value && themeContentData.value.length > 0) {
    // 查看themeContentData中是否包含currentThemeContentData中的themeContentCode
    const index = themeContentData.value.findIndex(
      (item: any) => item.themeContentCode === currentThemeContentData.value.themeContentCode,
    )
    if (index === -1) {
      themeContentData.value.push({
        ...currentThemeContentData.value,
        components: currentThemeContentComponentsData.value,
      })
    } else {
      themeContentData.value[index].components = currentThemeContentComponentsData.value
    }
  } else {
    themeContentData.value = []
    themeContentData.value.push({
      ...currentThemeContentData.value,
      components: currentThemeContentComponentsData.value,
    })
  }

  const payload = {
    themeConfig: JSON.stringify(themeContentData.value),
  }
  await editThemeConfig(id, payload).catch(err => {
    throw err
  })
  ElMessage.success('保存成功')
}

// 动态获取组件
const getComponent = (componentCode: string) => {
  const componentPath = `/src/components/Theme/Components/${componentCode}.vue`
  if (componentModules[componentPath]) {
    return defineAsyncComponent(componentModules[componentPath] as () => Promise<any>)
  } else {
    console.error(`Component not found: ${componentCode}`)
    return null
  }
}

const getThemeData = async () => {
  const { data } = await showTheme(id).catch(err => {
    throw err
  })
  themeContentData.value = JSON.parse(data.themeConfig)
  // 如果themeContentData中没有themeContents中的数组元素，则把themeContents中的数组元素添加到themeContentData中
  if (!themeContentData.value || themeContentData.value.length === 0) {
    themeContentData.value = themeContents
  } else {
    // 查看themeContentData中是否包含themeContents中的数组元素
    themeContents.forEach((themeContentItem: ThemeContentDataType) => {
      const index = themeContentData.value.findIndex(
        (item: any) => item.themeContentCode === themeContentItem.themeContentCode,
      )
      if (index === -1) {
        themeContentData.value.push(themeContentItem)
      }
    })
  }
}
getThemeData()
</script>

<template>
  <div class="view-page">
    <div class="view-header">
      <ElRow type="flex" justify="space-between" align="middle">
        <div>
          <h4>主题设置</h4>
        </div>
        <div>
          <EBtn size="small" type="danger" @click="save">
            <div class="flex items-center justify-between">
              <span><Icon icon="ant-design:save-outlined" class="mr-1" /></span>
              <span>保存</span>
            </div>
          </EBtn>
        </div>
      </ElRow>
    </div>
    <div class="flex px-2 py-2 h-screen">
      <div class="w-1/4 mr-1 px-2 py-2">
        <ElCard shadow="never" class="h-screen">
          <template #header>
            <div class="card-header">
              <span>可设置页面列表</span>
            </div>
          </template>
          <div v-for="(item, index) in themeContentData" :key="index">
            <div
              :class="`${currentThemeContentData.themeContentCode === item.themeContentCode ? 'bg-red-600 text-white' : 'bg-white'} w-full mb-3 text-left cursor-pointer border-1 border-gray-300 px-6 py-3`"
              @click="handleChangeThemeContent(item)"
            >
              <div class="flex items-center">
                <Icon icon="ant-design:holder-outlined" class="mr-1" />
                <span>{{ item.themeContentName }}</span>
              </div>
            </div>
          </div>
        </ElCard>
      </div>
      <div class="w-3/4 ml-1 px-2 py-2">
        <ElCard v-if="currentThemeContentData.themeContentCode" shadow="never" class="h-screen">
          <template #header>
            <div class="card-header">
              <div class="flex justify-between items-center">
                <span>组件</span>
                <div class="flex justify-between">
                  <div class="flex items-center justify-between cursor-pointer" @click="handleAddComponent">
                    <span><Icon icon="ant-design:plus-outlined" class="mr-1" /></span>
                    <span>添加</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <VueDraggable ref="vueDraggableRef" v-model="currentThemeContentComponentsData" item-key="sort" @start="dragging = true" @end="dragEnd">
            <div
              v-for="(item, index) in currentThemeContentComponentsData" :key="item.id"
              class="w-full mb-3 h-9 flex justify-between items-center border-1 border-gray-300 px-6 py-6 cursor-pointer"
            >
              <span class="flex flex-grow items-center">
                <Icon icon="ant-design:holder-outlined" class="mr-1" />
                <ElTag type="info" class="mr-1">排序：{{ item.sort }}</ElTag>
                <ElTag type="warning" class="mr-1">{{ item.componentName }}</ElTag>
                <ElTag v-if="item.aliasName" class="mr-1">{{ item.aliasName }}</ElTag>
                <ElTag v-if="item.componentConfig.status" type="success">启用</ElTag>
                <ElTag v-if="!item.componentConfig.status" type="danger">禁用</ElTag>
              </span>
              <span class="flex">
                <EBtn text @click="handleSettingComponent(item)">设置</EBtn>
                <EBtn text type="danger" @click="handleRemoveComponent(index)">删除</EBtn>
              </span>
            </div>
          </VueDraggable>
        </ElCard>
      </div>
    </div>
    <ElDialog v-model="addComponentDialogVisible" title="添加组件">
      <ElSelect v-model="selectComponentData" value-key="id" placeholder="请选择">
        <ElOption v-for="item in components" :key="item.id" :label="item.componentName" :value="item" />
      </ElSelect>
      <template #footer>
        <div class="dialog-footer">
          <EBtn @click="addComponentDialogVisible = false">
            取消
          </EBtn>
          <EBtn type="primary" @click="handleSaveCurrentThemeContentData">
            提交
          </EBtn>
        </div>
      </template>
    </ElDialog>

    <ElDialog v-model="settingComponentDialogVisible" title="设置组件" width="70%">
      <div v-if="currentComponentData.isRequiredAliasName">
        <ElForm label-width="140px">
          <ElFormItem label="组件别名" required>
            <ElInput v-model="aliasName" placeholder="请输入组件别名" />
          </ElFormItem>
        </ElForm>
      </div>
      <!-- 使用Vue3的动态组件，根据backendComponentCode获取对应的组件，动态展示 -->
      <component
        :is="getComponent(currentComponentData.backendComponentCode)"
        ref="currentComponentRef"
        :component-data="currentComponentData.componentConfig"
        v-bind="currentComponentData"
      />
      <template #footer>
        <div class="dialog-footer">
          <EBtn @click="settingComponentDialogVisible = false">
            取消
          </EBtn>
          <EBtn type="primary" @click="handleSaveCurrentComponentData">
            提交
          </EBtn>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
::v-deep(.e-btn) {
  height: 48px;
  text-align: left;
  justify-content: left;
}
</style>
