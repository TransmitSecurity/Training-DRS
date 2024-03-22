<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  beneficiaries: string[]
}>()

const emits = defineEmits(['selectBeneficiary'])
const open = ref(false)
const selectedBeneficiary = ref<string | null>(null)
function selectBeneficiary(beneficiary: string) {
  selectedBeneficiary.value = beneficiary
  open.value = false
  emits('selectBeneficiary', beneficiary)
}
</script>

<template>
  <div
    class="collapse collapse-arrow rounded-box border border-base-200 bg-base-100 shadow-md py-2 px-0"
  >
    <input type="checkbox" v-model="open" />
    <div class="collapse-title font-medium">
      <div v-if="selectedBeneficiary === null">
        {{ $t('bank.transfer.selectReceivingAccount') }}
      </div>
      <div v-else class="text-primary">
        {{ selectedBeneficiary }}
      </div>
    </div>
    <div class="collapse-content px-0">
      <hr />
      <div v-for="beneficiary in props.beneficiaries" v-bind:key="beneficiary">
        <div
          class="px-4 hover:cursor-pointer hover:bg-base-200 text-primary py-4"
          @click="selectBeneficiary(beneficiary)"
        >
          {{ beneficiary }}
        </div>
      </div>
    </div>
  </div>
</template>
