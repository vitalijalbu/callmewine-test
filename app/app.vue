<script setup>
const cart = useCart()

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'it'
  }
})

const title = 'Callmewine test'
const description = 'Nuxt 4 shopify test'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UHeader class="bg-primary">
      <template #left>
        <NuxtLink to="/">
          <NuxtImg
            src="/images/logo-callmewine-white.svg"
            width="190"
            height="50"
            alt="Callmewine"
            class="w-auto h-[50px] shrink-0"
          />
        </NuxtLink>
      </template>

      <template #right>
        <UChip
          :show="cart.count.value > 0"
          :text="cart.count.value"
          size="3xl"
          color="neutral"
          variant="subtle"
        >
          <UButton
            icon="i-lucide-shopping-bag"
            aria-label="Apri carrello"
            color="neutral"
            variant="ghost"
            class="text-white hover:text-white"
            @click="cart.isOpen.value = true"
          />
        </UChip>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <CartSlideover />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with Nuxt UI • © {{ new Date().getFullYear() }}
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
