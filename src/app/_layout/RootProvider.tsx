"use client";

import { Provider as NiceModalProvider } from "@ebay/nice-modal-react";
import { Provider as ReduxProvider } from "react-redux";

import { store } from "@/app/_store";
import { AuthProvider } from "@/modules/auth/providers/AuthProvider";

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <NiceModalProvider>
        <AuthProvider>{children}</AuthProvider>
      </NiceModalProvider>
    </ReduxProvider>
  );
};
