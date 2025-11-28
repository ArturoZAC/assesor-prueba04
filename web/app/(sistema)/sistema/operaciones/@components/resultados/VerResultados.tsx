/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

export type Errores = {
  fila: number
  mensaje: string
}

export default function VerResultados({ error }: { error: Errores[] }) {
  return (
    <div>
      <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">Hola, Estos son los errores que encontramos</h2>
      <div className='w-full'>
        {
          error.map((error: any) => (
            <div key={error.fila} className="grid grid-cols-1 mb-5 gap-x-4 gap-y-6 md:grid-cols-2 border-t border-b border-secondary-main">
              <div className="w-full max-w-[200px]">
                <p className="text-black-800">Fila {error.fila}</p>
              </div>
              <div className="w-full">
                <p className="text-black-800">{error.mensaje}</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
