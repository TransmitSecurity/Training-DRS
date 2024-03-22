<script setup lang="ts">
import BlogPreviewCard from '@/components/blog/BlogPreviewCard.vue'
import BlogFeatureCard from '../blog/BlogFeatureCard.vue'
import { FireIcon, PuzzlePieceIcon, SparklesIcon } from '@heroicons/vue/24/outline'

const lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis fugit dolorum amet dolores praesentium, alias nam? Tempore'
const blogs = [
  {
    authorName: 'Tom Hank',
    authorJobTitle: 'Creative Director',
    authorImage:
      'https://cdn.dribbble.com/users/1436669/screenshots/15006128/media/5f91264b3b56cc452cb2bba2535bccdd.png?compress=1&resize=1000x750&vertical=top',
    blogTitle: 'What do you want to know about UI',
    blogPreview: lorem,
    blogImage:
      'https://images.unsplash.com/photo-1624996379697-f01d168b1a52?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
  {
    authorName: 'Arthur Melo',
    authorJobTitle: 'Creative Director',
    authorImage:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
    blogTitle: 'All the features you want to know',
    blogPreview: lorem,
    blogImage:
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
  {
    authorName: 'Amelia Anderson',
    authorJobTitle: 'Lead Developer',
    authorImage:
      'https://images.unsplash.com/photo-1531590878845-12627191e687?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
    blogTitle: 'Which services you get from Transmit UI',
    blogPreview: lorem,
    blogImage:
      'https://images.unsplash.com/photo-1597534458220-9fb4969f2df5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
  },
]
</script>
<template>
  <section>
    <div
      class="relative grid w-full bg-primary-focus text-primary-content h-96 lg:h-[32rem] place-items-center"
    >
      <div class="flex flex-col items-center mx-auto text-center">
        <h1 class="text-4xl font-semibold uppercase md:text-6xl">Hero Header</h1>

        <p class="mt-6 text-lg leading-5">The best in town.</p>

        <a href="#about" class="mt-8 cursor-pointer animate-bounce">
          <svg
            width="53"
            height="53"
            viewBox="0 0 53 53"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="27" cy="26" r="18" stroke="white" stroke-width="2" />
            <path
              d="M22.41 23.2875L27 27.8675L31.59 23.2875L33 24.6975L27 30.6975L21 24.6975L22.41 23.2875Z"
              fill="white"
            />
          </svg>
        </a>
      </div>
    </div>

    <svg
      class="fill-primary-focus"
      viewBox="0 0 1440 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1440 0H0V57C720 0 1440 57 1440 57V0Z" />
    </svg>
  </section>

  <section class="container px-6 py-8 mx-auto lg:py-16 text-base-content" id="about">
    <div class="lg:flex lg:items-center lg:-mx-4">
      <div class="lg:w-1/2 lg:px-4">
        <h3 class="text-xl font-medium md:text-2xl lg:text-3xl">
          We create awesome prototypes, plugins, and templates.
        </h3>

        <p class="mt-6 text-base-content/70">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic laboriosam provident
          voluptatum id magni iste nobis corrupti, delectus quis repellat, debitis error quod
          explicabo molestiae rerum totam ab sunt excepturi?
        </p>

        <button class="flex items-center mt-8 -mx-2 text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 mx-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="mx-1 font-semibold">PLAY VIDEO</p>
        </button>
      </div>

      <div class="mt-8 lg:w-1/2 lg:px-4 lg:mt-0">
        <img
          class="object-cover w-full rounded-xl h-96"
          src="https://images.unsplash.com/photo-1516131206008-dd041a9764fd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
          alt="Video thumbnail"
        />
      </div>
    </div>
  </section>

  <section class="container px-6 py-8 mx-auto lg:py-16">
    <div class="grid grid-cols-1 gap-8 xl:gap-12 md:grid-cols-2 xl:grid-cols-3">
      <blog-feature-card
        feature-title="web design"
        feature-description="Research, user experience testing, mockups, and prototypes"
      >
        <fire-icon class="w-8 h-8 text-primary" />
      </blog-feature-card>

      <blog-feature-card
        feature-title="development"
        feature-description="Research, user experience testing, mockups, and prototypes"
      >
        <puzzle-piece-icon class="w-8 h-8 text-primary" />
      </blog-feature-card>

      <blog-feature-card
        feature-title="Research"
        feature-description="Research, user experience testing, mockups, and prototypes"
      >
        <sparkles-icon class="w-8 h-8 text-primary" />
      </blog-feature-card>
    </div>
  </section>

  <section class="container px-6 py-8 mx-auto lg:py-16">
    <h3 class="text-xl font-medium text-base-content md:text-2xl lg:text-3xl">
      Browse Our Projects
    </h3>

    <div class="flex items-center py-6 mt-4 -mx-2 overflow-x-auto whitespace-nowrap">
      <button
        class="px-4 mx-2 py-0.5 items-center inline-flex btn-primary btn-active btn-outline rounded-full"
      >
        All
      </button>
      <button
        class="px-4 mx-2 py-0.5 items-center inline-flex btn-secondary btn-outline rounded-full"
      >
        Web Design
      </button>
      <button
        class="px-4 mx-2 py-0.5 items-center inline-flex btn-secondary btn-outline rounded-full"
      >
        Development
      </button>
      <button
        class="px-4 mx-2 py-0.5 items-center inline-flex btn-secondary btn-outline rounded-full"
      >
        Research
      </button>
    </div>

    <div class="grid grid-cols-1 gap-10 mt-10 md:grid-cols-2 lg:grid-cols-3">
      <a href="#" class="transition-all duration-500 lg:col-span-2 hover:scale-105">
        <img
          class="object-cover object-top w-full rounded-lg shadow-md shadow-gray-200 h-80 xl:h-96"
          src="https://cdn.dribbble.com/users/1644453/screenshots/17056773/media/00509f74e765da294440886db976943a.png?compress=1&resize=1000x750&vertical=top"
          alt=""
        />
      </a>

      <a href="#" class="transition-all duration-500 hover:scale-105">
        <img
          class="object-cover object-top w-full rounded-lg shadow-md shadow-gray-200 h-80 xl:h-96"
          src="https://cdn.dribbble.com/userupload/3233220/file/original-e80767b5947df65a0f1ab4dab4964679.png?compress=1&resize=1024x768"
          alt=""
        />
      </a>

      <a href="#" class="transition-all duration-500 hover:scale-105">
        <img
          class="object-cover object-top w-full rounded-lg shadow-md shadow-gray-200 h-80 xl:h-96"
          src="https://cdn.dribbble.com/users/1644453/screenshots/14748860/media/25f53296059b741ac1c083be9f41745b.png?compress=1&resize=1000x750&vertical=top"
          alt=""
        />
      </a>

      <a href="#" class="transition-all duration-500 lg:col-span-2 hover:scale-105">
        <img
          class="object-cover object-top w-full rounded-lg shadow-md shadow-gray-200 h-80 xl:h-96"
          src="https://cdn.dribbble.com/users/878428/screenshots/17307425/media/01782a518148ce7ef2e790473c888b1f.png?compress=1&resize=1000x750&vertical=top"
          alt=""
        />
      </a>

      <a href="#" class="transition-all duration-500 lg:col-span-2 hover:scale-105">
        <img
          class="object-cover object-top w-full rounded-lg shadow-md shadow-gray-200 h-80 xl:h-96"
          src="https://cdn.dribbble.com/users/1930709/screenshots/11466872/media/e50b0f02160a77397eb4a76782d23966.png?compress=1&resize=1000x750&vertical=top"
          alt=""
        />
      </a>

      <a href="#" class="transition-all duration-500 hover:scale-105">
        <img
          class="object-cover object-top w-full rounded-lg shadow-md shadow-gray-200 h-80 xl:h-96"
          src="https://cdn.dribbble.com/users/1644453/screenshots/14403641/media/21e305eb9c8255b6e3367f0ca52c6668.png?compress=1&resize=1000x750&vertical=top"
          alt=""
        />
      </a>
    </div>
  </section>

  <section class="container px-6 py-8 mx-auto lg:py-16 text-base-content">
    <h3 class="text-xl font-medium md:text-2xl lg:text-3xl">Recent Blog Posts</h3>

    <div class="grid grid-cols-1 gap-8 mt-8 md:mt-10 md:grid-cols-2 xl:grid-cols-3">
      <template v-for="blog in blogs" :key="blog.blogTitle.trim()"
        ><blog-preview-card
          :author-name="blog.authorName"
          :author-job-title="blog.authorJobTitle"
          :author-image="blog.authorImage"
          :blog-title="blog.blogTitle"
          :blog-preview="blog.blogPreview"
          :blog-image="blog.blogImage"
        />
      </template>
    </div>
  </section>
</template>
