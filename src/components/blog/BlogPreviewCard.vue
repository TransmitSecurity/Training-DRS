<script setup lang="ts">
import { toRefs } from 'vue'

const props = withDefaults(
  defineProps<{
    authorName: string
    authorJobTitle: string
    authorImage: string
    blogTitle: string
    blogPreview: string
    blogImage: string
    blogLink?: string
  }>(),
  {
    blogLink: '#',
  },
)

const { authorName, authorJobTitle, authorImage, blogTitle, blogPreview, blogLink } = toRefs(props)
</script>
<template>
  <div>
    <div class="relative">
      <img
        class="object-cover object-center w-full h-64 rounded-lg lg:h-80"
        :src="blogImage"
        alt=""
      />

      <div class="absolute bottom-0 flex p-3 bg-base-100">
        <img class="object-cover object-center w-10 h-10 rounded-full" :src="authorImage" alt="" />

        <div class="mx-4">
          <h1 class="text-sm text-base-content">{{ authorName }}</h1>
          <p class="text-sm text-base-content/70">{{ authorJobTitle }}</p>
        </div>
      </div>
    </div>

    <h1 class="mt-6 text-xl font-semibold text-base-content">{{ blogTitle }}</h1>

    <hr class="w-32 my-6 bg-primary" />

    <p class="text-sm text-base-content/70">
      {{ blogPreview }}
    </p>

    <a :href="blogLink" class="inline-block mt-4 text-primary underline hover:text-primary/70"
      >Read more</a
    >
  </div>
</template>
