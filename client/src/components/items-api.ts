import { AxiosInstance } from "axios"
import { selector } from "recoil"
import { authAxios } from "./auth"
import { PagedResponse } from "./common"

export interface ItemType {
  id?: number
  barcode: string
  name: string
  unit_price: number
  category: string
  notes: string
}

export interface ItemCategoryType {
  id?: number
  name: string
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

export async function getItemById(axios: AxiosInstance, id: string | number): Promise<ItemType> {
  const response = await axios.get<ItemType>(`/inventory/items/${id}/`)
  return response.data
}

export async function updateItem(axios: AxiosInstance, id: string | number, item: ItemType): Promise<ItemType> {
  const response = await axios.put<ItemType>(`/inventory/items/${id}/`, item)
  return response.data
}

export async function deleteItem(axios: AxiosInstance, id: string | number): Promise<ItemType> {
  const response = await axios.delete<ItemType>(`/inventory/items/${id}/`)
  return response.data
}

export async function getItemCategoryList(axios: AxiosInstance): Promise<PagedResponse<ItemCategoryType[]>> {
  const response = await axios.get<PagedResponse<ItemCategoryType[]>>(`/inventory/categories/`)
  return response.data
}

export const itemCategoryList = selector<ItemCategoryType[]>({
  key: 'itemCategoryList',
  get: async ({ get }) => {
    const axios = get(authAxios)
    const response = await getItemCategoryList(axios)
    return response.results
  },
})
