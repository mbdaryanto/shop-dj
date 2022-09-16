import { Heading, HStack, IconButton, useToast, VStack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { authAxios } from "../components/auth"
import { BackIcon } from "../components/Icons"
import PurchaseForm from "./PurchaseForm"
import { createPurchase } from "../components/purchase-api"
import { formatDate } from "../components/DatePicker"

function PurchaseCreatePage() {
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
        <Heading>Create Purchase</Heading>
      </HStack>
      <PurchaseForm
        initialValues={{
          code: '',
          date: new Date(),
          details: []
        }}
        onSave={async (values) => {
          await createPurchase(axios, values)
        }}
      />
    </VStack>
  )
}

export default PurchaseCreatePage
