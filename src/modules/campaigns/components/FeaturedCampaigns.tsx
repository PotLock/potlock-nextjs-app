import { useEffect, useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { Campaign } from "@/common/contracts/potlock";
import { yoctoNearToFloat } from "@/common/lib";
import { fetchSocialImages } from "@/common/services/near-socialdb";
import { Button } from "@/common/ui/components";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/common/ui/components/carousel";

import { CampaignProgressBar } from "./CampaignProgressBar";

export const FeaturedCampaigns = ({ data }: { data: Campaign[] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  console.log(data);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="mt-8 w-full p-0 ">
      <div className="md:p-0 mb-4 flex w-full flex-row justify-between p-2">
        <div className=" flex items-center gap-4 ">
          <h1 className=" text-[18px] font-semibold ">Featured Campaigns</h1>
          <p className="text-[18px]">{current + 1}/3</p>
        </div>
        <div className="flex gap-4">
          <ArrowLeft
            onClick={() => api?.scrollTo(current - 1)}
            className="cursor-pointer rounded-full border border-gray-400 text-[14px] text-gray-500"
          />
          <ArrowRight
            onClick={() => api?.scrollTo(current + 1)}
            className="cursor-pointer rounded-full border border-gray-400 text-gray-500"
          />
        </div>
      </div>
      <Carousel opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {data.length &&
            data?.map((data) => (
              <FeaturedCampaignCard key={data.id} data={data} />
            ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

const FeaturedCampaignCard = ({ data }: { data: Campaign }) => {
  const [recepientImage, setRecepientImage] = useState<string>();
  const [ownerImage, setOwnerImage] = useState<string>();

  useEffect(() => {
    const fetchImages = async () => {
      const { image } = await fetchSocialImages({ accountId: data.recipient });
      const { image: ownerImage } = await fetchSocialImages({
        accountId: data.owner,
      });
      setOwnerImage(ownerImage);
      setRecepientImage(image);
    };
    fetchImages();
  }, [data]);

  return (
    <CarouselItem key={data.id}>
      <Link
        className="md:flex-row flex w-full flex-col items-start justify-between gap-4"
        href={`/campaign/${data.id}/leaderboard`}
        passHref
      >
        <div className="md:h-[285px] h-293px md:w-[68%] relative">
          <LazyLoadImage
            src={data?.cover_image_url || ""}
            alt=""
            className="md:rounded inset-1 h-full w-full object-cover"
            width={500}
            height={300}
          />
          <div className="absolute inset-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>{" "}
          <div className="absolute bottom-0 z-40 flex flex-col items-start gap-2 p-4">
            <h1 className="text-[24px] font-bold text-white">{data.name}</h1>
            <div className="md:flex-row md:items-center md:text-[15px] m-0 flex flex-col items-start gap-2 p-0 text-[12px] text-white">
              <div className="flex gap-1">
                <p className="font-semibold">FOR</p>
                <Link href={`/profile/${data.recipient}`} target="_blank">
                  <div onClick={(e) => e.stopPropagation()} className="flex">
                    <LazyLoadImage
                      alt=""
                      src={recepientImage}
                      width={20}
                      height={20}
                      className=" mx-1 h-5 w-5 rounded-[50%]"
                    />
                    <p className="font-semibold">{data.recipient}</p>
                  </div>
                </Link>
              </div>
              <div className="md:flex hidden flex-col items-center bg-gray-800">
                <span className="h-[18px] w-[2px] bg-white text-white" />{" "}
              </div>
              <div className="flex gap-1">
                <p className="font-semibold">ORGANIZED BY</p>
                <Link href={`/profile/${data.owner}`} target="_blank">
                  <div onClick={(e) => e.stopPropagation()} className="flex">
                    <LazyLoadImage
                      alt=""
                      src={ownerImage}
                      width={20}
                      height={10}
                      className="mx-1 h-5 w-5 rounded-[100%]"
                    />
                    <p className="font-semibold">{data.owner}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-[28%] md:p-0 flex flex-col items-start p-4">
          <CampaignProgressBar
            target={yoctoNearToFloat(data.target_amount)}
            minAmount={0}
            amount={Number(data.total_raised_amount)}
          />
          <p className="mt-4 text-start">{data.description}</p>
          <Button className="mt-4 w-full" disabled>
            Donate
          </Button>
        </div>
      </Link>
    </CarouselItem>
  );
};
