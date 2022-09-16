import { Center, CircularProgress, Heading, HStack, IconButton, useToast, VStack } from "@chakra-ui/react"
import { AxiosError } from "axios"
import { Formik } from "formik"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { authAxios } from "../components/auth"
import { getAxiosErrorDetail } from "../components/common"
import { getItemById, itemSchema, ItemType, updateItem } from "../components/items-api"
import { BackIcon } from "../components/Icons"
import { ItemForm } from "./ItemForm"

function ItemUpdatePage() {
  const navigate = useNavigate()
  const axios = useRecoilValue(authAxios)
  const [isLoading, setLoading] = useState(false)
  const [item, setItem] = useState<ItemType>()
  const toast = useToast()
  const { id } = useParams()

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    getItemById(axios, id!).then(
      (response) => {
        if (!isMounted) return
        setItem(response)
        setLoading(false)
      },
      (error) => {
        if (!isMounted) return
        setItem(undefined)
        setLoading(false)
        toast({
          status: "error",
          title: "Error Loading",
          description: getAxiosErrorDetail(error)
        })
      }
    )
    return () => {
      isMounted = false
    }
  }, [axios, id])

  if (isLoading) {
    return (
      <Center w="100%" h="80vh">
        <CircularProgress isIndeterminate/>
      </Center>
    )
  }

  if (!item) {
    return (
      <Center w="100%" h="80vh">
        <HStack spacing={5}>
        <IconButton
          aria-label="Back"
          icon={<BackIcon/>}
          onClick={() => navigate(-1)}
          variant="ghost"
        />
        <Heading>Ooops Item not found!</Heading>
      </HStack>
      </Center>
    )
  }

  return (
    <VStack>
      <HStack spacing={5}>
        <IconButton
          aria-label="Back"
          icon={<BackIcon/>}
          onClick={() => navigate(-1)}
          variant="ghost"
        />
        <Heading>Update Item</Heading>
      </HStack>
      <Formik
          initialValues={item!}
          validationSchema={itemSchema}
          onSubmit={async (values, { setErrors }) => {
            try {
              const savedItem = await updateItem(axios, id!, values)
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
                    description: "Please fix following fields " + errorFields.join(", "),
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

export default ItemUpdatePage
