import { Button, FormControl, HStack, Input } from "@chakra-ui/react"
import { Field, Form, Formik, FieldProps } from "formik"


const SearchBox = ({
  search, onSearch,
}: {
  search: string
  onSearch: (query: string) => Promise<void>
}) => (
  <Formik
    initialValues={{
      search
    }}
    validate={() => {}}
    onSubmit={async (values, {setSubmitting}) => {
      await onSearch(values.search)
      setSubmitting(false)
    }}
  >
    {({ isSubmitting }) => (
      <Form>
        <HStack spacing={2} w="100%">
          <Field name="search">
            {({ field }: FieldProps<string>) => (
              <FormControl>
                <Input {...field} />
              </FormControl>
            )}
          </Field>
          <Button type="submit" isLoading={isSubmitting}>Search</Button>
        </HStack>
      </Form>
    )}
  </Formik>
)

export default SearchBox
