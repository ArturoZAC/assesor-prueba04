import {
  useState,
  useEffect,
  createContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction
  // useRef
} from 'react'
import { Global } from '../helper/Global'
import axios from 'axios'
import { type UserSchema } from './UserSchema'
import { toast } from 'sonner'
/*
import io from 'socket.io-client'
import { toast } from 'sonner'
*/
export interface AuthContextValue {
  auth: typeof UserSchema
  setAuth: Dispatch<SetStateAction<typeof UserSchema>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  title: string
  setTitle: Dispatch<SetStateAction<string>>
  loadingComponents: boolean
  setLoadingComponents: Dispatch<SetStateAction<boolean>>
  showNotificaciones: boolean
  setShowNotificaciones: Dispatch<SetStateAction<boolean>>
  notificationCount: number
  setNotificationCount: Dispatch<SetStateAction<number>>
  getNotificaciones: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({
  children
}: {
  children: ReactNode
}): JSX.Element => {
  const [auth, setAuth] = useState<typeof UserSchema>({
    id: '',
    nombres: '',
    email: '',
    apellidos: '',
    rolId: null
  })
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [loadingComponents, setLoadingComponents] = useState(false)
  const [showNotificaciones, setShowNotificaciones] = useState<boolean>(false)
  const [notificationCount, setNotificationCount] = useState(0)
  /*
  const showNotification2 = (nombre: string, contenido: string, id: string): void => {
    console.log(nombre, id)
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const options: NotificationOptions = {
            body: contenido,
            icon: 'https://administrador.navesport.com/assets/icono-adbf44c5.png',
            silent: true
          }
          const notification = new Notification('Nueva transacción', options)
          notification.onclick = () => {
          }
        }
      })
    }
  }
    */
  /*
  const getNotificaciones = (): void => {
    axios
      .get(`${Global.url}/notificaciones/countNotificaciones`)
      .then((response) => {
        setNotificationCount(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }
      */

  const authUser = async (): Promise<false | undefined> => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return false
    }
    try {
      const { data } = await axios.get(`${Global.url}/user`, {
        headers: {
          Authorization: `Bearer ${token ?? ''}`
        }
      })

      console.log(data)
      if (data.rol_id === 1 || data.rol_id === 3) {
        setAuth(data)
        setLoading(false)
        toast.success('Validado Correctamente. Bienvenido!')
      } else {
        setLoading(false)
        window.location.href = '/login'
        localStorage.removeItem('token')
      }
    } catch (error) {
      //   console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    authUser()
    // getNotificaciones()
  }, [])
  /*
  const socketRef = useRef<any>(null)

  useEffect(() => {
    if (socketRef.current) return // Evitar la doble inicialización
    const socket = io('https://prueba.logosperu.com.pe', {
      transports: ['websocket']
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Conexión Socket.IO establecida')
    })

    socket.on('new_transaction', (data: any) => {
      console.log('NUEVA TRANSCCION: ', data)
      showNotification2('PRUEBA', 'contenido', 'id')
      toast.success('Nueva compra registrada')
      getNotificaciones()
    })

    socket.on('reconnect_attempt', (attemptNumber: string) => {
      console.log(`Intento de reconexión ${attemptNumber ?? ''}`)
    })

    socket.on('connect_error', (error) => {
      console.error('Error al conectar WebSocket:', error)
      toast.error('Error al conectar WebSocket')
    })

    socket.on('disconnect', () => {
      console.log('Conexión Socket.IO cerrada, intentando reconectar...')
    })

    socket.on('error', (error: any) => {
      console.error('Error en Socket.IO:', error)
      toast.error('Error en la conexión Socket.IO')
    })

    return () => {
      socketRef.current?.off('new_transaction') // Limpiar listeners
      socketRef.current?.disconnect()
    }
  }, [])
  */
  const getNotificaciones = (): void => { }
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loading,
        setLoading,
        title,
        setTitle,
        loadingComponents,
        setLoadingComponents,
        setShowNotificaciones,
        showNotificaciones,
        notificationCount,
        setNotificationCount,
        getNotificaciones
        // getNotificaciones
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
