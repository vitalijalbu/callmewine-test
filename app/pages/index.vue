<script setup lang="ts">
import { PRODUCT_BY_ID_QUERY } from "~/graphql/product";
import type { GetProductByHandleResult } from "~/types/product";
import { normalizeProductImages } from "~/utils/image";

// static id of the product
const productId = "gid://shopify/Product/7171746234415";
const { language, country } = useShopifyContext();

const { data, error } = await useStorefrontData<
	typeof PRODUCT_BY_ID_QUERY,
	GetProductByHandleResult
>(`product:${productId}:${language.value}`, PRODUCT_BY_ID_QUERY, {
	variables: {
		id: productId,
		language: language.value,
		country: country.value,
	},
});

if (error.value || !data.value?.product) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product not found",
		fatal: true,
	});
}

const product = computed(() => normalizeProductImages(data.value!.product!));

const galleryImages = computed(() => {
	const imgs = product.value.images.nodes;
	return imgs.length ? imgs : [product.value.featuredImage].filter(Boolean);
});

const categoryLabel = computed(
	() => product.value.productType?.split(">").pop()?.trim() ?? "",
);

const displayTags = computed(() =>
	product.value.tags
		.filter((t) => !/^(not_|b2b_|brand_|gold_|P\d+)/i.test(t))
		.slice(0, 6),
);

useSeoMeta({
	title: () => product.value.seo.title || product.value.title,
	description: () => product.value.seo.description || product.value.description,
	ogTitle: () => product.value.title,
	ogImage: () => product.value.featuredImage?.url,
});
</script>

<template>
  <UContainer
    v-if="product"
    class="py-8 lg:py-12"
  >
    <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div class="lg:sticky lg:top-24 lg:self-start">
        <ProductGallery
          :images="galleryImages"
          :title="product.title"
        />
      </div>

      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <UBadge
              v-if="product.vendor"
              color="neutral"
              variant="subtle"
              :label="product.vendor"
            />
            <UBadge
              v-if="categoryLabel"
              color="primary"
              variant="soft"
              :label="categoryLabel"
            />
          </div>
          <h1 class="text-3xl font-semibold text-highlighted text-balance lg:text-4xl">
            {{ product.title }}
          </h1>
        </div>

        <ProductPurchase :product="product" />

        <div
          v-if="displayTags.length"
          class="flex flex-wrap gap-2"
        >
          <UBadge
            v-for="tag in displayTags"
            :key="tag"
            color="neutral"
            variant="outline"
            size="sm"
            :label="tag"
          />
        </div>

        <USeparator />

        <section
          v-if="product.descriptionHtml"
          class="flex flex-col gap-3"
        >
          <h2 class="text-lg font-semibold text-highlighted">
            {{ $t('product.description') }}
          </h2>
          <div
            class="prose prose-sm dark:prose-invert max-w-none text-muted"
            v-html="product.descriptionHtml"
          />
        </section>
      </div>
    </div>
  </UContainer>
</template>
