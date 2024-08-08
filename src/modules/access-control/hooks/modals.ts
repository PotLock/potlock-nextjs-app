import { useCallback } from "react";

import { useModal } from "@ebay/nice-modal-react";

import {
  AccessControlAdminsModal,
  AccessControlAdminsModalProps,
} from "../components/AccessControlAdminsModal";

export const useAccessControlAdminsModal = (
  params: AccessControlAdminsModalProps,
) => {
  const modal = useModal(AccessControlAdminsModal);

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
