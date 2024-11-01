import { Button } from "@/common/ui/components";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  description: string;
  onViewCampaign: () => void;
  showBackToCampaigns?: boolean;
}

export const SuccessCampaignModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  showBackToCampaigns,
  onViewCampaign,
  header,
  description,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div
        style={{
          boxShadow:
            "0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 24px 24px -12px rgba(5, 5, 5, 0.08), 0px 40px 40px -20px rgba(5, 5, 5, 0.08), 0px 64px 80px 0px rgba(5, 5, 5, 0.08)",
        }}
        className="md:w-[604px] h-[500px] w-[90%]  max-w-full rounded-md bg-white shadow-lg"
      >
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="font-bold text-gray-500 hover:text-gray-700"
          >
            X
          </button>
        </div>
        <div className="h-100 flex flex-col items-center p-4">
          <div className="mb-10">
            <img
              src="https://ipfs.near.social/ipfs/bafkreicc5uyqp3i7jcnko3hda6gsonmzcgyhtzcal4fv2vwqckvf3p5bdm"
              alt="Chef Hat"
              className="h-26 w-28"
            />
          </div>
          <h2 className="md:text-[32px] mb-4 text-center font-lora text-2xl font-medium  tracking-wide text-red-600">
            {header}
          </h2>
          <p className="mb-6 text-center text-[#292929]">{description}</p>
          <div className="md:mt-12 w-full px-4 align-baseline">
            <Button
              onClick={() => {
                onViewCampaign();
                onClose();
              }}
              className="w-full"
            >
              {showBackToCampaigns ? "Back to Campaigns" : "View Campaigns"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
