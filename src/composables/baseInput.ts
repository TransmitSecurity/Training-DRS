import { ref, watchEffect, type Ref } from 'vue'
import type { BaseValidation } from '@vuelidate/core'

export const display = {
  error: 'displayError',
  valid: 'displayValid',
  none: 'displayNone',
} as const

type DisplayType = (typeof display)[keyof typeof display]

const size = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const

export type SizeType = (typeof size)[keyof typeof size]

export type ValidationParams = {
  validation: BaseValidation
  displayValidMessage: boolean
  displayInvalidMessage: boolean
  validMessage: string
}

export function getInputId(labelValue: string) {
  return labelValue.trim().replace(/\s/g, '_')
}

export function useInputValidation(params: ValidationParams) {
  const { validation, displayValidMessage, displayInvalidMessage, validMessage } = params

  const validationState = ref<DisplayType>(display.none)
  const validationMessage = ref('')
  const labelClass = ref('')
  const inputClass = ref('')
  const messageClass = ref('')

  watchEffect(() => {
    if (!validation.$errors[0] && validation.$dirty && displayValidMessage.valueOf()) {
      validationState.value = display.valid
    } else if (validation.$errors[0] && validation.$dirty && displayInvalidMessage.valueOf()) {
      validationState.value = display.error
    } else {
      validationState.value = display.none
    }

    if (validation.$invalid && validation.$dirty) {
      labelClass.value = 'text-error-content'
    } else {
      labelClass.value = ''
    }

    switch (validationState.value) {
      case display.valid:
        validationMessage.value = validMessage.valueOf() ? validMessage.valueOf() : ''
        inputClass.value = 'input-success'
        messageClass.value = 'visible text-success-content'
        break
      case display.error:
        validationMessage.value = validation.$errors[0].$message.toString()
        inputClass.value = 'input-error'
        messageClass.value = 'visible text-error-content'
        break
      default:
        validationMessage.value = 'Placeholder'
        inputClass.value = ''
        messageClass.value = 'invisible '
    }
  })

  return { labelClass, inputClass, messageClass, validationMessage }
}
