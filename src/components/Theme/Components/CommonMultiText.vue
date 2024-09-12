<script setup name="CommonMultiText" lang="ts">
import { ElDialog, ElMessage } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

const dialogVisible = ref<boolean>(false)

interface TextItem {
  sort: number
  title: ''
  subTitle: ''
  textList: string[]
}

const createTextItemFormRef = ref()

const createTextItemForm = (): TextItem => {
  return {
    sort: 1,
    title: '',
    subTitle: '',
    textList: [],
  }
}

const textItemForm = ref<TextItem>(createTextItemForm())

interface FormData {
  content: {
    textList: TextItem[]
  }
  status: boolean
}

const form = reactive<FormData>({
  content: {
    textList: [],
  },
  status: true,
})

const rules = reactive({
  title: [{ required: true, type: 'string', message: '请输入标题', trigger: 'blur' }],
})

watch(
  () => props.componentData,
  val => {
    if (val) {
      setFormData(val)
    }
  },
  { immediate: true },
)

const formRef = ref()

const handleAddText = () => {
  textItemForm.value = createTextItemForm()
  textItemForm.value.sort = form.content.textList.length + 1
  dialogVisible.value = true
}

const handleAddTextItem = () => {
  textItemForm.value.textList.push('') // 新增一行文字内容
  textItemForm.value.textList = [...textItemForm.value.textList] // 重新赋值以确保响应式更新
}

const handleEdit = (index: number) => {
  textItemForm.value = form.content.textList[index]
  dialogVisible.value = true
}

/**
 * 改变排序
 */
function handleChangeItemSort() {
  form.content.textList.forEach((item, index) => {
    item.sort = index + 1
  })
}

const handleRemove = (index: number) => {
  form.content.textList.splice(index, 1)
  handleChangeItemSort()
}

const handleRemoveItem = (index: number) => {
  textItemForm.value.textList.splice(index, 1) // 删除指定的文字内容
  textItemForm.value.textList = [...textItemForm.value.textList] // 重新赋值以确保响应式更新
}

const handleSaveTextItem = async () => {
  const valid = await createTextItemFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  dialogVisible.value = false
  form.content.textList.push(textItemForm.value)
}

async function getFormData() {
  if (form.content.textList.length === 0) {
    ElMessage.error('请添加一组文字')
    return false
  }
  return form
}

function setFormData(formData: FormData) {
  if (formData.content.textList && Array.isArray(formData.content.textList)) {
    form.content.textList = [...formData.content.textList] // 确保重新赋值，触发响应式
  }

  form.status = formData.status
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div>
    <ElForm ref="formRef" :model="form" label-width="140px">
      <ElFormItem label="文字内容" required>
        <div class="flex w-full mb-5">
          <EBtn @click="handleAddText">
            <Icon icon="ep:plus" />
            增加一组文字
          </EBtn>
        </div>

        <VueDraggable v-model="form.content.textList" item-key="sort" class="w-full grid grid-cols-4 gap-4">
          <ElTag v-for="(item, index) in form.content.textList" :key="index" class="w-full py-3" effect="plain" shadow="never">
            <template #default>
              <div class="flex items-center justify-between">
                <div>{{ item.title }}</div>
                <div>
                  <EBtn text type="primary" @click="handleEdit(index)">
                    <Icon icon="ep:edit" />
                  </EBtn>
                  <EBtn text type="danger" @click="handleRemove(index)">
                    <Icon icon="ep:close" />
                  </EBtn>
                </div>
              </div>
            </template>
          </ElTag>
        </VueDraggable>
      </ElFormItem>
      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
    <ElDialog v-model="dialogVisible" title="编辑文字内容">
      <ElForm ref="createTextItemFormRef" :model="textItemForm" :rules="rules" label-width="140px">
        <ElFormItem label="标题" prop="title" required>
          <ElInput v-model="textItemForm.title" />
        </ElFormItem>
        <ElFormItem label="副标题">
          <ElInput v-model="textItemForm.subTitle" />
        </ElFormItem>
        <ElFormItem label="文字">
          <div v-for="(item, index) in textItemForm.textList" :key="index" class="w-full mb-4">
            <div class="flex">
              <ElInput v-model="textItemForm.textList[index]" placeholder="请输入文字内容" />
              <EBtn text type="danger" class="ml-5" @click="handleRemoveItem(index)">
                <Icon icon="ep:delete" />
              </EBtn>
            </div>
          </div>
          <EBtn @click="handleAddTextItem">
            <Icon icon="ep:plus" />
            增加一行文字
          </EBtn>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="flex justify-end">
          <EBtn @click="dialogVisible = false">
            取消
          </EBtn>
          <EBtn type="primary" @click="handleSaveTextItem">
            提交
          </EBtn>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tag) {
  justify-content: start !important;
  height: 36px !important;
  padding:5px 9px !important;
  display: block !important;
}
</style>
