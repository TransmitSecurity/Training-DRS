export default [
  {
    path: '/bank/transfer/select',
    name: 'BankTransferSelect',
    component: () => import('@/views/bank/BankTransferSelectionView.vue'),
  },
  {
    path: '/bank/transfer/validate',
    name: 'BankTransferValidate',
    component: () => import('@/views/bank/BankTransferValidationView.vue'),
  },
]
