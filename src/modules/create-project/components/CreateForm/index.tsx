import useWallet from "@/modules/auth/hooks/useWallet";

import SubHeader from "./SubHeader";
import InfoSegment from "../InfoSegment/InfoSegment";
import Profile from "../Profile";

const CreateForm = () => {
  const { wallet, isWalletReady } = useWallet();
  const projectId = wallet?.accountId;

  // must be signed in
  if (isWalletReady && !projectId) {
    return (
      <InfoSegment
        title="Not logged in!"
        description="You must log in to create a new project!"
      />
    );
  }

  return (
    // Container
    <div className="m-auto flex w-full max-w-[816px] flex-col p-[3rem_0px] md:p-[4rem_0px]">
      <SubHeader title="Upload banner and profile Image" required />
      <Profile accountId={projectId} />
    </div>
  );
};

export default CreateForm;
