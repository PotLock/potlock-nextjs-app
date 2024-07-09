import { ChangeEvent, useCallback, useState } from "react";

import { dispatch, useTypedSelector } from "@/app/_store";
import { Button, FormField } from "@/common/ui/components";
import Radio from "@/common/ui/components/inputs/Radio";
import useWallet from "@/modules/auth/hooks/useWallet";

import {
  AccountStack,
  CustomInput,
  CustomTextForm,
  Row,
  SelectCategory,
} from "./components";
import { LowerBannerContainer, LowerBannerContainerLeft } from "./styles";
import SubHeader from "./SubHeader";
import { useCreateProjectForm } from "../../hooks/forms";
import AddTeamMembersModal from "../AddTeamMembersModal";
import InfoSegment from "../InfoSegment/InfoSegment";
import Profile from "../Profile";

const CreateForm = () => {
  const projectProps = useTypedSelector((state) => state.createProject);
  const { wallet, isWalletReady } = useWallet();
  const { form, errors } = useCreateProjectForm();
  const values = form.watch();

  const isDaoChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const _isDao = e.target.value === "yes";
      dispatch.createProject.setIsDao(_isDao);
      form.setValue("isDao", _isDao);
    },
    [form],
  );

  const categoryChangeHandler = useCallback(
    (categories: string[]) => {
      dispatch.createProject.setCategories(categories);
      form.setValue("categories", categories);
    },
    [form],
  );

  const [addTeamModalOpen, setAddTeamModalOpen] = useState(false);

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
          <Button
            variant="brand-plain"
            className="font-600"
            onClick={() => setAddTeamModalOpen(true)}
          >
            {projectProps.teamMembers.length > 0
              ? "Add or remove team members"
              : "Add team members"}
          </Button>
        </LowerBannerContainerLeft>
        <AccountStack />
      </LowerBannerContainer>

      <AddTeamMembersModal
        open={addTeamModalOpen}
        onCloseClick={() => {
          setAddTeamModalOpen(false);
        }}
      />

      <SubHeader title="Project details" required className="mt-16" />
      {/* DAO */}
      <div className="mb-6 mt-6 flex justify-between">
        <p className="font-500">Would you like to register project as DAO?</p>
        <Radio
          name="is-dao"
          value={projectProps.isDao ? "yes" : "no"}
          onChange={isDaoChangeHandler}
          options={[
            { label: "yes", value: "yes" },
            { label: "no", value: "no" },
          ]}
        />
      </div>

      <Row>
        {/* Project ID | DAO Address */}
        <FormField
          control={form.control}
          name="daoAddress"
          defaultValue={
            projectProps.isDao
              ? projectProps.daoAddress
              : projectProps.accountId
          }
          disabled={!projectProps.isDao}
          render={({ field }) => (
            <CustomInput
              label={projectProps.isDao ? "DAO address *" : "Project ID *"}
              inputProps={{
                placeholder: "Enter project name",
                error: errors.daoAddress?.message,
                ...field,
              }}
            />
          )}
        />
      </Row>

      <Row>
        <FormField
          control={form.control}
          name="name"
          defaultValue={projectProps.name}
          render={({ field }) => (
            <CustomInput
              label="Project name *"
              inputProps={{
                placeholder: "Enter project name",
                error: errors.name?.message,
                ...field,
              }}
            />
          )}
        />

        <SelectCategory
          onValuesChange={categoryChangeHandler}
          defaultValues={projectProps.categories}
        />
      </Row>

      <Row>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <CustomTextForm
              label="Describe your project *"
              placeholder="Type description"
              error={errors.description?.message}
              field={field}
              currentText={values.description}
            />
          )}
        />

        <FormField
          control={form.control}
          name="publicGoodReason"
          render={({ field }) => (
            <CustomTextForm
              label="Why do you consider yourself a public good? *"
              placeholder="Type the reason"
              error={errors.publicGoodReason?.message}
              field={field}
              currentText={values.publicGoodReason}
            />
          )}
        />
      </Row>

      <SubHeader title="Smart contracts" className="mt-16" />
    </div>
  );
};

export default CreateForm;
