<script setup lang="ts">
import ProductModal from '@/components/ProductModal.vue'
import ProductTable from '@/components/ProductTable.vue'
import { Product } from '@/models/Product.model'
import { useProductStore } from '@/stores/product.store'
import { computed, onMounted, ref } from 'vue'

const productStore = useProductStore()

const selectedProduct = ref<Product>(new Product())
const showModal = ref<boolean>(false)

const products = computed(() => productStore.products)

const openModal = (product: Product) => {
  selectedProduct.value = product
  showModal.value = true
}

onMounted(() => {
  productStore.getAll()
})
</script>

<template>
  <main>
    <section class="view-header">
      <h1 class="view-title">Produtos</h1>
      <button type="button" class="button is-primary" @click="() => openModal(new Product())">
        Novo produto
      </button>
    </section>

    <section class="view-body">
      <ProductTable :products="products" @edit="openModal" />
    </section>

    <ProductModal :product="selectedProduct" v-model="showModal" />
  </main>
</template>
