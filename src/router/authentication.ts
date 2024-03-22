export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/SignupView.vue'),
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: '/login/ido/email/otp',
    name: 'loginEmailOtp',
    component: () => import('@/views/login/ido/LoginEmailView.vue'),
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: '/login/ido/sms/otp',
    name: 'loginSmsOtp',
    component: () => import('@/views/login/ido/LoginPhoneView.vue'),
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: '/signup/ido/country',
    name: 'signupCountry',
    component: () => import('@/views/signup/ido/SignupEmailCountryView.vue'),
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: '/signup/ido/password',
    name: 'signupPassword',
    component: () => import('@/views/signup/ido/SignupPasswordView.vue'),
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: '/signup/ido/name',
    name: 'signupName',
    component: () => import('@/views/signup/ido/SignupNameView.vue'),
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: '/signup/ido/address',
    name: 'signupAddress',
    component: () => import('@/views/signup/ido/SignupAddressView.vue'),
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: '/signup/ido/phone',
    name: 'signupPhone',
    component: () => import('@/views/signup/ido/SignupPhoneView.vue'),
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: '/signup/ido/email',
    name: 'signupEmail',
    component: () => import('@/views/signup/ido/SignupEmailView.vue'),
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: '/signup/ido/create',
    name: 'createUser',
    component: () => import('@/views/signup/ido/SignupCreateView.vue'),
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: '/oidc/verification',
    name: 'oidcVerification',
    component: () => import('@/views/OidcVerificationView.vue'),
  },
]
