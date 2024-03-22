export default [
  {
    path: '/category/:category',
    name: 'category',
    component: () => import('@/views/shop/CategoryView.vue'),
    props: true,
  },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('@/views/shop/ProductView.vue'),
    props: true,
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/shop/checkout/CheckoutView.vue'),
    props: true,
  },
  {
    path: '/checkout/delivery',
    name: 'checkoutDelivery',
    component: () => import('@/views/shop/checkout/CheckoutDeliveryView.vue'),
    props: true,
  },
  {
    path: '/checkout/login',
    name: 'checkoutLogin',
    component: () => import('@/views/shop/checkout/CheckoutLoginView.vue'),
    props: true,
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: '/checkout/signup',
    name: 'checkoutSignup',
    component: () => import('@/views/shop/checkout/CheckoutSignupView.vue'),
    props: true,
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: '/checkout/confirmation',
    name: 'checkoutConfirmation',
    component: () => import('@/views/shop/checkout/CheckoutConfirmationView.vue'),
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/shop/OrdersView.vue'),
    props: true,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: '/orders/:id',
    name: 'order',
    component: () => import('@/views/shop/OrderView.vue'),
    props: true,
    meta: {
      requiresAuth: false,
    },
  },
]
