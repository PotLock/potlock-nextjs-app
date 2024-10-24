import { useRouteQuery, yoctoNearToFloat } from "@/common/lib"
import { useCampaign } from "../hooks/useCampaign"
import { AccountProfilePicture } from "@/modules/core"
import { walletApi } from "@/common/api/near"
import { NearIcon } from "@/common/assets/svgs"
import { useState } from "react"
import { CampaignForm } from "./CampaignForm"


export const CampaignSettings = () => {
    const [openEditCampaign, setOpenEditCampaign] = useState<boolean>(false)
    const { query: { campaignId } } = useRouteQuery()
    const { campaign } = useCampaign({ campaignId: campaignId as string })

    if (!campaign) return <></>

    const getTime = (timestamp: any) => new Date(timestamp).toLocaleString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: "UTC"
    })
    return (
        <div className="w-full md:mx-3 md:w-[70%]">
            <div className="w-full flex flex-col gap-6 md:gap-0 md:flex-row md:items-center justify-between">
                <div className="flex md:w-[40%] gap-5 md:flex-row items-start flex-wrap justify-between md:items-center">
                    <div className="flex gap-2 flex-col">
                        <p className="text-[#7B7B7B]">Organizer</p>
                        <div className="flex gap-2 items-center">
                            <AccountProfilePicture accountId={campaign?.owner as string} className="w-6 h-6" />
                            <p className="font-medium">{campaign?.owner}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-col">
                        <p className="text-[#7B7B7B]">Project</p>
                        <div className="flex gap-2 items-center">
                            <AccountProfilePicture accountId={campaign?.recipient as string} className="w-6 h-6" />
                            <p className="font-medium">{campaign?.recipient}</p>
                        </div>
                    </div>
                </div>
                {walletApi.accountId === campaign?.owner && (
                    <div>
                        <p onClick={() => setOpenEditCampaign(!openEditCampaign)} role="button" className="text-red-500">Edit Campaign</p>
                    </div>
                )
                }
            </div>
            {!openEditCampaign ? (
                <div className="w-full border mt-8 p-6 border-solid rounded-[12px] border-[#DBDBDB]">
                    <div>
                        <h1 className="text-xl font-semibold mb-4">{campaign?.name}</h1>
                        <p className="text-[#292929]">{campaign?.description}</p>
                    </div>
                    <div className="mt-12 flex items-center flex-wrap w-full md:w-[80%] justify-between">
                        <BarCard title="Funding goal" value={`${yoctoNearToFloat(campaign?.target_amount as string)} NEAR`} hasLogo />
                        <BarCard title="Campaign duration" value={`${getTime(campaign?.start_ms)} - ${campaign?.end_ms ? getTime(campaign?.end_ms) : "Ongoing"}`} />
                        <BarCard title="Minimum target" value={campaign?.min_amount ? `${yoctoNearToFloat(campaign?.min_amount as string)} NEAR` : "N/A"} hasLogo={!!campaign?.min_amount} />
                        <BarCard title="Maximum target" value={campaign?.max_amount ? `${yoctoNearToFloat(campaign?.max_amount as string)} NEAR` : "N/A"} hasLogo={!!campaign?.max_amount} />
                    </div>
                </div>

            ) : <CampaignForm existingData={campaign} />}
        </div>

    )
}

const BarCard = ({ title, value, hasLogo }: { title: string, value: any, hasLogo?: boolean }) => {
    return (
        <div className="flex w-[50%] mb-5 flex-col gap-1 items-start">
            <p className="text-sm text-[#656565]">{title}</p>
            <h2 className="text-[16px] flex items-center font-semibold">
                {hasLogo && (
                    <NearIcon className="w-5 mr-1 h-5" />
                )}
                {value}
            </h2>
        </div>
    )
}