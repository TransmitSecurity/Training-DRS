export default [
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/AccountView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/account/profile',
    name: 'accountProfile',
    component: () => import('@/views/AccountView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/account/settings',
    name: 'accountSettings',
    component: () => import('@/views/AccountView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/account/security',
    name: 'accountSecurity',
    component: () => import('@/views/AccountView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/account/cards',
    name: 'accountCards',
    component: () => import('@/views/AccountView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/account/transfers',
    name: 'accountTransfers',
    component: () => import('@/views/AccountView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/account/notifications',
    name: 'accountNotifications',
    component: () => import('@/views/AccountView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/webauthn/register',
    name: 'registerWebauthn',
    component: () => import('@/views/webauthn/WebauthnRegistration.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/webauthn/register/success',
    name: 'webauthnRegistrationSuccess',
    component: () => import('@/views/webauthn/WebauthnRegistrationSuccess.vue'),
    meta: {
      requiresAuth: true,
    },
  },
]
