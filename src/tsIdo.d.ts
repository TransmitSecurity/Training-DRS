interface IdoServiceResponse {
  type: IdoServiceResponseType
  rejectionReason?: string
  data?: any
  journeyStepId?: string
  clientResponseOptions?: Map<string, ClientResponseOption>
}

interface ClientResponseOption {
  type: ClientResponseOptionType
  id: string
  label: string
}

interface StartJourneyOptions {
  additionalParams?: object
  flowId?: string
}

/**
 * @enum
 * @description The enum for the log levels.
 */
enum LogLevel {
  Debug,
  Info,
  Warning,
  Error,
}

/**
 * @enum
 * @description The enum for the sdk error codes.
 */
enum ErrorCode {
  /**
   * @description The init options object is invalid.
   */
  InvalidInitOptions = 'invalid_initialization_options',
  /**
   * @description The sdk is not initialized.
   */
  NotInitialized = 'not_initialized',
  /**
   * @description There is no active Journey.
   */
  NoActiveJourney = 'no_active_journey',
  /**
   * @description Unable to receive response from the server.
   */
  NetworkError = 'network_error',
  /**
   * @description The client response to the Journey is not valid.
   */
  ClientResponseNotValid = 'client_response_not_valid',
  /**
   * @description The server returned an unexpected error.
   */
  ServerError = 'server_error',
  /**
   * @description The provided state is not valid for SDK state recovery.
   */
  InvalidState = 'invalid_state',
}

/**
 * @enum
 * @description The enum for the client response option types.
 */
enum ClientResponseOptionType {
  /**
   * @description Client response option type for client input.
   */
  ClientInput = 'client_input',
  /**
   * @description Client response option type for cancelation branch in the Journey, used for canceling the current step.
   */
  Cancel = 'cancel',
  /**
   * @description Client response option type for custom branch in the Journey, used for custom branching.
   */
  Custom = 'custom',
}

/**
 * @enum
 * @description The enum for the Journey step types.
 */
enum IdoServiceResponseType {
  /**
   * @description The Journey ended successfully.
   */
  JourneySuccess = 'journey_success',
  /**
   * @description The Journey reached a step that requires client input.
   */
  ClientInputRequired = 'client_input_required',
  /**
   * @description The current Journey step updated the client data or provided an error message.
   */
  ClientInputUpdateRequired = 'client_input_update_required',
  /**
   * @description The Journey ended with explicit rejection.
   */
  JourneyRejection = 'journey_rejection',
}

/**
 * @enum
 * @description The enum for the Journey step ID, when the journey step is a known action and not a custom form.
 */
enum IdoJourneyActionType {
  /**
   * @description `journeyStepId` for a Rejection action.
   */
  Rejection = 'action:rejection',
  /**
   * @description `journeyStepId` for an Information action.
   */
  Information = 'action:information',
  /**
   * @description `journeyStepId` for a server side debugger breakpoint.
   */
  DebugBreak = 'action:debug_break',
  /**
   * @description `journeyStepId` for a wait for Cross Session Message.
   */
  WaitForAnotherDevice = 'action:wait_for_another_device',
  /**
   * @description `journeyStepId` for device crypto binding action.
   * This action is presented to the client side when the journey has a form with the ID `"action:crypto_binding_registration"`.
   * On submission of `clientResponse` - the SDK will generate a key and respond in the following format:
   * ```json
   * {
   *   "ts:idosdk:device": {
   *     "platform_device_key": "base64 encoded public key",
   *     "platform_device_id": "an opaque key ID",
   *  }
   * ```
   * The server should store the key and the ID for future device identity validation.
   */
  CryptoBindingRegistration = 'action:crypto_binding_registration',
  /**
   * @description `journeyStepId` for device crypto binding validation action.
   * This action is presented to the client side when the journey has a form with the ID `"action:crypto_binding_validation"`.
   */
  CryptoBindingValidation = 'action:crypto_binding_validation',
}
