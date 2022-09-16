import { FormControl, FormErrorMessage, FormLabel, Input, Select, Textarea } from "@chakra-ui/react"
import { Field, FieldProps } from "formik"
import { ComponentProps, ReactNode } from "react"
import { useRecoilValue } from "recoil"
import { DateInput, formatDate } from "./DatePicker"
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

export const DateField = ({
  label, isRequired, ...fieldProps
}: CommonFieldProps) => (
  <Field {...fieldProps}>
    {({ field, meta, form }: FieldProps<string>) => {
      let value: string = ''
      if (typeof field.value === "string") {
        value = field.value
      } else if (typeof field.value === "object" && (field.value as any) instanceof Date) {
        value = formatDate(field.value)
      }
      return (
        <FormControl isRequired={isRequired} isInvalid={meta.touched && !!meta.error}>
          {!!label && <FormLabel>{label}</FormLabel>}
          <DateInput value={value} onChange={(value) => form.setFieldValue(field.name, value)} />
          <FormErrorMessage>{meta.error}</FormErrorMessage>
        </FormControl>
      )
    }}
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
