<script lang="ts" setup>
import { uploadFileApi } from '@/api/file'
import { updateUserAvatar } from '@/api/user'
import { ElMessage, type UploadProps } from 'element-plus'

const userStore = useUserStore()

const loading = ref(false)

const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Picture size can not exceed 2MB!')
    return false
  }
  return true
}

const handleUpload = async ({ file }) => {
  loading.value = true
  const formData = new FormData()
  formData.append('file', file)
  $catch(async () => {
    const { data } = await uploadFileApi(formData).catch(err => {
      loading.value = false
      throw err
    })
    await updateUserAvatar({ newAvatarFileId: data.id })
    await useUserStore().getUserDetail()
    $notify({
      type: 'success',
      title: '头像修改成功',
      message: '请耐心等待系统审核',
    })
  }).catch(err => {
    console.log(err)
  })

  loading.value = false
}
</script>

<template>
  <ClientOnly>
    <ElUpload
      :loading="loading"
      class="avatar-uploader"
      action
      accept=".jpg,.jpeg"
      :http-request="handleUpload"
      :show-file-list="false"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    >
      <img
        v-if="userStore.user?.avatarFileVo && userStore.user?.avatarFileVo?.fileUrl"
        class="h-12 w-12 rounded-full"
        :src="userStore.user?.avatarFileVo.fileUrl"
        alt=""
      >
      <img v-else class="h-12 w-12 rounded-full" src="~imgs/avatar.jpg" alt="">
    </ElUpload>
  </ClientOnly>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 180px;
  height: 180px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  text-align: center;
}
</style>
