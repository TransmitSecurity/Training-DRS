import router from '@/router'

export function continueIdoJourney(idoResponse: IdoServiceResponse) {
  // Parse the response and redirect the user
  switch (idoResponse.journeyStepId) {
    case 'action:information':
      router.push({ name: 'idoInfo' })
      break
    case 'action:success':
      router.push({ name: 'home' })
      break
    default:
      router.push({ name: idoResponse.journeyStepId || 'home' })
      break
  }
}
