import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/router";
import { Form } from "react-hook-form";

import { Button, FormField } from "@/common/ui/components";
import { useToast } from "@/common/ui/hooks";
import PlusIcon from "@/common/ui/svg/PlusIcon";
import {
  ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC,
  useAccountSocialProfile,
} from "@/entities/_shared/account";
import { rootPathnames } from "@/pathnames";

import AddFundingSourceModal from "./AddFundingSourceModal";
import AddTeamMembersModal from "./AddTeamMembersModal";
import EditSmartContractModal from "./EditSmartContractModal";
import {
  AccountStack,
  CustomInput,
  CustomTextForm,
  ProjectCategoryPicker,
  Row,
} from "./form-elements";
import FundingSourceTable from "./FundingSourceTable";
import { ProfileSetupImageUpload } from "./image-upload";
import Repositories from "./Repositories";
import { SmartContracts } from "./SmartContracts";
import SocialLinks from "./SocialLinks";
import { LowerBannerContainer, LowerBannerContainerLeft } from "./styles";
import SubHeader from "./SubHeader";
import { type ProfileSetupFormParams, useProfileSetupForm } from "../hooks/forms";
import { ProfileSetupInputs } from "../models/types";

export type ProfileSetupFormProps = Pick<ProfileSetupFormParams, "accountId" | "mode"> & {};

export const ProfileSetupForm: React.FC<ProfileSetupFormProps> = ({ accountId, mode }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [addTeamModalOpen, setAddTeamModalOpen] = useState(false);
  const [addFundingModalOpen, setAddFundingModalOpen] = useState(false);
  const [editFundingIndex, setEditFundingIndex] = useState<number>();
  const [editContractIndex, setEditContractIndex] = useState<number>();

  const {
    profile: socialDbSnapshot,
    avatarSrc,
    backgroundSrc,
  } = useAccountSocialProfile({ accountId });

  const defaultValues = useMemo<Partial<ProfileSetupInputs>>(
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

  const onSuccess = useCallback(() => {
    toast({ title: "Success!", description: "Project updated successfully" });
  }, [toast]);

  const onFailure = useCallback(
    (errorMessage: string) => toast({ title: "Error", description: errorMessage }),
    [toast],
  );

  const {
    form,
    values,
    isDisabled,
    isSubmitting,
    onSubmit,
    updateCategories,
    updateBackgroundImage,
    updateProfileImage,
    updateRepositories,
    updateTeamMembers,
    addRepository,
    errors,
  } = useProfileSetupForm({
    accountId,
    defaultValues,
    onSuccess,
    onFailure,
    mode,
  });

  useEffect(() => {
    // Set initial focus to name input.
    form.setFocus("name");
  }, [form]);

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

  console.log({ defaultValues });

  const getProjectEditorText = () => {
    if (socialDbSnapshot) {
      return values.isDao ? "Add proposal to update project" : "Update your project";
    }

    return values.isDao ? "Add proposal to create project" : "Create new project";
  };

  const projectEditorText = getProjectEditorText();

  // // DAO Status - In Progress
  // if (
  //   values.isDao &&
  //   values.daoProjectProposal &&
  //   values.daoProjectProposal?.status === "InProgress"
  // ) {
  //   return <DAOInProgress />;
  // }

  console.log("Form values:", values);

  console.log(form.formState.errors, form.formState.isValid);

  return (
    <Form {...form}>
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
          onMembersChange={onTeamMembersChange}
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
            onValuesChange={onCategoriesChange}
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
            {"Cancel"}
          </Button>

          <Button variant="standard-filled" type="submit" disabled={isDisabled} onClick={onSubmit}>
            {projectEditorText}
          </Button>
        </div>
      </div>
    </Form>
  );
};
