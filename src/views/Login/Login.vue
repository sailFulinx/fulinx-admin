<script setup lang="ts">
import LoginForm from './components/LoginForm.vue'

const title = ref(import.meta.env.VITE_APP_TITLE)

const version = useVersion()
</script>

<template>
  <div class="h-screen w-screen relative flex overflow-hidden">
    <div class="flex-1 bg-blue-500 bg-opacity-20 relative p-8">
      <div class="flex items-center relative text-white">
        <span class="text-2xl font-bold text-black">{{ title }}</span>
      </div>
      <div class="flex justify-center items-center h-80 w-full absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
        <TransitionGroup appear tag="div" enter-active-class="animate__animated animate__bounceInLeft">
          <img key="1" src="@/assets/svgs/login-box-bg.svg" :alt="title" class="w-80">
          <div key="2" class="text-3xl text-black">
            {{ $t('login.welcome') }}
          </div>
        </TransitionGroup>
      </div>
      <div class="flex items-center absolute bottom-10 text-black">
        <span class="text-lg">{{ version }}</span>
      </div>
    </div>
    <div class="flex-1 p-8 relative">
      <Transition appear enter-active-class="animate__animated animate__bounceInRight">
        <div class="h-full flex items-center justify-center w-full">
          <LoginForm class="w-full max-w-lg p-5 h-auto bg-white rounded-3xl" />
        </div>
      </Transition>
    </div>
  </div>
</template>
