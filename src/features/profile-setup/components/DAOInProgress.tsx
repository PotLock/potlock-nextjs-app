import Link from "next/link";

import { Button } from "@/common/ui/components";
import { useGlobalStoreSelector } from "@/store";

const DAOInProgress = () => {
  const { daoProjectProposal, daoAddress } = useGlobalStoreSelector((state) => state.projectEditor);

  if (!daoProjectProposal || !daoAddress) {
    return "";
  }

  return (
    <div
      className="flex w-full flex-col items-center justify-center p-[32px_16px]"
      style={{ wordWrap: "break-word" }}
    >
      <h1 className="font-600 mb-4 text-center">You have a DAO proposal in progress.</h1>
      <h5 className="mb-1 text-center" style={{ wordWrap: "break-word" }}>
        Please come back once voting on your proposal has been completed.
      </h5>
      <p className="sans-serif text-center italic" style={{ wordWrap: "break-word" }}>
        <strong>NB:</strong> This proposal consists of 2 steps (individual proposals): Register
        information on NEAR Social and register on POTLOCK.
      </p>
      <Link
        className="mt-4"
        target="_blank"
        href={`https://near.org/sking.near/widget/DAO.Page?daoId=${daoAddress}&tab=proposal&proposalId=${daoProjectProposal.id}`}
      >
        <Button variant="standard-filled">View DAO Proposal</Button>
      </Link>
    </div>
  );
};

export default DAOInProgress;
