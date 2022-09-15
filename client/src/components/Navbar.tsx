import type { ReactNode } from 'react'
import {
  Box, HStack, Menu, MenuButton, MenuList, MenuItem, Text, Button, Link as Link2,
  useColorModeValue,
  useToast
} from '@chakra-ui/react'
import { FaBars, FaUserCircle } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { authAxios, authStateAtom, logout } from './auth'
import { getAxiosErrorDetail } from './common'

const menus = [
  {
    children: 'Master',
    to: '/master',
  },
  {
    children: 'Transaksi',
    to: '/transaksi'
  },
]

const NavLink = (props: { children: ReactNode, to: string }) => (
  <Link2
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    as={Link}
    {...props}>
  </Link2>
);

const NAVBAR_HEIGHT = 60

const Navbar = ({
  title,
  children,
}: {
  title?: string,
  children: ReactNode,
}) => {
  const [auth, setAuth] = useRecoilState(authStateAtom)
  const axios = useRecoilValue(authAxios)
  const location = useLocation()
  const navigate = useNavigate()
  const toast = useToast()

  return (
    <Box minH="100vh" w="100%">
      <Box
        pos="fixed" top="0" w="100%" h={`${NAVBAR_HEIGHT}px`} pt={2} pb={2} pl={5} pr={5} zIndex={3}
        display="flex" justifyContent="center" alignItems="center"
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
      >
        <HStack spacing={5} align="center" justify="start" w="100%">
          <Menu>
            <Button
              as={MenuButton}
              variant="solid"
              aria-label="Navigation"
              // colorScheme='blue'
              _hover={{ bg: 'gray.400' }}
              _expanded={{ bg: 'blue.400' }}
              _focus={{ boxShadow: 'outline' }}
            >
              <FaBars />
            </Button>
            <MenuList>
              <MenuItem as={Link} to="/">
                Home
              </MenuItem>
              {menus.map((link) => (
                <MenuItem
                  display={{ base: 'flex', md: 'none' }}
                  as={Link}
                  key={link.to}
                  {...link}
                />
              ))}
            </MenuList>
          </Menu>

          <Text fontWeight="bold" fontSize="sm">{title || 'Shop'}</Text>

          <HStack
            as={'nav'}
            spacing={4}
            display={{ base: 'none', md: 'flex' }}>
            {menus.map((link) => (
              <NavLink key={link.to} {...link}/>
            ))}
          </HStack>

          <Box flexGrow={1}></Box>

          <Text fontSize="sm">
            {auth.username}
          </Text>

          {auth.isAuthenticated ? (
            <Menu>
              <MenuButton>
                <FaUserCircle />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={async () => {
                  try {
                    await logout(axios, setAuth)
                    navigate('/')
                  } catch (error) {
                    toast({
                      status: "error",
                      title: "Logout failed",
                      description: getAxiosErrorDetail(error),
                    })
                  }
                }}>
                  Logout
                </MenuItem>

              </MenuList>
            </Menu>
          ) : (
            <Button
              // variant="ghost"
              colorScheme='blue'
              as={Link}
              to="/login"
              state={{ from: location }}
            >
              Login
            </Button>
          )}
        </HStack>
      </Box>
      <Box
        w="100%"
        display="flex"
        justifyContent="center"
        alignItems="start"
        // bgColor='gray.50'
        minH="100vh"
      >
        <Box
          pt={2 + NAVBAR_HEIGHT}
          pb={2}
          px={{ base: 0, md: 5 }}
          // w={{ base: "100%", md: "1100px" }}
          w="100%"
          // h={`calc(100vh-${NAVBAR_HEIGHT})`}
          h="100vh"
          display="flex"
          alignItems="start"
          justifyContent="center"
          bgColor="whitesmoke"
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}


export default Navbar
