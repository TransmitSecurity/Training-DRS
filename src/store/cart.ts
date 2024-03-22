import { handleError } from '@/helpers/errors'
import {
  CartApi,
  type CartItemWithProductDto,
  type CartDto,
  ProductApi,
} from '@transmitsecurity-dev/ts-demo-client-lib'
import { defineStore } from 'pinia'
import { userSessionStore } from './userSession'
const cartApi = new CartApi(undefined, import.meta.env.VITE_BACKEND_URL)
const productApi = new ProductApi(undefined, import.meta.env.VITE_BACKEND_URL)

export const cartStore = defineStore('cart', {
  persist: true,
  state: () => ({
    cart: { quantity: 0, price: 0, items: Array<CartItemWithProductDto>() },
    showCart: false,
  }),
  getters: {
    getCart(state) {
      return state.cart
    },
  },
  actions: {
    toggleShowCart() {
      console.log('Update show cart')
      this.showCart = !this.showCart
    },
    async refreshCart(): Promise<CartDto | undefined> {
      try {
        const queryResult = await cartApi.getCart()
        console.log('Retrieved cart')
        console.log(queryResult.data)
        this.cart = queryResult.data
      } catch (error) {
        console.log('Error when retrieving cart')
        console.error(error)
      }
      return
    },
    async overrideCart() {
      const userSession = userSessionStore()
      if (userSession.isAuthenticated) {
        try {
          // Clear the existing cart
          await cartApi.clearCart({})

          // Save the new cart
          for (const item of this.cart.items) {
            await cartApi.addToCart({ productId: item.productId, quantity: item.quantity })
          }
          await this.refreshCart()
        } catch (error) {
          handleError(error)
        }
      }
    },
    async addToCart(productId: string, quantity = 1) {
      const userSession = userSessionStore()
      if (userSession.isAuthenticated) {
        console.log('User authenticated')
        try {
          await cartApi.addToCart({ productId, quantity })
          await this.refreshCart()
        } catch (error) {
          handleError(error)
        }
      } else {
        const index = this.cart.items.findIndex(item => item.productId === productId)
        console.log(`Index is ${index}`)
        if (index >= 0) {
          this.cart.items[index].quantity++
          this.cart.quantity++
          this.cart.price += this.cart.items[index].product.price
        } else {
          console.log('Fetching product')
          const productInfo = await productApi.getProductById(productId)
          this.cart.quantity++
          this.cart.price += productInfo.data.price
          this.cart.items.push({
            userId: '',
            createdAt: new Date().toString(),
            productId,
            quantity: 1,
            product: productInfo.data,
          })
        }
      }
    },
    async removeFromCart(productId: string) {
      const userSession = userSessionStore()
      if (userSession.isAuthenticated) {
        try {
          await cartApi.removeFromCart({ productId })
          await this.refreshCart()
        } catch (error) {
          handleError(error)
        }
      } else {
        const index = this.cart.items.findIndex(item => item.productId === productId)
        if (index >= 0) {
          const item = this.cart.items[index]
          if (item.quantity === 1) {
            this.deleteFromCart(productId)
          } else {
            this.cart.items[index].quantity--
            this.cart.quantity--
            this.cart.price -= this.cart.items[index].product.price
          }
        } else {
          const productInfo = await productApi.getProductById(productId)
          this.cart.quantity++
          this.cart.price += productInfo.data.price
          this.cart.items.push({
            userId: '',
            createdAt: new Date().toString(),
            productId,
            quantity: 1,
            product: productInfo.data,
          })
        }
      }
    },
    async deleteFromCart(productId: string) {
      const userSession = userSessionStore()
      if (userSession.isAuthenticated) {
        try {
          await cartApi.deleteFromCart({ productId })
          await this.refreshCart()
        } catch (error) {
          handleError(error)
        }
      } else {
        const index = this.cart.items.findIndex(item => item.productId === productId)
        if (index >= 0) {
          this.cart.items.splice(index, 1)
        }
      }
    },
    clearCart() {
      this.cart.items = []
      this.cart.price = 0
      this.cart.quantity = 0
    },
    async createOrder(actionToken?: string) {
      const userSession = userSessionStore()
      if (userSession.isAuthenticated) {
        const order = await cartApi.createOrderFromCart()
        this.clearCart()
        return order.data
      } else {
        return null
      }
    },
  },
})
