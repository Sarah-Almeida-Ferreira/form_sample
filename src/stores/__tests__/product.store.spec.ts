import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '@/stores/product.store'
import axios from 'axios'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { Product } from '@/models/Product.model'

vi.mock('axios')

describe('Product Store', () => {
  let store: ReturnType<typeof useProductStore>
  const mockProducts = [
    new Product({ id: '1', name: 'Produto 1', price: 100 }),
    new Product({ id: '2', name: 'Produto 2', price: 200 })
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useProductStore()
  })

  it('deve buscar todos os produtos corretamente', async () => {
    axios.get = vi.fn().mockResolvedValueOnce({ data: mockProducts })

    await store.getAll()

    expect(store.products).toEqual(mockProducts)
    expect(axios.get).toHaveBeenCalledWith(
      'https://66fb033c8583ac93b40aa484.mockapi.io/api/product'
    )
  })

  it('deve buscar um produto por ID corretamente', async () => {
    const productId = '1'
    const mockProduct = { id: productId, name: 'Produto 1', price: 100 }

    axios.get = vi.fn().mockResolvedValueOnce({ data: mockProduct })

    await store.getById(productId)

    expect(store.product).toEqual(mockProduct)
    expect(axios.get).toHaveBeenCalledWith(
      `https://66fb033c8583ac93b40aa484.mockapi.io/api/product/${productId}`
    )
  })

  it('deve criar um novo produto corretamente', async () => {
    const newProduct = new Product({ id: '3', name: 'Produto 3', price: 300 })

    axios.post = vi.fn().mockResolvedValueOnce({ data: newProduct })

    await store.create(newProduct)

    expect(store.products).toContainEqual(newProduct)
    expect(axios.post).toHaveBeenCalledWith(
      'https://66fb033c8583ac93b40aa484.mockapi.io/api/product',
      newProduct
    )
  })

  it('deve atualizar um produto corretamente', async () => {
    const updatedProduct = new Product({ id: '1', name: 'Produto Atualizado', price: 150 })

    store.products = [...mockProducts]

    axios.put = vi.fn().mockResolvedValueOnce({ data: updatedProduct })

    await store.update(updatedProduct)

    expect(store.products).toContainEqual(updatedProduct)
    expect(store.products.find((p) => p.id === '1')).toEqual(updatedProduct)
    expect(axios.put).toHaveBeenCalledWith(
      `https://66fb033c8583ac93b40aa484.mockapi.io/api/product/${updatedProduct.id}`,
      updatedProduct
    )
  })

  it('deve lidar com erro ao buscar todos os produtos', async () => {
    axios.get = vi.fn().mockRejectedValueOnce(new Error('Erro ao buscar produtos'))

    await store.getAll()

    expect(store.products).toEqual([])
  })

  it('deve lidar com erro ao buscar um produto por ID', async () => {
    const productId = '1'
    axios.get = vi.fn().mockRejectedValueOnce(new Error('Erro ao buscar produto'))

    await store.getById(productId)

    expect(store.product).toBeNull()
  })

  it('deve lidar com erro ao criar um produto', async () => {
    const newProduct = new Product({ id: '3', name: 'Produto 3', price: 300 })
    axios.get = vi.fn().mockRejectedValueOnce(new Error('Erro ao criar produto'))

    await store.create(newProduct)

    expect(store.products).not.toContainEqual(newProduct)
  })

  it('deve lidar com erro ao atualizar um produto', async () => {
    const updatedProduct = new Product({ id: '1', name: 'Produto Atualizado', price: 150 })

    store.products = [...mockProducts]
    axios.get = vi.fn().mockRejectedValueOnce(new Error('Erro ao atualizar produto'))

    await store.update(updatedProduct)

    expect(store.products.find((p) => p.id === '1')).toEqual(mockProducts[0])
  })
})
