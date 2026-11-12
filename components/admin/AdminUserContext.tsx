'use client';

import React, { createContext, useContext } from 'react';

const AdminUserContext = createContext<{ email: string } | null>(null);

export const AdminUserProvider: React.FC<{ email: string; children: React.ReactNode }> = ({ email, children }) => (
  <AdminUserContext.Provider value={{ email }}>{children}</AdminUserContext.Provider>
);

export function useAdminUser() {
  return useContext(AdminUserContext);
}
