import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ProductTable from '../ProductTable.vue'
import { Product } from '@/models/Product.model'

describe('ProductTable', () => {
  const sampleProducts = [
    new Product({ id: '1', name: 'Produto A', price: 100 }),
    new Product({ id: '2', name: 'Produto B', price: 200 }),
    new Product({ id: '3', name: 'Produto C', price: 150 })
  ]

  it('deve exibir a lista de produtos corretamente', () => {
    const wrapper = mount(ProductTable, {
      props: {
        products: sampleProducts
      }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(3)
    expect(rows[0].get('td').text()).toContain('Produto A')
    expect(rows[1].get('td').text()).toContain('Produto C')
    expect(rows[2].get('td').text()).toContain('Produto B')
  })

  it('deve ordenar os produtos por nome em ordem crescente e decrescente', async () => {
    const wrapper = mount(ProductTable, {
      props: {
        products: sampleProducts
      }
    })

    await wrapper.find('#order-by-name-button').trigger('click')

    let rows = wrapper.findAll('tbody tr')
    expect(rows[0].text()).toContain('Produto A')
    expect(rows[1].text()).toContain('Produto B')
    expect(rows[2].text()).toContain('Produto C')

    await wrapper.find('#order-by-name-button').trigger('click')

    rows = wrapper.findAll('tbody tr')
    expect(rows[0].text()).toContain('Produto C')
    expect(rows[1].text()).toContain('Produto B')
    expect(rows[2].text()).toContain('Produto A')
  })

  it('deve ordenar os produtos por preço em ordem crescente e decrescente', async () => {
    const wrapper = mount(ProductTable, {
      props: {
        products: sampleProducts
      }
    })

    await wrapper.find('#order-by-price-button').trigger('click')

    let rows = wrapper.findAll('tbody tr')
    expect(rows[0].text()).toContain('Produto B')
    expect(rows[1].text()).toContain('Produto C')
    expect(rows[2].text()).toContain('Produto A')

    await wrapper.find('#order-by-price-button').trigger('click')

    rows = wrapper.findAll('tbody tr')
    expect(rows[0].text()).toContain('Produto A')
    expect(rows[1].text()).toContain('Produto C')
    expect(rows[2].text()).toContain('Produto B')
  })

  it('deve formatar os preços corretamente em BRL', () => {
    const wrapper = mount(ProductTable, {
      props: {
        products: sampleProducts
      }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows[0].findAll('td')[1].text()).toBe('R$ 100,00')
    expect(rows[1].findAll('td')[1].text()).toBe('R$ 150,00')
    expect(rows[2].findAll('td')[1].text()).toBe('R$ 200,00')
  })

  it('deve emitir o evento "edit" ao clicar no botão de editar', async () => {
    const wrapper = mount(ProductTable, {
      props: {
        products: sampleProducts
      }
    })

    const editButtons = wrapper.findAll('button[title="Editar produto"]')

    await editButtons[0].trigger('click')

    expect(wrapper.emitted('edit')).toHaveLength(1)
    expect(wrapper.emitted('edit')![0]).toEqual([sampleProducts[0]])
  })
})
