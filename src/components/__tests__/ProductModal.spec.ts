import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import ProductModal from '../ProductModal.vue'
import { useProductStore } from '@/stores/product.store'
import { Product } from '@/models/Product.model'

vi.mock('@/stores/product.store', () => ({
  useProductStore: vi.fn().mockReturnValue({
    create: vi.fn(),
    update: vi.fn(),
    products: []
  })
}))

describe('ProductModal', () => {
  let productStore: any

  beforeAll(() => {
    HTMLDialogElement.prototype.close = vi.fn()
    HTMLDialogElement.prototype.showModal = vi.fn()
  })

  beforeEach(() => {
    productStore = useProductStore()
  })

  it('deve exibir o modal com o título correto para criação', async () => {
    const wrapper = mount(ProductModal, {
      props: {
        product: new Product()
      }
    })

    expect(wrapper.find('h1').text()).toBe('Criar produto')
  })

  it('deve exibir o modal com o título correto para edição', async () => {
    const wrapper = mount(ProductModal, {
      props: {
        product: new Product({ id: '123' })
      }
    })

    expect(wrapper.find('h1').text()).toBe('Editar produto')
  })

  it('deve abrir o modal quando isOpen é true', async () => {
    const wrapper = mount(ProductModal, {
      props: {
        product: new Product({ id: '123' })
      }
    })
    const dialogElement: HTMLDialogElement = wrapper.find('dialog').element

    await wrapper.setProps({ ...wrapper.props, modelValue: true })

    expect(dialogElement.showModal).toHaveBeenCalledOnce()
  })

  it('deve fechar o modal quando isOpen é false', async () => {
    const wrapper = mount(ProductModal, {
      props: {
        product: new Product({ id: '123' })
      }
    })

    const dialogElement = wrapper.find('dialog').element as HTMLDialogElement
    dialogElement.close = vi.fn()

    await wrapper.setValue(false)

    expect(dialogElement.close).toHaveBeenCalledOnce()
  })

  it('deve chamar `create` ao salvar um novo produto', async () => {
    const wrapper = mount(ProductModal, {
      props: {
        product: new Product()
      }
    })

    await wrapper.find('#product-name-input').setValue('Produto Teste')
    await wrapper.find('#product-price-input').setValue(100)
    await wrapper.find('#product-description-input').setValue('Descrição Teste')
    await wrapper.find('#product-avaliable-radio').trigger('change')

    await wrapper.find('form').trigger('submit')

    expect(productStore.create).toHaveBeenCalledWith({
      name: 'Produto Teste',
      price: 100,
      description: 'Descrição Teste',
      avaliable: true,
      id: ''
    })
  })

  it('deve chamar `update` ao salvar um produto existente', async () => {
    const editingProduct = {
      id: '123',
      name: 'Produto Editado',
      price: 200,
      description: 'Nova Descrição',
      avaliable: false
    }
    const wrapper = mount(ProductModal, {
      props: {
        modelValue: true,
        product: new Product({ id: '123', name: 'Produto Existente' })
      }
    })

    await wrapper.vm.$nextTick()

    await wrapper.find('#product-name-input').setValue(editingProduct.name)
    await wrapper.find('#product-price-input').setValue(editingProduct.price)
    await wrapper.find('#product-description-input').setValue(editingProduct.description)

    await wrapper.vm.$nextTick()

    await wrapper.find('form').trigger('submit')

    expect(productStore.update).toHaveBeenCalledWith(editingProduct)
  })
})
