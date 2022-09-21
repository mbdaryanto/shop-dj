import { Button, Grid, GridItem, HStack, IconButton, Text, useDisclosure, useToast, VStack } from "@chakra-ui/react"
import { AxiosError } from "axios"
import { Form, Formik } from "formik"
import { sum, toNumber } from "lodash"
import { nanoid } from "nanoid"
import { Fragment } from "react"
import { useNavigate } from "react-router-dom"
import { Asserts, TypeOf } from "yup"
import BrowseItem from "../components/BrowseItem"
import { getAxiosErrorDetail, nf } from "../components/common"
import { DateField, StringField } from "../components/FormFields"
import { AddIcon, DeleteIcon } from "../components/Icons"
import { purchaseCreateUpdateSchema } from "../components/purchase-api"

function PurchaseForm({
  initialValues, onSave
}: {
  initialValues: TypeOf<typeof purchaseCreateUpdateSchema>
  onSave: (values: Asserts<typeof purchaseCreateUpdateSchema>) => Promise<void>,
}) {
  const toast = useToast()
  const navigate = useNavigate()
  const browseItemDisclosure = useDisclosure()
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={purchaseCreateUpdateSchema}
      onSubmit={async (values, { setErrors }) => {
        try {
          await onSave(await purchaseCreateUpdateSchema.validate(values))
          toast({
            status: "success",
            title: "Saving purchase successful",
          })
          navigate(-1)
        } catch (error) {
          const axiosError = error as AxiosError
          if (axiosError.isAxiosError) {
            console.log(axiosError.response!.data!)
            if (axiosError.response!.status === 400) {
              const errorFields = Object.keys(axiosError.response!.data!)
              const errors = Object.fromEntries(
                Object.entries(axiosError.response!.data!)
                  .map(([key, value]) => [key, value.join("\n")])
              )

              setErrors(errors)
              toast({
                status: "error",
                title: "Saving purchase failed",
                description: "Please fix following fields " + errorFields.join(", "),
              })
            } else {
              toast({
                status: "error",
                title: "Saving purchase failed",
                description: getAxiosErrorDetail(error),
              })
            }
          }
        }
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <VStack as={Form} spacing={4}>
          <StringField name="code" label="Code" isRequired/>
          <DateField name="date" label="Date" isRequired/>
          <StringField name="supplier" label="Supplier" isRequired/>
          <Text textAlign="left" w="100%" fontWeight="semibold">Items Detail</Text>
          <Grid templateColumns="3fr 1fr 2fr 30px" gap={3}>
            {values.details!.map((row, index) => (
              <Fragment key={row.id || row._id}>
                <GridItem>
                  <Text>
                    <Text as="span" fontWeight="bold">{row.item.barcode}{' '}</Text>
                    <Text as="span">{row.item.name}{' '}</Text>
                    <Text as="span">[{row.item.category}]</Text>
                  </Text>
                  <Text>
                    <Text as="span" fontWeight="bold">Subtotal{' '}</Text>
                    <Text as="span">{nf.format(toNumber(row.quantity) * toNumber(row.unit_price))}</Text>
                  </Text>
                </GridItem>
                <GridItem>
                  <StringField name={`details[${index}].quantity`} isRequired/>
                </GridItem>
                <GridItem>
                  <StringField name={`details[${index}].unit_price`} isRequired/>
                </GridItem>
                <GridItem>
                  <IconButton
                    aria-label="Remove this item from purchase"
                    icon={<DeleteIcon/>}
                    color="red"
                    onClick={() => {
                      setFieldValue('details', values.details!.filter(_row => _row !== row))
                    }}
                    variant="ghost"
                  />
                </GridItem>
              </Fragment>
            ))}
          </Grid>

          <HStack spacing={2}>
            <Text>
              <Text as="span" fontWeight="bold">Total</Text>
              {' '}
              {nf.format(sum(values.details!
                .map(row => toNumber(row.quantity) * toNumber(row.unit_price))))}
            </Text>
            <Button colorScheme="blue" leftIcon={<AddIcon/>} onClick={() => browseItemDisclosure.onOpen()}>Add Item</Button>
            <Button type="submit" colorScheme="green" isLoading={isSubmitting}>Save</Button>
          </HStack>

          <BrowseItem
            isOpen={browseItemDisclosure.isOpen}
            onClose={browseItemDisclosure.onClose}
            onSelect={(item) => {
              setFieldValue(
                'details',
                [...values.details!, {
                  _id: nanoid(),
                  item: item,
                  quantity: 1,
                  unit_price: item.unit_price,
                }]
              )
              browseItemDisclosure.onClose()
            }}
          />
        </VStack>
      )}
    </Formik>
  )
}

export default PurchaseForm
