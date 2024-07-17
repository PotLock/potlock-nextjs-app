"use client";

import ScreenSpinner from "@/modules/core/components/ScreenSpinner";
import CreateForm from "@/modules/create-project/components/CreateForm";
import Header from "@/modules/create-project/components/Header";
import useInitProjectState from "@/modules/create-project/hooks/useInitProjectState";

import { useTypedSelector } from "../../_store";

export default function CreateProject() {
  useInitProjectState();

  // state used to show spinner during the data post
  const {
    submissionStatus,
    checkRegistrationStatus,
    checkPreviousProjectDataStatus,
    isEdit,
  } = useTypedSelector((state) => state.createProject);

  const showSpinner =
    submissionStatus === "sending" ||
    checkRegistrationStatus !== "ready" ||
    checkPreviousProjectDataStatus !== "ready";

  return (
    <main className="flex flex-col">
      {showSpinner && <ScreenSpinner />}
      <Header edit={isEdit} />
      <CreateForm />
    </main>
  );
}
