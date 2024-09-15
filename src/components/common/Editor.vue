<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

import { ElMessage } from 'element-plus'

const mode = 'default'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p></p>')

function getToken(): string {
  const tokenInfo = localStorage.getItem('token')
  if (tokenInfo) {
    return `Bearer ${tokenInfo}`
  }
  return ''
}

const toolbarConfig: any = {}

// 排除上传视频
toolbarConfig.excludeKeys = ['uploadVideo']

const editorConfig = {
  placeholder: '请输入内容内容...',
  MENU_CONF: {
    uploadImage: {
      server: `${import.meta.env.VITE_API_URL}server-side/file`,
      fieldName: 'file',
      allowedFileTypes: ['image/*'],
      maxFileSize: 2 * 1024 * 1024, // 1M
      headers: {
        'Accept': 'application/json',
        'Authorization': getToken(),
        'Access-Control-Allow-Origin': '*',
      },
      // withCredentials: true,
      onBeforeUpload(file: File) {
        // const formData = new FormData()
        // formData.append('file', file)
        // log(file)
        return file
      },
      onProgress(progress: number) {
        console.log('progress', progress)
      },

      // 单个文件上传成功之后
      onSuccess(file: File, res: any) {
        console.log(`${file.name} 上传成功`, res)
      },
      onFailed(file: File, res: any) {
        console.log(`${file.name} 上传失败`, res)
        ElMessage({
          type: 'error',
          message: `${file.name} 上传出错`,
        })
      },
      onError(file: File, err: any, res: any) {
        console.log(`${file.name} 上传出错`, err, res)
        ElMessage({
          type: 'error',
          message: `${file.name} 上传出错`,
        })
      },
      customInsert(res: any, insertFn: any) {
        if (res.errorCode === 0) {
          const fileUrl = import.meta.env.VITE_RESOURCE_URL + res.data.fileUrl
          insertFn(fileUrl, res.data.originalFileName, fileUrl)
        }
      },
    },
  },
  withCredentials: true,
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) {
    return
  }
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const customPaste = (editor: any, event: any, callback: any) => {
  // console.log('ClipboardEvent 粘贴事件对象', event)
  // const html = event.clipboardData.getData('text/html') // 获取粘贴的 html
  const text = event.clipboardData.getData('text/plain') // 获取粘贴的纯文本
  // const rtf = event.clipboardData.getData('text/rtf') // 获取 rtf 数据（如从 word wsp 复制粘贴）

  // 自定义插入内容
  editor.insertText(text)

  // 返回 false ，阻止默认粘贴行为
  event.preventDefault()
  callback(false) // 返回值（注意，vue 事件的返回值，不能用 return）

  // 返回 true ，继续默认的粘贴行为
  // callback(true)
}

const getEditorData = () => {
  return valueHtml.value
}

const setEditorData = (data: any) => {
  console.log(data)
  valueHtml.value = data
}

defineExpose({
  getEditorData,
  setEditorData,
})
</script>

<template>
  <div style="border: 1px solid #ccc; margin-top: 10px">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :default-config="toolbarConfig" :mode="mode" />

    <Editor
      v-model="valueHtml"
      style="min-height:320px; overflow-y: hidden"
      :default-config="editorConfig"
      :mode="mode"
      @on-created="handleCreated"
      @custom-paste="customPaste"
    />
  </div>
</template>

<style scoped>
</style>
