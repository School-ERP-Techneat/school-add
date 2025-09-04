'use client';
import { useEffect, useState, useCallback } from 'react';

const API_BASE = ' https://developed-ballet-projectors-shall.trycloudflare.com /api';

/** 🔑 Small helper: adds Authorization automatically if token is present */
const fetchWithAuth = async (url: string, token?: string | null, options: RequestInit = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${text}`);
  }

  return res.json();
};

export const useDashboardData = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [schoolDetails, setSchoolDetails] = useState<any>(null);
  const [adminData, setAdminData] = useState<{ id: string; row: string[] }[]>([]);

  const [loadingSchool, setLoadingSchool] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  /** 🔹 Load userId + token once */
  useEffect(() => {
    const match = document.cookie.match(/userId=([^;]+)/);
    setUserId(match?.[1] || null);

    const token = localStorage.getItem('accessToken');
    setAccessToken(token || null);
  }, []);

  /** 🔹 Fetch school + admin data */
  useEffect(() => {
    if (!userId) return;

    const fetchAll = async () => {
      try {
        // ✅ Hit correct endpoint
        const schoolRes = await fetchWithAuth(`${API_BASE}/school/${userId}`, accessToken);
        console.log('🏫 School API Response:', schoolRes); // debug
        setSchoolDetails(schoolRes.data);

        const adminRes = await fetchWithAuth(`${API_BASE}/admin/${userId}/allAdmins`, accessToken);
        const formatted =
          adminRes.data?.map((admin: any) => ({
            id: admin.id,
            row: [admin.username, admin.designation, '—'],
          })) || [];
        setAdminData(formatted);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoadingSchool(false);
        setLoadingAdmins(false);
      }
    };

    fetchAll();
  }, [userId, accessToken]);

  /** 🔹 Delete admin helper */
  const handleDelete = useCallback(
    async (adminId: string) => {
      if (!accessToken) return;
      try {
        await fetchWithAuth(`${API_BASE}/admin/${adminId}`, accessToken, { method: 'DELETE' });
        setAdminData((prev) => prev.filter((admin) => admin.id !== adminId));
      } catch (err) {
        console.error('Delete error:', err);
      }
    },
    [accessToken]
  );

  return {
    userId,
    schoolDetails,
    adminData,
    loadingSchool,
    loadingAdmins,
    handleDelete,
  };
};
