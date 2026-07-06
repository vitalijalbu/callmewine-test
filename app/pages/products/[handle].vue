<script setup lang="ts">
const storefront = useStorefront()

const { data } = await storefront.request(
  `#graphql
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      description
    }
  }
`,
  {
    variables: {
      id: 'gid://shopify/Product/7171746234415',
    },
  }
)
</script>

<template>
  <div v-if="data">
    <h1>{{ data.product.title }}</h1>

    <p>{{ data.product.description }}</p>
  </div>
</template>
