import { Center, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { EditIcon, NextIcon } from "./Icons"
import { ItemType } from "./items-api"


function ItemTable({ items, isSelection, onSelect: onSelected }: {
  items: ItemType[],
  isSelection?: boolean,
  onSelect?: (item: ItemType) => void,
}) {
  if (!items || items.length === 0) {
    return (
      <Center w="100%" minH="100px">
        <Text>No item found</Text>
      </Center>
    )
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Barcode</Th>
          <Th>Name</Th>
          <Th>Unit Price</Th>
          <Th>Category</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {items.map((item) => (
          <Tr key={item.id} _hover={{ bgColor: 'blue.100' }} onClick={() => {
            if (!!onSelected) onSelected(item)
          }}>
            <Td>{item.barcode}</Td>
            <Td>{item.name}</Td>
            <Td>{item.unit_price}</Td>
            <Td>{item.category}</Td>
            <Td>
              {isSelection
                ? <IconButton
                    aria-label="Select Item"
                    title="Select Item"
                    icon={<NextIcon/>}
                    onClick={() => {
                      if (!!onSelected) onSelected(item)
                    }}
                    variant="link"
                  />
                : <IconButton
                    aria-label="Update Item"
                    title="Update Item"
                    icon={<EditIcon/>}
                    as={Link}
                    to={`/item/${item.id}/update`}
                    variant="link"
                  />
              }
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default ItemTable
