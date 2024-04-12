# Adding passkeys

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

## Step 2 - Suggest webauthn registration (adaptive signup)

### About SignupView.vue

Whenever a user accesses the route `/signup` the file `src/views/SignupView.vue` is loaded.
This file is in charge of:
- displaying user forms
- controlling the logic of these forms

In this case, this file is already capable of displaying two forms to collect the user information and the user password.
Once this information is collected, the form will call the application backend to create the user and log them in.

Here is an excerpt of the code you can already find in `SignupView.vue`, in charge of creating the user:

```js
async function signupPassword() {
  const isFormCorrect = await passwordValidation$.value.$validate()
  console.log(`formCorrect ${isFormCorrect}`)
  if (isFormCorrect) {
    // Register a new account with a password
    loading.value = true
    try {
      reportAction(Action.LOGIN)
      const response = await registerApi.registerWithPassword({
        email: email.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value,
        phone: phone.value,
      })
```

### Checking if webauthn is supported

There is no point in suggesting webauthn registration if the user's device does not support it.
So the first step is to verify that it is supported.

We will do this when the page loads, thanks to the `onMounted()` feature of VueJS.
Uncomment the code in `onMounted()` to call the function `checkWebauthnSupport()`

```js

onMounted(() => {
  if (userSession.tsPlatformLoaded) {
    checkWebauthnSupport()
  } else {
    // The ts platform SDK is not loaded yet, we need to wait
    // for it to be loaded and then initialize webauthn
    document.addEventListener('tsPlatformLoaded', function (e) {
      checkWebauthnSupport()
    })
  }
})
```

The function `checkWebauthnSupport()` will rely on Transmit Security's SDK to verify is webauthn is available on the device. To do so, you should use `window.tsPlatform.webauthn.isPlatformAuthenticatorSupported()` as demonstrated below.
In this case, we save the result in the local user session to be able to check against it later on.

```js
async function checkWebauthnSupport() {
  console.log('Verifying if webauthn is supported')
  window.tsPlatform.webauthn.isPlatformAuthenticatorSupported().then((supported: boolean) => {
    userSession.setWebAuthnSupported(supported)
    console.log(`Webauthn is ${supported ? '' : 'not'} supported`)
  })
}
```

### Suggest a webauthn registration

Once the user is successfully created with a password, check if webauthn is supported.
If so, redirect the user to a page suggesting to register webauthn.
In `SignupView.vue`, in the function `signupPassword()`, uncomment the code redirecting the user to the page suggesting to register webauthn.

```js
await loadSession()
if (userSession.webauthnSupported) {
    router.push({ name: 'registerWebauthn' })
} else {
    router.push({ name: 'home' })
}
```

## Step 3 - Register webauthn

If webauthn is supported, the user is redirected to `webauthn/register` which loads the file `src/views/webauthn/WebauthnRegistration.vue`.

This file is in charge of showing a choice selection to the user, to allow them to register a passkey on their device if they want to.

### Check if webauthn is supported
As a good practice, and to make this page reusable, we check again if webauthn is supported on this page in `onBeforeMount()`. This code is already included.

### Create the credentials

The function `registerWebauthn()` is in charge of creating the credentials thanks to the Transmit Security SDK.
Once the credentials are created, they are sent to our application backend to finish the registration.

To create the credentials, you should use the method `register()`:

```js
const webauthnEncodedResult = await window.tsPlatform.webauthn.register(userSession.email)
```

The full code looks like this:

```js
async function registerWebauthn() {
  try {
    const webauthnEncodedResult = await window.tsPlatform.webauthn.register(userSession.email)
    reportAction(Action.REGISTER)
    const response = await registerApi.registerWebauthn({
      webauthnEncodedResult,
    })
    loading.value = false
    console.log(response)
    if (response.status == 200) {
      router.push({
        name: 'webauthnRegistrationSuccess',
        query: { redirect: redirectRoute.value },
      })
    } else {
      toast.error(response.statusText)
    }
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}
```

## Step 4 - Login

### About LoginView.vue
When the user accesses the login page at `/login`, the file `src/views/LoginView.vue` is loaded.
This file is in charge of displaying and controlling the login forms and will communicate with our application backend to forward the authentication credentials and receive the session cookies then load the user session from these cookies.

### Initializing webauthn

Before performing an authentication with webauthn, we need to check if the browser supports this technology, and initialize webauthn.
The same way we verified webauthn support during sign up, we use the `onMounted()` function of VueJS to trigger this verification on page load:

```js
onMounted(() => {
  if (userSession.tsPlatformLoaded) {
    initializeWebauthn()
  } else {
    // The ts platform SDK is not loaded yet, we need to wait
    // for it to be loaded and then initialize webauthn
    document.addEventListener('tsPlatformLoaded', function (e) {
      initializeWebauthn()
    })
  }
})
```

In the function `initializeWebauthn()` we rely on Transmit Security's SDK to verify is the device can use webauthn to authenticate the user:

```js
async function initializeWebauthn() {
  console.log('Verifying if webauthn is supported')
  window.tsPlatform.webauthn.isPlatformAuthenticatorSupported().then((supported: boolean) => {
    userSession.setWebAuthnSupported(supported)
    console.log(`Webauthn is ${supported ? '' : 'not'} supported`)
  })
}
```

### Login with Webauthn

When the user clicks on "Sign in with a Passkey", the method `loginWebauthn()` is called.
Update this method to use `authenticate.modal()` and authenticate the user with their passkey:

```js
const webauthnEncodedResult = await window.tsPlatform.webauthn.authenticate.modal(email.value)
```

The full code looks like this:

```js
async function loginWebauthn() {
  try {
    // Proceed to traditional login
    reportAction(Action.LOGIN)
    const webauthnEncodedResult = await window.tsPlatform.webauthn.authenticate.modal(email.value)
    const response = await authApi.authenticateWebauthn({ webauthnEncodedResult })
    console.log(response)
    console.log(response.data)
    await loadSession()
    router.push({ name: 'home' })
  } catch (error) {
    // handleError(error)
  } finally {
    loading.value = false
  }
}
```