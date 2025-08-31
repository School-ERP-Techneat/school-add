"use client";
import Header from "../components/Header";
import { SchoolDetailsCard } from "./SchoolDetails";
import { useFetchAdmins } from "@/query/queries";
import { useSession } from "next-auth/react";
import AdminTable from "./AdminTable";
const DashboardPage: React.FC = () => {
  const session = useSession();
  const schoolCode = session.data?.user.schoolCode || "";
  const accessToken = session.data?.accessToken || "";

  const { data } = useFetchAdmins(schoolCode, accessToken);

  return (
    <div className="min-h-screen bg-gradient-to  text-gray-900 font-sans">
      <Header variant="auth" />

      <div className="my-10 px-5 sm:px-20">
        <div className="my-5">
          <SchoolDetailsCard />
        </div>
        <div className="my-5">
          <AdminTable />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
