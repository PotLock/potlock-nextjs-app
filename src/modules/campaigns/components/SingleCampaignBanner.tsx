import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { Campaign } from "@/common/contracts/potlock";
import { get_campaign } from "@/common/contracts/potlock/campaigns";
import { yoctoNearToFloat } from "@/common/lib";
import { fetchSocialImages } from "@/common/services/near-socialdb";
import { Button } from "@/common/ui/components";
import { SocialsShare } from "@/common/ui/components/SocialShare";
import { useNearToUsdWithFallback } from "@/modules/core/hooks/useNearToUsdWithFallback";

import { CampaignProgressBar } from "./CampaignProgressBar";

export const SingleCampaignBanner = () => {
  const [campaign, setCampaign] = useState<Campaign>();
  const [ownerImage, setOwnerImage] = useState<string>();
  const [recipientImage, setRecipientImage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const usdInfo = useNearToUsdWithFallback(
    Number(campaign?.total_raised_amount || 0),
  );

  const {
    query: { campaignId },
  } = useRouter();

  useEffect(() => {
    if (!campaignId) return;
    setLoading(true);
    get_campaign({ campaign_id: parseInt(campaignId as string) as any })
      .then((response) => {
        console.log(response);
        setCampaign(response);
      })
      .catch((err) => console.error(err));

    const fetchImages = async () => {
      const { image } = await fetchSocialImages({
        accountId: campaign?.recipient as string,
      });
      const { image: ownerImage } = await fetchSocialImages({
        accountId: campaign?.owner as string,
      });
      setOwnerImage(ownerImage);
      setRecipientImage(image);
      setLoading(false);
    };
    fetchImages();
  }, [campaignId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="md:flex-row md:gap-0 flex w-full flex-col justify-between gap-4">
      <div className="md:w-[70%] w-full  rounded-xl border border-gray-300">
        <div className="relative">
          <LazyLoadImage
            className="md:rounded inset-1 h-[348px] w-full rounded-xl object-cover"
            src={campaign?.cover_image_url}
          />
          <div className="absolute inset-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>{" "}
          <div className="absolute bottom-0 z-40 flex flex-col items-start gap-2 p-4">
            <h1 className="text-[24px] font-bold text-white">
              {campaign?.name}
            </h1>
            <div className="md:flex-row md:items-center md:text-[15px] m-0 flex flex-col items-start gap-2 p-0 text-[12px] text-white">
              <div className="flex gap-1">
                <p className="font-semibold">FOR</p>
                <Link href={`/profile/${campaign?.recipient}`} target="_blank">
                  <div onClick={(e) => e.stopPropagation()} className="flex">
                    <LazyLoadImage
                      alt=""
                      src={recipientImage}
                      width={20}
                      height={20}
                      className=" mx-1 h-5 w-5 rounded-[50%]"
                    />
                    <p className="font-semibold">{campaign?.recipient}</p>
                  </div>
                </Link>
              </div>
              <div className="md:flex hidden flex-col items-center bg-gray-800">
                <span className="h-[18px] w-[2px] bg-white text-white" />{" "}
              </div>
              <div className="flex gap-1">
                <p className="font-semibold">ORGANIZED BY</p>
                <Link href={`/profile/${campaign?.owner}`} target="_blank">
                  <div onClick={(e) => e.stopPropagation()} className="flex">
                    <LazyLoadImage
                      alt=""
                      src={ownerImage}
                      width={20}
                      height={10}
                      className="mx-1 h-5 w-5 rounded-[100%]"
                    />
                    <p className="font-semibold">{campaign?.owner}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <p className="p-6">{campaign?.description}</p>
      </div>
      <div className="md:w-[27%] h-max w-full rounded-xl border border-[#DBDBDB] p-4">
        <div className="mb-5 border border-solid border-[#f4b37d] bg-[#fef6ee] p-4">
          <p className="text-[11px] font-semibold tracking-widest text-[#EA6A25]">
            TOTAL AMOUNT RAISED
          </p>
          <div className="flex items-baseline">
            <h1 className="text-xl font-semibold">
              {campaign?.total_raised_amount} NEAR
            </h1>
            <h2 className="text-base">{usdInfo}</h2>
          </div>
        </div>
        <CampaignProgressBar
          target={yoctoNearToFloat((campaign?.target_amount as string) || "0")}
          minAmount={0}
          amount={Number(campaign?.total_raised_amount)}
        />
        <div className="mt-6">
          <Button className="mb-4 w-full" variant="brand-filled">
            Donate
          </Button>
          <SocialsShare showButton />
        </div>
      </div>
    </div>
  );
};
