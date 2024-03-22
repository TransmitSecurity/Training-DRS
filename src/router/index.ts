import { createRouter, createWebHistory } from 'vue-router'
import home from './home'
import account from './account'
import authentication from './authentication'
import { loadSession } from '@/helpers/session'
import { userSessionStore } from '@/store/userSession'
import NotFoundView from '@/views/NotFoundView.vue'
import shop from './shop'
import bank from './bank'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...home,
    ...account,
    ...authentication,
    ...shop,
    ...bank,
    { path: '/:pathMatch(.*)*', name: 'notFound', component: NotFoundView },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
})

router.beforeEach(async (to, from, next) => {
  const sessionStore = userSessionStore()
  console.log('path', to.path)
  // If the session is not loaded, and the page requires a session load
  if (
    !sessionStore.sessionLoaded &&
    sessionStore.tsPlatformLoaded &&
    !to.matched.some(record => record.meta.noLoad)
  ) {
    const result = await loadSession()
    sessionStore.setSessionLoaded(true)
    if (result) {
      console.log(result)
      sessionStore.setAuthenticated(true)
      // Prevent logged in user to go to login pages
      if (to.matched.some(record => record.meta.requiresNotAuth)) next('/')
      else next()
    } else {
      // No session loaded
      sessionStore.setAuthenticated(false)
      if (to.matched.some(record => record.meta.requiresAuth)) next('/login')
      else next()
    }
  } else if (
    sessionStore.isAuthenticated &&
    to.matched.some(record => record.meta.requiresNotAuth)
  ) {
    // If the user is authenticated but the page requires the user to be logged out
    next('/')
  } else if (!sessionStore.isAuthenticated) {
    // Prevent logged out user to go to pages requiring a session
    if (to.matched.some(record => record.meta.requiresAuth)) next('/login')
    else next()
  } else {
    next()
  }
})

export default router
