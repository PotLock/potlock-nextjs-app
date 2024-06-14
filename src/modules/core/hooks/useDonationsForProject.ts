import { useEffect, useState } from "react";

import { getAccountDonationsReceived } from "@/common/api/account";
import { getDonationsForRecipient } from "@/common/contracts/potlock/donate";
import { DirectDonation } from "@/common/contracts/potlock/interfaces/donate.interfaces";

const useDonationsForProject = (projectId: string) => {
  const [donations, setDonations] = useState<DirectDonation[]>();

  useEffect(() => {
    (async () => {
      // TODO: User Indexer here (/api/v1/accounts/{account_id}/donations_received)
      const foo = await getAccountDonationsReceived({ accountId: projectId });
      console.log("Donations Received:", foo);

      const _donations = await getDonationsForRecipient({
        recipient_id: projectId,
      });

      setDonations(_donations);
    })();
  }, [projectId]);

  return donations;
};

export default useDonationsForProject;
