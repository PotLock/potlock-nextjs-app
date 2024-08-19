import { useCallback } from "react";

import { useModal } from "@ebay/nice-modal-react";

import {
  AccessControlAccountsModal,
  AccessControlAccountsModalProps,
} from "../components/AccessControlAccountsModal";

// TODO: Remove if not needed
export const useAccessControlAccountManager = (
  params: AccessControlAccountsModalProps,
) => {
  const modal = useModal(AccessControlAccountsModal);

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
