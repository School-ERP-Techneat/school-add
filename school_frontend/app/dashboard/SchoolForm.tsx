"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import CustomFormField from "../components/CustomFormField";
import CustomFormSelect from "../components/CustomFormSelect";
import { useSession } from "next-auth/react";
import { useCreateSchool, useUpdateSchool } from "@/query/mutations";
import { schoolSchema } from "@/types/zodTypes";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSchoolStore } from "@/store/StoreProvider";
import { useEffect } from "react";

const SchoolForm = () => {
  const session = useSession();
  const schoolCode = session.data?.user.schoolCode;
  const accessToken = session.data?.accessToken;
  const { schoolFormOpen, setSchoolFormOpen } = useSchoolStore(
    (state) => state
  );

  const currentYear = new Date().getFullYear();
  const startYear = 1980;
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) =>
    (currentYear - i).toString()
  );

  const queryClient = useQueryClient();

  const boards = ["CBSE", "ICSE", "STATE", "IB", "CAMBRIDGE"];
  const mediums = ["English", "Hindi", "Regional"];
  const schoolTypes = ["Private", "Government", "Aided", "International"];

  const { schoolData } = useSchoolStore((state) => state);
  console.log(schoolData);
  const form = useForm<z.infer<typeof schoolSchema>>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      code: schoolCode,
      affiliationNumber: "",
      name: "",
      board: "CBSE",
      medium: "English",
      establishmentYear: new Date().getFullYear().toString(),
      schoolType: "Private",
      contactEmail: "",
      contactPhone: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
    },
  });

  const createSchool = useCreateSchool(accessToken || "");
  const updateSchool = useUpdateSchool(schoolCode || "", accessToken || "");

  const onSubmit = async (data: z.infer<typeof schoolSchema>) => {
    if (schoolData) {
      updateSchool.mutate(data, {
        onSuccess: (updatedData) => {
          form.reset(updatedData);
          queryClient.invalidateQueries({ queryKey: ["school"] });
          setSchoolFormOpen(false);
        },
        onError: (error) => {
          console.error("Error updating school:", error);
        },
      });
    } else {
      createSchool.mutate(data, {
        onSuccess: (createdData) => {
          form.reset(createdData);
          queryClient.invalidateQueries({ queryKey: ["school"] });
          setSchoolFormOpen(false);
        },
        onError: (error) => {
          console.error("Error creating school:", error);
        },
      });
    }
  };

  useEffect(() => {
    if (schoolData) {
      form.reset(schoolData);
    }
  }, [schoolData]);
  return (
    <Dialog open={schoolFormOpen} onOpenChange={setSchoolFormOpen}>
      <DialogContent className="lg:max-w-6xl overflow-auto max-lg:max-h-[85vh]  w-full">
        <DialogHeader>
          {schoolData ? (
            <>
              <DialogTitle>Edit school details</DialogTitle>
              <DialogDescription>
                Fill in the updated school details.
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle>Create a new school</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new school.
              </DialogDescription>
            </>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2  grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 overflow-auto  ">
              <CustomFormField
                formControl={form.control}
                label="Name"
                name="name"
                placeholder="Enter school name"
              />

              <CustomFormField
                formControl={form.control}
                label="Affiliation Number"
                name="affiliationNumber"
                placeholder="Enter affiliation number"
              />
              <CustomFormSelect
                formControl={form.control}
                label="Board"
                name="board"
                options={boards}
              />
              <CustomFormSelect
                formControl={form.control}
                label="Medium"
                name="medium"
                options={mediums}
              />
              <CustomFormSelect
                formControl={form.control}
                label="Establishment Year"
                name="establishmentYear"
                options={years}
              />
              <CustomFormSelect
                formControl={form.control}
                label="School Type"
                name="schoolType"
                options={schoolTypes}
              />

              <CustomFormField
                formControl={form.control}
                label="Contact Phone"
                name="contactPhone"
                placeholder="Enter contact phone"
              />
              <CustomFormField
                formControl={form.control}
                label="Contact Email"
                name="contactEmail"
                placeholder="Enter contact email"
              />
              <CustomFormField
                formControl={form.control}
                label="Website"
                name="website"
                placeholder="Enter website"
              />
              <CustomFormField
                formControl={form.control}
                label="Logo URL"
                name="logoUrl"
                placeholder="Enter logo URL"
              />
              <CustomFormField
                formControl={form.control}
                label="Street"
                name="address.street"
                placeholder="Enter street"
              />

              <CustomFormField
                formControl={form.control}
                label="City"
                name="address.city"
                placeholder="Enter city"
              />
              <CustomFormField
                formControl={form.control}
                label="State"
                name="address.state"
                placeholder="Enter state"
              />
              <CustomFormField
                formControl={form.control}
                label="Country"
                name="address.country"
                placeholder="Enter country"
              />
              <CustomFormField
                formControl={form.control}
                label="Zip Code"
                name="address.zipCode"
                placeholder="Enter zip code"
              />
            </div>
            <div className="flex gap-5 flex-row-reverse my-5">
              {schoolData ? (
                <>
                  <Button
                    type="submit"
                    className="bg-emerald-400 text-white hover:bg-emerald-500"
                  >
                    {updateSchool.isPending ? (
                      <p className="flex items-center gap-2">
                        Submitting...{" "}
                        <Loader2 className="size-2 animate-spin" />
                      </p>
                    ) : (
                      "Submit"
                    )}
                  </Button>

                  <Button
                    type="reset"
                    variant="ghost"
                    onClick={() => setSchoolFormOpen(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  type="submit"
                  className="bg-emerald-400 text-white hover:bg-emerald-500"
                >
                  {createSchool.isPending ? (
                    <p className="flex items-center gap-2">
                      Submitting... <Loader2 className="size-2 animate-spin" />
                    </p>
                  ) : (
                    "Submit"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SchoolForm;
