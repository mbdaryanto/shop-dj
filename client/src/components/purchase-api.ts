import { AxiosInstance } from "axios"
import { roundToNearestMinutesWithOptions } from "date-fns/fp"
import { object, string, number, date, array, Asserts } from "yup"
import { PagedResponse } from "./common"
import { formatDate } from "./DatePicker"
import { itemSchema, ItemType } from "./items-api"

export interface PurchaseType {
  id?: number
  code: string
  date: string
  supplier: string
}

export const purchaseDCreateUpdateSchema = object({
  id: number().integer().optional(),
  _id: string().optional(),
  item: itemSchema.required(),
  quantity: number().required().min(0),
  unit_price: number().required().min(0),
})

export const purchaseCreateUpdateSchema = object({
  code: string().required().max(30),
  date: date().required(),
  supplier: string().required().max(200),
  details: array().of(purchaseDCreateUpdateSchema).ensure(),
})

interface PurchaseDRetrieveType {
  id: number,
  item: ItemType,
  quantity: number,
  unit_price: number,
}

export interface PurchaseRetrieveType extends PurchaseType {
  details: PurchaseDRetrieveType[]
}

export async function getPurchaseList(axios: AxiosInstance, searchParams: URLSearchParams): Promise<PagedResponse<PurchaseType[]>> {
  const response = await axios.get<PagedResponse<PurchaseType[]>>(`/inventory/purchase/?${searchParams.toString()}`)
  return response.data
}

const purchaseDataFormat = ({ details, date, ...restPurchase }: Asserts<typeof purchaseCreateUpdateSchema>) => ({
  ...restPurchase,
  'date': formatDate(date),
  'details': details.map(({ item, ...restDetail }) => ({ ...restDetail, 'item': item.id}))
})

export async function createPurchase(axios: AxiosInstance, purchase: Asserts<typeof purchaseCreateUpdateSchema>): Promise<Asserts<typeof purchaseCreateUpdateSchema>> {
  const response = await axios.post<Asserts<typeof purchaseCreateUpdateSchema>>('/inventory/purchase/', purchaseDataFormat(purchase))
  console.log(response.data)
  return response.data
}

export async function getPurchaseById(axios: AxiosInstance, id: string | number): Promise<PurchaseRetrieveType> {
  const response = await axios.get<PurchaseRetrieveType>(`/inventory/purchase/${id}/`)
  return response.data
}

export async function updatePurchase(axios: AxiosInstance, id: string | number, purchase: Asserts<typeof purchaseCreateUpdateSchema>): Promise<Asserts<typeof purchaseCreateUpdateSchema>> {
  const response = await axios.put<Asserts<typeof purchaseCreateUpdateSchema>>(`/inventory/purchase/${id}/`, purchaseDataFormat(purchase))
  return response.data
}

export async function deletePurchase(axios: AxiosInstance, id: string | number): Promise<void> {
  const response = await axios.delete<void>(`/inventory/purchase/${id}/`)
  return response.data
}
