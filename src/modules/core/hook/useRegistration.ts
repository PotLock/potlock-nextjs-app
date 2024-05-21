import { useEffect, useState } from "react";

import { UNREGISTERED_PROJECT } from "@app/app/project/[projectId]/statuses";
import { Registration } from "@contracts/potlock/interfaces/lists.interfaces";
import { get_registration } from "@contracts/potlock/lists";

const useRegistration = (projectId: string) => {
  const [registration, setRegistration] =
    useState<Registration>(UNREGISTERED_PROJECT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const registration =
          (await get_registration({
            registrant_id: projectId,
          })) || UNREGISTERED_PROJECT;
        setRegistration(registration);
        setLoading(false);
      } catch (error) {
        console.log("error fetching project ", error);
        setError(error);
        setLoading(false);
      }
    };
    fetchRegistration();
  }, []);

  return {
    registration,
    loading,
    error,
  };
};

export default useRegistration;
