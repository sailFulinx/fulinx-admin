<script setup lang="ts">
import Iconify from '@purge-icons/generated'
import { ElIcon } from 'element-plus'
import { computed, nextTick, ref, unref, watch } from 'vue'

const props = defineProps({
  // icon name
  icon: {
    type: String,
  },
  // icon color
  color: {
    type: String,
  },
  // icon size
  size: {
    type: Number,
    default: 16,
  },
})

const elRef = ref<ElRef>(null)

const isLocal = () => {
  return props.icon?.startsWith('svg-icon:')
}

const symbolId = () => {
  return unref(isLocal) ? `#icon-${props.icon?.split('svg-icon:')[1]}` : props.icon
}

const getIconifyStyle = computed(() => {
  const { color, size } = props
  return {
    fontSize: `${size}px`,
    color,
  }
})

const updateIcon = async (icon: string) => {
  if (unref(isLocal)) {
    return
  }

  const el = unref(elRef)
  if (!el) {
    return
  }

  await nextTick()

  if (!icon) {
    return
  }

  const svg = Iconify.renderSVG(icon, {})
  if (svg) {
    el.textContent = ''
    el.appendChild(svg)
  } else {
    const span = document.createElement('span')
    span.className = 'iconify'
    span.dataset.icon = icon
    el.textContent = ''
    el.appendChild(span)
  }
}

watch(
  () => props.icon,
  (icon: string) => {
    updateIcon(icon)
  },
)
</script>

<template>
  <ElIcon :size="size" :color="color">
    <span ref="elRef" :class="$attrs.class" :style="getIconifyStyle">
      <span class="iconify" :data-icon="symbolId" />
    </span>
  </ElIcon>
</template>
