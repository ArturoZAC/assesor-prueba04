import { FaBell } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import { styled } from '@mui/material/styles'
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  type AccordionSummaryProps,
  accordionSummaryClasses
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import { FiChevronDown } from 'react-icons/fi'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import { type valuesTransaccion } from '../Interfaces'
import { Link } from 'react-router-dom'
import { LoadingSmall } from '../LoadingSmall'
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&::before': {
    display: 'none'
  }
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<FiChevronDown size={24} color="#fff" />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: 'rotate(180deg)'
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1)
  }
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}))

export const ModalNotificaciones = (): JSX.Element => {
  const obtenerHora = (fechaCompleta: string): string => {
    const hora = fechaCompleta.split(', ')[1] // Obtiene la parte después de la coma
    return hora // Devuelve solo la hora
  }

  const { showNotificaciones, setShowNotificaciones } = useAuth()
  const modalRef = useRef<HTMLDivElement>(null)
  const [loadTransacciones, setLoadTransacciones] = useState<boolean>(false)
  const [transacciones, setTransacciones] = useState<valuesTransaccion[]>([])
  const token = localStorage.getItem('token')

  // Función para cerrar el modal si se hace clic fuera de él
  const handleClickOutside = (event: MouseEvent): void => {
    if (
      showNotificaciones &&
      modalRef.current &&
      !modalRef.current.contains(event.target as Node)
    ) {
      setShowNotificaciones(false)
    }
  }

  // Añade el evento al montar y lo elimina al desmontar
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const [expanded, setExpanded] = useState<string | false>('panel1')

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      event.preventDefault()
      setExpanded(newExpanded ? panel : false)
    }

  const getTransacciones = async (): Promise<void> => {
    setLoadTransacciones(true)
    try {
      const { data } = await axios.get(`${Global.url}/checkout/findAll`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      console.log(data)
      setTransacciones(data.message)
    } catch (error) {
      console.log(error)
      setLoadTransacciones(false)
    } finally {
      setLoadTransacciones(false)
    }
  }

  useEffect(() => {
    if (showNotificaciones) getTransacciones()
  }, [showNotificaciones])
  const transaccionesAgrupadas = transacciones.reduce<
  Record<string, valuesTransaccion[]>
  >((acc, transaccion) => {
    const fecha =
      transaccion.paymentDate !== undefined
        ? transaccion.paymentDate.split(',')[0]
        : '' // Extrae solo la fecha sin la hora
    if (!acc[fecha]) {
      acc[fecha] = []
    }
    acc[fecha].push(transaccion) // Agrupa por fecha
    return acc
  }, {})
  return (
    <motion.div
      ref={modalRef}
      initial={{ opacity: 0, x: -200 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -200 }}
      transition={{ duration: 0.3 }}
      className={`fixed max-w-md w-full h-full block overflow-y-scroll left-0 shadow shadow-white/20 lg:left-[300px] top-0 lg:top-4  bg-primary px-4 py-8 rounded-2xl z-[999] ${
        showNotificaciones ? 'block' : 'hidden'
      }`}
    >
      <h2 className="text-main text-2xl font-nulshock flex items-center gap-3 mb-8">
        <FaBell />
        NOTIFICACIONES
      </h2>

      {loadTransacciones
        ? <LoadingSmall />
        : (
        <div className="w-full">
          <div>
            {Object.entries(transaccionesAgrupadas).map(
              ([fecha, transacciones]) => (
                <Accordion
                  key={fecha}
                  expanded={expanded === `panel${fecha}`}
                  onChange={handleChange(`panel${fecha}`)}
                >
                  <AccordionSummary
                    aria-controls={`panel${fecha}-content`}
                    id={`panel${fecha}-header`}
                  >
                    <Typography component="span">{fecha}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {/* Diseño del Card */}
                    {transacciones.map((transaccion) => (
                      <Link
                        to={`/admin/transacciones/viewTransaccion/${transaccion.id}`}
                        key={transaccion.id}
                        onClick={() => {
                          setShowNotificaciones(false)
                        }}
                        className="block border rounded-lg shadow-sm overflow-hidden mb-4"
                      >
                        {/* Imagen */}
                        <img
                          src={`${Global.urlImages}/recursos/uploads/${
                            transaccion.imagen1 ?? ''
                          }`}
                          alt={transaccion.nombres}
                          className="w-full h-40 object-cover"
                        />
                        {/* Contenido */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold">
                            {transaccion.nombres} {' '} {transaccion.apellidos}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            ID: {transaccion.paymentId}
                          </p>
                          <p className="text-sm mt-1">
                            Monto: S/ {transaccion.transactionAmount}
                          </p>
                          <p className="text-sm mt-1">
                            Hora: {obtenerHora(transaccion.paymentDate ?? '')}
                          </p>
                          <p
                            className={`text-sm mt-1 ${
                              transaccion.estado === 0 ? 'text-yellow-400' : ''
                            } ${transaccion.estado === 1 ? 'text-main' : ''} ${
                              transaccion.estado === 2 ? 'text-green-400' : ''
                            }`}
                          >
                            Estado: {transaccion.estado === 0 && 'Por Revisar'}
                            {transaccion.estado === 1 && 'Rechazado'}
                            {transaccion.estado === 2 && 'Aprobado'}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </AccordionDetails>
                </Accordion>
              )
            )}
          </div>
        </div>
          )}
    </motion.div>
  )
}
