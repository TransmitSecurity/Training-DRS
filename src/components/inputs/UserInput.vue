<script setup lang="ts">
/**
 * This component defines a base input field
 * and is capable of displaying error messages and validation messages
 * under the input field.
 *
 * @displayName UserInput
 */
import { ref, toRefs } from 'vue'
import type { BaseValidation } from '@vuelidate/core'
import { useInputValidation } from '@/composables/baseInput'
import type { SizeType } from '@/composables/baseInput'
import { CheckIcon } from '@heroicons/vue/24/outline'
import { ExclamationCircleIcon } from '@heroicons/vue/24/solid'

const props = withDefaults(
  defineProps<{
    /**
     * The description of the input
     * displayed above the input
     */
    label: string
    /**
     * The type of the input
     * as described in the HTML specs
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#input_types}
     */
    inputType?: string
    /**
     * The granularity that the input
     * must adhere to
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/step}
     */
    step?: string
    /**
     * The reactive data to store and display
     * in the input
     */
    modelValue: string
    /**
     * The validation result
     */
    validation: BaseValidation
    /**
     * Indicates if the input is required
     */
    required?: boolean
    /**
     * The placeholder displayed when the
     * input is empty
     */
    placeholder?: string
    /**
     * Display a message under the input
     * when the input is valid
     */
    displayValidMessage?: boolean
    /**
     * Display a message under the input
     * when the input is invalid
     */
    displayInvalidMessage?: boolean
    /**
     * Message to be displayed when
     * the input is valid
     */
    validMessage?: string
    /**
     * Thickness of the input, from xs to lg
     */
    size?: SizeType
    /**
     * Display the update button
     */
    displayUpdateOption?: boolean
    /**
     * Display the verified badge
     */
    displayVerifiedBadge?: boolean
    /**
     * Indicate if this data is verified
     */
    verified?: boolean
    /**
     * Route name to verify the data
     * as defined in routes/index.ts
     */
    verifyRouteName?: string
    /**
     * Indicate if the update function is still loading
     */
    loading?: boolean
    /**
     * Indicate if this input will be automatically focused
     */
    autofocus?: boolean
    /**
     * Value of the autocomplete
     */
    autocomplete?: string
  }>(),
  {
    inputType: 'text',
    required: false,
    placeholder: '',
    showValidation: false,
    displayValidMessage: false,
    displayInvalidMessage: true,
    responsive: false,
    validMessage: '',
    size: 'md',
    displayUpdateOption: false,
    displayVerifiedBadge: false,
    verified: false,
    verifyLink: '',
    loading: false,
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
  displayUpdateOption,
  verifyLink: verifyRouteName,
  loading,
} = toRefs(props)
const inputId = label?.value?.trim().replace(/\s/g, '_')

const emits = defineEmits(['updateData', 'update:modelValue'])

const { labelClass, inputClass, messageClass, validationMessage } = useInputValidation({
  validation: validation.value,
  displayInvalidMessage: displayInvalidMessage.value,
  displayValidMessage: displayValidMessage.value,
  validMessage: validMessage.value,
})
</script>
<template>
  <div class="form-control">
    <!-- label -->
    <label :class="labelClass" class="label flex justify-start gap-x-4" :for="inputId">
      <span class="label-text">{{ label }}</span>
      <!-- Verified badge -->
      <div v-if="displayVerifiedBadge">
        <div v-if="verified" class="badge badge-xs badge-info bg-info/20 gap-2">
          <CheckIcon class="h-3 w-3 text-info-content" />
          {{ $t('components.account.accountInfoItem.verified') }}
        </div>
        <router-link
          :to="{ name: verifyRouteName }"
          v-if="!verified"
          class="text-warning pr-1 text-xs flex items-center w-max underline"
        >
          <ExclamationCircleIcon class="h-3 w-3 text-warning/70" />
          <span>{{ $t('components.account.accountInfoItem.notVerified') }}</span>
        </router-link>
      </div>
    </label>

    <!-- input -->
    <div class="flex gap-x-4">
      <input
        :autocomplete="autocomplete"
        class="input input-bordered w-full text-base-content input-light flex-grow"
        @input="$emit('update:modelValue', ($event?.target as HTMLInputElement).value)"
        :value="modelValue"
        :class="`${inputClass} input-${size}`"
        :type="inputType"
        :step="step"
        :id="inputId"
        :required="required"
        :placeholder="placeholder"
        :autofocus="autofocus"
      />
      <!-- Update button -->
      <div
        v-if="displayUpdateOption"
        @click="$emit('updateData')"
        class="self-center btn btn-ghost text-primary hover:text-primary-focus cursor-pointer font-bold relative"
        :class="loading ? 'btn-disabled' : ''"
      >
        <!-- Loading spinner -->
        <div
          v-if="loading"
          class="btn-disabled btn loading loading-spinner text-primary-content absolute top-0 flex justify-center items-center w-full h-full bg-primary opacity-80"
        ></div>
        <!-- Button text -->
        <span v-if="!verified"> {{ $t('global.verify') }}</span>
        <span v-else>{{ $t('global.update') }}</span>
      </div>
    </div>
    <!-- validation or error message | is hidden if not configured to display -->
    <label
      v-if="displayInvalidMessage || displayValidMessage"
      class="text-xs mt-1"
      :class="messageClass"
    >
      <span>
        {{ validationMessage }}
      </span>
    </label>
  </div>
</template>
