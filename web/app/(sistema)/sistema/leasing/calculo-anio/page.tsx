"use server";

import { TablaCalculoTotalGeneral } from "@/components/tables/TablaCalculoTotalGeneral";
import { config } from "@/config/config";
import React from "react";
import { leasingOperacionColumns } from "./@components/types/ColumnasCalculoLeasing";

export default async function page({ searchParams }: { searchParams: Promise<{ year: string }> }) {
  const { year } = await searchParams;

  const res = await fetch(
    `
        ${config.apiUrl}/leasing/total-cuadro${year ? `?year=${year}` : ""}
      `,
    {
      credentials: "include",
    }
  );

  const data = await res.json();

  // console.log({ data });

  return (
    <div>
      <div>
        <TablaCalculoTotalGeneral
          data={data}
          columns={leasingOperacionColumns}
          linkPath="/sistema/leasing"
        />
      </div>
    </div>
  );
}
