import { CampaignDonation } from "@/common/contracts/potlock"
import { yoctoNearToFloat } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import { useProfileData } from "@/modules/profile";
import { LazyLoadImage } from "react-lazy-load-image-component";

export const CampaignDonationItem = ({
    donation,
    campaignId,
}: {
    donation: CampaignDonation;
    campaignId: string;
}) => {
const {recipient_id, donor_id, total_amount, donated_at_ms } = donation
const {avatarSrc: src} = useProfileData(recipient_id)


    return (
        <div className="flex justify-between gap-8 text-sm p-2 flex-wrap md:gap-4">
            <div className="flex items-center gap-4 flex-1 max-w-full">
                <div className="h-[2.5em] w-[2.5em]">
                <LazyLoadImage 
                    {...{ src }}
                    className="h-full w-full rounded-full object-cover align-middle"
                    />
                    </div>
                    <div>
                        {donor_id === recipient_id? "You" : donor_id}
                    </div>
            </div>
            <div className="tab">
                {yoctoNearToFloat(total_amount)}
            </div>
            <div className="tab">
                {getTimePassed(donated_at_ms, true)}
            </div>
        </div>
    )
}