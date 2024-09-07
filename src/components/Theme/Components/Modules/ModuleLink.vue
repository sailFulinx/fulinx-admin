<script setup name="ThemeLinkType" lang="ts">
import { articleList } from '@/api/article'
import { listCategoryApi } from '@/api/category'
import { linkTypes } from '@/data/theme'

const emit = defineEmits(['changeLinkType'])
const linkType = ref<string>('home')
const linkValue = ref<string>('')
const linkData = reactive<LinkData>({
  linkType: 'home',
  linkUrl: '/',
  linkValue: '/',
  label: '',
  children: [],
})
const categoriesProps = reactive({
  value: 'id',
  label: 'categoryName',
  checkStrictly: true,
  multiple: false,
})
const categories = ref<ListCategoryRes>({
  list: [],
  total: 0,
})
const categoriesRef = ref()
let prevLinkType = ''
const status = reactive({
  category: false,
  article: false,
  externalLink: false,
})
const loading = reactive({
  init: false,
  data: false,
})
const articles = ref<TableResponse<ArticleData & CommonField>>({
  list: [],
  total: 0,
})
const needChildren = ['category']
const domRefs = {
  category: categoriesRef,
}

const setLinkData = async linkDataVal => {
  linkType.value = linkDataVal.linkType
  await changeLinkType()
  linkValue.value = linkDataVal.linkValue
  linkData.label = linkDataVal.label || 'home'
  linkData.linkType = linkDataVal.linkType || 'home'
  linkData.linkUrl = linkDataVal.linkUrl || '/'
  linkData.linkValue = linkDataVal.linkValue || '/'
  linkData.children = linkDataVal.children || []
}

/**
 * 获取分类数据
 */
async function getCategoryData() {
  loading.data = true
  const { data } = await listCategoryApi().catch(err => {
    throw err
  })
  categories.value = data
  loading.data = false
}

/**
 * 获取文章数据
 * @param query
 */
async function getArticlesData() {
  const payload = {
    articleId: linkValue.value || null,
  }
  loading.data = true
  const { data } = await articleList(payload).catch(err => {
    loading.data = false
    throw err
  })
  articles.value = data
  loading.data = false
}
async function changeLinkType() {
  linkValue.value = ''
  if (linkType.value === 'article') {
    await getArticlesData()
  }
  if (linkType.value === 'category') {
    await getCategoryData()
  }
  if (prevLinkType) {
    status[prevLinkType] = false
  }
  status[linkType.value] = true
  prevLinkType = linkType.value
  linkData.linkUrl = '/'
  linkData.linkValue = '/'
  linkData.linkType = linkType.value
  linkData.children = []
  // emit('changeLinkType', linkData)
}
function changeLinkValue(v) {
  const childrenConfig = [] as LinkData[]
  if (needChildren.includes(linkType.value)) {
    const nodeRes = domRefs[linkType.value].value.getCheckedNodes()
    const data = nodeRes[0]?.data || {}
    const slug = data.slug || ''
    if (linkType.value === 'category') {
      linkData.linkValue = data.id
      linkData.linkUrl = `/category${slug}/${data.id}`
      linkData.label = data.categoryName
    }
    linkData.linkType = linkType.value
    const children = data.children
    if (children) {
      if (linkType.value === 'category') {
        linkData.linkUrl = `/category${slug}/${data.id}`
        for (const item of children) {
          const { slug, categoryName, id } = item
          const slugData = slug || ''
          const childrenItem = {
            linkType: linkType.value,
            linkUrl: `/category${slugData}/${id}`,
            linkValue: id,
            label: categoryName,
            children: [],
          } as LinkData
          childrenConfig.push(childrenItem)
        }
      }
      linkData.children = childrenConfig
    } else {
      linkData.children = []
    }
    return
  }
  let linkUrl = ''
  if (linkType.value === 'article') {
    const slug = v.slug || ''
    linkUrl = `/article${slug}/${v.id}`
    linkData.linkUrl = linkUrl || ''
    linkData.label = v.articleName
  }
  linkData.linkValue = v.id || ''
  linkData.linkType = linkType.value
}
function getLinkData() {
  if (linkType.value === 'externalLink') {
    linkData.linkUrl = linkValue.value || '/'
    linkData.linkValue = linkValue.value || '/'
  }
  if (linkType.value === 'home') {
    linkData.linkUrl = '/'
    linkData.linkValue = '/'
    linkData.label = 'Home'
  }
  return jsonParse(linkData)
}
defineExpose({
  getLinkData,
  setLinkData,
})
</script>

<template>
  <div class="w-full flex justify-start items-center">
    <div class="w-1/3 mr-1">
      <ElSelect
        v-model="linkType"
        :loading="loading.data"
        placeholder="请选择链接类型"
        class="w-full"
        @change="changeLinkType"
      >
        <ElOption v-for="item in linkTypes" :key="item.id" :label="item.title" :value="item.code" />
      </ElSelect>
    </div>

    <div class="w-2/3">
      <!-- 博客分类 -->
      <ElCascader
        v-if="status.category"
        ref="categoriesRef"
        v-model="linkValue"
        :loading="loading.data"
        :show-all-levels="false"
        :props="categoriesProps"
        clearable
        placeholder="请选择博客分类，支持搜索"
        :options="categories.list"
        filterable
        class="w-full"
        @change="changeLinkValue"
      />
      <!-- 文章 -->
      <ElSelect
        v-if="status.article"
        v-model="linkValue"
        filterable
        clearable
        remote
        reserve-keyword
        placeholder="请输入标题搜索"
        :remote-method="getArticlesData"
        :loading="loading.data"
        class="w-full"
      >
        <ElOption
          v-for="item in articles.list"
          :key="item.id"
          :label="item.articleName"
          :value="item.id"
          style="height: 60px; line-height: 60px"
          @click.native="changeLinkValue(item)"
        >
          <span style="line-height: 60px">{{ item.articleName }}</span>
        </ElOption>
      </ElSelect>
      <!-- 外部链接 -->
      <ElInput
        v-if="status.externalLink"
        v-model="linkValue"
        minlength="1"
        maxlength="60"
        placeholder="请输入外部链接"
        class="w-full"
      />
    </div>
  </div>
</template>
