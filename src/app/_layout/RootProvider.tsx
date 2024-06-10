"use client";

import { Provider as NiceModalProvider } from "@ebay/nice-modal-react";
import { Provider as ReduxProvider } from "react-redux";

import { store } from "@/app/_store";
import { AuthProvider } from "@/modules/auth/providers/AuthProvider";

export type RootProviderProps = {
  children: React.ReactNode;
};

export const RootProvider: React.FC<RootProviderProps> = ({ children }) => {
  return (
    <NiceModalProvider>
      <ReduxProvider store={store}>
        <AuthProvider>{children}</AuthProvider>
      </ReduxProvider>
    </NiceModalProvider>
  );
};
