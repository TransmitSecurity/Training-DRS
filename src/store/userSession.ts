import { defineStore } from 'pinia'
import {
  UserApi,
  type UserAddressDto,
  type UserDto,
} from '@transmitsecurity-dev/ts-demo-client-lib'
import type UserSignupDto from '@/store/dto/UserSignupDto'
import { deleteCookie } from '@/helpers/session'

const userApi = new UserApi(undefined, import.meta.env.VITE_BACKEND_URL)
const defaultSignupData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  secondaryEmails: [],
  secondaryPhones: [],
  street: '',
  city: '',
  postalCode: '',
  country: '',
  birthday: '',
  password: '',
  title: '',
  username: '',
} as UserSignupDto

export const userSessionStore = defineStore('main', {
  state: () => ({
    bankData: {
      transfer: {
        selectedAccount: {
          holder: '',
          name: '',
          balance: 0,
          number: '1',
        },
        beneficiaryAccount: '',
        amount: 0,
        date: new Date(),
      },
    },
    signupData: defaultSignupData,
    idoSerializedState: '',
    idoResponse: {} as any,
    userData: {} as UserDto,
    sessionLoaded: false,
    authenticated: false,
    tsPlatformLoaded: false,
    webauthn: {
      supported: false,
      sessionId: '',
      deviceBindingToken: '',
    },
  }),
  getters: {
    isAuthenticated: state => {
      return state.authenticated
    },
    webauthnSupported(state) {
      return state.webauthn.supported
    },
    creationDate(state) {
      return new Date(state.userData.created_at)
    },
    firstName(state) {
      let firstName = ''
      if (state.userData) {
        if (state.userData.name && state.userData.name.first_name) {
          firstName = state.userData.name.first_name
        }
      }
      return firstName
    },
    lastName(state) {
      let lastName = ''
      if (state.userData) {
        if (state.userData.name && state.userData.name.last_name) {
          lastName = state.userData.name.last_name
        }
      }
      return lastName
    },
    birthday(state) {
      let birthday
      if (state.userData) {
        if (state.userData && state.userData.birthday) {
          const storedBirthday = state.userData.birthday
          birthday = new Date(storedBirthday)
        }
      }
      return birthday
    },
    formattedBirthday(state) {
      let birthday = ''
      if (state.userData && state.userData.birthday) {
        const storedBirthday = state.userData.birthday
        birthday = new Date(storedBirthday).toLocaleDateString()
      }
      return birthday
    },
    fullName(state) {
      let fullName
      if (state.userData) {
        const emailAddress = state.userData.email?.value
        if (state.userData.name && (this.firstName != '' || this.lastName != '')) {
          const first = state.userData.name.first_name
          const last = state.userData.name.last_name
          if (this.firstName != '') {
            fullName = first + ' ' + last
          } else if (this.firstName == '' && this.lastName != '') {
            fullName = last
          } else {
            fullName = ''
          }
        } else if (state.userData.email) {
          fullName = emailAddress
        } else if (state.userData.phone_number) {
          fullName = state.userData.phone_number.value
        } else {
          fullName = ''
        }
      } else {
        fullName = ''
      }
      return fullName
    },
    phone(state) {
      const userData = state.userData
      return userData.phone_number?.value || ''
    },
    phoneVerified(state): boolean {
      const userData = state.userData
      return userData.phone_number?.phone_number_verified?.valueOf() || false
    },
    showPhoneNumberVerified(): boolean {
      return this.phone !== ''
    },
    email(state) {
      const userData = state.userData
      return userData.email?.value || ''
    },
    emailVerified(state): boolean {
      const userData = state.userData
      return userData.email?.email_verified?.valueOf() || false
    },
    showEmailVerified(): boolean {
      return this.email !== ''
    },
    personalInfoMissing(): boolean {
      return this.firstName == '' || this.lastName == ''
    },
    customData(state) {
      const userData = state.userData
      let customData = null
      if (userData && userData.custom_app_data) {
        customData = userData.custom_app_data
      }
      return customData
    },
    address(state): UserAddressDto {
      let address = {}
      if (state.userData && state.userData.address) {
        address = state.userData.address
      }
      return address
    },
  },
  actions: {
    async setTsPlatformLoaded(loaded: boolean) {
      this.tsPlatformLoaded = loaded
    },
    async setPersonalInfo(firstName: string, lastName: string, birthday: string | null) {
      let update
      if (birthday) {
        update = await userApi.update({
          name: { first_name: firstName, last_name: lastName },
          birthday: birthday,
        })
      } else {
        update = await userApi.update({
          name: { first_name: firstName, last_name: lastName },
        })
      }

      if (update.status == 200) {
        console.log('Update user data', update.data)
        this.setUserData(update.data)
        return true
      }
      return false
    },
    async setAddress(street: string, city: string, postalCode: string, country: string) {
      const update = await userApi.update({
        address: {
          city,
          street_address: street,
          postal_code: postalCode,
          country,
        },
      })

      if (update.status == 200) {
        console.log('Update user address', update.data)
        this.setUserData(update.data)
        return true
      }
      return false
    },
    async refreshUserData() {
      const refresh = await userApi.getCurrentUser()
      if (refresh.status == 200) {
        console.log('Refreshed user data')
        console.log(refresh.data)
        this.setUserData(refresh.data.userData)
      }
    },
    setAuthenticated(authenticated: boolean) {
      this.authenticated = authenticated
    },
    setUserData(userData: UserDto) {
      this.userData = userData
    },
    setSessionLoaded(loaded: boolean) {
      this.sessionLoaded = loaded
    },
    setWebAuthnSupported(supported: boolean) {
      this.webauthn.supported = supported
    },
    setWebAuthnAuthenticationSession(sessionId: string, deviceBindingToken: string) {
      this.webauthn.sessionId = sessionId
      this.webauthn.deviceBindingToken = deviceBindingToken
    },
    clearSignupData() {
      this.signupData = defaultSignupData
    },
    clear() {
      this.userData = {} as UserDto
      this.setAuthenticated(false)
      deleteCookie('connect.sid')
    },
  },
})
