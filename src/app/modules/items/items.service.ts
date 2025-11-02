import { Items } from './items.models'

const getItemsByOrderId = async (id: string) => {
  const result = await Items.find({ order: id }).populate([{ path: 'product' }])
  return result
}

export const ItemsService = {
  getItemsByOrderId,
}
