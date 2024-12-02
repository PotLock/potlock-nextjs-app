import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/router";
import { Form } from "react-hook-form";
import { prop } from "remeda";

import PlusIcon from "@/common/assets/svgs/PlusIcon";
import { Button, FormField } from "@/common/ui/components";
import { useAuth } from "@/modules/auth/hooks/store";
import useWallet from "@/modules/auth/hooks/wallet";
import ErrorModal from "@/modules/core/components/ErrorModal";
import routesPath from "@/modules/core/routes";
import { dispatch, useGlobalStoreSelector } from "@/store";

import {
  AccountStack,
  CustomInput,
  CustomTextForm,
  ProjectCategoryPicker,
  Row,
} from "./components";
import { LowerBannerContainer, LowerBannerContainerLeft } from "./styles";
import SubHeader from "./SubHeader";
import { useProjectEditorForm } from "../../hooks/forms";
import AddFundingSourceModal from "../AddFundingSourceModal";
import AddTeamMembersModal from "../AddTeamMembersModal";
import DAOInProgress from "../DAOInProgress";
import EditSmartContractModal from "../EditSmartContractModal";
import FundingSourceTable from "../FundingSourceTable";
import InfoSegment from "../InfoSegment/InfoSegment";
import Profile from "../Profile";
import Repositories from "../Repositories";
import { SmartContracts } from "../SmartContracts";
import SocialLinks from "../SocialLinks";
import SuccessfulRegister from "../SuccessfulRegister";

const CreateForm = () => {
  const router = useRouter();
  const { projectId: projectIdPathParam } = router.query;

  const projectId =
    typeof projectIdPathParam === "string" ? projectIdPathParam : projectIdPathParam?.at(0);

  const projectTemplate = useGlobalStoreSelector(prop("projectEditor"));
  const { wallet, isWalletReady } = useWallet();
  const { isAuthenticated } = useAuth();
  const { form, errors, onSubmit } = useProjectEditorForm();
  const values = form.watch();

  const isOwner = projectTemplate.isDao
    ? projectId === projectTemplate.daoAddress
    : projectId === wallet?.accountId;

  useEffect(() => {
    // Set initial focus to name input.
    form.setFocus("name");
  }, [form]);

  // Set default values by profile
  useEffect(() => form.reset(projectTemplate), [form, projectTemplate]);

  // Set initial name
  const [initialNameSet, setInitialNameSet] = useState(false);
  useEffect(() => {
    if (!initialNameSet && projectTemplate.name) {
      form.setValue("name", projectTemplate.name);
      form.trigger(); // re-validate
      setInitialNameSet(true);
    }
  }, [initialNameSet, projectTemplate.name, form]);

  // Store description, public good reason and daoAddress
  useEffect(() => {
    if (values.name) {
      dispatch.projectEditor.setProjectName(values.name);
    }
    if (values.description) {
      dispatch.projectEditor.updateDescription(values.description);
    }
    if (values.publicGoodReason) {
      dispatch.projectEditor.updatePublicGoodReason(values.publicGoodReason);
    }
  }, [values.description, values.publicGoodReason, values.name]);

  const categoryChangeHandler = useCallback(
    (categories: string[]) => {
      dispatch.projectEditor.setCategories(categories);
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

  const projectEditorText = projectTemplate.isEdit
    ? projectTemplate.isDao
      ? "Add proposal to update project"
      : "Update your project"
    : projectTemplate.isDao
      ? "Add proposal to create project"
      : "Create new project";

  const isRepositoriesValid = projectTemplate.isRepositoryRequired
    ? projectTemplate.githubRepositories
      ? projectTemplate.githubRepositories?.length > 0
      : true
    : true;

  // Wait for wallet
  if (!isWalletReady) {
    return <InfoSegment title="Checking account." description="Please, wait..." />;
  }

  if (isAuthenticated && projectTemplate.checkPreviousProjectDataStatus !== "ready") {
    return <InfoSegment title="Checking account." description="Please, wait..." />;
  }

  // must be signed in
  if (!isAuthenticated) {
    return <InfoSegment title="Not logged in!" description="You must log in first!" />;
  }

  // If it is Edit & not the owner
  if (!isOwner && projectTemplate.isEdit) {
    return (
      <InfoSegment
        title="You're not the owner of this project!"
        description="You can't edit this project."
      />
    );
  }

  // DAO Status - In Progress
  if (
    projectTemplate.isDao &&
    projectTemplate.daoProjectProposal &&
    projectTemplate.daoProjectProposal?.status === "InProgress"
  ) {
    return <DAOInProgress />;
  }

  if (
    projectTemplate.submissionStatus === "done" &&
    location.pathname === routesPath.CREATE_PROJECT
  ) {
    return (
      <div className="md:p-[4rem_0px] m-auto flex w-full max-w-[816px] flex-col p-[3rem_0px]">
        <SuccessfulRegister
          registeredProject={
            projectTemplate.isDao ? projectTemplate.daoAddress || "" : wallet?.accountId || ""
          }
          isEdit={projectTemplate.isEdit}
        />
      </div>
    );
  }

  return (
    // Container
    <Form {...form}>
      <div className="md:p-[4rem_0px] m-auto flex w-full max-w-[816px] flex-col p-[3rem_0px]">
        <SubHeader title="Upload banner and profile Image" required />
        <Profile />
        <LowerBannerContainer>
          <LowerBannerContainerLeft>
            <Button
              variant="brand-plain"
              className="font-600"
              onClick={() => setAddTeamModalOpen(true)}
            >
              {projectTemplate.teamMembers.length > 0
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
          open={!!projectTemplate.submissionError}
          errorMessage={projectTemplate.submissionError}
          onCloseClick={resetUrl}
        />

        <SubHeader
          title={projectTemplate.isDao ? "Project details (DAO)" : "Project details"}
          required
          className="mt-16"
        />

        <Row>
          <FormField
            control={form.control}
            name="name"
            defaultValue={projectTemplate.name}
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
            defaultValues={projectTemplate.categories}
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
                currentText={projectTemplate.description}
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
                currentText={projectTemplate.publicGoodReason}
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

        <SubHeader
          title="Repositories"
          required={projectTemplate.isRepositoryRequired}
          className="mt-16"
        />

        <Row>
          <Repositories onChange={onChangeRepositories} />
        </Row>

        <div className="mt-6">
          <button
            className="font-500 flex items-center gap-2 text-[14px] text-[#dd3345] transition-all hover:opacity-[0.7]"
            onClick={() => {
              dispatch.projectEditor.addRepository();
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
            disabled={!form.formState.isValid || !isRepositoriesValid}
            onClick={onSubmit}
          >
            {projectEditorText}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default CreateForm;
