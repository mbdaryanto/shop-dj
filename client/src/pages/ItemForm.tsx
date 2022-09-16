import { Button, VStack } from "@chakra-ui/react"
import { Form, useFormikContext } from "formik"
import { ItemCategoryField, StringField, TextareaField } from "../components/FormFields"

export function ItemForm() {
  const { isSubmitting } = useFormikContext()
  return (
    <VStack as={Form} spacing={4}>
      <StringField name="barcode" label="Barcode" isRequired/>
      <StringField name="name" label="Name" isRequired/>
      <StringField name="unit_price" label="Unit Price" isRequired/>
      <ItemCategoryField name="category" label="Category" isRequired/>
      <TextareaField name="notes" label="Notes"/>
      <Button type="submit" colorScheme="green" isLoading={isSubmitting}>Save</Button>
    </VStack>
  )
}
