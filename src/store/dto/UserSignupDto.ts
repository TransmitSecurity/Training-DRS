export default interface UserSignupDto {
  email: string
  secondaryEmails: Array<string>
  phone: string
  secondaryPhones: Array<string>
  username: string
  birthday: string
  street: string
  country: string
  city: string
  postalCode: string
  firstName: string
  lastName: string
  title: string
  password: string
}
