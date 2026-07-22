"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/api/queryClient";
import { AuthProvider } from "@/lib/auth/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
