import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import ProductTable from '@/components/ProductTable.vue'
import ProductModal from '@/components/ProductModal.vue'
import { useProductStore } from '@/stores/product.store'
import ProductComponent from '../ProductView.vue'
import { Product } from '@/models/Product.model'

vi.mock('@/stores/product.store', () => ({
  useProductStore: vi.fn().mockReturnValue({
    products: [],
    getAll: vi.fn()
  })
}))

describe('ProductComponent', () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.close = vi.fn()
    HTMLDialogElement.prototype.showModal = vi.fn()
  })

  it('deve renderizar corretamente', () => {
    const wrapper = mount(ProductComponent)

    expect(wrapper.find('h1').text()).toBe('Produtos')
    expect(wrapper.findComponent(ProductTable).exists()).toBe(true)
    expect(wrapper.findComponent(ProductModal).exists()).toBe(true)
  })

  it('deve abrir o modal ao clicar no botão "Novo produto"', async () => {
    const wrapper = mount(ProductComponent)

    expect(wrapper.findComponent(ProductModal).props('modelValue')).toBe(false)

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(wrapper.findComponent(ProductModal).props('modelValue')).toBe(true)
  })

  it('deve abrir o modal ao clicar no botão de editar na tabela', async () => {
    const wrapper = mount(ProductComponent)
    const wrapperVm = wrapper.vm as any

    const product = new Product({ id: '1', name: 'Product 1' })

    wrapper.findComponent(ProductTable).vm.$emit('edit', product)

    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent(ProductModal).props('modelValue')).toBe(true)
    expect(wrapperVm.selectedProduct).toEqual(product)
  })

  it('deve chamar productStore.getAll() quando o componente for montado', () => {
    const productStore = useProductStore()
    vi.spyOn(productStore, 'getAll')

    mount(ProductComponent)

    expect(productStore.getAll).toHaveBeenCalledOnce()
  })
})
