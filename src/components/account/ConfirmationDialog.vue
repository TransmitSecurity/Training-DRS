<script setup lang="ts">
import { toRefs } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
} from '@headlessui/vue'

const props = defineProps<{
  isOpen: boolean
}>()

const { isOpen } = toRefs(props)
const emits = defineEmits(['cancel', 'confirm'])
</script>
<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="() => {}" class="relative z-10" :static="true">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-box bg-base-100 text-base-content p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle class="mb-8">{{ $t('global.areYouSure') }}</DialogTitle>
              <DialogDescription>
                <slot> This operation cannot be undone. </slot>
              </DialogDescription>
              <div class="flex justify-around mt-8">
                <button class="btn btn-ghost border-primary border-2" @click="$emit('cancel')">
                  {{ $t('global.cancel') }}
                </button>
                <button class="btn btn-primary" @click="$emit('confirm')">
                  {{ $t('global.confirm') }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
