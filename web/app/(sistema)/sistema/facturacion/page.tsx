/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { TablaGeneralLegacy } from "@/components/tables/TablaGeneraLegacy"
import { config } from "@/config/config"
import { adaptarFacturacion } from "./@components/types/adaptarFacturacion"
import { columnasFacturacion } from "./@components/types/ColumnasFacturacion"
import ExportExcelFacturacion from "./@components/excel/ExportExcelFacturacion"

export default async function page({
  searchParams
}: {
  searchParams: any
}) {

  const limit = Number(searchParams.limit ?? 10)
  const pageParam = searchParams?.page

  const search = typeof searchParams.search === 'string' ? searchParams.search : ''
  const page = parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam ?? '1')
  const safePage = isNaN(page) || page < 1 ? 1 : page
  console.log(`${config.apiUrl}/facturacion`)
  const res = await fetch(`${config.apiUrl}/facturacion?page=${safePage}
      &limit=${limit}
      &search=${encodeURIComponent(search)}`, { credentials: 'include' })
  const { data, pagination } = await res.json()
  const datos = adaptarFacturacion(data)

  return (
    <section className='w-full'>
      <TablaGeneralLegacy
        search={search}
        actionClick='agregar'
        //@ts-ignore
        columns={columnasFacturacion}
        pagination={pagination}
        textAdd='Agregar Leasing'
        hideAddButton
        data={datos}
        filters={[]}
        formExportModal={<ExportExcelFacturacion />}
      />
    </section>
  )
}