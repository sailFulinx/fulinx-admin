<script setup lang="ts">
import { usePermissionStore } from '@/stores/permission'
import { useRouter } from 'vue-router'

const { push } = useRouter()

const permissionStore = usePermissionStore()

const errorClick = () => {
  push(permissionStore.addRouters[0]?.path as string)
}
</script>

<template>
  <Error @error-click="errorClick" />
</template>
