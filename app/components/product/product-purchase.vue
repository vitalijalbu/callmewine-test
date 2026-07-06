<script setup lang="ts">
import { type GiftBoxSchema, giftBoxSchema } from "~/schemas/gift-box";
import type { Product, ProductVariant } from "~/types/product";

const props = defineProps<{ product: Product }>();

const { t } = useI18n();
const toast = useToast();
const cart = useCart();
const { $money } = useShopifyContext();

const variants = computed(() => props.product.variants.nodes);

const hasRealOptions = computed(() =>
	props.product.options.some((o) => o.name !== "Title"),
);

const selectedOptions = reactive<Record<string, string>>(
	Object.fromEntries(
		props.product.options.map((o) => [o.name, o.optionValues[0]?.name ?? ""]),
	),
);

const selectedVariant = computed<ProductVariant | undefined>(() => {
	return (
		variants.value.find((v) =>
			v.selectedOptions.every((o) => selectedOptions[o.name] === o.value),
		) ?? variants.value[0]
	);
});

function selectOption(name: string, value: string) {
	selectedOptions[name] = value;
}

function isOptionAvailable(name: string, value: string) {
	return variants.value.some(
		(v) =>
			v.availableForSale &&
			v.selectedOptions.some((o) => o.name === name && o.value === value),
	);
}

const quantity = ref(1);

const maxQuantity = computed(() => {
	const q = selectedVariant.value?.quantityAvailable;
	return q && q > 0 ? Math.min(q, 12) : 12;
});

watch(maxQuantity, (max) => {
	if (quantity.value > max) quantity.value = max;
});

const inStock = computed(
	() => selectedVariant.value?.availableForSale ?? false,
);

const unitPrice = computed(() =>
	Number(selectedVariant.value?.price.amount ?? 0),
);
const compareAtPrice = computed(() => {
	const c = selectedVariant.value?.compareAtPrice;
	const amount = c ? Number(c.amount) : 0;
	return amount > unitPrice.value ? amount : 0;
});
const currencyCode = computed(
	() => selectedVariant.value?.price.currencyCode ?? "EUR",
);
const discountPct = computed(() =>
	compareAtPrice.value
		? Math.round((1 - unitPrice.value / compareAtPrice.value) * 100)
		: 0,
);

const giftEnabled = ref(false);
const gift = reactive<Partial<GiftBoxSchema>>({
	recipientName: "",
	senderName: "",
	message: "",
});

watch(giftEnabled, (enabled) => {
	if (!enabled) {
		gift.recipientName = "";
		gift.senderName = "";
		gift.message = "";
	}
});

async function addToCart() {
	const variant = selectedVariant.value;
	if (!variant || !inStock.value) return;

	let giftData: GiftBoxSchema | null = null;
	if (giftEnabled.value) {
		const parsed = giftBoxSchema.safeParse(gift);
		if (!parsed.success) {
			toast.add({
				title: t("gift.incomplete"),
				description: parsed.error.issues[0]?.message,
				color: "error",
				icon: "i-lucide-triangle-alert",
			});
			return;
		}
		giftData = parsed.data;
	}

	await cart.addLine(variant.id, quantity.value, giftData);

	const addedQty = quantity.value;
	quantity.value = 1;
	giftEnabled.value = false;

	toast.add({
		title: t("cart.added"),
		description: `${addedQty} × ${props.product.title}`,
		icon: "i-lucide-shopping-bag",
		color: "success",
	});
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="text-3xl font-semibold text-highlighted">
        {{ $money(unitPrice, currencyCode) }}
      </span>
      <span
        v-if="compareAtPrice"
        class="text-lg text-muted line-through"
      >
        {{ $money(compareAtPrice, currencyCode) }}
      </span>
      <UBadge
        v-if="discountPct > 0"
        color="error"
        variant="subtle"
        :label="`-${discountPct}%`"
      />
    </div>

    <div
      v-if="hasRealOptions"
      class="flex flex-col gap-4"
    >
      <div
        v-for="option in product.options"
        :key="option.id"
        class="flex flex-col gap-2"
      >
        <span class="text-sm font-medium text-highlighted">{{ option.name }}</span>
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="value in option.optionValues"
            :key="value.id"
            :label="value.name"
            :color="selectedOptions[option.name] === value.name ? 'primary' : 'neutral'"
            :variant="selectedOptions[option.name] === value.name ? 'solid' : 'outline'"
            :disabled="!isOptionAvailable(option.name, value.name)"
            size="sm"
            @click="selectOption(option.name, value.name)"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4 rounded-xl ring-1 ring-default p-4">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-gift"
            class="size-5 text-primary"
          />
          <div>
            <p class="text-sm font-medium text-highlighted">
              {{ $t('gift.toggle') }}
            </p>
            <p class="text-xs text-muted">
              {{ $t('gift.subtitle') }}
            </p>
          </div>
        </div>
        <USwitch v-model="giftEnabled" />
      </div>

      <ProductGiftBoxForm
        v-if="giftEnabled"
        :model-value="gift"
        @update:model-value="Object.assign(gift, $event)"
      />
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <UInputNumber
        v-model="quantity"
        :min="1"
        :max="maxQuantity"
        :disabled="!inStock"
        class="w-32"
        :aria-label="$t('product.quantity')"
      />
      <UButton
        :label="inStock ? $t('product.addToCart') : $t('product.outOfStock')"
        icon="i-lucide-shopping-bag"
        size="lg"
        color="primary"
        block
        class="sm:flex-1"
        :loading="cart.loading.value"
        :disabled="!inStock"
        @click="addToCart"
      />
    </div>

    <UAlert
      v-if="inStock && selectedVariant?.quantityAvailable && selectedVariant.quantityAvailable <= 6"
      color="warning"
      variant="subtle"
      icon="i-lucide-flame"
      :title="$t('product.lastStock', { n: selectedVariant.quantityAvailable })"
    />
  </div>
</template>
