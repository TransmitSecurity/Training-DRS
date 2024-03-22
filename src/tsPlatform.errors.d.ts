/**
 * Common interface for `Promise` rejections.
 * Developers should handle according to the `errorCode`
 */
interface SdkError {
  /**
   * Error code from {@link ErrorCode}
   */
  readonly errorCode: ErrorCode
  /**
   * Error message
   */
  readonly message: string
  /**
   * Additional data
   */
  readonly data?: any
}

/**
 * @enum
 */
enum ErrorCode {
  /**
   * Either the SDK init call failed or another function was called before initializing the SDK
   */
  NotInitialized = 'not_initialized',
  /**
   * When the call to {@link WebauthnApis.startAuthentication} failed
   */
  AuthenticationFailed = 'authentication_failed',
  /**
   * When {@link  WebauthnAuthenticationFlows.modal authenticate.modal} or {@link  AutofillHandlers.activate authenticate.autofill.activate} is called and the modal is closed by the user
   */
  AuthenticationCanceled = 'webauthn_authentication_canceled',
  /**
   * When the call to {@link WebauthnApis.startRegistration} failed
   */
  RegistrationFailed = 'registration_failed',
  /**
   * When {@link register} is called and the modal is closed by the user
   */
  RegistrationCanceled = 'webauthn_registration_canceled',
  /**
   * Passkey autofill authentication was aborted by {@link AutofillHandlers.abort}
   */
  AutofillAuthenticationAborted = 'autofill_authentication_aborted',
  /**
   * Passkey authentication is already active. To start a new authentication, abort the current one first by calling {@link AutofillHandlers.abort}
   */
  AuthenticationProcessAlreadyActive = 'authentication_process_already_active',
  /**
   * The {@link ApprovalData} parameter was sent in the wrong format
   * @ignore
   */
  InvalidApprovalData = 'invalid_approval_data',
  /**
   * When the call to {@link WebauthnApis.initCrossDeviceAuthentication}  failed   */
  FailedToInitCrossDeviceSession = 'cross_device_init_failed',
  /**
   * When the call to {@link WebauthnApis.getCrossDeviceTicketStatus}  failed   */
  FailedToGetCrossDeviceStatus = 'cross_device_status_failed',
  /**
   * When the SDK operation fails on an unhandled error
   */
  Unknown = 'unknown',
}
