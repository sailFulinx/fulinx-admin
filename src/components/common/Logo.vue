<script setup lang="ts">

</script>

<template>
  <div>
    <RouterLink
      class="flex !h-[var(--logo-height)] items-center cursor-pointer pl-8px relative dark:bg-[var(--el-bg-color)]"
      to="/"
    >
      <img src="@/assets/imgs/logo.png" class="w-[calc(var(--logo-height)-10px)] h-[calc(var(--logo-height)-10px)]">
    </RouterLink>
  </div>
</template>
