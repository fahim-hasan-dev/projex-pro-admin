'use client';

import type { ReactNode } from 'react';
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { store } from "@/utils/store";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <Provider store={store}>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
      <Toaster />
    </Provider>
  );
}