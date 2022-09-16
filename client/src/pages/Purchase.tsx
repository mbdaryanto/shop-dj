import { Button, CircularProgress, Heading, HStack, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, useToast, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { authAxios } from "../components/auth"
import { getAxiosErrorDetail, PagedResponse } from "../components/common"
import { getPurchaseList, PurchaseType } from "../components/purchase-api"
import SearchBox from "../components/SearchBox"
import { EditIcon, AddIcon } from "../components/Icons"


function PurchasePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isLoading, setLoading] = useState(false)
  const [isLoadingNext, setLoadingNext] = useState(false)
  const [list, setList] = useState<PurchaseType[]>([])
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const axios = useRecoilValue(authAxios)
  const toast = useToast()

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    getPurchaseList(axios, searchParams).then(
      (result) => {
        if (!isMounted) return
        // set list from results
        setList(result.results)
        // update next url
        setNextUrl(result.next)
        setLoading(false)
      },
      (error) => {
        if (!isMounted) return
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
  }, [axios, toast, searchParams.toString()])

  const loadNext = async () => {
    if (!nextUrl) {
      toast({
        status: "error",
        title: "Data not available",
      })
    }
    try {
      setLoadingNext(true)
      const response = await axios.get(nextUrl!)
      const result = response.data as PagedResponse<PurchaseType[]>
      // append new fetched records to the end of the list
      setList((prev) => [...prev, ...result.results])
      // update next url
      setNextUrl(result.next)
    } catch (error) {
      toast({
        status: "error",
        title: "Error Loading",
        description: getAxiosErrorDetail(error)
      })
    } finally {
      setLoadingNext(false)
    }
  }

  return (
    <VStack spacing={4} w="100%">
      <Heading textAlign="left" mb={5}>
        Purchase
      </Heading>
      <IconButton
        aria-label="Create New Purchase"
        icon={<AddIcon />}
        title="Create New Purchase"
        position="fixed"
        zIndex={3}
        borderRadius="50%"
        right="100px"
        bottom="30px"
        boxShadow="md"
        colorScheme="blue"
        as={Link}
        to="/purchase/create"
      />
      <SearchBox search={searchParams.get('search') ?? ''} onSearch={async (query) => {
        setSearchParams(query ? { search: query } : {})
      }}/>
      {isLoading ? (
        <HStack spacing={2}>
          <CircularProgress isIndeterminate/>
          { searchParams.get('search')
            ? <Text>Searching for {searchParams.get('search') ?? ''} ...</Text>
            : <Text>Loading...</Text>
          }
        </HStack>
      ) : (
        <>
          <PurchaseTable list={list}/>
          {nextUrl && (
            <Button onClick={loadNext} isLoading={isLoadingNext}>Load Next...</Button>
          )}
        </>
      )}
    </VStack>
  )
}

const PurchaseTable = ({ list }: {
  list: PurchaseType[]
}) => (
  <Table>
    <Thead>
      <Tr>
        <Th>Code</Th>
        <Th>Date</Th>
        <Th></Th>
      </Tr>
    </Thead>
    <Tbody>
      {list.map((row) => (
        <Tr key={row.id} _hover={{ bgColor: 'blue.100' }}>
          <Td>{row.code}</Td>
          <Td>{row.date}</Td>
          <Td>
            <IconButton
              aria-label="Update"
              title="Update"
              icon={<EditIcon/>}
              as={Link}
              to={`/purchase/${row.id}/update`}
              variant="link"
            />
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
)



export default PurchasePage
