import { AxiosInstance } from "axios"
import { object, string, number, date, array, Asserts } from "yup"
import { PagedResponse } from "./common"
import { ItemType } from "./items-api"

export interface PurchaseType {
  id?: number
  code: string
  date: string
}

export const purchaseDCreateUpdateSchema = object({
  id: number().integer().optional(),
  item: number().integer(),
  quantity: number().required().min(0),
  unit_price: number().required().min(0),
})

export const purchaseSchema = object({
  id: number().integer().optional(),
  code: string().required().max(30),
  date: date().required(),
})

export const purchaseCreateUpdateSchema = purchaseSchema.shape({
  details: array().of(purchaseDCreateUpdateSchema).ensure(),
})

interface PurchaseDRetrieveType {
  id: number,
  item: ItemType,
  quantity: number,
  unit_price: number,
}

interface PurchaseRetrieveType extends PurchaseType {
  details: PurchaseDRetrieveType[]
}

export async function getPurchaseList(axios: AxiosInstance, searchParams: URLSearchParams): Promise<PagedResponse<PurchaseType[]>> {
  const response = await axios.get<PagedResponse<PurchaseType[]>>(`/inventory/purchase/?${searchParams.toString()}`)
  return response.data
}

export async function createPurchase(axios: AxiosInstance, purchase: Asserts<typeof purchaseCreateUpdateSchema>): Promise<Asserts<typeof purchaseCreateUpdateSchema>> {
  const response = await axios.post<Asserts<typeof purchaseCreateUpdateSchema>>('/inventory/purchase/', purchase)
  console.log(response.data)
  return response.data
}

export async function getPurchaseById(axios: AxiosInstance, id: string | number): Promise<PurchaseRetrieveType> {
  const response = await axios.get<PurchaseRetrieveType>(`/inventory/purchase/${id}/`)
  return response.data
}

export async function updatePurchase(axios: AxiosInstance, id: string | number, purchase: Asserts<typeof purchaseCreateUpdateSchema>): Promise<Asserts<typeof purchaseCreateUpdateSchema>> {
  const response = await axios.put<Asserts<typeof purchaseCreateUpdateSchema>>(`/inventory/purchase/${id}/`, purchase)
  return response.data
}

export async function deletePurchase(axios: AxiosInstance, id: string | number): Promise<void> {
  const response = await axios.delete<void>(`/inventory/purchase/${id}/`)
  return response.data
}
