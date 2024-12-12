import { PageWithBanner } from "@/common/ui/components";
import { CampaignForm } from "@/entities/campaign/components/CampaignForm";
import { useCampaignDeploymentRedirect } from "@/entities/campaign/hooks/redirects";

export default function CreateCampaign() {
  useCampaignDeploymentRedirect();
  return (
    <PageWithBanner>
      <div className="bg-hero relative flex min-h-[400px] w-full flex-col justify-center overflow-hidden">
        <div className="flex w-full items-center justify-center text-center">
          <h1 className="font-500 font-lora  mb-6 mt-0 text-[24px] md:text-[32px]">
            Create Your Campaign to{" "}
            <span className="font-500 font-lora text-[64px] leading-[72px] tracking-tighter">
              Make a Difference
            </span>{" "}
            <br /> And Get Your Project Funded
          </h1>
        </div>
      </div>
      <CampaignForm />
    </PageWithBanner>
  );
}
