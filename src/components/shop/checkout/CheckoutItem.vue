<script setup lang="ts">
const props = defineProps({
  id: String,
  name: String,
  description: String,
  image: String,
  quantity: Number,
  price: Number,
})
</script>
<template>
  <div class="flex items-start">
    <img class="flex-shrink-0 object-cover w-16 h-16 rounded-lg" :src="props.image" alt="" />

    <div class="ml-4">
      <p class="text-sm">{{ props.name }}</p>

      <dl class="mt-1 space-y-1 text-xs text-base-content/60">
        {{ description?.substring(0, 100)
        }}{{ description && description?.length > 100 ? '...' : '' }}
      </dl>
    </div>
  </div>

  <div>
    <p class="text-sm">
      {{ $n(props.price || 0, 'currency') }}
      <small class="text-base-content/60">x{{ props.quantity }}</small>
    </p>
  </div>
</template>
