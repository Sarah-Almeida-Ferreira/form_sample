<script setup lang="ts">
import { Product } from '@/models/Product.model'
import { computed, ref } from 'vue'

defineEmits(['edit'])

const props = defineProps<{
  products: Product[]
}>()

const sort = ref({ key: 'price', order: 'asc' })

const sortIsAsc = computed(() => sort.value.order === 'asc')
const sortIsName = computed(() => sort.value.key === 'name')
const sortOrder = computed(() => (sortIsAsc.value ? 'Crescente' : 'Decrescente'))
const sortedProducts = computed(() => {
  const sorted = [...props.products].sort((a, b) => {
    if (sort.value.key === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sort.value.key === 'price') {
      return a.price - b.price
    }
    return 0
  })

  if (sort.value.order === 'desc') {
    return sorted.reverse()
  }
  return sorted
})

const sortBy = (key: string) => {
  if (sort.value.key === key) {
    sort.value.order = sort.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value.key = key
    sort.value.order = 'asc'
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>
          <div class="table-header-grid">
            <button
              type="button"
              id="order-by-name-button"
              class="ordering-button table-action-button"
              @click="() => sortBy('name')"
              :title="`Ordenar por nome (${sortOrder})`"
            >
              <font-awesome-icon
                icon="fa-solid fa-caret-up"
                :class="{ 'is-active': sortIsName && sortIsAsc }"
              />
              <font-awesome-icon
                icon="fa-solid fa-caret-down"
                :class="{ 'is-active': sortIsName && !sortIsAsc }"
              />
            </button>
            Nome
          </div>
        </th>
        <th>
          <div class="table-header-grid">
            <button
              type="button"
              id="order-by-price-button"
              class="ordering-button table-action-button"
              @click="() => sortBy('price')"
              :title="`Ordenar por preço (${sortOrder})`"
            >
              <font-awesome-icon
                icon="fa-solid fa-caret-up"
                :class="{ 'is-active': !sortIsName && sortIsAsc }"
              />
              <font-awesome-icon
                icon="fa-solid fa-caret-down"
                :class="{ 'is-active': !sortIsName && !sortIsAsc }"
              />
            </button>
            Valor
          </div>
        </th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in sortedProducts" :key="product.id">
        <td>{{ product.name }}</td>
        <td>{{ formatCurrency(product.price) }}</td>
        <td>
          <button
            type="button"
            title="Editar produto"
            class="table-action-button"
            @click="$emit('edit', product)"
          >
            <font-awesome-icon icon="fa-solid fa-pencil" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  width: 100%;
}

th,
td {
  padding: 8px;
  text-align: left;
  border: none;
}

th {
  font-weight: bold;
}

th,
td {
  background-color: var(--color-background-soft);
}
th:first-child,
td:first-child {
  width: 70%;
}
th:last-child,
td:last-child {
  width: 70px;
  text-align: center;
}

.table-action-button {
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: var(--color-text);
}

.table-action-button:hover {
  transform: scale(1.1);
  color: white;
}

.table-header-grid {
  display: grid;
  grid-template-columns: 15px auto;
  column-gap: 10px;
  font-weight: bold;
}

.ordering-button {
  display: grid;
  cursor: pointer;
  grid-template-rows: 8px 8px;
}

.is-active {
  color: var(--color-primary);
}
</style>
