import { ReactNode } from 'react'
import { Box, Button, Center, CircularProgress, Input, InputGroup, InputRightElement,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, VStack } from '@chakra-ui/react'
import { Formik, Form, Field, FieldProps } from 'formik'
import { SearchIcon } from './Icons'

export function BrowseModal({
  children, title, term, isOpen, isLoading, size, setTerm, onClose,
}: {
  children: ReactNode
  title: string
  term: string
  isOpen: boolean
  isLoading: boolean
  size?: string
  setTerm: (value: string) => void
  onClose: () => void
}) {
  return (
    <Modal isOpen={isOpen} size={size} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg={"gray.200"} mb={2}>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={5}>
            <Formik
              initialValues={{
                term
              }}
              validate={() => {}}
              onSubmit={async (values, { setSubmitting }) => {
                setTerm(values.term);
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Box w="100%"> {/* supaya lebar full width} */}
                  <Form>
                    <Field name="term">
                      {({ field }: FieldProps<string>) => (
                        <InputGroup width="100%">
                          <Input {...field} size="md" placeholder="enter keyword here" isRequired={false}/>
                          {/* <InputRightAddon children='Cari' /> */}
                          <InputRightElement width="5rem">
                            <Button type="submit" isLoading={isSubmitting || isLoading} size="sm" rightIcon={<SearchIcon />} > Search </Button>
                          </InputRightElement>
                        </InputGroup>
                      )}
                    </Field>
                  </Form>
                </Box>
              )}
            </Formik>

            {isLoading ? (
              <Center w="100%" h="200px">
                <CircularProgress isIndeterminate />
              </Center>
            ) : children}
          </VStack>

        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
