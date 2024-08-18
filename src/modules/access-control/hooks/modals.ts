import { useCallback } from "react";

import { useModal } from "@ebay/nice-modal-react";

import {
  AccessControlAccountsModal,
  AccessControlAccountsModalProps,
} from "../components/AccessControlAccountsModal";

export const useAccessControlAccountManager = (
  params: AccessControlAccountsModalProps,
) => {
  const modal = useModal(AccessControlAccountsModal);

  const openAdminsModal = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      modal.show(params);
    },

    [modal, params],
  );

  return { openAdminsModal };
};
