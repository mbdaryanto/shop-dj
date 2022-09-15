import { atom, selector } from 'recoil'
import Axios, { AxiosInstance, AxiosError } from 'axios'

interface LoginResponseType {
  expiry: string
  token: string
}

export interface AuthStateType extends Partial<LoginResponseType> {
  isAuthenticated: boolean
  username: string
}

export interface AuthStateWithAxios extends AuthStateType {
  axios: AxiosInstance
}

export const LoggedOutState: AuthStateType = {
  isAuthenticated: false,
  username: 'Guest',
}

const SESSION_STORAGE_AUTHSTATE_KEY = 'authStateJson'

function authFromSession(): AuthStateType {
  if (!window.sessionStorage) return LoggedOutState

  const authStateJson = window.sessionStorage.getItem(SESSION_STORAGE_AUTHSTATE_KEY)
  if (!authStateJson) return LoggedOutState

  return JSON.parse(authStateJson) as AuthStateType
}

// function makeAuthStateWithAxios(authState: AuthStateType): AuthStateWithAxios {
//   return {
//     axios: Axios.create(authState.token ? {
//       headers: {
//         'Authorization': `token ${authState.token}`
//       }
//     }: {}),
//     ...authState
//   }
// }

export const authStateAtom = atom<AuthStateType>({
  key: 'authState',
  default: authFromSession()
})

export const authAxios = selector<AxiosInstance>({
  key: 'authAxios',
  get: ({ get }) => {
    const { isAuthenticated, token } = get(authStateAtom)
    console.log({ isAuthenticated, token })
    if (isAuthenticated && token) return Axios.create({
      headers: {
        'Authorization': `token ${token}`
      }
    })
    return Axios.create({})
  }
})

export async function login(
  username: string,
  password: string,
  setAuthState: (newAuthState: AuthStateType) => void
) {
  const response = await Axios.post('/login/', {
    username, password
  })

  // using axios post with application/x-www-form-urlencoded format
  // const params = new URLSearchParams()
  // params.append('username', username)
  // params.append('password', password)
  // const response = await Axios.post('/token/login', params)

  console.log(response.data)
  const loginResponse = response.data as LoginResponseType
  const authState: AuthStateType = {
    ...loginResponse,
    isAuthenticated: true,
    username,
  }
  setAuthState(authState)
  window.sessionStorage.setItem(SESSION_STORAGE_AUTHSTATE_KEY, JSON.stringify(authState))
}

export async function logout(
  axios: AxiosInstance,
  setAuthState: (newAuthState: AuthStateType) => void
) {
  const response = await axios.post('/logout/')
  setAuthState(LoggedOutState)
  window.sessionStorage.removeItem(SESSION_STORAGE_AUTHSTATE_KEY)
}
