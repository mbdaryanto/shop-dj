import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, VStack, useToast } from '@chakra-ui/react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { Location, useLocation, useNavigate } from "react-router-dom"
import { useSetRecoilState } from 'recoil'
import { object, string } from 'yup'
import { authStateAtom, login } from '../components/auth'
import { getAxiosErrorDetail } from '../components/common'
import { PasswordInput } from '../components/PasswordInput'


const loginSchema = object({
  username: string().required(),
  password: string().required(),
})


interface LocationStateType {
  from?: Location
}


function Login() {
  const setAuth = useSetRecoilState(authStateAtom)
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const locationState = location.state as (LocationStateType | undefined)
  const from = locationState?.from?.pathname ?? '/';

  return (
    <Box
      // mt={10}
      w="100%" maxW="400px"
      // boxShadow={{ base: undefined, sm: "lg" }}
      // p={{ base: undefined, sm: 5 }}
      boxShadow="lg"
      p={5}
      bg='white'
      alignSelf="center"
    >
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await login(values.username, values.password, setAuth)
            navigate(from, { replace: true })
          } catch (error) {
            toast({
              status: "error",
              title: "Login Failed",
              description: getAxiosErrorDetail(error),
            })
          }
          setSubmitting(false)
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <VStack spacing={5}>
              <Heading>
                Login
              </Heading>

              <Field name="username">
                {({ field, meta }: FieldProps<string>) => (
                  <FormControl isRequired>
                    <FormLabel htmlFor={field.name}>Username</FormLabel>
                    <Input id={field.name} type="text" {...field} />
                    {meta.touched && !!meta.error && (
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>

              <Field name="password">
                {({ field, meta }: FieldProps<string>) => (
                  <FormControl isRequired>
                    <FormLabel htmlFor={field.name}>Password</FormLabel>
                    <PasswordInput id={field.name} {...field} />
                    {meta.touched && !!meta.error && (
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>

              <Button
                type="submit"
                isLoading={isSubmitting}
                colorScheme="blue"
              >
                Login
              </Button>
              {/* <Flex w="100%" spacing={2} flexDir="column">
                  <Button flexGrow={1} isFullWidth colorScheme="teal" variant="link" as={Link} to="/login/forgotpassword">
                    Ubah password?
                  </Button>
                </Flex> */}

            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default Login;
