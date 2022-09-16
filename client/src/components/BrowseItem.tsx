import { Button, useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { authAxios } from "./auth"
import { BrowseModal } from "./BrowseModal"
import { getAxiosErrorDetail, PagedResponse } from "./common"
import { getItemList, ItemType } from "./items-api"
import ItemTable from "./ItemTable"

function BrowseItem({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean,
  onClose: () => void,
  onSelect: (value: ItemType) => void,
}) {
  const [search, setSearch] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [isLoadingNext, setLoadingNext] = useState(false)
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const [list, setList] = useState<ItemType[]>([])
  const axios = useRecoilValue(authAxios)
  const toast = useToast()

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    const searchParams = new URLSearchParams()
    if (!!search) {
      searchParams.append('search', search)
    }
    getItemList(axios, searchParams).then(
      (response) => {
        if (!isMounted) return
        setList(response.results)
        setNextUrl(response.next)
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
  }, [axios, search])

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
    <BrowseModal
      title="Browse Item"
      term={search}
      setTerm={setSearch}
      isOpen={isOpen}
      isLoading={isLoading}
      size="full"
      onClose={onClose}
    >
      <ItemTable items={list} isSelection onSelect={onSelect}/>
      {nextUrl && (
        <Button onClick={loadNext} isLoading={isLoadingNext}>Load Next...</Button>
      )}
    </BrowseModal>
  )
}

export default BrowseItem
