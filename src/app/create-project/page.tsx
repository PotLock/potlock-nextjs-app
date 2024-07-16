"use client";

import ScreenSpinner from "@/modules/core/components/ScreenSpinner";
import CreateForm from "@/modules/create-project/components/CreateForm";
import Header from "@/modules/create-project/components/Header";
import useInitProjectState from "@/modules/create-project/hooks/useInitProjectState";

import { useTypedSelector } from "../_store";

export default function CreateProject() {
  useInitProjectState();

  // state used to show spinner during the data post
  const isSubmittingProject = useTypedSelector(
    (state) => state.createProject.submissionStatus === "sending",
  );

  return (
    <main className="flex flex-col">
      {isSubmittingProject && <ScreenSpinner />}
      <Header />
      <CreateForm />
    </main>
  );
}
