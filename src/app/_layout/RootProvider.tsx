"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";

import { store } from "@/app/_store";
import { AuthProvider } from "@/modules/auth/providers/AuthProvider";

// react-query
const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthProvider>{children}</AuthProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default Providers;
