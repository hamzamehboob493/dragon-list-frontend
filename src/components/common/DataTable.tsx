"use client";

import { DataTableProps } from "@/lib/types/common/types";
import React from "react";

function DataTable<T>({ columns, data, customClass = "" }: DataTableProps<T>) {
  return (
    <div className={`overflow-x-auto ${customClass}`}>
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-md">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-orange-50">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
