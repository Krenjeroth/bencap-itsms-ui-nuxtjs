<script setup lang="ts"></script>

<template>
  <footer class="relative">
    <div>
      <div
        class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 lg:py-4 lg:flex lg:items-center lg:justify-between lg:gap-x-3"
      >
        <div
          class="lg:flex-1 flex items-center justify-center lg:justify-end gap-x-1.5 lg:order-3"
        >
          <ULink
            class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 p-1.5 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center"
            to="https://github.com/benguet-capitol-itsms"
            target="_blank"
          >
            <UIcon
              name="i-simple-icons:facebook"
              class="flex-shrink-0 w-5 h-5"
            />
          </ULink>
        </div>
        <div class="mt-3 lg:mt-0 lg:order-2 flex items-center justify-center">
          <ul
            class="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-6"
          >
            <li class="relative">
              <ULink
                class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                to="https://github.com/krenjer"
                target="_blank"
                >GitHub
                <UIcon
                  name="i-heroicons:arrow-up-right-20-solid"
                  class="w-3 h-3 absolute top-0.5 -right-3.5 text-gray-400 dark:text-gray-500"
                />
              </ULink>
            </li>
          </ul>
        </div>
        <div
          class="flex items-center justify-center lg:justify-start lg:flex-1 gap-x-1.5 mt-3 lg:mt-0 lg:order-1"
        >
          <ULink class="text-sm text-gray-500 dark:text-gray-400"
            >Dev
            <span class="text-gray-900 dark:text-white">Krenjer</span></ULink
          >
        </div>
      </div>
    </div>
  </footer>
</template>
