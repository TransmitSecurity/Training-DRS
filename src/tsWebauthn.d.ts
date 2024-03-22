/**
 * WebAuthn registration response interfaces
 */
interface ApiStartRegistrationResponse {
  webauthn_session_id: string
  credential_creation_options: any
}

/**
 * WebAuthn authentication response interfaces
 */
interface ApiStartAuthenticationResponse {
  webauthn_session_id: string
  credential_request_options: any
}

enum AuthenticationMediationType {
  InputAutofill = 'input-autofill',
  Modal = 'modal',
}
/**
 * WebAuthn cross device interfaces
 */
enum WebauthnCrossDeviceStatus {
  Pending = 'pending',
  Scanned = 'scanned',
  Success = 'success',
  Error = 'error',
  Timeout = 'timeout',
  Aborted = 'aborted',
}

interface CrossDeviceController {
  /**
   * Ticket ID for this cross-device flow.
   */
  crossDeviceTicketId: string
  /**
   * Stops listening for events from devices in cross-device flows
   */
  stop: () => void
}

/**
 * WebAuthn cross device init response interfaces
 */
interface ApiCrossDeviceInitResponse {
  cross_device_ticket_id: string
}

/**
 * WebAuthn cross device status response interfaces
 */
interface ApiCrossDeviceStatusResponse {
  /**
   * cross device status
   */
  status: WebauthnCrossDeviceStatus

  /**
   * authentication session id
   */
  session_id?: string
}

interface AutofillHandlers {
  /**
   * @throws {@link ErrorCode.NotInitialized}
   * @throws {@link ErrorCode.AuthenticationFailed}
   * @throws {@link ErrorCode.AuthenticationCanceled}
   * @throws {@link ErrorCode.AutofillAuthenticationAborted}
   * @param handlers Handlers that will be invoked once the authentication is completed (success or failure)
   * @param username Name of user account, as used in the WebAuthn registration. If not provided, the authentication will start without the context of a user and it will be inferred by the chosen passkey
   */
  activate(handlers: AuthenticationAutofillActivateHandlers, username?: string): void

  /**
   * Aborts a WebAuthn authentication. This method should be called after the passkey autofill is dismissed in order to be able to query existing passkeys once again. This will end the browser's  `navigator.credentials.get()` operation.
   */
  abort(): void
}
/**
 * Alternate paths used by the SDK to route API calls to your proxy server.
 */
interface WebauthnApis {
  /**
   * @defaultValue `/v1/auth/webauthn/authenticate/start`
   */
  startAuthentication: string

  /**
   * @defaultValue `/v1/auth/webauthn/register/start`
   */
  startRegistration: string

  /**
   * @defaultValue `/v1/auth/webauthn/cross-device/register/start`
   */
  startCrossDeviceRegistration: string

  /**
   * @defaultValue `/v1/auth/webauthn/cross-device/authenticate/init`
   */
  initCrossDeviceAuthentication: string

  /**
   * @defaultValue `/v1/auth/webauthn/cross-device/authenticate/start`
   */
  startCrossDeviceAuthentication: string

  /**
   * @defaultValue `/v1/auth/webauthn/cross-device/status`
   */
  getCrossDeviceTicketStatus: string

  /**
   * @defaultValue `/v1/auth/webauthn/cross-device/attach-device`
   */
  attachDeviceToCrossDeviceSession: string
}

/**
 * @private
 */
interface WebAuthnInitOptions {
  /**
   * Base path for sending API requests. This would be either a Transmit Security API deployment URL
   * such as documented for sandbox, or if you are proxying API requests from your backend - then the base path to your proxy.
   */
  serverPath: string

  /**
   * Override endpoints when using a proxy server in case the proxy server implements its own paths.
   */
  webauthnApiPaths?: WebauthnApis
}

/**
 * @private
 */
interface PublicKeyCredentialRegistrationData {
  id: string
  rawId: string
  response: {
    attestationObject: string
    clientDataJSON: string
  }
  authenticatorAttachment: string | null
  type: string
}

/**
 * @private
 */
interface PublicKeyCredentialAuthenticationData {
  id: string
  rawId: string
  response: {
    authenticatorData: string
    clientDataJSON: string
    signature: string
    userHandle: string
  }
  authenticatorAttachment?: string | null
  type: string
}

/**
 * @private
 */
interface CredentialResult {
  /**
   * The session ID of the operation
   */
  webauthnSessionId: string
  /**
   * The encoded result of webauthn operation
   */
  publicKeyCredential: PublicKeyCredentialRegistrationData | PublicKeyCredentialAuthenticationData
  /**
   * The user agent of the browser
   */
  userAgent: string
}

interface AuthenticationAutofillActivateHandlers {
  /**
   * A Callback function that will be triggered once biometrics signing is completed successfully.
   * @param webauthn_encoded_result
   */
  onSuccess: (webauthn_encoded_result: string) => Promise<void>
  /**
   * A Callback function that will be triggered if authentication fails with an SdkError.
   * @param err
   */
  onError?: (err: SdkError) => Promise<void>
}

interface BaseCrossDeviceHandlers {
  /**
   * Called when the user has successfully attached a device to the cross-device flow using the {@link WebauthnCrossDeviceFlows.attachDevice} method.
   */
  onDeviceAttach: () => Promise<void>
  /**
   * Called when there was an error in the cross-device flow with status response {@link ApiCrossDeviceStatusResponse}.
   */
  onFailure: (error: ApiCrossDeviceStatusResponse) => Promise<void>
}

interface CrossDeviceAuthenticationHandlers extends BaseCrossDeviceHandlers {
  /**
   * Called upon successful webauthn authentication.
   * @param sessionId Session ID that will be exchanged for the user's access and ID tokens using the /v1/auth/session/authenticate API
   */
  onCredentialAuthenticate: (sessionId: string) => Promise<void>
}

interface CrossDeviceRegistrationHandlers extends BaseCrossDeviceHandlers {
  /**
   * Called upon successful webauthn registration.
   */
  onCredentialRegister: () => Promise<void>
}

interface WebauthnAuthenticationFlows {
  /**
       * Invokes a WebAuthn authentication, including prompting the user to select from a list of registered credentials, and then prompting the user for biometrics. The credentials list is displayed using the native browser modal.<br/>
       * If username isn't provided, it will promote a modal with a list of all discoverable credentials on the device. If username is provided, this call must be invoked for a registered username. If the target username is not registered or in case of any other failure, an SdkError will be thrown.<br/>
       * If authentication is completed successfully, this call will return a promise that resolves to the credential result, which is an object encoded as a base64 string. This encoded result should then be passed to the [backend authentication endpoint](/openapi/user/backend-webauthn/#operation/authenticateWebauthnCredential) to retrieve user tokens.<br/>
  
       * @param username Name of user account, as used in the WebAuthn registration. If not provided, the authentication will start without the context of a user and it will be inferred by the chosen passkey
       * @throws {@link ErrorCode.NotInitialized}
       * @throws {@link ErrorCode.AuthenticationFailed}
       * @throws {@link ErrorCode.AuthenticationCanceled}
       * @throws {@link ErrorCode.AuthenticationProcessAlreadyActive}
       * @returns Base64-encoded object, which contains the credential result. This encoded result will be used to fetch user tokens via the [backend authentication endpoint](/openapi/user/backend-webauthn/#operation/authenticateWebauthnCredential).
       */
  modal(username?: string): Promise<string>

  /**
   * Property used to implement credential selection via autofill UI.
   */
  autofill: AutofillHandlers
}

interface WebauthnCrossDeviceFlows {
  /**
   * Initializes a cross device flow, such as when users request to login to a desktop using their mobile device. Once invoked, the SDK will start listening for events occurring on the other device,
   * and calls your handlers when a state change is detected.
   * These methods return a promise that resolves to a {@link CrossDeviceController} object, which allows you to stop listening to events and includes the cross-device ticket ID which is used when attaching another device to the flow.
   */
  init: {
    /**
     * Start a cross device registration flow
     * This call receives a cross-device ticket ID, and a {@link CrossDeviceRegistrationHandlers} instance that contains your handlers for cross device events.
     * For example, these handlers may update the UI or any other relevant application state.
     * @throws {@link ErrorCode.NotInitialized}
     * @returns {@link CrossDeviceController} - Object that allows you to stop the event loop, and obtain the cross-device ticket ID.
     */
    registration: (params: {
      crossDeviceTicketId: string
      handlers: CrossDeviceRegistrationHandlers
    }) => Promise<CrossDeviceController>
    /**
     * Start a cross device authentication flow
     * This call receives an optional username (if already known), and a {@link CrossDeviceAuthenticationHandlers} instance that contains your handlers for cross device events.
     * For example, these handlers may update the UI or any other relevant application state.
     * If username isn't provided, it will promote a modal with a list of all discoverable credentials on the attached device. If username is provided, this call must be invoked for a registered username.
     * If the target username is not registered, an SdkError will be thrown when trying to authenticate in the attached device.<br/>
     * @throws {@link ErrorCode.NotInitialized}
     * @throws {@link ErrorCode.FailedToInitCrossDeviceSession}
     * @returns {@link CrossDeviceController} - Object that allows you to stop the event loop, and obtain the cross-device ticket ID.
     */
    authentication: (params: {
      username?: string
      handlers: CrossDeviceAuthenticationHandlers
    }) => Promise<CrossDeviceController>
  }

  authenticate: {
    /**
     * Invokes a WebAuthn authentication for the user used in the cross device session init, including prompting the user to select from a list of registered credentials, and then prompting the user for biometrics. The credentials list is displayed using the native browser modal.<br/>
     * If authentication is completed successfully, this call will return a promise that resolves to the credential result, which is an object encoded as a base64 string. This encoded result should then be passed to the [backend authentication endpoint](/openapi/user/backend-webauthn/#operation/authenticateWebauthnCredential) to retrieve user tokens.<br/>
     * Once tokens are retrieved, {@link CrossDeviceAuthenticationHandlers.onCredentialAuthenticate} will be called with a session ID that can also be used to retrieve tokens.
     * @param crossDeviceTicketId Ticket ID of the cross-device flow. retrieved from the {@link CrossDeviceController} object.
     * @throws {@link ErrorCode.NotInitialized}
     * @throws {@link ErrorCode.AuthenticationFailed}
     * @throws {@link ErrorCode.AuthenticationCanceled}
     * @returns Base64-encoded object, which contains the credential result. This encoded result will be used to fetch user tokens via the [backend authentication endpoint](/openapi/user/backend-webauthn/#operation/authenticateWebauthnCredential).
     */
    modal: (crossDeviceTicketId: string) => Promise<string>
  }
  /**
   * Invokes a WebAuthn credential registration for the user used in the cross device session init, including prompting the user for biometrics.
   * If registration is completed successfully, this call will return a promise that resolves to the credential result, which is an object encoded as a base64 string. This encoded result should then be passed to the relevant backend registration endpoint to complete the registration for either a [logged-in user](/openapi/user/backend-webauthn/#operation/webauthn-registration) or [logged-out user](/openapi/user/backend-webauthn/#operation/webauthn-registration-external).
   * If registration fails, an SdkError will be thrown.
   * If the backend registration call was successful, {@link CrossDeviceRegistrationHandlers.onCredentialRegister} will be called.
   * @param crossDeviceTicketId Ticket ID of the cross-device flow. retrieved from the {@link CrossDeviceController} object.
   * @param options Additional configuration for registration flow
   * @throws {@link ErrorCode.NotInitialized}
   * @throws {@link ErrorCode.RegistrationFailed}
   * @throws {@link ErrorCode.RegistrationCanceled}
   */
  register: (
    crossDeviceTicketId: string,
    options?: WebauthnCrossDeviceRegistrationOptions,
  ) => Promise<string>

  /**
   * Indicates when a session is accepted on another device in cross-device flows.
   *
   * If successful,{@link CrossDeviceRegistrationHandlers.onDeviceAttach} will be called in registration flow and {@link CrossDeviceAuthenticationHandlers.onDeviceAttach} for authentication.
   * @param crossDeviceTicketId Ticket ID of the cross-device flow. retrieved from the {@link CrossDeviceController} object.
   */
  attachDevice: (crossDeviceTicketId: string) => Promise<void>
}

interface WebauthnCrossDeviceRegistrationOptions {
  /**
   * Allow registration using cross-platform authenticators, such as a USB security key or a different device. If enabled, cross-device authentication flows can be performed using the native browser experience (via QR code). default: True
   */
  allowCrossPlatformAuthenticators?: boolean

  /**
   * Must be set to true to register credentials as passkeys when supported (except for Apple devices, which always register credentials as passkeys). default: True
   */
  registerAsDiscoverable?: boolean
}

interface WebauthnRegistrationOptions extends WebauthnCrossDeviceRegistrationOptions {
  /**
   * Human-palatable name for the user account, only for display (max 64 characters). If not set, the username parameter will also act as the display name
   */
  displayName?: string
}
