<script setup lang="ts">
/**
 * This component defines an input field used to enter a password
 * and is capable of displaying error messages and validation messages
 * under the input field.
 *
 * An eye icon also provides a way for the user to see or hide the password
 */
import { ref, toRefs } from 'vue'
import type { BaseValidation } from '@vuelidate/core'
import { useInputValidation } from '@/composables/baseInput'
import { EyeIcon, EyeSlashIcon as EyeOffIcon } from '@heroicons/vue/24/outline'

const props = withDefaults(
  defineProps<{
    label: string
    modelValue: string
    validation: BaseValidation
    displayValidMessage?: boolean
    displayInvalidMessage?: boolean
    validMessage?: string
    responsive?: boolean
    placeholder?: string
    autofocus?: boolean
    autocomplete?: string
  }>(),
  {
    displayValidMessage: false,
    displayInvalidMessage: true,
    responsive: false,
    validMessage: '',
    placeholder: '',
    autofocus: false,
    autocomplete: '',
  },
)

const {
  label,
  displayValidMessage,
  displayInvalidMessage,
  validMessage,
  validation,
  responsive,
  placeholder,
} = toRefs(props)
const show = ref(false)
const inputId = label?.value?.trim().replace(/\s/g, '_')

const { labelClass, inputClass, messageClass, validationMessage } = useInputValidation({
  validation: validation.value,
  displayInvalidMessage: displayInvalidMessage.value,
  displayValidMessage: displayValidMessage.value,
  validMessage: validMessage.value,
})
</script>
<template>
  <div
    class="grid grid-cols-6 form-control w-full"
    :class="{ 'md:items-center md:space-x-4': responsive }"
  >
    <!-- label -->
    <label :class="labelClass" class="label col-span-6" :for="inputId">
      <span class="label-text"> {{ label }}</span>
    </label>
    <!-- input & message -->
    <div class="col-span-6" :class="{ 'md:col-span-5': responsive }">
      <!-- input -->
      <div>
        <div class="relative w-full">
          <div class="absolute inset-y-0 right-0 flex items-center px-2">
            <EyeIcon
              v-if="!show"
              @click="show = !show"
              class="w-4 h-4 text-base-300 hover:text-base-content"
            />
            <EyeOffIcon
              v-if="show"
              @click="show = !show"
              class="w-4 h-4 text-base-300 hover:text-base-content"
            />
          </div>

          <input
            class="input input-bordered input-light w-full text-base-content"
            @input="$emit('update:modelValue', ($event?.target as HTMLInputElement).value)"
            :value="modelValue"
            :class="inputClass"
            :type="show ? 'text' : 'password'"
            :id="inputId"
            :placeholder="placeholder"
            :autofocus="autofocus"
            :autocomplete="autocomplete"
          />
        </div>
      </div>
      <!-- message -->
      <label
        v-if="displayInvalidMessage || displayValidMessage"
        class="text-xs mt-1 label text-error-content"
        :class="messageClass"
      >
        <span>
          {{ validationMessage }}
        </span>
      </label>
    </div>
  </div>
</template>
