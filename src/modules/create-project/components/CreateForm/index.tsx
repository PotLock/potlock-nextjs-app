import { ChangeEvent, useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { Form } from "react-hook-form";

import { dispatch, useTypedSelector } from "@/app/_store";
import PlusIcon from "@/common/assets/svgs/PlusIcon";
import { Button, FormField } from "@/common/ui/components";
import Radio from "@/common/ui/components/inputs/Radio";
import useWallet from "@/modules/auth/hooks/useWallet";
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
import SuccessfulRegister from "../SuccessfullRegister";

const CreateForm = () => {
  const projectProps = useTypedSelector((state) => state.createProject);
  const { wallet, isWalletReady } = useWallet();
  const { form, errors, onSubmit } = useCreateProjectForm();
  const values = form.watch();
  const router = useRouter();

  // Set default values by profile
  useEffect(() => {
    form.setValue("name", projectProps.name);
    form.setValue("isDao", false); // default value
    form.setValue("backgroundImage", projectProps.backgroundImage);
    form.setValue("profileImage", projectProps.profileImage);
    form.setValue("description", projectProps.description);
    form.setValue("publicGoodReason", projectProps.publicGoodReason);
  }, [
    projectProps.name,
    projectProps.backgroundImage,
    projectProps.profileImage,
    projectProps.description,
    projectProps.publicGoodReason,
    form,
  ]);

  // Store description, public good reason and daoAddress
  useEffect(() => {
    if (values.description) {
      dispatch.createProject.updateDescription(values.description);
    }
    if (values.publicGoodReason) {
      dispatch.createProject.updatePublicGoodReason(values.publicGoodReason);
    }
    if (values.daoAddress) {
      dispatch.createProject.setDaoAddress(values.daoAddress);
    }
  }, [values.description, values.publicGoodReason, values.daoAddress]);

  const isDaoChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const _isDao = e.target.value === "yes";
      dispatch.createProject.setIsDao(_isDao);
      form.setValue("isDao", _isDao);

      if (!_isDao) {
        form.setValue("daoAddress", "");
      }
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

  const onMembersChangeHandler = useCallback(
    (members: string[]) => {
      form.setValue("teamMembers", members);
    },
    [form],
  );

  const onChangeRepositories = useCallback(
    (repositories: string[]) => {
      form.setValue("githubRepositories", repositories);
    },
    [form],
  );

  const [addTeamModalOpen, setAddTeamModalOpen] = useState(false);
  const [addFundingModalOpen, setAddFundingModalOpen] = useState(false);
  const [editFundingIndex, setEditFundingIndex] = useState<number>(); // controls if a funding is being edited
  const [editContractIndex, setEditContractIndex] = useState<number>();

  // must be signed in
  if (isWalletReady && !wallet?.accountId) {
    return (
      <InfoSegment
        title="Not logged in!"
        description="You must log in to create a new project!"
      />
    );
  }

  if (projectProps.submissionStatus === "done") {
    return (
      <div className="m-auto flex w-full max-w-[816px] flex-col p-[3rem_0px] md:p-[4rem_0px]">
        <SuccessfulRegister registeredProject={wallet?.accountId || ""} />
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
                  error: projectProps.isDao ? errors.daoAddress?.message : "",
                  ...field,
                  ...(!projectProps.isDao
                    ? { value: projectProps.accountId }
                    : {}),
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
            Update your project
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default CreateForm;
