import { useCallback } from "react";

import { useModal } from "@ebay/nice-modal-react";

import {
  AccessControlListModal,
  AccessControlListModalProps,
} from "../components/AccessControlListModal";

// TODO: Remove if not needed
export const useAccessControlAccountManager = (
  params: AccessControlListModalProps,
) => {
  const modal = useModal(AccessControlListModal);

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
