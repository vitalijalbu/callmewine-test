<script setup lang="ts">
import type { ShopifyImage } from "~/types/product";

const props = defineProps<{
	images: ShopifyImage[];
	title: string;
}>();

const carousel = useTemplateRef<{
	emblaApi?: { scrollTo: (index: number) => void };
}>("carousel");
const activeIndex = ref(0);

const slides = computed<ShopifyImage[]>(() =>
	props.images.length
		? props.images
		: [{ url: "", altText: props.title, width: null, height: null }],
);

function onSelect(index: number) {
	activeIndex.value = index;
}

function goTo(index: number) {
	activeIndex.value = index;
	carousel.value?.emblaApi?.scrollTo(index);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UCarousel
      ref="carousel"
      v-slot="{ item }"
      :items="slides"
      :arrows="slides.length > 1"
      :ui="{ item: 'basis-full' }"
      class="w-full overflow-hidden rounded-xl bg-elevated/50 ring-1 ring-default"
      @select="onSelect"
    >
      <div class="flex aspect-square w-full items-center justify-center p-4">
        <NuxtImg
          v-if="item.url"
          provider="shopify"
          :src="item.url"
          :alt="item.altText || title"
          :width="700"
          :height="700"
          sizes="(max-width: 1024px) 100vw, 600px"
          fit="contain"
          loading="lazy"
          class="h-full w-full object-contain"
        />
        <UIcon
          v-else
          name="i-lucide-wine"
          class="size-24 text-dimmed"
        />
      </div>
    </UCarousel>

    <div
      v-if="slides.length > 1"
      class="grid grid-cols-5 gap-2 sm:grid-cols-6"
    >
      <button
        v-for="(image, index) in slides"
        :key="image.url || index"
        type="button"
        :aria-label="`Vedi immagine ${index + 1}`"
        :aria-current="index === activeIndex"
        class="aspect-square overflow-hidden rounded-lg bg-elevated/50 ring-1 transition"
        :class="index === activeIndex ? 'ring-2 ring-primary' : 'ring-default hover:ring-inverted/30'"
        @click="goTo(index)"
      >
        <NuxtImg
          provider="shopify"
          :src="image.url"
          :alt="image.altText || `${title} miniatura ${index + 1}`"
          :width="120"
          :height="120"
          fit="contain"
          loading="lazy"
          class="h-full w-full object-contain p-1"
        />
      </button>
    </div>
  </div>
</template>
