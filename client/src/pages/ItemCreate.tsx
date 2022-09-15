import { Heading, HStack, IconButton, useToast, VStack } from "@chakra-ui/react"
import { AxiosError } from "axios"
import { Formik } from "formik"
import { FaArrowLeft as BackIcon } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { authAxios } from "../components/auth"
import { getAxiosErrorDetail } from "../components/common"
import { createItem, ItemType } from "../components/items-api"
import { ItemForm } from "./ItemForm"

function ItemCreatePage() {
  const navigate = useNavigate()
  const axios = useRecoilValue(authAxios)
  const toast = useToast()
  return (
    <VStack>
      <HStack spacing={5}>
        <IconButton
          aria-label="Back"
          icon={<BackIcon/>}
          onClick={() => navigate(-1)}
          variant="ghost"
        />
        <Heading>Create Item</Heading>
      </HStack>
      <Formik
          initialValues={{
            barcode: '',
            name: '',
            unit_price: 0,
            category: '',
            notes: ''
          }}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              const savedItem = await createItem(axios, values as ItemType)
              toast({
                status: "success",
                title: "Saving Item successful",
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
                    title: "Saving Item failed",
                    description: "Please fix submitted fields " + errorFields.join(", "),
                  })
                } else {
                  toast({
                    status: "error",
                    title: "Saving Item failed",
                    description: getAxiosErrorDetail(error),
                  })
                }
              }
            }
          }}
        >
        {() => <ItemForm/>}
      </Formik>
    </VStack>
  )
}

export default ItemCreatePage
