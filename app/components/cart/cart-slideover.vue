<script setup lang="ts">
import { GIFT_ATTRIBUTE_KEY } from "~/composables/use-cart";
import { shopifyImageBase } from "~/utils/image";

const cart = useCart();
const { $money } = useShopifyContext();

onMounted(() => cart.ensureLoaded());

function giftMessage(attributes: { key: string; value: string }[]) {
	return attributes.find((a) => a.key === "Messaggio")?.value ?? "";
}

function isGift(attributes: { key: string; value: string }[]) {
	return attributes.some((a) => a.key === GIFT_ATTRIBUTE_KEY);
}

function close() {
	cart.isOpen.value = false;
}
</script>

<template>
  <USlideover
    v-model:open="cart.isOpen.value"
    :title="$t('cart.title')"
    :description="$t('cart.count', cart.count.value)"
  >
    <template #body>
      <div
        v-if="!cart.lines.value.length"
        class="flex h-full flex-col items-center justify-center gap-3 text-center"
      >
        <UIcon
          name="i-lucide-shopping-bag"
          class="size-12 text-dimmed"
        />
        <p class="text-muted">
          {{ $t('cart.emptyMessage') }}
        </p>
      </div>

      <ul
        v-else
        class="flex flex-col divide-y divide-default"
      >
        <li
          v-for="line in cart.lines.value"
          :key="line.id"
          class="flex gap-3 py-4 first:pt-0"
        >
          <div class="size-20 shrink-0 overflow-hidden rounded-lg bg-elevated/50 ring-1 ring-default">
            <NuxtImg
              v-if="line.merchandise.image"
              provider="shopify"
              :src="shopifyImageBase(line.merchandise.image.url)"
              :alt="line.merchandise.image.altText || line.merchandise.product.title"
              :width="120"
              :height="120"
              fit="contain"
              class="h-full w-full object-contain p-1"
            />
          </div>

          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <div class="flex items-start justify-between gap-2">
              <NuxtLink
                to="/"
                class="line-clamp-2 text-sm font-medium text-highlighted hover:text-primary"
                @click="close"
              >
                {{ line.merchandise.product.title }}
              </NuxtLink>
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-x"
                :aria-label="$t('cart.removeItem')"
                @click="cart.removeLine(line.id)"
              />
            </div>

            <div
              v-if="isGift(line.attributes)"
              class="flex flex-col gap-1 rounded-lg bg-primary/10 p-2 text-xs"
            >
              <span class="flex items-center gap-1 font-medium text-primary">
                <UIcon
                  name="i-lucide-gift"
                  class="size-3.5"
                />
                {{ $t('gift.badge') }}
              </span>
              <span
                v-if="giftMessage(line.attributes)"
                class="text-muted italic"
              >
                “{{ giftMessage(line.attributes) }}”
              </span>
            </div>

            <div class="mt-1 flex items-center justify-between gap-2">
              <UInputNumber
                :model-value="line.quantity"
                :min="1"
                :max="12"
                size="sm"
                class="w-24"
                :aria-label="`Quantità per ${line.merchandise.product.title}`"
                @update:model-value="(q: number) => cart.updateLine(line.id, q)"
              />
              <span class="text-sm font-medium text-highlighted">
                {{ $money(line.cost.totalAmount) }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </template>

    <template
      v-if="cart.lines.value.length"
      #footer
    >
      <div class="flex w-full flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="text-base font-medium text-highlighted">{{ $t('cart.subtotal') }}</span>
          <span class="text-lg font-semibold text-highlighted">
            {{ cart.subtotal.value ? $money(cart.subtotal.value) : '—' }}
          </span>
        </div>
        <UButton
          :to="cart.checkoutUrl.value"
          external
          target="_blank"
          :label="$t('cart.checkout')"
          icon="i-lucide-credit-card"
          size="lg"
          color="primary"
          block
          :disabled="!cart.checkoutUrl.value"
        />
        <UButton
          :label="$t('cart.continue')"
          color="neutral"
          variant="ghost"
          block
          @click="close"
        />
      </div>
    </template>
  </USlideover>
</template>
