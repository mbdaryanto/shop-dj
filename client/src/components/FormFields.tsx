import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { Field, FieldProps } from "formik"
import { ComponentProps, ReactNode } from "react"

type CommonFieldProp = Omit<ComponentProps<typeof Field>, 'children'> | {
  label?: ReactNode
  isRequired?: boolean
}

export const StringField = ({
  label, isRequired, ...fieldProps
}: CommonFieldProp) => (
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

