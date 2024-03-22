export abstract class BaseSdkError extends Error implements SdkError {
  errorCode = ErrorCode.NotInitialized

  data?: any

  constructor(message?: string, additionalData?: any) {
    super(message)
    this.data = additionalData
  }
}

export class NotInitializedError extends BaseSdkError {
  errorCode = ErrorCode.NotInitialized

  constructor(message?: string, additionalData?: any) {
    super(message ?? 'WebAuthnSdk is not initialized', additionalData)
  }
}

export class AuthenticationFailedError extends BaseSdkError {
  errorCode = ErrorCode.AuthenticationFailed

  constructor(message?: string, additionalData?: any) {
    super(message ?? 'Authentication failed with an error', additionalData)
  }
}

export class AuthenticationCanceledError extends BaseSdkError {
  errorCode = ErrorCode.AuthenticationCanceled

  constructor(message?: string, additionalData?: any) {
    super(message ?? 'Authentication was canceled by the user or got timeout', additionalData)
  }
}

export class RegistrationFailedError extends BaseSdkError {
  errorCode = ErrorCode.RegistrationFailed

  constructor(message?: string, additionalData?: any) {
    super(message ?? 'Registration failed with an error', additionalData)
  }
}

export class RegistrationCanceledError extends BaseSdkError {
  errorCode = ErrorCode.RegistrationCanceled

  constructor(message?: string, additionalData?: any) {
    super(message ?? 'Registration was canceled by the user or got timeout', additionalData)
  }
}

export class AutofillAuthenticationAbortedError extends BaseSdkError {
  errorCode = ErrorCode.AutofillAuthenticationAborted

  constructor(message?: string) {
    super(message ?? 'Autofill flow was aborted')
  }
}

export class AuthenticationProcessAlreadyActiveError extends BaseSdkError {
  errorCode = ErrorCode.AuthenticationProcessAlreadyActive

  constructor(message?: string, additionalData?: any) {
    super(message ?? 'Authentication process is already active', additionalData)
  }
}

export class InvalidApprovalDataError extends BaseSdkError {
  errorCode = ErrorCode.InvalidApprovalData

  constructor(message?: string, additionalData?: any) {
    super(message ?? 'Invalid approval data', additionalData)
  }
}

export class FailedToInitCrossDeviceAuthenticationError extends BaseSdkError {
  errorCode = ErrorCode.FailedToInitCrossDeviceSession

  constructor(message?: string, additionalData?: any) {
    super(message ?? 'Failed to init cross device authentication', additionalData)
  }
}

export class FailedToGetCrossDeviceStatusError extends BaseSdkError {
  errorCode = ErrorCode.FailedToGetCrossDeviceStatus

  constructor(message?: string, additionalData?: any) {
    super(message ?? 'Failed to get cross device status', additionalData)
  }
}

export function isBaseSdkError(error: any): error is BaseSdkError {
  return error.errorCode && Object.values(ErrorCode).includes(error.errorCode)
}
