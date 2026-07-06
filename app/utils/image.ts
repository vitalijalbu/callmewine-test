import type { Product, ShopifyImage } from '~/types/product'

export function shopifyImageBase(url: string | null | undefined): string {
  if (!url) return ''
  const i = url.indexOf('?')
  return i === -1 ? url : url.slice(0, i)
}

const normalizeImage = (img: ShopifyImage | null): ShopifyImage | null =>
  img ? { ...img, url: shopifyImageBase(img.url) } : null

export function normalizeProductImages(product: Product): Product {
  return {
    ...product,
    featuredImage: normalizeImage(product.featuredImage),
    images: { nodes: product.images.nodes.map(n => normalizeImage(n)!) },
    variants: {
      nodes: product.variants.nodes.map(v => ({ ...v, image: normalizeImage(v.image) }))
    }
  }
}
