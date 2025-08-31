"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSchoolStore } from "@/store/StoreProvider";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SchoolDetailsCard() {
  const { schoolData, setSchoolFormOpen } = useSchoolStore((state) => state);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const details = [
    { label: "Name", value: schoolData?.name },
    { label: "Code", value: schoolData?.code },
    { label: "Board", value: schoolData?.board },
    { label: "Affiliation Number", value: schoolData?.affiliationNumber },
    { label: "School Type", value: schoolData?.schoolType },
    { label: "Establishment Year", value: schoolData?.establishmentYear },
    { label: "Contact Email", value: schoolData?.contactEmail },
    { label: "Contact Phone", value: schoolData?.contactPhone },
    { label: "Website", value: schoolData?.website },
  ];

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-teal-800">School Details</CardTitle>
          {schoolData ? (
            <div className="flex gap-2 items-center">
              <Link
                href={`https://localhost:3001/${schoolData?.code ?? ""}/login`}
              >
                <Button className="bg-gradient-to-br from-teal-400 to-blue-400">
                  Login
                </Button>
              </Link>
              <Button
                onClick={() => setSchoolFormOpen(true)}
                className="bg-gradient-to-br from-teal-400 to-blue-400"
              >
                Edit
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setSchoolFormOpen(true)}
              className="bg-gradient-to-br from-teal-400 to-blue-400"
            >
              <Plus />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {schoolData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {details.map((item) => (
              <div key={item.label}>
                <span className="text-teal-800 font-semibold">
                  {item.label}:
                </span>{" "}
                <span className="text-gray-700">{item.value || "—"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No school details yet. Please add one.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
