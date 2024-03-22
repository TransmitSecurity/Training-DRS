<script setup lang="ts">
import { toRefs } from 'vue'
import type { BaseValidation } from '@vuelidate/core'
import { useInputValidation } from '@/composables/baseInput'
const props = withDefaults(
  defineProps<{
    label: string
    inputType: string
    step?: string
    displayInput?: boolean
    modelValue: string
    validation: BaseValidation
  }>(),
  { displayInput: true },
)

const { displayInput, label, inputType, validation } = toRefs(props)
const { labelClass, inputClass, messageClass, validationMessage } = useInputValidation({
  validation: validation.value,
  displayInvalidMessage: true,
  displayValidMessage: false,
  validMessage: '',
})
const inputId = label.value.trim().replace(/\s/g, '_')
</script>
<template>
  <div>
    <label :class="labelClass" class="label flex justify-start px-0" :for="inputId">
      <span class="label-text text-xs">{{ label }}</span>
    </label>
    <div v-if="displayInput">
      <input
        class="input input-bordered w-full text-base-content input-light flex-grow"
        @input="$emit('update:modelValue', ($event?.target as HTMLInputElement).value)"
        :value="modelValue"
        :type="inputType"
        :step="step"
        :id="inputId"
      />
      <div
        class="text-xs mt-1 text-error-content"
        :class="validation.$errors[0] ? 'visible' : 'invisible'"
      >
        <div>{{ validation.$errors[0] ? validation.$errors[0].$message : 'Placeholder' }}</div>
      </div>
    </div>
    <span v-else class="text-base-content text-lg w-full break-words">{{ props.modelValue }}</span>
  </div>
</template>
