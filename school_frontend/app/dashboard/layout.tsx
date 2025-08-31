"use client";
import React from "react";
import { useSchoolStore } from "@/store/StoreProvider";
import AdminForm from "./AdminForm";
import SchoolForm from "./SchoolForm";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const adminFormOpen = useSchoolStore((state) => state.adminFormOpen);
  const schoolFormOpen = useSchoolStore((state) => state.schoolFormOpen);

  return (
    <div>
      {children}
      {adminFormOpen && <AdminForm />}
      {schoolFormOpen && <SchoolForm />}
    </div>
  );
};

export default Layout;
