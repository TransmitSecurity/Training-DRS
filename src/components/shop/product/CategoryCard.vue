<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id: string
    name: string
    image: string
    class?: string
  }>(),
  { class: 'h-52' },
)
</script>

<template>
  <router-link :to="'/category/' + props.id" class="relative justify-center flex flex-grow">
    <img
      :src="props.image"
      alt="hero"
      class="w-full hover:saturate-150 hover:brightness-100 transition-all object-cover"
      :class="props.class"
    />
    <div class="absolute flex flex-col bottom-0 w-full">
      <div class="">
        <h2
          class="text-center text-md sm:text-2xl font-thin text-base-content backdrop-opacity-60 backdrop-blur-md backdrop-grayscale bg-base-300 bg-opacity-70"
        >
          {{ props.name }}
        </h2>
      </div>
    </div>
  </router-link>
</template>
