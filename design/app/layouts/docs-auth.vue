<template>
  <!-- Inherit the header, footer, and OIDC login support from connect-auth -->
  <NuxtLayout name="connect-auth">
    <UMain class="flex-1 w-full py-8">
      <slot />
    </UMain>
  </NuxtLayout>
</template>
