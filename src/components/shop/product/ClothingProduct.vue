<script lang="ts" setup>
import { toRefs } from 'vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import type { ProductDto } from '@transmitsecurity-dev/ts-demo-client-lib'

const props = defineProps<{
  product: ProductDto
}>()

const { product } = toRefs(props)

const emit = defineEmits(['addToCart'])
</script>

<template>
  <div class="py-6 sm:py-8 lg:py-12">
    <div class="max-w-screen-xl px-4 md:px-8 mx-auto">
      <div class="grid md:grid-cols-3 lg:grid-cols-8 gap-4 mb-5">
        <div class="col-start-1 lg:col-start-2 flex justify-start items-center ml-2">
          <router-link
            class="flex items-center flex-grow hover:underline text-base-content"
            :to="product.category == 'FEMALE' ? '/category/female' : '/category/male'"
            ><arrow-left-icon class="w-4 h-4 mr-2" /> {{ $t('global.back') }}</router-link
          >
        </div>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        <!-- images - start -->
        <div class="grid md:col-span-2 lg:grid-cols-5 gap-4">
          <div class="flex lg:flex-col order-last lg:order-none lg:col-start-2 lg:col-end-3 gap-4">
            <div class="rounded-none overflow-hidden">
              <img
                :src="product.image"
                loading="lazy"
                alt="Product image"
                class="w-full h-full object-cover object-center hover:scale-150 transition-all"
              />
            </div>

            <div class="bg-base-100 rounded-none overflow-hidden">
              <img
                :src="product.image2"
                loading="lazy"
                alt="Product image"
                class="w-full h-full object-cover object-center hover:scale-150 transition-all"
              />
            </div>

            <div class="bg-base-100 rounded-none overflow-hidden">
              <img
                :src="product.image3"
                loading="lazy"
                alt="Product image"
                class="w-full h-full object-cover object-center hover:scale-150 transition-all"
              />
            </div>
          </div>

          <div class="lg:col-span-3 bg-base-100 rounded-none overflow-hidden relative">
            <img
              :src="product.image"
              loading="lazy"
              alt="Product image"
              class="w-full h-full object-cover object-center hover:scale-110 transition-all"
            />

            <span
              class="bg-accent text-accent-content text-sm tracking-wider uppercase rounded-br-lg absolute left-0 top-0 px-3 py-1.5"
              >sale</span
            >

            <a
              href="#"
              class="inline-block bg-base-100 hover:bg-base-200 focus-visible:ring ring-accent-300 text-base-content active:text-error-content border text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 absolute right-4 top-4 px-3.5 py-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </a>
          </div>
        </div>
        <!-- images - end -->

        <!-- content - start -->
        <div class="md:py-8">
          <!-- name - start -->
          <div class="mb-2 md:mb-3">
            <span class="inline-block text-base-content/80 mb-0.5">{{ product.brand }}</span>
            <h2 class="text-base-content text-2xl lg:text-3xl font-bold">{{ product.name }}</h2>
          </div>
          <!-- name - end -->

          <!-- rating - start -->
          <div class="flex items-center gap-3 mb-6 md:mb-10">
            <div
              class="h-7 flex items-center bg-accent text-accent-content rounded-full gap-1 px-2"
            >
              <span class="text-sm">4.2</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>

            <span class="text-accent text-sm transition duration-100">{{
              $t('shop.product.rating')
            }}</span>
          </div>
          <!-- rating - end -->

          <!-- color - start -->
          <div class="mb-4 md:mb-6 text-base-content/80">{{ product.description }}</div>

          <!-- color - start -->
          <div class="mb-4 md:mb-6">
            <span
              class="inline-block text-base-content/80 text-sm md:text-base font-semibold mb-3"
              >{{ $t('shop.product.color') }}</span
            >

            <div class="flex flex-wrap gap-2">
              <span
                class="w-8 h-8 bg-gray-800 border ring-2 ring-offset-1 ring-gray-800 rounded-full transition duration-100"
              ></span>
              <button
                type="button"
                class="w-8 h-8 bg-gray-500 border ring-2 ring-offset-1 ring-transparent hover:ring-gray-200 rounded-full transition duration-100"
              ></button>
              <button
                type="button"
                class="w-8 h-8 bg-gray-200 border ring-2 ring-offset-1 ring-transparent hover:ring-gray-200 rounded-full transition duration-100"
              ></button>
              <button
                type="button"
                class="w-8 h-8 bg-white border ring-2 ring-offset-1 ring-transparent hover:ring-gray-200 rounded-full transition duration-100"
              ></button>
            </div>
          </div>
          <!-- color - end -->

          <!-- size - start -->
          <div class="mb-8 md:mb-10">
            <span
              class="inline-block text-base-content/80 text-sm md:text-base font-semibold mb-3"
              >{{ $t('shop.product.size') }}</span
            >

            <div class="flex flex-wrap gap-3">
              <button
                type="button"
                class="w-12 h-8 flex justify-center items-center bg-base-100 hover:bg-primary hover:text-primary-content active:bg-primary-focus text-base-content active:text-primary-content text-sm font-semibold text-center border rounded-none transition duration-100"
              >
                XS
              </button>
              <button
                type="button"
                class="w-12 h-8 flex justify-center items-center bg-base-100 hover:bg-primary hover:text-primary-content active:bg-primary-focus text-base-content active:text-primary-content text-sm font-semibold text-center border rounded-none transition duration-100"
              >
                S
              </button>
              <span
                class="active w-12 h-8 flex justify-center items-center bg-primary hover:bg-primary text-primary-content active:bg-primary-focus active:text-primary-content text-sm font-semibold text-center border rounded-none transition duration-100 cursor-default"
                >M</span
              >
              <button
                type="button"
                class="w-12 h-8 flex justify-center items-center bg-base-100 hover:bg-primary hover:text-primary-content active:bg-primary-focus text-base-content active:text-primary-content text-sm font-semibold text-center border rounded-none transition duration-100"
              >
                L
              </button>
              <span
                class="w-12 h-8 flex justify-center items-center bg-base-100 hover:bg-primary hover:text-primary-content active:bg-primary-focus text-base-content active:text-primary-content text-sm font-semibold text-center border rounded-none transition duration-100 cursor-not-allowed"
                >XL</span
              >
            </div>
          </div>
          <!-- size - end -->

          <!-- price - start -->
          <div class="mb-4">
            <div class="flex items-end gap-2">
              <span class="text-base-content text-xl md:text-2xl font-bold">{{
                $n(product.price, 'currency')
              }}</span>
              <span class="text-accent line-through mb-0.5">{{
                $n(product.price + 19.74, 'currency')
              }}</span>
            </div>

            <span class="text-base-content/80 text-sm">{{
              $t('shop.product.includingVATplusShipping')
            }}</span>
          </div>
          <!-- price - end -->

          <!-- shipping notice - start -->
          <div class="flex items-center text-base-content/80 gap-2 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
              />
            </svg>

            <span class="text-sm">{{ $t('shop.product.shippingMessage') }}</span>
          </div>
          <!-- shipping notice - end -->

          <!-- buttons - start -->
          <div class="flex">
            <button @click="$emit('addToCart')" class="flex-1 btn btn-primary">
              {{ $t('shop.product.addToCart') }}
            </button>
          </div>
          <!-- buttons - end -->
        </div>
        <!-- content - end -->
      </div>
    </div>
  </div>
</template>
