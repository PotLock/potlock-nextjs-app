import SuccessRedIcon from "@/common/ui/layout/svg/success-red-icon";
import TwitterSvg from "@/common/ui/layout/svg/twitter";

const DonationSuccess = ({
  totalAmount,
  breakdown,
  selectedProjects = [],
  onClose,
}: {
  totalAmount: number;
  breakdown: any;
  onClose: () => void;
  selectedProjects: { registrant: { id: string } }[];
}) => (
  <div className="">
    <div className="flex items-center justify-between">
      <div className="flex w-full justify-center">
        <SuccessRedIcon />
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
            fill="#F7F7F7"
          />
        </svg>
      </button>
    </div>

    <h2 className="mt-4 text-center text-xl font-semibold">Donation Successful</h2>
    <p className="mt-2 text-center text-sm text-gray-700">
      {totalAmount} NEAR ~${(totalAmount * 7).toFixed(2)} has been donated to
      <span className="font-medium">
        {" "}
        {selectedProjects
          ?.slice(0, 2)
          .map((data) => data?.registrant?.id)
          .join(", ")}{" "}
        collective
      </span>{" "}
      {selectedProjects.length > 2 && selectedProjects.length - 2
        ? ` and  ${selectedProjects?.length - 2} others. `
        : ""}
    </p>
    <div className="mt-2 text-center">
      {/* <a href="#" className="text-sm text-red-500 hover:underline">
        View donation
      </a> */}
    </div>
    <div className="mt-4 flex justify-center">
      <button className="flex items-center space-x-2 rounded-lg bg-[#464646] p-2 px-4">
        <span className="text-white">Share to</span>
        <TwitterSvg />
        {/* <span className="text-xl text-white">X</span> */}
      </button>
    </div>

    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700">Breakdown</h3>
      <div className="mt-2 rounded-lg border border-gray-200 p-4">
        <ul>
          {breakdown.map((item: any, index: number) => (
            <li key={index} className="mb-2 flex justify-between text-sm text-gray-700 last:mb-0">
              <span>{item.label}</span>
              <span>{item.amount} NEAR</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* <div className="mt-6 text-center text-sm text-gray-500">
      <p>Txn Hash: {txnHash}</p>
    </div> */}
  </div>
);

export default DonationSuccess;
