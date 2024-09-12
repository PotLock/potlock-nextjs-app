import ScreenSpinner from "@/common/ui/components/ScreenSpinner";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import CreateForm from "@/modules/project-editor/components/CreateForm";
import Header from "@/modules/project-editor/components/Header";
import useInitProjectState from "@/modules/project-editor/hooks/useInitProjectState";
import { useTypedSelector } from "@/store";

export default function CreateProject() {
  const { isAuthenticated } = useAuth();
  useInitProjectState();

  // state used to show spinner during the data post
  const {
    submissionStatus,
    checkRegistrationStatus,
    checkPreviousProjectDataStatus,
    isEdit,
  } = useTypedSelector((state) => state.projectEditor);

  const showSpinner = isAuthenticated
    ? submissionStatus === "sending" ||
      checkRegistrationStatus !== "ready" ||
      checkPreviousProjectDataStatus !== "ready"
    : false;

  return (
    <main className="flex flex-col">
      {showSpinner && <ScreenSpinner />}
      <Header edit={isEdit} />
      <CreateForm />
    </main>
  );
}
