import { useModal } from "@ebay/nice-modal-react";

export const useAddAdmin = () => {
  const modal = useModal("addAdmin");

  return modal;
};
