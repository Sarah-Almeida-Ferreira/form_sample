<script setup lang="ts">
import { Product } from '@/models/Product.model'
import { useProductStore } from '@/stores/product.store'
import { computed, ref, watchEffect } from 'vue'

const productStore = useProductStore()
const isOpen = defineModel({ default: false })
const props = defineProps<{
  product: Product
}>()

const modal = ref<HTMLDialogElement>()
const editingProduct = ref<Product>(new Product())

const title = computed(() => (props.product?.isNew ? 'Criar produto' : 'Editar produto'))

const open = () => {
  editingProduct.value = new Product(props.product)
  modal.value?.showModal()
}
const close = () => {
  isOpen.value = false
  modal.value?.close()
}
const save = () => {
  if (props.product.id) productStore.update(editingProduct.value)
  else productStore.create(editingProduct.value)
  close()
}

watchEffect(() => {
  if (isOpen.value) open()
  else close()
})
</script>

<template>
  <dialog ref="modal" class="modal">
    <div class="modal-header">
      <h1>{{ title }}</h1>
      <button type="button" class="close-button" @click="close">
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </button>
    </div>
    <div class="modal-body">
      <form id="product-register-form" class="form" @submit.prevent="save">
        <div class="modal-body-field-group">
          <div class="field">
            <label for="product-name-input" class="input-label">Nome</label>
            <input id="product-name-input" class="input" v-model="editingProduct.name" required />
          </div>
          <div class="field">
            <label for="product-price-input" class="input-label">Valor</label>
            <input
              id="product-price-input"
              class="input"
              type="number"
              step="0.01"
              required
              v-model="editingProduct.price"
            />
          </div>
        </div>
        <div class="field">
          <label for="product-description-input" class="input-label">Descrição</label>
          <textarea
            id="product-description-input"
            class="input"
            rows="5"
            v-model="editingProduct.description"
          ></textarea>
        </div>
        <div class="field">
          <p class="input-label">Disponível</p>
          <div class="radio-group">
            <span>
              <input
                type="radio"
                :value="true"
                v-model="editingProduct.avaliable"
                id="product-avaliable-radio"
              />
              <label for="product-avaliable-radio" class="radio-label"> Sim </label>
            </span>
            <span>
              <input
                type="radio"
                :value="false"
                v-model="editingProduct.avaliable"
                id="product-unavaliable-radio"
              />
              <label for="product-unavaliable-radio" class="radio-label"> Não </label>
            </span>
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <div class="modal-footer-buttons">
        <button
          type="button"
          id="modal-footer-cancel-button"
          class="button is-secondary"
          @click="close"
        >
          Cancelar
        </button>
        <button
          type="submit"
          id="product-register-form-submit-button"
          form="product-register-form"
          class="button is-primary"
        >
          Salvar
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
@import '../assets/base.css';

.modal {
  padding: 0;
  margin: auto;
  width: 100%;
  height: min-content;
  border-radius: 10px;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border: none;
}

.modal-body,
.modal-header,
.modal-footer {
  padding: 15px;
}

.modal-header {
  border-top: 5px solid hsla(160, 100%, 37%, 1);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: right;
}

.radio-group {
  display: grid;
  grid-template-columns: 50px 50px;
  column-gap: 10px;
}

.form {
  display: grid;
  row-gap: 15px;
}

.modal-footer-buttons {
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 15px;
}

.button {
  width: 100%;
}

@media (min-width: 1024px) {
  .modal {
    width: 80%;
  }

  .modal-body-field-group {
    display: grid;
    grid-template-columns: 75% auto;
    column-gap: 10px;
  }
}
</style>
