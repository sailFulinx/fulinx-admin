<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
import { resetRouter } from '@/router'
import { useTagsViewStore } from '@/stores/tagsView'
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const tagsViewStore = useTagsViewStore()

const { replace } = useRouter()

const { t } = useLocale()

const loginOut = () => {
  ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
  })
    .then(async () => {
      tagsViewStore.delAllViews()
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiration')
      resetRouter() // 重置静态路由表
      replace('/login')
    })
    .catch(() => {})
}
</script>

<template>
  <ElDropdown trigger="click">
    <div class="flex items-center">
      <img src="@/assets/imgs/avatar.jpg" alt="" class="w-36px rounded-[50%]">
      <span class="text-13px pl-3">Archer</span>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem divided>
          <div @click="loginOut">
            {{ t('common.loginOut') }}
          </div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
