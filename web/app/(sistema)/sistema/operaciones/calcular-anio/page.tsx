"use server";

import { TablaCalculoTotalGeneral } from "@/components/tables/TablaCalculoTotalGeneral";
import React from "react";
import { operacionColumns } from "./@components/types/ColumnaOperacionCalculo";
import { config } from "@/config/config";

export default async function page({ searchParams }: { searchParams: Promise<{ year: string }> }) {
  const { year } = await searchParams;

  const res = await fetch(
    `
          ${config.apiUrl}/operaciones/total-cuadro${year ? `?year=${year}` : ""}
        `,
    {
      credentials: "include",
    }
  );

  const data = await res.json();
  console.log({ data });

  return (
    <div>
      <TablaCalculoTotalGeneral
        data={data}
        columns={operacionColumns}
        linkPath="/sistema/operaciones"
      />
    </div>
  );
}
