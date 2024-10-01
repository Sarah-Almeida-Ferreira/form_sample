interface IProduct {
  id?: string
  description?: string
  name?: string
  price?: number
  avaliable?: boolean
}

export class Product {
  id: string = ''
  description: string = ''
  name: string = ''
  price: number = 0
  avaliable: boolean = false

  constructor(options?: IProduct) {
    Object.assign(this, options)
  }

  get isNew() {
    return !this.id
  }
}
