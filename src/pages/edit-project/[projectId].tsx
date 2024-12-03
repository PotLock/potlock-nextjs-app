import { PageWithBanner, SpinnerOverlay } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useSessionReduxStore } from "@/entities/session/hooks/redux-store";
import CreateForm from "@/features/project-editor/components/CreateForm";
import useInitProjectState from "@/features/project-editor/hooks/useInitProjectState";
import { useGlobalStoreSelector } from "@/store";

export default function EditProjectPage() {
  const { isAuthenticated } = useSessionReduxStore();
  useInitProjectState();

  // state used to show spinner during the data post
  const { submissionStatus, checkRegistrationStatus, checkPreviousProjectDataStatus } =
    useGlobalStoreSelector((state) => state.projectEditor);

  const showSpinner = isAuthenticated
    ? submissionStatus === "sending" ||
      checkRegistrationStatus !== "ready" ||
      checkPreviousProjectDataStatus !== "ready"
    : false;

  return (
    <PageWithBanner>
      <section
        className={cn(
          "md:px-10 md:py-16 flex w-full flex-col items-center gap-8",
          "2xl-rounded-lg border-[#f8d3b0] bg-hero px-5 py-12",
        )}
      >
        <h1 className="prose font-500 md:text-[40px] font-lora text-[32px] leading-[120%]">
          {"Edit Project"}
        </h1>

        <h2 className="prose md:text-lg max-w-[600px] text-center">
          {"Create a profile for your project to receive donations and qualify for funding rounds."}
        </h2>
      </section>

      {showSpinner && <SpinnerOverlay />}
      <CreateForm />
    </PageWithBanner>
  );
}
