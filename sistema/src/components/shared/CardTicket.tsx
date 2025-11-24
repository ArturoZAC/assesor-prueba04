import { Link } from 'react-router-dom'
import { RiTicketLine, RiMore2Fill, RiAddLine } from 'react-icons/ri'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'

interface Props {
  ticket: string | undefined
  totalTickets: number | undefined
  tabla: string
  dashboard: string
  ruta: string
  agregar: string
  button: string
}

const CardTicket = (props: Props): JSX.Element => {
  const { ticket, totalTickets, tabla, dashboard, ruta, agregar, button } = props

  let status = ''
  let textColor = ''

  switch (ticket) {
    case 'pending':
      status = 'bg-yellow-500/10 text-yellow-500'
      textColor = 'text-yellow-500'
      break
    case 'inProcess':
      status = 'bg-blue-500/10 text-blue-500'
      textColor = 'text-blue-500'
      break
    case 'close':
      status = 'bg-green-500/10 text-green-500'
      textColor = 'text-green-500'
      break
    case 'total':
      status = 'bg-pink-500/10 text-pink-500'
      textColor = 'text-pink-500'
      break
  }

  return (
    <div className="bg-primary p-8 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <RiTicketLine
            className={`text-4xl ${status} p-2 box-content rounded-xl`}
          />
        </div>
        <div>
          <Menu
            menuButton={
              <MenuButton className="flex items-center gap-x-2 hover:bg-secondary-100 p-2 rounded-lg transition-colors">
                <RiMore2Fill />
              </MenuButton>
            }
            align="end"
            arrow
            transition
            menuClassName="bg-secondary-100 p-4"
          >
            <MenuItem className="p-0 hover:bg-transparent">
              <Link
                to={ruta}
                className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-100 flex items-center gap-x-4 p-2 flex-1"
              >
                Dashboard {dashboard}
              </Link>
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div>
        <h1 className="text-3xl text-gray-300 font-bold mb-4">
          {totalTickets} resultados
        </h1>
        <p className={textColor}>{tabla} Totales</p>
      </div>
      <hr className="border border-dashed border-gray-500/50 my-4" />
      <div>
        <Link
          to={agregar}
          className="flex items-center gap-2 text-white hover:underline"
        >
          <RiAddLine /> Agregar {button}
        </Link>
      </div>
    </div>
  )
}

export default CardTicket
