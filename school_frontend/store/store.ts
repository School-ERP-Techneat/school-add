// src/stores/counter-store.ts
import { School } from "@/types";
import { createStore } from "zustand";

export type SchoolState = {
  schoolData: School | null;
  schoolCode: string;
  adminFormOpen: boolean;
  schoolFormOpen: boolean;
  editAdminId: string | null;
};

export type SchoolActions = {
  setSchoolData: (data: School | null) => void;
  setSchoolCode: (code: string) => void;
  setSchoolFormOpen: (isOpen: boolean) => void;
  setAdminFormOpen: (isOpen: boolean) => void;
  setEditAdminId: (id: string | null) => void;
};

export type SchoolStore = SchoolState & SchoolActions;

const defaultInitState: SchoolState = {
  schoolData: null,
  schoolCode: "",
  schoolFormOpen: false,
  adminFormOpen: false,
  editAdminId: null,
};
export const createSchoolStore = (
  initState: SchoolState = defaultInitState
) => {
  return createStore<SchoolStore>()((set) => ({
    ...initState,
    setSchoolData: (data) => set((state) => ({ schoolData: data })),
    setSchoolCode: (code) => set((state) => ({ schoolCode: code })),
    setAdminFormOpen: (isOpen) => set((state) => ({ adminFormOpen: isOpen })),
    setSchoolFormOpen: (isOpen) => set((state) => ({ schoolFormOpen: isOpen })),
    setEditAdminId: (id) => set((state) => ({ editAdminId: id })),
  }));
};
