import type { Money } from '~/types/product'
import type { GiftBoxSchema } from '~/schemas/gift-box'
import {
  CART_QUERY,
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_UPDATE,
  CART_LINES_REMOVE
} from '~/graphql/cart'

export interface CartAttribute {
  key: string
  value: string
}

export interface CartLine {
  id: string
  quantity: number
  attributes: CartAttribute[]
  cost: { totalAmount: Money }
  merchandise: {
    id: string
    title: string
    price: Money
    compareAtPrice: Money | null
    image: { url: string, altText: string | null } | null
    product: { title: string }
  }
}

export interface Cart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: { subtotalAmount: Money, totalAmount: Money }
  lines: { nodes: CartLine[] }
}

interface CartMutationResult {
  cart: Cart | null
  userErrors: { field: string[] | null, message: string }[]
}

export const GIFT_ATTRIBUTE_KEY = 'Confezione regalo'

function giftAttributes(gift: GiftBoxSchema | null): CartAttribute[] {
  if (!gift) return []
  return [
    { key: GIFT_ATTRIBUTE_KEY, value: 'Sì' },
    { key: 'Destinatario', value: gift.recipientName },
    { key: 'Mittente', value: gift.senderName },
    { key: 'Messaggio', value: gift.message }
  ]
}

export function useCart() {
  const storefront = useStorefront()
  const toast = useToast()

  const cartId = useCookie<string | null>('cw_cart_id', {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax'
  })
  const cart = useState<Cart | null>('cart', () => null)
  const isOpen = useState<boolean>('cart:open', () => false)
  const loading = useState<boolean>('cart:loading', () => false)
  const initialized = useState<boolean>('cart:initialized', () => false)

  async function request<T>(operation: string, variables: Record<string, unknown>) {
    const { data, errors } = await storefront.request<T>(operation, { variables })
    if (errors) {
      throw new Error(Array.isArray(errors) ? errors[0]?.message : String(errors))
    }
    return data
  }

  function apply(result: CartMutationResult | undefined | null) {
    if (result?.userErrors?.length) {
      throw new Error(result.userErrors[0]!.message)
    }
    if (result?.cart) {
      cart.value = result.cart
      cartId.value = result.cart.id
    }
  }

  async function refresh() {
    if (!cartId.value) return
    try {
      const data = await request<{ cart: Cart | null }>(CART_QUERY, { cartId: cartId.value })
      if (data?.cart) {
        cart.value = data.cart
      } else {
        cart.value = null
        cartId.value = null
      }
    } catch {
      cart.value = null
      cartId.value = null
    }
  }

  async function ensureLoaded() {
    if (initialized.value) return
    initialized.value = true
    await refresh()
  }

  async function addLine(merchandiseId: string, quantity: number, gift: GiftBoxSchema | null = null) {
    loading.value = true
    try {
      const lines = [{ merchandiseId, quantity, attributes: giftAttributes(gift) }]

      if (!cartId.value) {
        const data = await request<{ cartCreate: CartMutationResult }>(CART_CREATE, { lines })
        apply(data?.cartCreate)
      } else {
        const data = await request<{ cartLinesAdd: CartMutationResult }>(CART_LINES_ADD, {
          cartId: cartId.value,
          lines
        })
        if (!data?.cartLinesAdd?.cart) {
          cartId.value = null
          const created = await request<{ cartCreate: CartMutationResult }>(CART_CREATE, { lines })
          apply(created?.cartCreate)
        } else {
          apply(data.cartLinesAdd)
        }
      }
      isOpen.value = true
    } catch (e) {
      toast.add({ title: 'Errore', description: (e as Error).message, color: 'error', icon: 'i-lucide-triangle-alert' })
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateLine(lineId: string, quantity: number) {
    if (!cartId.value) return
    if (quantity <= 0) return removeLine(lineId)
    loading.value = true
    try {
      const data = await request<{ cartLinesUpdate: CartMutationResult }>(CART_LINES_UPDATE, {
        cartId: cartId.value,
        lines: [{ id: lineId, quantity }]
      })
      apply(data?.cartLinesUpdate)
    } catch (e) {
      toast.add({ title: 'Errore', description: (e as Error).message, color: 'error', icon: 'i-lucide-triangle-alert' })
    } finally {
      loading.value = false
    }
  }

  async function removeLine(lineId: string) {
    if (!cartId.value) return
    loading.value = true
    try {
      const data = await request<{ cartLinesRemove: CartMutationResult }>(CART_LINES_REMOVE, {
        cartId: cartId.value,
        lineIds: [lineId]
      })
      apply(data?.cartLinesRemove)
    } catch (e) {
      toast.add({ title: 'Errore', description: (e as Error).message, color: 'error', icon: 'i-lucide-triangle-alert' })
    } finally {
      loading.value = false
    }
  }

  const lines = computed(() => cart.value?.lines.nodes ?? [])
  const count = computed(() => cart.value?.totalQuantity ?? 0)
  const subtotal = computed(() => cart.value?.cost.subtotalAmount ?? null)
  const checkoutUrl = computed(() => cart.value?.checkoutUrl ?? '')

  return {
    lines,
    count,
    subtotal,
    checkoutUrl,
    isOpen,
    loading,
    ensureLoaded,
    addLine,
    updateLine,
    removeLine
  }
}
