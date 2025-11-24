"use server";

import { TablaCalculoTotalGeneral } from "@/components/tables/TablaCalculoTotalGeneral";
import { config } from "@/config/config";
import React from "react";
import { monthlyTotalColumns } from "./@components/types/ColumnasCalculoData";

export default async function page({ searchParams }: { searchParams: Promise<{ year: string }> }) {
  const { year } = await searchParams;

  const res = await fetch(
    `
      ${config.apiUrl}/prestamos/total-cuadro${year ? `?year=${year}` : ""}
    `,
    {
      credentials: "include",
    }
  );

  const data = await res.json();
  // console.log(data);
  return (
    <div>
      <TablaCalculoTotalGeneral
        data={data}
        columns={monthlyTotalColumns}
        linkPath="/sistema/prestamos"
      />
    </div>
  );
}
