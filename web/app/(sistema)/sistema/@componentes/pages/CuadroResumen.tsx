
'use server'

import { TablaGeneralLegacy } from "@/components/tables/TablaGeneraLegacy";
import { columnasCuadroResumen } from "../types/columnasCuadroResumen";
import FormExcelExportarResumen from "../excel/FormExcelExportarResumen";
import { config } from "@/config/config";

const dataTablaTotal = await fetch(`${config.apiUrl}/operaciones/tabla-total-anio/cuadro/total`, {
    cache: "no-store",
    credentials: 'include',
})

const resTablaTotal = await dataTablaTotal.json()
console.log('TABLA TOTAL: ' ,resTablaTotal)

export default async function CuadroResumen() {
    return (
        <div className="w-full">
            <TablaGeneralLegacy
                columns={columnasCuadroResumen}
                data={resTablaTotal}
                textAdd=""
                filters={[]}
                hideSearch={true}
                hideAddButton={true}
                hideCalculoTotal={true}
                hideExpotarTabla={true}
                formExportModal={<FormExcelExportarResumen />}
            />
        </div>
    )
}