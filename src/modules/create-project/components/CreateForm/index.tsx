import { useCallback, useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { Form } from "react-hook-form";

import { dispatch, useTypedSelector } from "@/app/_store";
import PlusIcon from "@/common/assets/svgs/PlusIcon";
import { Button, FormField } from "@/common/ui/components";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import useWallet from "@/modules/auth/hooks/useWallet";
import ErrorModal from "@/modules/core/components/ErrorModal";
import routesPath from "@/modules/core/routes";

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
import AddFundingSourceModal from "../AddFundingSourceModal";
import AddTeamMembersModal from "../AddTeamMembersModal";
import EditSmartContractModal from "../EditSmartContractModal";
import FundingSourceTable from "../FundingSourceTable";
import InfoSegment from "../InfoSegment/InfoSegment";
import Profile from "../Profile";
import Repositories from "../Repositories";
import { SmartContracts } from "../SmartContracts";
import SocialLinks from "../SocialLinks";
import SuccessfulRegister from "../SuccessfulRegister";
import DAOInProgress from "../DAOInProgress";

const CreateForm = () => {
  const projectProps = useTypedSelector((state) => state.createProject);
  const { wallet, isWalletReady } = useWallet();
  const { isAuthenticated } = useAuth();
  const params = useParams<{ projectId?: string }>();
  const { form, errors, onSubmit } = useCreateProjectForm();
  const values = form.watch();
  const router = useRouter();

  const isOwner = projectProps.isDao
    ? params.projectId === projectProps.daoAddress
    : params.projectId === wallet?.accountId;

  useEffect(() => {
    // Set initial focus to name input.
    form.setFocus("name");
  }, [form]);

  // Set default values by profile
  useEffect(() => {
    form.setValue("isDao", false); // default value
    form.setValue("backgroundImage", projectProps.backgroundImage);
    form.setValue("profileImage", projectProps.profileImage);
    form.setValue("description", projectProps.description);
    form.setValue("publicGoodReason", projectProps.publicGoodReason);
    form.setValue("fundingSources", projectProps.fundingSources);
  }, [
    projectProps.backgroundImage,
    projectProps.profileImage,
    projectProps.description,
    projectProps.publicGoodReason,
    projectProps.fundingSources,
    form,
  ]);

  // Set initial name
  const [initialNameSet, setInitialNameSet] = useState(false);
  useEffect(() => {
    if (!initialNameSet) {
      form.setValue("name", projectProps.name);
      setInitialNameSet(true);
    }
  }, [initialNameSet, projectProps.name, form]);

  // Store description, public good reason and daoAddress
  useEffect(() => {
    if (values.name) {
      dispatch.createProject.setProjectName(values.name);
    }
    if (values.description) {
      dispatch.createProject.updateDescription(values.description);
    }
    if (values.publicGoodReason) {
      dispatch.createProject.updatePublicGoodReason(values.publicGoodReason);
    }
  }, [values.description, values.publicGoodReason, values.name]);

  const categoryChangeHandler = useCallback(
    (categories: string[]) => {
      dispatch.createProject.setCategories(categories);
      form.setValue("categories", categories);
      form.trigger(); // re-validate
    },
    [form],
  );

  const onMembersChangeHandler = useCallback(
    (members: string[]) => {
      form.setValue("teamMembers", members);
    },
    [form],
  );

  const onChangeRepositories = useCallback(
    (repositories: string[]) => {
      form.setValue("githubRepositories", repositories);
      form.trigger(); // re-validate
    },
    [form],
  );

  const resetUrl = useCallback(() => {
    router.push(routesPath.CREATE_PROJECT);
  }, [router]);

  const [addTeamModalOpen, setAddTeamModalOpen] = useState(false);
  const [addFundingModalOpen, setAddFundingModalOpen] = useState(false);
  const [editFundingIndex, setEditFundingIndex] = useState<number>(); // controls if a funding is being edited
  const [editContractIndex, setEditContractIndex] = useState<number>();

  const createProjectText = projectProps.isEdit
    ? projectProps.isDao
      ? "Add proposal to update project"
      : "Update your project"
    : projectProps.isDao
      ? "Add proposal to create project"
      : "Create new project";

  // Wait for wallet
  if (!isWalletReady) {
    return (
      <InfoSegment title="Checking account." description="Please, wait..." />
    );
  }

  // must be signed in
  if (!isAuthenticated) {
    return (
      <InfoSegment
        title="Not logged in!"
        description="You must log in first!"
      />
    );
  }

  // If it is Edit & not the owner
  if (!isOwner && projectProps.isEdit) {
    return (
      <InfoSegment
        title="You're not the owner of this project!"
        description="You can't edit this project."
      />
    );
  }

  // DAO Status - In Progress
  if (
    projectProps.isDao &&
    projectProps.daoProjectProposal &&
    projectProps.daoProjectProposal?.status === "InProgress"
  ) {
    return <DAOInProgress />;
  }

  if (
    projectProps.submissionStatus === "done" &&
    location.pathname === routesPath.CREATE_PROJECT
  ) {
    return (
      <div className="m-auto flex w-full max-w-[816px] flex-col p-[3rem_0px] md:p-[4rem_0px]">
        <SuccessfulRegister
          registeredProject={
            projectProps.isDao
              ? projectProps.daoAddress || ""
              : wallet?.accountId || ""
          }
          isEdit={projectProps.isEdit}
        />
      </div>
    );
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

        <ErrorModal
          open={!!projectProps.submissionError}
          errorMessage={projectProps.submissionError}
          onCloseClick={resetUrl}
        />

        <SubHeader
          title={
            projectProps.isDao ? "Project details (DAO)" : "Project details"
          }
          required
          className="mt-16"
        />

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
                showHint
                label="Describe your project *"
                placeholder="Type description"
                error={errors.description?.message}
                field={field}
                currentText={projectProps.description}
              />
            )}
          />

          <FormField
            control={form.control}
            name="publicGoodReason"
            render={({ field }) => (
              <CustomTextForm
                showHint
                label="Why do you consider yourself a public good? *"
                placeholder="Type the reason"
                error={errors.publicGoodReason?.message}
                field={field}
                currentText={projectProps.publicGoodReason}
              />
            )}
          />
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

        <SubHeader title="Repositories" required className="mt-16" />

        <Row>
          <Repositories onChange={onChangeRepositories} />
        </Row>

        <div className="mt-6">
          <button
            className="font-500 flex items-center gap-2 text-[14px] text-[#dd3345] transition-all hover:opacity-[0.7]"
            onClick={() => {
              dispatch.createProject.addRepository();
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
              router.push(routesPath.PROJECTS_LIST);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="standard-filled"
            disabled={!form.formState.isValid}
            onClick={onSubmit}
          >
            {createProjectText}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default CreateForm;
