import { isClient } from "@wpdas/naxios";

import { WalletManagerProvider } from "@/common/contexts/wallet-manager";
import { PageWithBanner, SpinnerOverlay, SplashScreen } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useSession } from "@/entities/_shared/session";
import { ProjectEditor, useInitProjectState } from "@/features/profile-setup";
import { useGlobalStoreSelector } from "@/store";

export default function EditProjectPage() {
  const viewer = useSession();
  useInitProjectState();

  // state used to show spinner during the data post
  const { submissionStatus, checkRegistrationStatus, checkPreviousProjectDataStatus } =
    useGlobalStoreSelector((state) => state.projectEditor);

  const showSpinner = viewer.isSignedIn
    ? submissionStatus === "sending" ||
      checkRegistrationStatus !== "ready" ||
      checkPreviousProjectDataStatus !== "ready"
    : false;

  return (
    <PageWithBanner>
      <section
        className={cn(
          "flex w-full flex-col items-center gap-8 md:px-10 md:py-16",
          "2xl-rounded-lg bg-hero border-[#f8d3b0] px-5 py-12",
        )}
      >
        <h1 className="prose font-500 font-lora text-[32px] leading-[120%] md:text-[40px]">
          {"Edit Project"}
        </h1>

        <h2 className="prose max-w-[600px] text-center md:text-lg">
          {"Create a profile for your project to receive donations and qualify for funding rounds."}
        </h2>
      </section>

      {showSpinner && <SpinnerOverlay />}
      <ProjectEditor />
    </PageWithBanner>
  );
}

EditProjectPage.getLayout = function getLayout(page: React.ReactNode) {
  return isClient() ? (
    <WalletManagerProvider>{page}</WalletManagerProvider>
  ) : (
    <SplashScreen className="h-200" />
  );
};
