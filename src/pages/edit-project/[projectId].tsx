import { PageWithBanner, SpinnerOverlay } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useSession } from "@/entities/_shared/session";
import { ProjectEditor, useInitProjectState } from "@/features/profile-setup";

export default function EditProjectPage() {
  const { isSignedIn, accountId } = useSession();
  useInitProjectState();

  return (
    <PageWithBanner>
      {!isSignedIn ? (
        <div className="h-108 w-full flex-col items-center justify-center">
          <h1 className="prose">You need to be athenticated blah blah blah</h1>
          <SpinnerOverlay />
        </div>
      ) : (
        <>
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
              {
                "Create a profile for your project to receive donations and qualify for funding rounds."
              }
            </h2>
          </section>

          {!isSignedIn && <SpinnerOverlay />}
          {accountId && <ProjectEditor accountId={accountId} />}
        </>
      )}
    </PageWithBanner>
  );
}
