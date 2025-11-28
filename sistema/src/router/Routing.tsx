import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import { PrivateLayout } from '../components/private/PrivateLayout'
// import { ListaBanners } from '../components/private/tables/banners/ListaBanners'

import Auth from '../components/public/Auth'

import ModalProvider from '../context/ModalProvider'
import { ListarTipoCambio } from '../components/private/tables/tipo_cambio/ListarTipoCambio'

export const Routing = (): JSX.Element => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="login" element={<Auth />} />
            <Route path="admin" element={<PrivateLayout />}>
              <Route path="" element={<ListarTipoCambio />} />
            </Route>
            <Route path="*" element={<>Error 404</>} />
          </Routes>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
