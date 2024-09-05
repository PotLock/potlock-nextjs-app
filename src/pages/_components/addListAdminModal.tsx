import { useEffect, useState } from "react";

import { naxiosInstance } from "@/common/api/near";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAdmin: (admin: string) => void;
  admins: string[];
  checkedState: boolean[];
  onToggleCheck: (index: number) => void;
  onRemoveSelected: () => void;
}

export const AddListAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  onClose,
  onAddAdmin,
  admins,
  checkedState,
  onToggleCheck,
  onRemoveSelected,
}) => {
  const [adminAccount, setAdminAccount] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isAccountValid, setIsAccountValid] = useState<boolean | null>(null);

  useEffect(() => {
    const validateAccount = async () => {
      if (!adminAccount) {
        setErrorMessage("Account ID cannot be empty.");
        setIsAccountValid(false);
        return;
      }

      setIsValidating(true);
      try {
        const response = await naxiosInstance.rpcApi().query({
          request_type: "view_account",
          finality: "final",
          account_id: adminAccount,
        });

        if (response) {
          setIsAccountValid(true);
          setErrorMessage("");
        } else {
          setIsAccountValid(false);
          setErrorMessage("Invalid account ID. Please check and try again.");
        }
      } catch (error) {
        setIsAccountValid(false);
        setErrorMessage("Invalid account ID. Please check and try again.");
      } finally {
        setIsValidating(false);
      }
    };

    const timer = setTimeout(() => {
      if (adminAccount) {
        validateAccount();
      }
    }, 500);

    return () => clearTimeout(timer); // Clear timeout if input changes before 500ms
  }, [adminAccount]);

  const handleAddAdmin = () => {
    if (isAccountValid && adminAccount) {
      onAddAdmin(adminAccount);
      setAdminAccount("");
      setIsAccountValid(null); // Reset validation state
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="w-96 max-w-full rounded-md bg-white">
        <div className="flex items-center justify-between rounded-t-md bg-red-500 p-4 text-white">
          <h2 className="text-xl font-semibold">Edit Admin list</h2>
          <button onClick={onClose} className="font-bold text-white">
            X
          </button>
        </div>
        <div className="p-4">
          <input
            type="text"
            value={adminAccount}
            onChange={(e) => setAdminAccount(e.target.value)}
            placeholder="Enter NEAR account ID"
            className="mb-4 w-full rounded-md border px-4 py-2"
          />
          {errorMessage && <p className="mb-4 text-red-500">{errorMessage}</p>}
          <button
            type="button"
            onClick={handleAddAdmin}
            className={`mb-4 w-full rounded-md px-4 py-2 transition ${
              isAccountValid
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            }`}
            disabled={!isAccountValid}
          >
            {isValidating ? "Validating..." : "Add"}
          </button>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-gray-700">{admins.length} Admins</span>
            <button
              type="button"
              onClick={onRemoveSelected}
              className="text-gray-600 hover:text-gray-800"
            >
              Remove all selected
            </button>
          </div>
          <div className="space-y-2">
            {admins.map((admin, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={checkedState[index]}
                  onChange={() => onToggleCheck(index)}
                />
                <span>{admin}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
