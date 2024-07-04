import { ChangeEvent, useCallback } from "react";

import { dispatch, useTypedSelector } from "@/app/_store";
import { Button, Input } from "@/common/ui/components";
import Radio from "@/common/ui/components/inputs/Radio";
import useWallet from "@/modules/auth/hooks/useWallet";

import { InputContainer, Label, Row } from "./components";
import { LowerBannerContainer, LowerBannerContainerLeft } from "./styles";
import SubHeader from "./SubHeader";
import { useCreateProjectForm } from "../../hooks/forms";
import InfoSegment from "../InfoSegment/InfoSegment";
import Profile from "../Profile";

const CreateForm = () => {
  const { accountId, teamMembers, isDao, daoAddress } = useTypedSelector(
    (state) => state.createProject,
  );
  const { wallet, isWalletReady } = useWallet();
  const {
    form: { register },
  } = useCreateProjectForm();

  const isDaoChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const _isDao = e.target.value === "yes";
    dispatch.createProject.setIsDao(_isDao);
  }, []);

  // must be signed in
  if (isWalletReady && !wallet?.accountId) {
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
      <Profile />
      <LowerBannerContainer>
        <LowerBannerContainerLeft>
          <Button variant="brand-plain" className="font-600">
            {teamMembers.length > 0
              ? "Add or remove team members"
              : "Add team members"}
          </Button>
        </LowerBannerContainerLeft>
      </LowerBannerContainer>

      <SubHeader title="Project details" required />
      {/* DAO */}
      <div className="mb-6 mt-6 flex justify-between">
        <p className="font-500">Would you like to register project as DAO?</p>
        <Radio
          name="is-dao"
          value={isDao ? "yes" : "no"}
          onChange={isDaoChangeHandler}
          options={[
            { label: "yes", value: "yes" },
            { label: "no", value: "no" },
          ]}
        />
      </div>

      <Row>
        <InputContainer>
          <Label>{isDao ? "DAO address *" : "Project ID *"}</Label>
          {isDao ? (
            <Input
              {...register("daoAddress", { required: true })}
              value={daoAddress}
            />
          ) : (
            <Input value={accountId} disabled />
          )}
        </InputContainer>
      </Row>
    </div>
  );
};

export default CreateForm;
