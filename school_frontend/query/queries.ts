import api from "@/lib/api";
import { ApiResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useFetchSchool({
  schoolCode,
  accessToken,
}: {
  schoolCode: string;
  accessToken: string;
}) {
  return useQuery({
    queryKey: ["school", schoolCode],
    queryFn: async () => {
      const res = await api.get<ApiResponse>(`/school/${schoolCode}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.data.success) throw new Error("Failed to fetch School");
      return res.data.data;
    },
    enabled: !!accessToken && !!schoolCode,
  });
}

export function useFetchAdmins(schoolCode: string, accessToken: string) {
  return useQuery({
    queryKey: ["admins", schoolCode],
    queryFn: async () => {
      const res = await api.get<ApiResponse>(`/admin/${schoolCode}/allAdmins`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.data.success) throw new Error("Failed to fetch Admins");
      return res.data.data;
    },
    enabled: !!accessToken && !!schoolCode, // only runs when all are truthy
  });
}

export function useFetchAdmin(
  schoolCode: string,
  accessToken: string,
  adminId: string
) {
  return useQuery({
    queryKey: ["admin", schoolCode, adminId], // include adminId in the key
    queryFn: async ({ queryKey }) => {
      const [_key, _schoolCode, adminId] = queryKey as [string, string, string];
      const res = await api.get<ApiResponse>(
        `/admin/${_schoolCode}/account/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.data.success) throw new Error("Failed to fetch Admin");
      return res.data.data;
    },
    enabled: !!adminId && !!accessToken && !!schoolCode, // only runs when all are truthy
  });
}
