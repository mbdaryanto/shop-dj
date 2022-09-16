import { FormControl, FormErrorMessage, FormLabel, Input, Select, Textarea } from "@chakra-ui/react"
import { Field, FieldProps } from "formik"
import { ComponentProps, ReactNode } from "react"
import { useRecoilValue } from "recoil"
import { itemCategoryList } from "./items-api"

interface CommonFieldProps extends Omit<ComponentProps<typeof Field>, 'children'> {
  label?: ReactNode
  isRequired?: boolean
}

export const StringField = ({
  label, isRequired, ...fieldProps
}: CommonFieldProps) => (
  <Field {...fieldProps}>
    {({ field, meta }: FieldProps<string>) => (
      <FormControl isRequired={isRequired} isInvalid={meta.touched && !!meta.error}>
        {!!label && <FormLabel>{label}</FormLabel>}
        <Input {...field}/>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    )}
  </Field>
)

export const TextareaField = ({
  label, isRequired, ...fieldProps
}: CommonFieldProps) => (
  <Field {...fieldProps}>
    {({ field, meta }: FieldProps<string>) => (
      <FormControl isRequired={isRequired} isInvalid={meta.touched && !!meta.error}>
        {!!label && <FormLabel>{label}</FormLabel>}
        <Textarea {...field}/>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    )}
  </Field>
)

export function ItemCategoryField({
  label, isRequired, ...fieldProps
}: CommonFieldProps) {
  const itemCategories = useRecoilValue(itemCategoryList)

  return (
    <Field {...fieldProps}>
      {({ field, meta }: FieldProps<string>) => (
        <FormControl isRequired={isRequired} isInvalid={meta.touched && !!meta.error}>
          {!!label && <FormLabel>{label}</FormLabel>}
          <Select {...field}>
            {itemCategories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </Select>
          <FormErrorMessage>{meta.error}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  )
}
