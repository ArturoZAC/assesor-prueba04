export interface HeaderField {
  titulo: string;
  className?: string;
  colSpan?: number;
}

interface TableHeaderGridProps {
  fields: HeaderField[];
  className: string;
}

export default function TableHeaderGrid({
  fields,
}: TableHeaderGridProps) {
  return (
    <thead className="bg-secondary-main ">
      <tr>
        {fields.map((field, index) => (
          <th
            key={index}
            colSpan={field.colSpan }
            
            className={`text-left border-r ${field.className} text-sm font-semibold text-white-main px-3 py-2 border-b`}
          >
            {field.titulo}
          </th>
        ))}
      </tr>
    </thead>
  );
}
