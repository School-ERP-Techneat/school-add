import Link from 'next/link';

const DataTable = ({
  headers,
  rows,
  onDelete,
}: {
  headers: string[];
  rows: { id: string; row: string[] }[];
  onDelete: (id: string) => void;
}) => (
  <div className="overflow-x-auto rounded-lg shadow-sm">
    <table className="min-w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
      <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
        <tr>
          {headers.map((head, i) => (
            <th key={i} className="px-4 py-2 text-left whitespace-nowrap">{head}</th>
          ))}
          <th className="px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 dark:text-gray-300">
        {rows.map(({ id, row }, i) => (
          <tr key={i} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-2 whitespace-nowrap">{cell}</td>
            ))}
            <td className="px-4 py-2 space-x-2">
              <Link href={`/edit/${id}`}>
                <button className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition">Edit</button>
              </Link>
              <button
                onClick={() => onDelete(id)}
                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
