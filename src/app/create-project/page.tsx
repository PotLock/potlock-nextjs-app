"use client";

import CreateForm from "@/modules/create-project/components/CreateForm";
import Header from "@/modules/create-project/components/Header";
import useInitCreateProjectState from "@/modules/create-project/hooks/useInitCreateProjectState";

export default function CreateProject() {
  useInitCreateProjectState();

  return (
    <main className="flex flex-col">
      <Header />
      <CreateForm />
    </main>
  );
}
