import { Center, CircularProgress, Heading, HStack, IconButton, useToast, VStack } from "@chakra-ui/react"
import { useNavigate, useParams } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { authAxios } from "../components/auth"
import { BackIcon } from "../components/Icons"
import PurchaseForm from "./PurchaseForm"
import { updatePurchase, getPurchaseById, purchaseCreateUpdateSchema } from "../components/purchase-api"
import { useEffect, useState } from "react"
import { getAxiosErrorDetail } from "../components/common"
import { TypeOf } from "yup"

function PurchaseUpdatePage() {
  const navigate = useNavigate()
  const axios = useRecoilValue(authAxios)
  const [isLoading, setLoading] = useState(false)
  const [purchase, setPurchase] = useState<TypeOf<typeof purchaseCreateUpdateSchema>>()
  const toast = useToast()

  const { id } = useParams()

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    getPurchaseById(axios, id!).then(
      (response) => {
        if (!isMounted) return
        setPurchase(purchaseCreateUpdateSchema.validateSync(response))
        setLoading(false)
      },
      (error) => {
        if (!isMounted) return
        setPurchase(undefined)
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

  if (!purchase) {
    return (
      <Center w="100%" minH="50vh">
        <HStack spacing={5}>
        <IconButton
          aria-label="Back"
          icon={<BackIcon/>}
          onClick={() => navigate(-1)}
          variant="ghost"
        />
        <Heading>Ooops Purchase not found!</Heading>
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
        <Heading>Update Purchase</Heading>
      </HStack>
      <PurchaseForm
        initialValues={purchase}
        onSave={async (values) => {
          await updatePurchase(axios, id!, values)
        }}
      />
    </VStack>
  )
}

export default PurchaseUpdatePage
