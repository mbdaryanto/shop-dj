import { Center, Heading, HStack, IconButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BackIcon } from "../components/Icons";


function ComingSoonPage() {
  const navigate = useNavigate()
  return (
    <Center w="100%" minH="80vh">
      <HStack spacing={5}>
        <IconButton
          aria-label="Back"
          icon={<BackIcon/>}
          onClick={() => navigate(-1)}
          variant="ghost"
        />
        <Heading>Coming Soon</Heading>
      </HStack>
    </Center>
  )
}

export default ComingSoonPage
