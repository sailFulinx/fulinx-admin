<script setup lang="ts">
import { useVersion } from '@/composables/general'
import { useAppStore } from '@/stores/app'
import { underlineToHump } from '@/utils'

import LoginForm from './components/LoginForm.vue'

const appStore = useAppStore()
</script>

<template>
  <div class="h-[100%] relative">
    <div class="relative h-full flex mx-auto">
      <div class="flex-1 bg-gray-500 bg-opacity-20 relative p-30px ">
        <div class="flex items-center relative text-white">
          <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
        </div>
        <div class="flex justify-center items-center h-[calc(100%-40px)]">
          <TransitionGroup appear tag="div" enter-active-class="animate__animated animate__bounceInLeft">
            <img key="1" src="@/assets/svgs/login-box-bg.svg" alt="" class="w-350px">
            <div key="2" class="text-3xl text-white">
              欢迎
            </div>
            <div key="3" class="mt-5 font-normal text-white text-18px" />
          </TransitionGroup>
        </div>
        <div class="flex items-center relative text-white">
          <!-- <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" /> -->
          <span class="text-16px">{{ useVersion() }}</span>
        </div>
      </div>
      <div class="flex-1 p-30px <sm:p-10px dark:bg-v-dark relative">
        <div class="flex justify-between items-center text-white @2xl:justify-end @xl:justify-end">
          <div class="flex items-center @2xl:hidden @xl:hidden">
            <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px">
            <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
          </div>
        </div>
        <Transition appear enter-active-class="animate__animated animate__bounceInRight">
          <div
            class="h-full flex items-center m-auto w-[100%] @2xl:max-w-500px @xl:max-w-500px @md:max-w-500px @lg:max-w-500px"
          >
            <LoginForm class="w-100 p-20px h-auto m-auto <xl:(rounded-3xl light:bg-white)" />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
