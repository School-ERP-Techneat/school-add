import { useFetchAdmin, useFetchAdmins } from "@/query/queries";
import { getColumns } from "./Columns";
import { DataTable } from "./DataTable";
import { useSchoolStore } from "@/store/StoreProvider";
import { useSession } from "next-auth/react";
import { Admin } from "@/types";
import { useDeleteAdmin } from "@/query/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdminTable = () => {
  const session = useSession();
  const accessToken = session.data?.accessToken;
  const schoolCode = session.data?.user.schoolCode;
  const queryClient = useQueryClient();
  const setAdminFormOpen = useSchoolStore((state) => state.setAdminFormOpen);
  const setEditAdminId = useSchoolStore((state) => state.setEditAdminId);
  const deleteAdmin = useDeleteAdmin(schoolCode || "", accessToken || "");
  const { data: admins } = useFetchAdmins(schoolCode || "", accessToken || "");

  const columns = getColumns(
    setAdminFormOpen,
    setEditAdminId,
    (adminId: string) => {
      const setAdminFormOpen = useSchoolStore(
        (state) => state.setAdminFormOpen
      );

      deleteAdmin.mutate(adminId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["admins", schoolCode] });
        },
        onError: (error) => {
          console.error("Error deleting admin:", error);
        },
      });
    }
  );

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-teal-800">Admins</CardTitle>

          <Button
            onClick={() => setAdminFormOpen(true)}
            className="bg-gradient-to-br from-teal-400 to-blue-400"
          >
            <Plus />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {admins ? (
          <DataTable columns={columns} data={admins} />
        ) : (
          <p className="text-gray-500 italic">No Admins yet. Please add one.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTable;
