import { Button, CircularProgress, Heading, HStack, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, useToast, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { FaPlus as AddIcon } from "react-icons/fa"
import { authAxios } from "../components/auth"
import { getAxiosErrorDetail, PagedResponse } from "../components/common"
import { getItemList, ItemType } from "../components/items-api"
import SearchBox from "../components/SearchBox"


function ItemPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isLoading, setLoading] = useState(false)
  const [isLoadingNext, setLoadingNext] = useState(false)
  const [items, setItems] = useState<ItemType[]>([])
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const axios = useRecoilValue(authAxios)
  const toast = useToast()

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    getItemList(axios, searchParams).then(
      (result) => {
        if (!isMounted) return
        // set items from results
        setItems(result.results)
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
      const result = response.data as PagedResponse<ItemType[]>
      // append new fetched item to the end of the list
      setItems((prev) => [...prev, ...result.results])
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
        Item
      </Heading>
      <IconButton
        aria-label="Create New Item"
        icon={<AddIcon />}
        title="Create New Item"
        position="fixed"
        zIndex={3}
        borderRadius="50%"
        right="100px"
        bottom="30px"
        boxShadow="md"
        colorScheme="blue"
        as={Link}
        to="/item/create"
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
          <ItemList items={items}/>
          {nextUrl && (
            <Button onClick={loadNext} isLoading={isLoadingNext}>Load Next...</Button>
          )}
        </>
      )}
    </VStack>
  )
}

const ItemList = ({ items }: {
  items: ItemType[]
}) => (
  <Table>
    <Thead>
      <Tr>
        <Th>Barcode</Th>
        <Th>Name</Th>
        <Th>Unit Price</Th>
        <Th>Category</Th>
      </Tr>
    </Thead>
    <Tbody>
      {items.map((item) => (
        <Tr key={item.id}>
          <Td>{item.barcode}</Td>
          <Td>{item.name}</Td>
          <Td>{item.unit_price}</Td>
          <Td>{item.category}</Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
)



export default ItemPage
