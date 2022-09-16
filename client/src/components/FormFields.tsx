import { FormControl, FormErrorMessage, FormLabel, Input, Select } from "@chakra-ui/react"
import { Field, FieldProps } from "formik"
import { ComponentProps, ReactNode, useEffect } from "react"
import { selector, useRecoilValue } from "recoil"
import { authAxios } from "./auth"
import { getItemCategoryList, itemCategoryList, ItemCategoryType } from "./items-api"

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

// interface DropDownFieldProps extends CommonFieldProps {
//   children: Pick<ComponentProps<typeof Select>, 'children'>
// }

// export const DropDownField = ({
//   label, isRequired, children, ...fieldProps
// }: DropDownFieldProps) => (
//   <Field {...fieldProps}>
//     {({ field, meta }: FieldProps<string>) => (
//       <FormControl isRequired={isRequired} isInvalid={meta.touched && !!meta.error}>
//         {!!label && <FormLabel>{label}</FormLabel>}
//         <Select {...field}>
//           {children}
//         </Select>
//         <FormErrorMessage>{meta.error}</FormErrorMessage>
//       </FormControl>
//     )}
//   </Field>
// )

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
