import React from 'react'
import { type Usuario } from '../interfaces/UserInterface'

interface AdminContextProps {
  user: Usuario
}

export const AdminContext = React.createContext<AdminContextProps>({
  user: {
    id: '',
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    celular: '',
    rolId: 0
  }
})

export default function AdminProvider ({ children }: { children: React.ReactNode }): JSX.Element {
  const [user] = React.useState<Usuario>({
    id: '',
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    celular: '',
    rolId: 0
  })

  /*
  React.useEffect(() => {

  }, [])
  */

  return (
    <AdminContext.Provider value={{ user }}>
      { children }
    </AdminContext.Provider>
  )
}
