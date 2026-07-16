<template>
  <div class="flex flex-col min-h-screen">
    <UHeader :ui="{ container: 'px-6 sm:px-8' }">
      <template #title>
        <span class="font-bold text-xl tracking-tight text-highlighted">Connect Docs</span>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain class="flex-1 w-full py-8">
      <slot />
    </UMain>
  </div>
</template>
