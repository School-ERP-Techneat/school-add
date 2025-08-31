"use client";
import * as z from "zod";
import { adminSchema } from "@/types/zodTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "../components/CustomFormField";
import { useCreateAdmin, useUpdateAdmin } from "@/query/mutations";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useSchoolStore } from "@/store/StoreProvider";
import { useFetchAdmin } from "@/query/queries";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const AdminForm = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const {
    schoolCode,
    editAdminId,
    adminFormOpen,
    setAdminFormOpen,
    setEditAdminId,
  } = useSchoolStore((state) => state);

  const accessToken = session.data?.accessToken || "";
  const updateAdmin = useUpdateAdmin(schoolCode, accessToken);
  const createAdmin = useCreateAdmin(schoolCode, accessToken);

  const { data: admin } = useFetchAdmin(
    schoolCode || "",
    accessToken || "",
    editAdminId || ""
  );

  const form = useForm<z.infer<typeof adminSchema>>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      schoolCode: schoolCode,
      designation: "",
      username: "",
      password: null,
    },
  });

  // Reset form when admin data changes
  useEffect(() => {
    console.log("resetting the form data");
    if (admin) {
      form.reset({
        schoolCode: schoolCode,
        designation: admin.designation || "",
        username: admin.username || "",
        password: null,
      });
    } else {
      form.reset({
        schoolCode: schoolCode,
        designation: "",
        username: "",
        password: null,
      });
    }
  }, [admin, form, schoolCode]);

  const onSubmit = async (data: z.infer<typeof adminSchema>) => {
    console.log("Submitting admin form:", data);
    if (admin) {
      updateAdmin.mutate(
        { adminId: admin.id, data },
        {
          onSuccess: (createdData) => {
            form.reset(createdData);
            setEditAdminId(null);
            setAdminFormOpen(false);
            queryClient.invalidateQueries({ queryKey: ["admins", schoolCode] });
          },
          onError: (error) => {
            console.error("Error updating admin:", error);
          },
        }
      );
    } else {
      console.log("Creating admin:", data);
      createAdmin.mutate(data, {
        onSuccess: (createdData) => {
          form.reset(createdData);
          queryClient.invalidateQueries({ queryKey: ["admins", schoolCode] });
          setAdminFormOpen(false);
        },
        onError: (error) => {
          console.error("Error creating admin:", error);
        },
      });
    }
  };

  const onError = (errors: any) => {
    console.log("errors", errors);
  };

  return (
    <Dialog
      open={adminFormOpen}
      onOpenChange={(val) => {
        setAdminFormOpen(val);
        if (!val) {
          form.reset();
          setEditAdminId(null);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {admin ? "Edit Admin" : "Create a new Admin"}
          </DialogTitle>
          <DialogDescription>
            {admin
              ? "Update the admin details below."
              : "Fill in the details below to create a new Admin."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-4"
          >
            <div className="hidden">
              <CustomFormField
                name="schoolCode"
                formControl={form.control}
                placeholder="Enter school code"
                label="School Code"
                type="text"
              />
            </div>
            <CustomFormField
              name="username"
              formControl={form.control}
              placeholder="Enter username"
              label="Username"
              type="text"
            />
            <CustomFormField
              name="password"
              formControl={form.control}
              placeholder="Enter password"
              label="Password"
              type="password"
              required={!admin} // make password required only when creating a new admin
            />
            <CustomFormField
              name="designation"
              formControl={form.control}
              placeholder="Enter designation"
              label="Designation"
              type="text"
            />
            <div className="flex gap-5 flex-row-reverse my-5">
              <Button
                type="submit"
                className="bg-emerald-400 text-white hover:bg-emerald-500"
                disabled={updateAdmin.isPending || createAdmin.isPending}
              >
                {admin ? (
                  updateAdmin.isPending ? (
                    <span className="flex items-center gap-2">
                      Updating... <Loader2 className="h-4 w-4 animate-spin" />
                    </span>
                  ) : (
                    "Update"
                  )
                ) : createAdmin.isPending ? (
                  <span className="flex items-center gap-2">
                    Creating... <Loader2 className="h-4 w-4 animate-spin" />
                  </span>
                ) : (
                  "Create"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAdminFormOpen(false);
                  setEditAdminId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminForm;
