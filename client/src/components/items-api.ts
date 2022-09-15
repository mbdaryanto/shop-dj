import { AxiosInstance } from "axios"
import { PagedResponse } from "./common"

export interface ItemType {
  id?: number
  barcode: string
  name: string
  unit_price: number
  category: string
  notes: string
}

export async function getItemList(axios: AxiosInstance, searchParams: URLSearchParams): Promise<PagedResponse<ItemType[]>> {
  const response = await axios.get<PagedResponse<ItemType[]>>(`/inventory/items/?${searchParams.toString()}`)
  return response.data
}

export async function createItem(axios: AxiosInstance, item: ItemType): Promise<ItemType> {
  const response = await axios.post<ItemType>('/inventory/items/', item)
  console.log(response.data)
  return response.data
}
