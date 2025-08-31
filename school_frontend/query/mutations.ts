import * as z from "zod";
import { createUserSchema, schoolSchema, adminSchema } from "@/types/zodTypes";
import { ApiResponse } from "@/types";
import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useRegisterUser() {
  return useMutation({
    mutationKey: ["user", "register"],
    mutationFn: async (data: z.infer<typeof createUserSchema>) => {
      const res = await api.post<ApiResponse>("/user/signup", data);
      if (!res.data.success) throw new Error("Failed to register user");
      return res.data.data;
    },
  });
}

export function useCreateSchool(accessToken: string) {
  return useMutation({
    mutationKey: ["school", "create"],
    mutationFn: async (data: z.infer<typeof schoolSchema>) => {
      const res = await api.post<ApiResponse>("/school", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.data.success) throw new Error("Failed to create School");
      return res.data.data;
    },
  });
}

export function useUpdateSchool(schoolCode: string, accessToken: string) {
  return useMutation({
    mutationKey: ["school", "update", schoolCode],
    // mutationFn receives `data` when you call mutate
    mutationFn: async (data: z.infer<typeof schoolSchema>) => {
      const res = await api.put<ApiResponse>(`/school/${schoolCode}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.data.success) throw new Error("Failed to update School");
      return res.data.data;
    },
  });
}

export function useCreateAdmin(schoolCode: string, accessToken: string) {
  return useMutation({
    mutationKey: ["admin", "create", schoolCode],
    mutationFn: async (data: z.infer<typeof adminSchema>) => {
      const res = await api.post<ApiResponse>(
        `/admin/${schoolCode}/register`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.data.success) throw new Error("Failed to create Admin");
      return res.data.data;
    },
  });
}

export function useUpdateAdmin(schoolCode: string, accessToken: string) {
  return useMutation({
    mutationKey: ["admin", "update", schoolCode],
    mutationFn: async ({
      adminId,
      data,
    }: {
      adminId: string;
      data: z.infer<typeof adminSchema>;
    }) => {
      const res = await api.put<ApiResponse>(
        `/admin/${schoolCode}/account/${adminId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.data.success) throw new Error("Failed to update Admin");
      return res.data.data;
    },
  });
}
export function useDeleteAdmin(schoolCode: string, accessToken: string) {
  return useMutation({
    mutationKey: ["admin", "delete", schoolCode],
    mutationFn: async (adminId: string) => {
      const res = await api.delete<ApiResponse>(
        `/admin/${schoolCode}/account/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.data.success) throw new Error("Failed to delete Admin");
      return res.data.data;
    },
  });
}
