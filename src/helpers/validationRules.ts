import {
  required,
  email as isEmail,
  helpers,
  minLength,
  alpha,
  alphaNum,
} from '@vuelidate/validators'
import i18n from '@/helpers/i18n'

export function signupPasswordRule() {
  const { t } = i18n.global
  return {
    required: helpers.withMessage(t('validation.password.passwordRequired'), required),
    minLength: helpers.withMessage(t('validation.password.EightCharacters'), minLength(8)),
    $autoDirty: true,
  }
}

export function loginPasswordRule() {
  const { t } = i18n.global
  return {
    required: helpers.withMessage(t('validation.password.passwordRequired'), required),
    $autoDirty: false,
  }
}

export function emailRule() {
  const { t } = i18n.global
  return {
    required: helpers.withMessage(t('validation.email.emailIsRequired'), required),
    isEmail: helpers.withMessage(t('validation.email.validEmailRequired'), isEmail),
    $autoDirty: false,
  }
}

export function firstNameRule() {
  const { t } = i18n.global
  return {
    required: helpers.withMessage(t('validation.firstName.nameRequired'), required),
    alpha: helpers.withMessage(t('validation.firstName.validNameRequired'), alpha),
    $autoDirty: false,
  }
}

export function lastNameRule() {
  const { t } = i18n.global
  return {
    required: helpers.withMessage(t('validation.lastName.nameRequired'), required),
    alpha: helpers.withMessage(t('validation.lastName.validNameRequired'), alpha),
    $autoDirty: false,
  }
}

export function cityRule() {
  const { t } = i18n.global
  return {
    required: helpers.withMessage(t('validation.city.cityRequired'), required),
    $autoDirty: false,
  }
}

export function zipCodeRule() {
  const { t } = i18n.global
  return {
    required: helpers.withMessage(t('validation.zipCode.zipCodeRequired'), required),
    $autoDirty: false,
  }
}

export function countryRule() {
  const { t } = i18n.global
  return {
    required: helpers.withMessage(t('validation.country.countryRequired'), required),
    $autoDirty: false,
  }
}

export function streetRule() {
  const { t } = i18n.global
  return {
    required: helpers.withMessage(t('validation.street.streetRequired'), required),
    $autoDirty: false,
  }
}

export function phoneRule() {
  const { t } = i18n.global
  return {
    required: helpers.withMessage(t('validation.phone.phoneRequired'), required),
    $autoDirty: false,
  }
}
