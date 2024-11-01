import { PageWithBanner } from "@/common/ui/components";
import { CampaignForm } from "@/modules/campaigns/components/CampaignForm";
import { useCampaignDeploymentRedirect } from "@/modules/campaigns/hooks/redirects";

export default function CreateCampaign() {
  useCampaignDeploymentRedirect();
  return (
    <PageWithBanner>
      <div className="relative flex min-h-[400px] w-full flex-col justify-center overflow-hidden bg-hero">
        <div className="flex w-full items-center justify-center text-center">
          <h1 className="font-500 md:text-[32px]  mb-6 mt-0 font-lora text-[24px]">
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
