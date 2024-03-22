<script setup lang="ts">
import {
  DocumentTextIcon,
  CreditCardIcon,
  PencilSquareIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps<{
  text: string
  icon: 'Transfer' | 'Card' | 'Iban' | 'Document'
}>()

const componentToLoad = computed(() => {
  switch (props.icon) {
    case 'Transfer':
      return ArrowsRightLeftIcon

    case 'Card':
      return CreditCardIcon

    case 'Iban':
      return PencilSquareIcon

    case 'Document':
      return DocumentTextIcon

    default:
      return CreditCardIcon
  }
})
</script>

<template>
  <div
    class="col-span-1 flex flex-col items-center px-2 py-4 hover:bg-primary hover:text-primary-content hover:rounded-sm hover:cursor-pointer"
  >
    <component :is="componentToLoad" class="w-5 h-5 font-bold" />
    <span class="text-center mt-4">{{ props.text }}</span>
  </div>
</template>
