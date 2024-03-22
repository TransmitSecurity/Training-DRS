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

export async function reportAction(actionType: Action) {
  try {
    const result = await window.tsPlatform.drs.triggerActionEvent(actionType)
    return result.actionToken
  } catch (error) {
    return ''
  }
}

export async function setUserId(userId: string) {
  return await window.tsPlatform.drs.setAuthenticatedUser(userId)
}

export async function clearUser() {
  return await window.tsPlatform.drs.clearUser()
}
