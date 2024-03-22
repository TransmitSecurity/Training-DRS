import axios, { AxiosError } from 'axios'
import { useToast } from 'vue-toastification'
const toast = useToast()

export function handleError(error: unknown) {
  console.log(error)
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    const data = axiosError.response?.data as { message: string }
    if (data.message) {
      toast.error(data.message)
    }
  } else {
    const errorObject = error as { message: string }
    const message = errorObject.message ? errorObject.message : (error as string)
    toast.error(message)
  }
}
