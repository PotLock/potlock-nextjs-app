import { useEffect, useState } from "react";

import { Registration } from "@/common/contracts/potlock/interfaces/lists.interfaces";
import { getRegistration } from "@/common/contracts/potlock/lists";

import { UNREGISTERED_PROJECT } from "../constants";

export const useRegistration = (projectId: string) => {
  const [registration, setRegistration] =
    useState<Registration>(UNREGISTERED_PROJECT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        if (projectId) {
          const registration =
            (await getRegistration({
              registrant_id: projectId,
            })) || UNREGISTERED_PROJECT;
          setRegistration(registration);
          setLoading(false);
        }
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchRegistration();
  }, [projectId]);

  return {
    registration,
    loading,
    error,
    isRegisteredProject: !!registration.id,
  };
};

export default useRegistration;
