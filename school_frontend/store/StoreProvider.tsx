"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createSchoolStore, SchoolState, SchoolStore } from "./store";
import { Session } from "next-auth";

export type SchoolStoreApi = ReturnType<typeof createSchoolStore>;
export const SchoolStoreContext = createContext<SchoolStoreApi | undefined>(
  undefined
);

export interface SchoolStoreProviderProps {
  children: ReactNode;
  session: Session | null;
}

export const SchoolStoreProvider = ({
  children,
  session,
}: SchoolStoreProviderProps) => {
  const storeRef = useRef<SchoolStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createSchoolStore({
     schoolCode: session && session.user && session.user.schoolCode
  ? session.user.schoolCode
  : "",

      schoolData: null,
      adminFormOpen: false,
      schoolFormOpen: false,
      editAdminId: null,
    });
  }
  return (
    <SchoolStoreContext.Provider value={storeRef.current}>
      {children}
    </SchoolStoreContext.Provider>
  );
};

export const useSchoolStore = <T,>(selector: (store: SchoolStore) => T): T => {
  const schoolStoreContext = useContext(SchoolStoreContext);

  if (!schoolStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`);
  }

  return useStore(schoolStoreContext, selector);
};
