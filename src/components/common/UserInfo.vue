<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { resetRouter } from '@/router'
import { useTagsViewStore } from '@/stores/tagsView'
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const tagsViewStore = useTagsViewStore()

const { t } = useI18n()

const { replace } = useRouter()

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
      <img src="@/assets/imgs/avatar.jpg" alt="" class="w-[calc(var(--logo-height)-25px)] rounded-[50%]">
      <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">Archer</span>
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
