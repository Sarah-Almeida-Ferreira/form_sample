import { defineStore } from 'pinia'
import axios from 'axios'
import type { Product } from '@/models/Product.model'

const BASE_API = 'https://66fb033c8583ac93b40aa484.mockapi.io/api/product'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    product: null
  }),
  actions: {
    async getAll() {
      try {
        const response = await axios.get(BASE_API)
        this.products = response.data
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
      }
    },
    async getById(id: string) {
      try {
        const response = await axios.get(`${BASE_API}/${id}`)
        this.product = response.data
      } catch (error) {
        console.error('Erro ao buscar produto:', error)
      }
    },
    async create(productData: Product) {
      try {
        const { data } = await axios.post(BASE_API, productData)
        this.products.push(data)
      } catch (error) {
        console.error('Erro ao criar produto:', error)
      }
    },
    async update(productData: Product) {
      try {
        const response = await axios.put(`${BASE_API}/${productData.id}`, productData)
        const editingProduct = this.products.find(
          (product: Product) => product.id === productData.id
        )
        if (editingProduct) Object.assign(editingProduct, response.data)
      } catch (error) {
        console.error('Erro ao atualizar produto:', error)
      }
    }
  }
})
