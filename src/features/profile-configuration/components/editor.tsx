import { useCallback, useMemo, useState } from "react";

import { useRouter } from "next/router";
import { isDefined } from "remeda";

import { SOCIAL_PLATFORM_NAME } from "@/common/_config";
import { TextAreaField, TextField } from "@/common/ui/form/components";
import { Button, Form, FormField, RuntimeErrorAlert } from "@/common/ui/layout/components";
import PlusIcon from "@/common/ui/layout/svg/PlusIcon";
import {
  ACCOUNT_PROFILE_DESCRIPTION_MAX_LENGTH,
  AccountCategory,
  AccountGroup,
  useAccountSocialProfile,
} from "@/entities/_shared/account";

import { ProfileConfigurationFundingSourceModal } from "./AddFundingSourceModal";
// import { ProfileConfigurationSmartContractModal } from "./contract-modal";
import { ProfileConfigurationSmartContractsSection } from "./contracts-section";
import { ProjectCategoryPicker, Row, SubHeader } from "./editor-elements";
import { ProfileConfigurationFundingSourcesTable } from "./funding-sources";
import { ProfileConfigurationImageUpload } from "./image-upload";
import { ProfileConfigurationLinktreeSection } from "./linktree-section";
import { ProfileConfigurationRepositoriesSection } from "./repositories-section";
import { LowerBannerContainer, LowerBannerContainerLeft } from "./styles";
import { type ProfileFormParams, useProfileForm } from "../hooks/forms";

export type ProfileEditorProps = Pick<
  ProfileFormParams,
  "mode" | "accountId" | "isDaoRepresentative" | "onSuccess" | "onFailure"
> & {};

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  mode,
  accountId,
  isDaoRepresentative,
  onSuccess,
  onFailure,
}) => {
  const router = useRouter();
  const { avatar, cover, error } = useAccountSocialProfile({ accountId, live: true });

  const [addFundingModalOpen, setAddFundingModalOpen] = useState(false);
  const [editFundingIndex, setEditFundingIndex] = useState<number>();

  const {
    form,
    isDisabled,
    teamMembersAccountGroup,
    onSubmit,
    updateCategories,
    updateBackgroundImage,
    updateProfileImage,
    addRepository,
    removeRepository,
    updateRepository,
    updateTeamMembers,
    addFundingSource,
    updateFundingSource,
    removeFundingSource,
    addSmartContract,
    removeSmartContract,
  } = useProfileForm({
    mode,
    accountId,
    isDaoRepresentative,
    onSuccess,
    onFailure,
  });

  const values = form.watch();

  const onCategoriesChange = useCallback(
    (categories: string[]) => updateCategories(categories),
    [updateCategories],
  );

  const onTeamMembersChange = useCallback(
    (members: string[]) => updateTeamMembers(members),
    [updateTeamMembers],
  );

  // const onChangeRepositories = useCallback(
  //   (repositories: string[]) => updateRepositories(repositories),
  //   [updateRepositories],
  // );

  const submitButtonLabel = useMemo(() => {
    switch (mode) {
      case "register": {
        return isDaoRepresentative ? "Submit registration proposal" : "Create new project";
      }

      case "update": {
        return isDaoRepresentative ? "Submit profile update proposal" : "Update your project";
      }
    }
  }, [isDaoRepresentative, mode]);

  // TODO: Handle DAO representative case in a separate ticket after the initial release
  // // DAO Status - In Progress
  // if (
  //   values.isDao &&
  //   values.daoProjectProposal &&
  //   values.daoProjectProposal?.status === "InProgress"
  // ) {
  //   return <DAOInProgress />;
  // }

  return isDefined(error) ? (
    <RuntimeErrorAlert message={`Unable to retrieve ${SOCIAL_PLATFORM_NAME} profile`} />
  ) : (
    <>
      <ProfileConfigurationFundingSourceModal
        data={values.fundingSources}
        open={addFundingModalOpen}
        editFundingIndex={editFundingIndex}
        onAddFundingSource={addFundingSource}
        onUpdateFundingSource={updateFundingSource}
        onCloseClick={() => {
          setAddFundingModalOpen(false);
          setEditFundingIndex(undefined);
        }}
      />

      {/* <ProfileConfigurationSmartContractModal
        data={values.smartContracts}
        contractIndex={editContractIndex || 0}
        open={editContractIndex !== undefined}
        onCloseClick={() => {
          setEditContractIndex(undefined);
        }}
      /> */}

      <Form {...form}>
        <form {...{ onSubmit }}>
          <div className="max-w-224 m-auto flex w-full flex-col p-[3rem_0px] md:p-[4rem_0px]">
            <ProfileConfigurationImageUpload
              profileImage={values.profileImage ?? avatar.url}
              backgroundImage={values.backgroundImage ?? cover.url}
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
                name="name"
                control={form.control}
                defaultValue={values.name}
                render={({ field }) => (
                  <TextField
                    label="Project name"
                    required
                    type="text"
                    placeholder="Enter name"
                    classNames={{ root: "w-full" }}
                    {...field}
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
                  <TextAreaField
                    label="Describe your project"
                    required
                    labelExtension={
                      <span className="line-height-none text-sm text-neutral-600">
                        {"(markdown)"}
                      </span>
                    }
                    placeholder="Type description"
                    maxLength={ACCOUNT_PROFILE_DESCRIPTION_MAX_LENGTH}
                    {...field}
                  />
                )}
              />

              {values.categories?.includes(AccountCategory["Public Good"]) ? (
                <FormField
                  control={form.control}
                  name="publicGoodReason"
                  render={({ field }) => (
                    <TextAreaField
                      label="Why do you consider yourself a public good?"
                      required
                      placeholder="Type the reason"
                      maxLength={250}
                      {...field}
                    />
                  )}
                />
              ) : null}
            </Row>

            <SubHeader title="Smart contracts" className="mt-16" />

            <Row>
              <ProfileConfigurationSmartContractsSection
                values={values.smartContracts}
                onAddContract={addSmartContract}
                onRemoveContract={removeSmartContract}
              />
            </Row>

            <SubHeader title="Funding sources" className="mt-16" />

            <ProfileConfigurationFundingSourcesTable
              values={values.fundingSources}
              onEditClick={(fundingIndex: number) => {
                setEditFundingIndex(fundingIndex);
                setAddFundingModalOpen(true);
              }}
              onDeleteClick={removeFundingSource}
            />

            <div className="mt-6">
              <Button variant="standard-outline" onClick={() => setAddFundingModalOpen(true)}>
                <PlusIcon width={12} height={12} />
                <span>{"Add Funding Source"}</span>
              </Button>
            </div>

            <SubHeader
              title="Open source repositories"
              required={values.categories?.includes(AccountCategory["Open Source"])}
              className="mt-16"
            />

            <Row>
              <ProfileConfigurationRepositoriesSection
                values={values.githubRepositories}
                onUpdate={updateRepository}
                onRemove={removeRepository}
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
              <ProfileConfigurationLinktreeSection form={form} />
            </Row>

            <div className="mt-16 flex gap-4 self-end">
              <Button variant="standard-outline" onClick={router.back}>
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
