<script setup lang="ts">
import type { GiftBoxSchema } from '~/schemas/gift-box'

const props = defineProps<{
  modelValue: Partial<GiftBoxSchema>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Partial<GiftBoxSchema>]
}>()

const state = reactive<Partial<GiftBoxSchema>>({
  recipientName: props.modelValue?.recipientName ?? '',
  senderName: props.modelValue?.senderName ?? '',
  message: props.modelValue?.message ?? ''
})

watch(state, (val) => {
  emit('update:modelValue', { ...val })
}, { deep: true })
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-start gap-3 rounded-lg bg-primary/10 p-3 text-sm">
      <UIcon
        name="i-lucide-gift"
        class="mt-0.5 size-5 shrink-0 text-primary"
      />
      <p class="text-muted">
        Confezione regalo con biglietto: compila i campi qui sotto e il messaggio verrà allegato al prodotto nel carrello.
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField
        label="Nome del destinatario"
        required
      >
        <UInput
          v-model="state.recipientName"
          placeholder="Per chi è?"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Il tuo nome"
        required
      >
        <UInput
          v-model="state.senderName"
          placeholder="Da…"
          class="w-full"
        />
      </UFormField>
    </div>

    <UFormField
      label="Messaggio di auguri"
      required
      :hint="`${state.message?.length ?? 0}/250`"
    >
      <UTextarea
        v-model="state.message"
        :rows="4"
        :maxlength="250"
        placeholder="Scrivi un messaggio per il biglietto…"
        class="w-full"
      />
    </UFormField>
  </div>
</template>
