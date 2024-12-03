import { useEffect, useState } from "react";

import { Registration, listsClient } from "@/common/contracts/core";

import { UNREGISTERED_PROJECT } from "../constants";

/**
 *! @deprecated This is a HORRIBLE piece of code, please ask the backend team to add an endpoint
 *!  for `/api/v1/lists/{list_id}/registration` by project accountId,
 *!  then create an indexer query hook and use it instead of this nightmare
 */
export const useRegistration = (projectId: string) => {
  const [registration, setRegistration] = useState<Registration>(UNREGISTERED_PROJECT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        if (projectId) {
          const registration =
            (await listsClient.getRegistration({
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
