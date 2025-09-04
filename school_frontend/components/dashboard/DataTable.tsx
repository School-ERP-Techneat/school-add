'use client';
import Link from 'next/link';
import toast from 'react-hot-toast';

const DataTable = ({
  headers,
  rows,
  schoolCode, // ✅ pass the schoolCode
  refreshData, // ✅ callback to refresh after delete
}: {
  headers: string[];
  rows: { id: string; row: string[] }[];
  schoolCode: string;
  refreshData: () => void;
}) => {
  const handleDelete = async (id: string) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error('No access token found. Please log in.');
        return;
      }
const match = document.cookie.match(/userId=([^;]+)/);
const schoolCode = match ? match[1] : null;
      const res = await fetch(
        ` https://developed-ballet-projectors-shall.trycloudflare.com/api/admin/${schoolCode}/account/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        toast.success('✅ Admin deleted successfully');
        refreshData(); // reload table
      } else {
        toast.error(data.message || '❌ Failed to delete admin');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('⚠️ Network error');
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-sm">
      <table className="min-w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
          <tr>
            {headers.map((head, i) => (
              <th key={i} className="px-4 py-2 text-left whitespace-nowrap">
                {head}
              </th>
            ))}
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 dark:text-gray-300">
          {rows.map(({ id, row }, i) => (
            <tr
              key={i}
              className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 whitespace-nowrap">
                  {cell}
                </td>
              ))}
              <td className="px-4 py-2 space-x-2">
                <Link href={`/edit/${id}`}>
                  <button className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(id)}
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
};

export default DataTable;
