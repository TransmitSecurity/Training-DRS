<template>
  <main class="min-h-screen w-full flex flex-col justify-center items-center bg-base-100 not-found">
    <h1 class="text-9xl font-extrabold text-base-content tracking-widest">404</h1>
    <div class="px-2 text-sm rounded rotate-12 absolute bg-error text-error-content">
      <slot>
        {{ $t('global.pageNotFound') }}
      </slot>
    </div>
    <button class="mt-5 px-8 btn btn-primary">
      <router-link :to="{ name: 'home' }">{{ $t('global.goHome') }}</router-link>
    </button>
  </main>
</template>
