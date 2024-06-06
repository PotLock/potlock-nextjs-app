"use client";

import { Provider as NiceModalProvider } from "@ebay/nice-modal-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";

import { store } from "@/app/_store";
import { AuthProvider } from "@/modules/auth/providers/AuthProvider";

// react-query
const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NiceModalProvider>
      <QueryClientProvider client={queryClient}>
        <ReduxProvider store={store}>
          <AuthProvider>{children}</AuthProvider>
        </ReduxProvider>
      </QueryClientProvider>
    </NiceModalProvider>
  );
};

export default Providers;
