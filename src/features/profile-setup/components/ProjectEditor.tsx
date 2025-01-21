import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/router";
import { Form } from "react-hook-form";

import { indexer } from "@/common/api/indexer";
import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { Button, FormField } from "@/common/ui/components";
import PlusIcon from "@/common/ui/svg/PlusIcon";
import {
  ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC,
  useAccountSocialProfile,
} from "@/entities/_shared/account";
import { useSession } from "@/entities/_shared/session";
import { rootPathnames } from "@/pathnames";

import AddFundingSourceModal from "./AddFundingSourceModal";
import AddTeamMembersModal from "./AddTeamMembersModal";
import DAOInProgress from "./DAOInProgress";
import EditSmartContractModal from "./EditSmartContractModal";
import { ErrorModal } from "./ErrorModal";
import {
  AccountStack,
  CustomInput,
  CustomTextForm,
  ProjectCategoryPicker,
  Row,
} from "./form-elements";
import FundingSourceTable from "./FundingSourceTable";
import InfoSegment from "./InfoSegment";
import Profile from "./Profile";
import Repositories from "./Repositories";
import { SmartContracts } from "./SmartContracts";
import SocialLinks from "./SocialLinks";
import { LowerBannerContainer, LowerBannerContainerLeft } from "./styles";
import SubHeader from "./SubHeader";
import SuccessfulRegister from "./SuccessfulRegister";
import { useProjectEditorForm } from "../hooks/forms";
import { ProjectEditorInputs } from "../models/types";

interface ProjectEditorProps {
  accountId: string;
}

export const ProjectEditor: FC<ProjectEditorProps> = ({ accountId }) => {
  const router = useRouter();
  const isNewAccount = accountId === undefined;
  // const [editContractIndex, setEditContractIndex] = useState<number>();
  // const [initialNameSet, setInitialNameSet] = useState(false);

  // Local state for modals
  const [addTeamModalOpen, setAddTeamModalOpen] = useState(false);
  const [addFundingModalOpen, setAddFundingModalOpen] = useState(false);
  const [editFundingIndex, setEditFundingIndex] = useState<number>();
  const [editContractIndex, setEditContractIndex] = useState<number>();

  const sessionData = useSession();

  const {
    profile: socialDbSnapshot,
    avatarSrc,
    backgroundSrc,
  } = useAccountSocialProfile({
    accountId: accountId ?? "noop",
    enabled: !isNewAccount,
  });

  const defaultValues = useMemo<Partial<ProjectEditorInputs>>(
    () =>
      socialDbSnapshot === undefined
        ? { profileImage: ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC }
        : {
            name: socialDbSnapshot.name,
            description: socialDbSnapshot.description,
            publicGoodReason: socialDbSnapshot.plPublicGoodReason,
            teamMembers: socialDbSnapshot.plTeam ? JSON.parse(socialDbSnapshot.plTeam) : undefined,
            categories: socialDbSnapshot.plCategories
              ? JSON.parse(socialDbSnapshot.plCategories)
              : undefined,
            github: socialDbSnapshot.plGithubRepos
              ? JSON.parse(socialDbSnapshot.plGithubRepos)
              : undefined,
            backgroundImage: backgroundSrc ?? ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC,
            profileImage: avatarSrc ?? ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC,
          },
    [avatarSrc, backgroundSrc, socialDbSnapshot],
  );

  const { data: listRegistrations } = indexer.useListRegistrations({ listId: 1 });

  const hasRegistrationSubmitted = useMemo(
    () =>
      listRegistrations?.results.find(
        (registration) => registration.registrant.id === PUBLIC_GOODS_REGISTRY_LIST_ID.toString(),
      ) !== undefined,
    [listRegistrations?.results],
  );

  const {
    form,
    values,
    isSubmitting,
    onSubmit,
    updateTeamMembers,
    updateCategories,
    updateRepositories,
    addRepository,
    errors,
  } = useProjectEditorForm({
    defaultValues,
    onSuccess: () => router.push(rootPathnames.PROJECTS_LIST),
    isEdit: hasRegistrationSubmitted,
  });

  useEffect(() => {
    form.reset(defaultValues, {
      keepDefaultValues: true,
      keepDirty: false,
    });
  }, [defaultValues]);

  useEffect(() => {
    // Set initial focus to name input.
    form.setFocus("name");
  }, []);

  const stringifiedDefaultValues = JSON.stringify(defaultValues);
  const stringifiedValues = JSON.stringify(values);

  const isOwner = values.isDao ? accountId === values.daoAddress : accountId === accountId;

  const categoryChangeHandler = useCallback(
    (categories: string[]) => updateCategories(categories),
    [updateCategories],
  );

  const onMembersChangeHandler = useCallback(
    (members: string[]) => updateTeamMembers(members),
    [updateTeamMembers],
  );

  const onChangeRepositories = useCallback(
    (repositories: string[]) => updateRepositories(repositories),
    [updateRepositories],
  );

  console.log({ defaultValues });

  const isThereDiff = useMemo(() => {
    return stringifiedDefaultValues !== stringifiedValues;
  }, [stringifiedValues, stringifiedDefaultValues]);

  // const resetUrl = useCallback(() => {
  //   router.push(rootPathnames.CREATE_PROJECT);
  //   resetForm();
  // }, [router, resetForm]);

  // Add loading state
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Prevent form render while loading
  if (form.formState.isLoading) {
    return <InfoSegment title="Loading project data..." description="Please wait..." />;
  }

  const getProjectEditorText = () => {
    if (socialDbSnapshot) {
      return values.isDao ? "Add proposal to update project" : "Update your project";
    }

    return values.isDao ? "Add proposal to create project" : "Create new project";
  };

  const projectEditorText = getProjectEditorText();

  const isRepositoriesValid = values.githubRepositories && values.githubRepositories.length > 0;

  // Wait for wallet
  if (sessionData.isMetadataLoading) {
    return <InfoSegment title="Checking account." description="Please, wait..." />;
  }

  // if (isAuthenticated && values.checkPreviousProjectDataStatus !== "ready") {
  //   return <InfoSegment title="Checking account." description="Please, wait..." />;
  // }

  // must be signed in
  if (!accountId) {
    return <InfoSegment title="Not logged in!" description="You must log in first!" />;
  }

  // If it is Edit & not the owner
  if (!isOwner && socialDbSnapshot) {
    return (
      <InfoSegment
        title="You're not the owner of this project!"
        description="You can't edit this project."
      />
    );
  }

  const isEdit = !!socialDbSnapshot;

  // // DAO Status - In Progress
  // if (
  //   values.isDao &&
  //   values.daoProjectProposal &&
  //   values.daoProjectProposal?.status === "InProgress"
  // ) {
  //   return <DAOInProgress />;
  // }

  if (form.formState.isSubmitted && location.pathname === rootPathnames.CREATE_PROJECT) {
    return (
      <div className="m-auto flex w-full max-w-[816px] flex-col p-[3rem_0px] md:p-[4rem_0px]">
        <SuccessfulRegister
          registeredProject={values.isDao ? values.daoAddress || "" : accountId || ""}
          isEdit={isEdit}
        />
      </div>
    );
  }

  console.log("Form values:", values);

  console.log(form.formState.errors, form.formState.isValid);

  // console.log({ stringifiedDefaultValues, stringifiedValues });

  console.log("isThereAChange?", isThereDiff, { isSubmitting });

  if (form.formState.isLoading) {
    return <InfoSegment title="Loading project data..." description="Please wait..." />;
  }

  return (
    // Container
    <Form {...form}>
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
              {(values?.teamMembers?.length ?? 0 > 0)
                ? "Add or remove team members"
                : "Add team members"}
            </Button>
          </LowerBannerContainerLeft>
          <AccountStack />
        </LowerBannerContainer>

        <AddTeamMembersModal
          open={addTeamModalOpen}
          onCloseClick={() => setAddTeamModalOpen(false)}
          onMembersChange={onMembersChangeHandler}
        />

        <AddFundingSourceModal
          open={addFundingModalOpen}
          editFundingIndex={editFundingIndex}
          onCloseClick={() => {
            setAddFundingModalOpen(false);
            setEditFundingIndex(undefined);
          }}
        />

        <EditSmartContractModal
          contractIndex={editContractIndex || 0}
          open={editContractIndex !== undefined}
          onCloseClick={() => {
            setEditContractIndex(undefined);
          }}
        />

        {/* <ErrorModal
          open={!!errors}
          errorMessage={values.submissionError}
          onCloseClick={resetUrl}
        /> */}

        <SubHeader
          title={values.isDao ? "Project details (DAO)" : "Project details"}
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
                  error: errors.name?.message,
                  ...field,
                }}
              />
            )}
          />

          <ProjectCategoryPicker
            onValuesChange={categoryChangeHandler}
            defaultValues={defaultValues.categories}
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
                error={errors.description?.message}
                field={field}
                currentText={values.description}
              />
            )}
          />
          <>
            {values.categories?.includes("Public Good") ? (
              <FormField
                control={form.control}
                name="publicGoodReason"
                render={({ field }) => (
                  <CustomTextForm
                    showHint
                    label="Why do you consider yourself a public good?"
                    placeholder="Type the reason"
                    error={errors.publicGoodReason?.message}
                    field={field}
                    currentText={values.publicGoodReason}
                  />
                )}
              />
            ) : null}
          </>
        </Row>

        <SubHeader title="Smart contracts" className="mt-16" />
        <Row>
          <SmartContracts onEditClickHandler={setEditContractIndex} />
        </Row>

        <SubHeader title="Funding sources" className="mt-16" />

        <FundingSourceTable
          onEditClick={(fundingIndex: number) => {
            setEditFundingIndex(fundingIndex);
            setAddFundingModalOpen(true);
          }}
        />

        <div className="mt-6">
          <button
            className="font-500 flex items-center gap-2 text-[14px] text-[#dd3345] transition-all hover:opacity-[0.7]"
            onClick={() => setAddFundingModalOpen(true)}
          >
            <PlusIcon width={12} height={12} /> Add funding source
          </button>
        </div>

        {/* <SubHeader title="Repositories" required={values.isRepositoryRequired} className="mt-16" /> */}

        <Row>
          <Repositories onChange={onChangeRepositories} />
        </Row>

        <div className="mt-6">
          <button
            className="font-500 flex items-center gap-2 text-[14px] text-[#dd3345] transition-all hover:opacity-[0.7]"
            onClick={() => {
              addRepository();
            }}
          >
            <PlusIcon width={12} height={12} /> Add more repos
          </button>
        </div>

        <SubHeader title="Social links" className="mt-16" />
        <Row>
          <SocialLinks />
        </Row>

        <div className="mt-16 flex self-end">
          <Button
            className="mr-4"
            variant="standard-outline"
            onClick={() => {
              router.push(rootPathnames.PROJECTS_LIST);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="standard-filled"
            type="submit"
            disabled={isSubmitting || !isThereDiff}
            onClick={onSubmit}
          >
            {projectEditorText}
          </Button>
        </div>
      </div>
    </Form>
  );
};
