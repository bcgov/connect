<script setup lang="ts">
const { locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: locale.value
  }
})

const { data: navigation } = await useAsyncData(() => `navigation-${locale.value}`, async () => {
  const rawNav = await queryCollectionNavigation('content')
  
  const activeLocalePath = '/' + locale.value.toLowerCase()
  const activeBranch = rawNav.find(n => n.path.toLowerCase() === activeLocalePath)
  
  if (!activeBranch) {
    return []
  }

  const stripPrefix = (nodes: any[]): any[] => {
    return nodes.map(node => {
      const newNode = { ...node }
      if (newNode.path.toLowerCase().startsWith(activeLocalePath)) {
        const subPath = newNode.path.substring(activeLocalePath.length)
        newNode.path = subPath === '' ? '/' : subPath
      }
      if (newNode.children) {
        newNode.children = stripPrefix(newNode.children)
      }
      return newNode
    })
  }

  if (locale.value.toLowerCase() === 'en-ca') {
    const normalized = stripPrefix([activeBranch])
    return normalized[0].children || []
  }

  return activeBranch.children || []
})

provide('navigation', navigation)
</script>

<template>
  <UApp :toaster="{ expand: false }">
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
