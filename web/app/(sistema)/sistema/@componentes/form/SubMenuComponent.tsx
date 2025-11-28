/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { SubMenuLogic } from '@/zustand/SubMenuLogic'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function SubMenuComponent({opcionParam}: { opcionParam?: string }) {
  const router = useRouter()
  const { setOption, option } = SubMenuLogic()

  useEffect(() => {
    if (opcionParam) {
      setOption(opcionParam)
    }
    else {
      router.push(`/sistema?option=operaciones`)
    }
  }, [])

  function handleChange(e: any) {
    router.push(`/sistema?option=${e.target.value}`)
    setOption(e.target.value)
    console.log(e.target.value)
  }

  return (
    <div className="flex flex-col gap-2 mb-8">
      <label htmlFor="opcion">Selecciona una opción</label>
      <select name="opcion" id="opcion" onChange={handleChange} value={option} className='px-4 py-2 text-sm w-fit border rounded-lg'>
        <option value="operaciones">Operaciones</option>
        <option value="cuadro-resumen">Cuadro Resumen</option>
        <option value="flujo">Flujo</option>
        <option value="prestamos">Prestamos</option>
        <option value="saldos">Saldos</option>
        <option value="clientes">Clientes</option>
        <option value="divisas">Divisas</option>
      </select>
    </div>
  )
}
