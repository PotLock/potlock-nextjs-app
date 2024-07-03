"use client";

import CreateForm from "@/modules/create-project/components/CreateForm";
import Header from "@/modules/create-project/components/Header";

export default function CreateProject() {
  return (
    <main className="flex flex-col">
      <Header />
      <CreateForm />
    </main>
  );
}
