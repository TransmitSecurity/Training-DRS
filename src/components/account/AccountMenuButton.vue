<script setup lang="ts">
/**
 * Link to a sub menu, used in the AccountMenu component
 */
import { computed, toRefs } from 'vue'
import type { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    icon: FunctionalComponent<HTMLAttributes & VNodeProps, {}, any>
    routeName: string
    selected?: boolean
  }>(),
  { selected: false },
)

const { title, icon, selected, routeName } = toRefs(props)

const selectedLinkClass =
  'bg-primary/5 border-primary-focus text-primary hover:bg-primary/10 hover:text-primary-focus'
const normalLinkClass = 'text-base-content/50 hover:bg-base-200 hover:text-base-content/70'
const selectedIconClass = 'group-hover:text-primary-focus'
const normalIconClass = 'text-base-content/50 group-hover:text-base-content/70'

const linkClass = computed(() => {
  return selected.value ? selectedLinkClass : normalLinkClass
})

const iconClass = computed(() => {
  return selected.value ? selectedIconClass : normalIconClass
})
</script>
<template>
  <router-link
    :to="{ name: routeName }"
    class="group border-l-4 px-3 py-2 flex items-center text-sm font-medium focus-visible:outline-none"
    :class="linkClass"
  >
    <icon class="w-6 h-6 flex-shrink-0 -ml-1 mr-3" :class="iconClass" />
    <span class="truncate"> {{ title }} </span>
  </router-link>
</template>
