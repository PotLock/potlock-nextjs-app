import { useCallback } from "react";

import { useModal } from "@ebay/nice-modal-react";

import {
  AccountGroupEditModal,
  AccountGroupEditModalProps,
} from "../components/AccountGroupEditModal";

// TODO: Remove if not needed
export const useAccountGroupEditModal = (params: AccountGroupEditModalProps) => {
  const modal = useModal(AccountGroupEditModal);

  const openAccountsModal = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      modal.show(params);
    },

    [modal, params],
  );

  return { openAccountsModal };
};
