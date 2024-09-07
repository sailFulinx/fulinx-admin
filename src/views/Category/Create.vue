<script setup>
import Detail from './Components/Detail.vue'
</script>

<template>
  <Detail :is-edit="false" :title="`${$t('common.create')}${$t('category.name')}`" />
</template>
