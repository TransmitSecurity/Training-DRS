<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id: string
    name: string
    image: string
    price: number
    class?: string
  }>(),
  { class: 'h-52' },
)
</script>

<template>
  <div>
    <div>
      <router-link :to="{ path: `/product/${props.id}` }">
        <div class="overflow-hidden">
          <img
            :src="props.image"
            class="w-full hover:scale-110 transition-all object-cover"
            :class="props.class"
          />
        </div>
      </router-link>
      <div class="pt-3 flex justify-between items-center gap-x-4">
        <p class="font-light text-sm overflow-ellipsis">{{ props.name }}</p>
        <p class="text-sm text-base-content font-light">
          {{ $n(props.price, 'currency') }}
        </p>
      </div>
    </div>
  </div>
</template>
