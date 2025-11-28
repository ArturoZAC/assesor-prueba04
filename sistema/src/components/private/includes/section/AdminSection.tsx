import { RiHomeWifiFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'

export default function AdminSection (): JSX.Element {
  return (
    <ul className="p-0 ml-0">
      <li>
        <Link
          to="tipo_cambio"
          className="flex items-center justify-between w-full px-4 py-2 transition-colors rounded-lg hover:bg-secondary-900"
        >
          <span className="flex items-center gap-4">
            <RiHomeWifiFill className="text-main" /> Tipo de cambio
          </span>
        </Link>
      </li>
    </ul>
  )
}
