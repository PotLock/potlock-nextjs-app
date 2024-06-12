import { useEffect, useState } from "react";

import { getDonationsForRecipient } from "@/common/contracts/potlock/donate";
import { DirectDonation } from "@/common/contracts/potlock/interfaces/donate.interfaces";

const useDonationsForProject = (projectId: string) => {
  const [donations, setDonations] = useState<DirectDonation[]>();

  useEffect(() => {
    (async () => {
      const _donations = await getDonationsForRecipient({
        recipient_id: projectId,
      });

      setDonations(_donations);
    })();
  }, [projectId]);

  return donations;
};

export default useDonationsForProject;
