import { useEffect, useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

import { Button } from "@/common/ui/components";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/common/ui/components/carousel";

import { CampaignProgressBar } from "./CampaignProgressBar";

export const FeaturedCampaigns = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const NO_IMAGE =
    "https://i.near.social/magic/large/https://near.social/magic/img/account/null.near";

  const dummy = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
  ];

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
          {dummy.map((data) => (
            <CarouselItem
              key={data.id}
              className="md:flex-row flex w-full flex-col items-start justify-between gap-4"
            >
              <div className="md:h-[285px] h-293px md:w-[68%] relative">
                <Image
                  src="/assets/images/profile-banner.png"
                  alt=""
                  className="md:rounded inset-1 h-full w-full"
                  width={500}
                  height={300}
                />
                <div className="absolute inset-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>{" "}
                <div className="absolute bottom-0 z-40 flex flex-col items-start gap-2 p-4">
                  <h1 className="text-[24px] font-bold text-white">
                    Campaign Header
                  </h1>
                  <div className="md:flex-row md:items-center md:text-[15px] m-0 flex flex-col items-start gap-2 p-0 text-[12px] text-white">
                    <div className="flex gap-1">
                      <p className="font-semibold">FOR</p>
                      <Image
                        alt=""
                        src={NO_IMAGE}
                        width={20}
                        height={20}
                        className="rounded-[50%]"
                      />
                      <p className="font-semibold">MagicBuild</p>
                    </div>
                    <div className="md:flex hidden flex-col items-center bg-gray-800">
                      <span className="h-[18px] w-[2px] bg-white text-white" />{" "}
                    </div>
                    <div className="flex gap-1">
                      <p className="font-semibold">ORGANIZED BY</p>
                      <Image
                        alt=""
                        src={NO_IMAGE}
                        width={20}
                        height={20}
                        className="rounded-[50%]"
                      />
                      <p className="font-semibold">Username.near</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-[28%] md:p-0 flex flex-col items-center p-4">
                <CampaignProgressBar
                  target={10000}
                  minAmount={1000}
                  amount={900}
                />
                <p className="mt-4">
                  Lorem ipsum dolor sit amet consectetur. Duis fermentum turpis
                  vitae mi augue erat et lectus. Auctor a diam amet sagittis dui
                  at accumsan adipiscing. Suspendisse sapien ante dolor id leo.
                  Placerat convallis enim est diam ipsum tempor.
                </p>
                <Button className="mt-4 w-full" disabled>
                  Donate
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
