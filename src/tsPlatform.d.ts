interface tsPlatform {
  drs: tsPlatformDrs
  ido: tsPlatformIdo
  webauthn: any
}
interface tsPlatformDrs {
  setAuthenticatedUser(userId: string): Promise
  triggerActionEvent(actionType: string): Promise
  init(): void
}

interface tsPlatformIdo {
  startJourney(journeyId: string, options: StartJourneyOptions): Promise<IdoServiceResponse>
  submitClientResponse(clientResponseOptionId: string, data?: object): Promise<IdoServiceResponse>
  serializeState(): string
  restoreFromSerializedState(state: string): IdoServiceResponse
}
