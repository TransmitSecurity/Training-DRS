// https://developer.transmitsecurity.com/guides/risk/recommendations/#action-types
export enum Action {
  LOGIN = 'login',
  REGISTER = 'register',
  TRANSACTION = 'transaction',
  PASSWORD_RESET = 'password_reset',
  LOGOUT = 'logout',
  CHECKOUT = 'checkout',
  ACCOUNT_DETAILS_CHANGE = 'account_details_change',
  ACCOUNT_AUTH_CHANGE = 'account_auth_change',
  CREDITS_CHANGE = 'credits_change',
}

// WEBINAR ACTION - Add a helper to report actions
// https://developer.transmitsecurity.com/guides/risk/quick_start_web/#step-4-report-actions
export async function reportAction(actionType: Action) {
  try {
    const result = await window.tsPlatform.drs.triggerActionEvent(actionType)
    return result.actionToken
  } catch (error) {
    return ''
  }
}

// WEBINAR ACTION - Add a helper to set the user ID
// https://developer.transmitsecurity.com/guides/risk/quick_start_web/#step-3-set-user
export async function setUserId(userId: string) {
  return await window.tsPlatform.drs.setAuthenticatedUser(userId)
}

// WEBINAR ACTION - ADD a helper to clear the user ID
// https://developer.transmitsecurity.com/guides/risk/quick_start_web/#step-6-clear-user
export async function clearUser() {
  return await window.tsPlatform.drs.clearUser()
}
