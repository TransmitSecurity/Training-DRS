<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
import VOtpInput from 'vue3-otp-input'
import { ref, toRefs } from 'vue'

const otpInput = ref(null)

const props = withDefaults(
  defineProps<{
    contact: string
    showOtherOptions?: boolean
    otherOptionTitle?: string
    otherOptionLinkLabel?: string
    showBackLabel?: boolean
    backLabel?: string
    showError?: boolean
    loading?: boolean
  }>(),
  { showError: false, loading: false, showOtherOptions: false, showBackLabel: false },
)

const emits = defineEmits(['resendOtp', 'back', 'validateOtp', 'change', 'otherOption'])

const {
  contact,
  otherOptionTitle,
  otherOptionLinkLabel,
  backLabel,
  showOtherOptions,
  showBackLabel,
  showError,
} = toRefs(props)

function resendOtp() {
  emits('resendOtp')
}

function back() {
  emits('back')
}
function handleOnChange(otp: string) {
  emits('change')
}

function handleOnComplete(otp: string) {
  console.log(`Complete [${otp}] [${contact.value}]`)
  emits('validateOtp', contact.value, otp)
}
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="mb-3 flex items-center space-x-3">
      <slot name="title"></slot>
    </div>
    <div>
      <div class="w-80">
        <div class="container mx-auto space-y-8">
          <p>
            {{ $t('otp.pleaseEnterTheCodeReceived') }}
            <span class="font-bold">{{ contact }}</span>
          </p>
          <div class="self-center relative">
            <!-- Loading indicator -->
            <div
              v-if="loading"
              class="btn-disabled btn loading loading-spinner text-base-content absolute top-0 flex justify-center items-center w-full h-full bg-base-100 opacity-80"
            ></div>
            <!-- OTP input -->
            <v-otp-input
              class="space-x-2 flex justify-center"
              ref="otpInput"
              input-classes="bg-base-100 w-10 text-center border-b-2 border-neutral outline-none focus:border-neutral-focus"
              separator=""
              :num-inputs="6"
              :should-auto-focus="true"
              :is-input-num="true"
              :placeholder="['·', '·', '·', '·', '·', '·']"
              @on-change="handleOnChange"
              @on-complete="handleOnComplete"
            />
          </div>
          <div class="text-error text-center" v-if="showError">
            {{ $t('otp.invalidCode') }}
          </div>
          <p>
            {{ $t('otp.notReceived') }}
            <a @click="resendOtp" class="text-primary hover:text-primary-focus cursor-pointer">
              {{ $t('global.resend') }} </a
            >.
          </p>
        </div>
      </div>
      <div v-if="showOtherOptions || showBackLabel">
        <div
          v-if="showOtherOptions && otherOptionTitle && otherOptionLinkLabel"
          class="mt-5 text-center"
        >
          <p class="text-sm text-neutral">
            {{ otherOptionTitle }}
            <span @click="$emit('otherOption')" class="text-neutral link">
              {{ otherOptionLinkLabel }}
            </span>
          </p>
        </div>

        <div v-if="showBackLabel" class="mt-5 text-left">
          <p class="text-sm">
            <a @click="back" class="text-neutral hover:text-neutral-focus cursor-pointer">
              <div class="flex space-x-3 items-center">
                <arrow-left-icon class="w-4 h-4" />
                <div>{{ backLabel }}</div>
              </div>
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
