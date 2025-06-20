import { useCallback, useMemo, useState } from "react";

import { useRouter } from "next/router";
import { pick } from "remeda";

import { TextAreaField, TextField } from "@/common/ui/form/components";
import { Button, Form, FormField } from "@/common/ui/layout/components";
import PlusIcon from "@/common/ui/layout/svg/PlusIcon";
import {
  ACCOUNT_PROFILE_LINKTREE_KEYS,
  AccountCategory,
  AccountGroup,
} from "@/entities/_shared/account";
import { rootPathnames } from "@/pathnames";

import { ProfileSetupFundingSourceModal } from "./AddFundingSourceModal";
import { ProfileSetupSmartContractModal } from "./contract-modal";
import { ProfileSetupSmartContractsSection } from "./contracts-section";
import { CustomTextForm, ProjectCategoryPicker, Row, SubHeader } from "./editor-elements";
import { ProfileSetupFundingSourcesTable } from "./funding-sources";
import { ProfileSetupImageUpload } from "./image-upload";
import { ProfileSetupLinktreeSection } from "./linktree-section";
import { ProfileSetupRepositoriesSection } from "./repositories-section";
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
          <div className="max-w-224 m-auto flex w-full flex-col p-[3rem_0px] md:p-[4rem_0px]">
            <SubHeader title="Upload banner and profile Image" required />

            <ProfileSetupImageUpload
              backgroundImage={values.backgroundImage}
              profileImage={values.profileImage}
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
                    placeholder="Type description"
                    maxLength={250}
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

            <SubHeader
              title="Open source repositories"
              required={values.categories?.includes(AccountCategory["Open Source"])}
              className="mt-16"
            />

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
                  router.push(rootPathnames.PROJECTS);
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
