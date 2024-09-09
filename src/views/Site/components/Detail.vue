d
<script setup lang="ts">
import { useTagsViewStore } from '@/stores/tagsView'
import { ElMessage } from 'element-plus'

import Base from './Modules/Base.vue'

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const id = Number(useRoute().params.id)

const activeName = ref('base')

const loading = reactive({
  init: false,
  button: false,
})

const pageTitle = computed(() => (props.isEdit ? '编辑网站' : '添加网站'))

const init = async () => {
  if (props.isEdit && id) {
  }
}

const tagsViewStore = useTagsViewStore()

const deleteTagView = (refresh: boolean) => {
  if (refresh) {
    tagsViewStore.delCachedView()
  }
  tagsViewStore.delVisitedView(router.currentRoute.value)
  router.push({ name: 'SiteList' })
}

const baseRef = ref()

const save = async () => {
  if (activeName.value === 'base') {
    baseRef.value.save()
  }
  ElMessage({
    message: '保存成功',
    type: 'success',
    duration: 2000,
  })
}

const closeViewTag = () => {}

onMounted(() => {
  init()
})
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <ElRow type="flex" justify="space-between" align="middle">
        <div>
          <h4>{{ pageTitle }}</h4>
        </div>
        <div>
          <EBtn size="small" :loading="loading.button" @click="closeViewTag()">
            取消
          </EBtn>
          <EBtn size="small" type="primary" icon="el-icon-document-add" :loading="loading.button" @click="save">
            保存
          </EBtn>
        </div>
      </ElRow>
    </div>
    <div class="view-main">
      <ElTabs v-model="activeName" class="demo-tabs">
        <ElTabPane label="基础设置" name="base">
          <Base ref="baseRef" :is-edit="props.isEdit" />
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
