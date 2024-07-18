"use client";

import ScreenSpinner from "@/common/ui/components/ScreenSpinner";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import CreateForm from "@/modules/create-project/components/CreateForm";
import Header from "@/modules/create-project/components/Header";
import useInitProjectState from "@/modules/create-project/hooks/useInitProjectState";

import { useTypedSelector } from "../_store";

export default function CreateProject() {
  const { isAuthenticated } = useAuth();
  useInitProjectState();

  // state used to show spinner during the data post
  const {
    submissionStatus,
    checkRegistrationStatus,
    checkPreviousProjectDataStatus,
  } = useTypedSelector((state) => state.createProject);

  const showSpinner = isAuthenticated
    ? submissionStatus === "sending" ||
      checkRegistrationStatus !== "ready" ||
      checkPreviousProjectDataStatus !== "ready"
    : false;

  return (
    <main className="flex flex-col">
      {showSpinner && <ScreenSpinner />}
      <Header />
      <CreateForm />
    </main>
  );
}
