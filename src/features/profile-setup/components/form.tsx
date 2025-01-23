import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/router";
import { pick } from "remeda";

import { Button, Form, FormField } from "@/common/ui/components";
import PlusIcon from "@/common/ui/svg/PlusIcon";
import {
  ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC,
  ACCOUNT_PROFILE_LINKTREE_KEYS,
  AccountGroup,
} from "@/entities/_shared/account";
import { rootPathnames } from "@/pathnames";

import { ProfileSetupFundingSourceModal } from "./AddFundingSourceModal";
import { ProfileSetupSmartContractModal } from "./contracts-modal";
import { ProfileSetupSmartContractsSection } from "./contracts-section";
import {
  CustomInput,
  CustomTextForm,
  ProjectCategoryPicker,
  Row,
  SubHeader,
} from "./form-elements";
import { ProfileSetupFundingSourcesTable } from "./funding-sources";
import { ProfileSetupImageUpload } from "./image-upload";
import { ProfileSetupLinktreeSection } from "./linktree-section";
import { ProfileSetupRepositoriesSection } from "./repositories-section";
import { LowerBannerContainer, LowerBannerContainerLeft } from "./styles";
import { type ProfileSetupFormParams, useProfileSetupForm } from "../hooks/forms";

export type ProfileSetupFormProps = Pick<
  ProfileSetupFormParams,
  "mode" | "accountId" | "isDaoRepresentative" | "onSuccess" | "onFailure"
> & {};

export const ProfileSetupForm: React.FC<ProfileSetupFormProps> = ({
  mode,
  accountId,
  isDaoRepresentative,
  onSuccess,
  onFailure,
}) => {
  const router = useRouter();

  const [addFundingModalOpen, setAddFundingModalOpen] = useState(false);
  const [editFundingIndex, setEditFundingIndex] = useState<number>();
  const [editContractIndex, setEditContractIndex] = useState<number>();

  const submitButtonLabel = useMemo(() => {
    switch (mode) {
      case "register": {
        return isDaoRepresentative ? "Add proposal to create project" : "Create new project";
      }

      case "update": {
        return isDaoRepresentative ? "Add proposal to update project" : "Update your project";
      }
    }
  }, [isDaoRepresentative, mode]);

  const {
    form,
    isDisabled,
    teamMembersAccountGroup,
    onSubmit,
    updateCategories,
    updateBackgroundImage,
    updateProfileImage,
    addRepository,
    updateRepositories,
    updateTeamMembers,
  } = useProfileSetupForm({
    mode,
    accountId,
    isDaoRepresentative,
    onSuccess,
    onFailure,
  });

  const values = form.watch();

  console.log("Form values:", values);
  console.log("Errors:", form.formState.errors, "isValid", form.formState.isValid);

  const onCategoriesChange = useCallback(
    (categories: string[]) => updateCategories(categories),
    [updateCategories],
  );

  const onTeamMembersChange = useCallback(
    (members: string[]) => updateTeamMembers(members),
    [updateTeamMembers],
  );

  const onChangeRepositories = useCallback(
    (repositories: string[]) => updateRepositories(repositories),
    [updateRepositories],
  );

  // TODO: Handle DAO representative case in a separate ticket after the initial release
  // // DAO Status - In Progress
  // if (
  //   values.isDao &&
  //   values.daoProjectProposal &&
  //   values.daoProjectProposal?.status === "InProgress"
  // ) {
  //   return <DAOInProgress />;
  // }

  return (
    <>
      <ProfileSetupFundingSourceModal
        data={values.fundingSources}
        open={addFundingModalOpen}
        editFundingIndex={editFundingIndex}
        onCloseClick={() => {
          setAddFundingModalOpen(false);
          setEditFundingIndex(undefined);
        }}
      />

      <ProfileSetupSmartContractModal
        data={values.smartContracts}
        contractIndex={editContractIndex || 0}
        open={editContractIndex !== undefined}
        onCloseClick={() => {
          setEditContractIndex(undefined);
        }}
      />

      <Form {...form}>
        <form {...{ onSubmit }}>
          <div className="m-auto flex w-full max-w-[816px] flex-col p-[3rem_0px] md:p-[4rem_0px]">
            <SubHeader title="Upload banner and profile Image" required />

            <ProfileSetupImageUpload
              backgroundImage={values.backgroundImage}
              profileImage={values.profileImage ?? ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC}
              onBackgroundImageUploaded={updateBackgroundImage}
              onProfileImageUploaded={updateProfileImage}
            />

            <LowerBannerContainer>
              <LowerBannerContainerLeft>
                <AccountGroup
                  title="Team Members"
                  isEditable
                  value={teamMembersAccountGroup}
                  onSubmit={onTeamMembersChange}
                />
              </LowerBannerContainerLeft>
            </LowerBannerContainer>

            <SubHeader
              title={isDaoRepresentative ? "Project details (DAO)" : "Project details"}
              required
              className="mt-16"
            />

            <Row>
              <FormField
                control={form.control}
                name="name"
                defaultValue={values.name}
                render={({ field }) => (
                  <CustomInput
                    label="Project name *"
                    inputProps={{
                      placeholder: "Enter project name",
                      ...field,
                    }}
                  />
                )}
              />

              <ProjectCategoryPicker
                onValuesChange={onCategoriesChange}
                defaultValues={values.categories}
              />
            </Row>

            <Row>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <CustomTextForm
                    showHint
                    label="Describe your project *"
                    placeholder="Type description"
                    field={field}
                    currentText={values.description}
                  />
                )}
              />

              {values.categories?.includes("Public Good") ? (
                <FormField
                  control={form.control}
                  name="publicGoodReason"
                  render={({ field }) => (
                    <CustomTextForm
                      showHint
                      label="Why do you consider yourself a public good?"
                      placeholder="Type the reason"
                      field={field}
                      currentText={values.publicGoodReason}
                    />
                  )}
                />
              ) : null}
            </Row>

            <SubHeader title="Smart contracts" className="mt-16" />

            <Row>
              <ProfileSetupSmartContractsSection
                values={values.smartContracts}
                onEditClickHandler={setEditContractIndex}
              />
            </Row>

            <SubHeader title="Funding sources" className="mt-16" />

            <ProfileSetupFundingSourcesTable
              values={values.fundingSources}
              onEditClick={(fundingIndex: number) => {
                setEditFundingIndex(fundingIndex);
                setAddFundingModalOpen(true);
              }}
            />

            <div className="mt-6">
              <Button variant="standard-outline" onClick={() => setAddFundingModalOpen(true)}>
                <PlusIcon width={12} height={12} />
                <span>{"Add Funding Source"}</span>
              </Button>
            </div>

            {/* <SubHeader title="Repositories" required={values.isRepositoryRequired} className="mt-16" /> */}

            <Row>
              <ProfileSetupRepositoriesSection
                values={values.githubRepositories}
                onChange={onChangeRepositories}
              />
            </Row>

            <div className="mt-6">
              <Button onClick={() => addRepository()}>
                <PlusIcon width={12} height={12} />
                <span>{"Add Repository"}</span>
              </Button>
            </div>

            <SubHeader title="Social links" className="mt-16" />

            <Row>
              <ProfileSetupLinktreeSection values={pick(values, ACCOUNT_PROFILE_LINKTREE_KEYS)} />
            </Row>

            <div className="mt-16 flex gap-4 self-end">
              <Button
                variant="standard-outline"
                onClick={() => {
                  router.push(rootPathnames.PROJECTS_LIST);
                }}
              >
                {"Cancel"}
              </Button>

              <Button variant="standard-filled" type="submit" disabled={isDisabled}>
                {submitButtonLabel}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
