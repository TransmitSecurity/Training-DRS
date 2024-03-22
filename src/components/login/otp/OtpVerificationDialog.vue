<script setup lang="ts">
import { toRefs } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue'
import OtpSent from './OtpSent.vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    contact: string
    showError?: boolean
    loading?: boolean
  }>(),
  { showError: false, loading: false },
)

const { isOpen, contact } = toRefs(props)
const emits = defineEmits(['resendOtp', 'validateOtp', 'back', 'change'])

function validate(contact: string, otp: string) {
  console.log(`OTP in dialog ${otp}`)
  emits('validateOtp', contact, otp)
}
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
              class="w-full max-w-md flex justify-center transform overflow-hidden rounded-lg bg-base-100 text-base-content p-6 text-left align-middle shadow-xl transition-all"
            >
              <otp-sent
                :show-error="showError"
                :contact="contact"
                show-back-label
                :back-label="$t('global.cancel')"
                :loading="loading"
                @change="$emit('change')"
                @resend-otp="$emit('resendOtp')"
                @validate-otp="validate"
                @back="$emit('back')"
                class="py-8"
              >
                <div class="mt-1 mb-2 text-center font-semibold text-xl">
                  {{ $t('otp.oneLastThing') }}
                </div>
              </otp-sent>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
