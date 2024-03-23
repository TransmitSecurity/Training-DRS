# Adding detection and response

## Step 1 - Initialize the Transmit Security SDK

### About loading 
This application already contains code to download the SDK.
You will find it in `App.vue`: a script tag is dynamically added.
Then the function `initWhenLoaded` from the `tsSDK` helper is called.
This function will [wait for the page to load](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event) to initialize the Transmit Security SDK.

Here is an excerpt of the code you can already find in `src/helpers/tsSDK.ts`:

```js
export function initWhenLoaded() {
  console.log('Transmit Security platform SDK - adding initialization listener')
  const platformScript = document.getElementById('ts-platform-script')
  if (platformScript) {
    platformScript.addEventListener('load', async function () {
      try {
        // We need the client ID to initialize the SDK
        // in this case our backend is providing it to us
        const response = await configApi.getClientId()
```

### Initializing the SDK

To initialize the SDK, you need to call `await window.tsPlatform.initialize()` and pass the client ID and the server path.
In this case, the server path will just be "https://api.transmitsecurity.io", this has already been configured in the `.env` file in this project, and this value can be retrieved with `import.meta.env.VITE_TS_SERVER_PATH`.

Here is the code to add to initialize the SDK:

```js
await window.tsPlatform.initialize({
    clientId: response.data.clientId,
    webauthn: { serverPath: import.meta.env.VITE_TS_SERVER_PATH },
})
```

To learn more about how to initialize the SDK, feel free to read the [full guide](https://developer.transmitsecurity.com/guides/webauthn/quick_start_sdk/#step-3-initialize-the-sdk) on Transmit Security's website.


### Waiting for the library to load

The `App.vue` file is already configured to wait for the library to load before displaying the application.
This can be necessary to use webauthn on a login page for example. In our case, we need the library to be loaded to evaluate the risk context before allowing the user to use their session.

In the pattern used in this code example, whenever the library is successfully loaded, we dispatch an event called `tsPlatformLoaded`. When the `App.vue` file detects this event, the page is switched from the waiting spinner to the actual application.


```js
onBeforeMount(() => {
  // Add a script tag to the page to download the ts-platform sdk
  // https://developer.transmitsecurity.com/guides/risk/quick_start_web/#step-2-load-sdk
  const platformScript = document.createElement('script')
  platformScript.src = import.meta.env.VITE_PLATFORM_SDK_URL
  platformScript.defer = true
  platformScript.id = 'ts-platform-script'
  document.head.appendChild(platformScript)

  // Then, initialize the ts-platform sdk
  tsSdk.initWhenLoaded()

  // The ts platform SDK is not loaded yet, we need to wait
  // for it to be loaded and then initialize the app
  // this is necessary to perform a silent risk based user authentication
  document.addEventListener('tsPlatformLoaded', async function (e) {
    platformLoading.value = false
    await loadSession()

    // Dispatch an event indicating that the session was loaded
    // when the session is loaded the app is displayed
    const event = new CustomEvent('sessionLoaded')
    document.dispatchEvent(event)
    console.log('Session loading attempt done')
  })

  // The session is not loaded yet, we need to wait
  // this is necessary to perform a silent risk based user authentication
  document.addEventListener('sessionLoaded', function (e) {
    sessionLoading.value = false
  })
})
```

## Step 2 -  Set up your helpers

In `src/helpers/risk.ts` add the code to report actions to the Detection and Response Service, set the user ID, and clear the user ID. You will use these functions in the next step.

```js
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

// https://developer.transmitsecurity.com/guides/risk/quick_start_web/#step-4-report-actions
export async function reportAction(actionType: Action) {
  try {
    const result = await window.tsPlatform.drs.triggerActionEvent(actionType)
    return result.actionToken
  } catch (error) {
    return ''
  }
}

// https://developer.transmitsecurity.com/guides/risk/quick_start_web/#step-3-set-user
export async function setUserId(userId: string) {
  return await window.tsPlatform.drs.setAuthenticatedUser(userId)
}

// https://developer.transmitsecurity.com/guides/risk/quick_start_web/#step-6-clear-user
export async function clearUser() {
  return await window.tsPlatform.drs.clearUser()
}
```

## Step 3 -  Start reporting actions

Whenever the user is performing a sensitive action such as creating an account, logging in, sending money or updating their credentials, the context should be sent to the Detection and Response service. There is a list of pre-defined actions on [our website](https://developer.transmitsecurity.com/guides/risk/recommendations/#action-types).

### Report authentications

Whenever an authentication is happening, with passkeys or with a password, report the "login" action.

In `src/views/LoginView.vue`, report the login action in the `loginPassword()` method:

```js
async function loginPassword() {
  const isFormCorrect = (await v$.value.email.$validate()) && (await v$.value.password.$validate())
  console.log(`formCorrect ${isFormCorrect}`)
  if (isFormCorrect) {
    // Authenticate with a password
    loading.value = true
    try {
      // WEBINAR ACTION - Report the login action
      reportAction(Action.LOGIN)
```

In the `loginWebauthn()` method:

```js
async function loginWebauthn() {
  try {
    // Abort autofill login
    await window.tsPlatform.webauthn.authenticate.autofill.abort()
    // Proceed to traditional login
    // WEBINAR ACTION - Report the login action
    reportAction(Action.LOGIN)
```

And in the `loginWebauthnAutofill()` method:

```js
async function loginWebauthnAutofill(webauthnEncodedResult: string) {
  try {
    // WEBINAR ACTION - Report the login action
    reportAction(Action.LOGIN)
    const response = await authApi.authenticateWebauthn({ webauthnEncodedResult })
```

### Report registrations

Whenever a user creates an account, you can report a "register" action.
Update `src/views/SignupView.vue` to include this reporting:

```js
async function signupPassword() {
  const isFormCorrect = await passwordValidation$.value.$validate()
  console.log(`formCorrect ${isFormCorrect}`)
  if (isFormCorrect) {
    // Register a new account with a password
    loading.value = true
    try {
      // WEBINAR ACTION - Report the registration action
      reportAction(Action.REGISTER)
```

### Report new authenticators

It can also be interesting to report any new authenticator registration, even if the user is already authenticated.
Update the `registerWebauthn()` method in `src/views/webauthn/WebauthnRegistration.vue`:

```js
async function registerWebauthn() {
  try {
    const webauthnEncodedResult = await window.tsPlatform.webauthn.register(userSession.email)
    // WEBINAR ACTION - Report the update action
    reportAction(Action.ACCOUNT_AUTH_CHANGE)
    const response = await registerApi.registerWebauthn({
      webauthnEncodedResult,
    })
```

### Report transactions


This code contains an example user experience of a bank transfer.
Whenever the transfer is validated, you should report the "transaction" action in `src/views/bank/BankTransferValidationView.vue`:

```js
function validateTransfer() {
  // WEBINAR ACTION - Report the transaction action
  reportAction(Action.TRANSACTION)
  router.push({ name: 'home' })
}
```

## Step 4 - Set the user ID

To build a user profile across multiple sessions, the Detection and Response Service needs to understand which user is interacting with the service. This is why we need to indicate which user successfully logged in with the `setUserId()` method ([learn more in our documentation](https://developer.transmitsecurity.com/guides/risk/quick_start_web/#step-3-set-user)).

This is usually done on the backend side, but for this webinar, we will do it on the front-end side.

In `src/helpers/session.ts`, update the code to set the authenticated user when the session was loaded successfully.

```js

export async function loadSession(): Promise<{ user: UserDto } | undefined> {
  // The session is stored in a cookie sent
  // automatically whenever a new request is made
  // To check if there is a valid session, we simply
  // try to get the user information
  const userApi = new UserApi(undefined, backendAPI)
  try {
    const sessionStore = userSessionStore()
    if (sessionStore.tsPlatformLoaded) {
      console.log('Looking for an existing user session')
      // Retrieve the current user (if there is one)
      const userResponse = await userApi.getCurrentUser()

      console.log(userResponse.data.userData)
      console.log('riskRecommendation', userResponse.data.riskRecommendation)
      if (userResponse.status !== 200) {
        console.log('Session expired')
        clearSession()
        return
      }

      // WEBINAR ACTION 2 - Set the user ID
      // The user is authenticated, set the user in the risk SDK
      setUserId(userResponse.data.userData.user_id)

      // Save the user information locally
      sessionStore.setUserData(userResponse.data.userData)
      sessionStore.setAuthenticated(true)
      // Dispatch an event indicating that the user logged in
      // this is helpful if other components need to populate
      // things at this stage (cart for example)
      const event = new CustomEvent('userLoggedIn')
      document.dispatchEvent(event)
      return { user: userResponse.data.userData }
    } else {
      console.log('Trying to load session while platform is not loaded - aborted')
      return
    }
  } catch (error) {
    console.log(error)
    return
  }
}
```


## Step 5 - Act on the recommendation

To act on recommendations, you should send the action token collected with the `reportAction()` method to the application backend.
The backend can then get the risk recommendation and require the user to be challenged, or terminate the session if necessary.

To make this example simple, we will get the risk context every time the session is loaded: a user could come back a day or two after logging in and still have a valid session. Then we will send the actionToken to the backend which will decide if the session is terminated or not.


```js
export async function loadSession(): Promise<{ user: UserDto } | undefined> {
  // The session is stored in a cookie sent
  // automatically whenever a new request is made
  // To check if there is a valid session, we simply
  // try to get the user information
  const userApi = new UserApi(undefined, backendAPI)
  try {
    const sessionStore = userSessionStore()
    if (sessionStore.tsPlatformLoaded) {
      console.log('Looking for an existing user session')
      // WEBINAR ACTION - Report a login action
      // Report a login action to the detection and response service
      const actionToken = await reportAction(Action.LOGIN)
      console.log('Action token', actionToken)

      // WEBINAR ACTION - Send the action token to the backend when getting the user data
      // Retrieve the current user (if there is one)
      const userResponse = await userApi.getCurrentUser(actionToken)

      console.log(userResponse.data.userData)
      console.log('riskRecommendation', userResponse.data.riskRecommendation)
      if (userResponse.status !== 200) {
        console.log('Session expired')
        clearSession()
        return
      }

      // WEBINAR ACTION 2 - Set the user ID
      // The user is authenticated, set the user in the risk SDK
      setUserId(userResponse.data.userData.user_id)

      // Save the user information locally
      sessionStore.setUserData(userResponse.data.userData)
      sessionStore.setAuthenticated(true)
      // Dispatch an event indicating that the user logged in
      // this is helpful if other components need to populate
      // things at this stage (cart for example)
      const event = new CustomEvent('userLoggedIn')
      document.dispatchEvent(event)
      return { user: userResponse.data.userData }
    } else {
      console.log('Trying to load session while platform is not loaded - aborted')
      return
    }
  } catch (error) {
    console.log(error)
    return
  }
}
```

Now, when the user comes back a day or two after logging in, even if they have a valid session, which hasn't expired yet, they might be logged out according to the risk context.

