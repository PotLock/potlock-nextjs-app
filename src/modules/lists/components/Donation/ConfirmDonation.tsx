import LeftArrowIcon from "@/common/assets/svgs/LeftArrowIcon";

const ConfirmDonation = ({
  totalAmount,
  breakdown,
  onConfirm,
  onBack,
}: any) => (
  <div>
    <div className="p-4">
      <div className="">
        <h3 className="text-sm font-medium text-gray-700">Total amount</h3>
        <div className="mt-2 flex items-center">
          <div
            role="button"
            className="cursor-pointer hover:opacity-50"
            onClick={onBack}
          >
            <LeftArrowIcon className="text-black" />
          </div>

          <p className="ml-2 text-lg font-semibold">
            {totalAmount} NEAR ~${(totalAmount * 7).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700">Breakdown</h3>
        <div className="mt-2 rounded-lg border border-gray-200 p-4">
          <ul>
            {breakdown.map((item: any, index: number) => (
              <li
                key={index}
                className="mb-2 flex justify-between text-sm text-gray-700 last:mb-0"
              >
                <span>{item.label}</span>
                <span>{item.amount} NEAR</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-red-600"
          />
          <span className="ml-2">Remove 2% Protocol Fees</span>
          <span className="ml-2 flex items-center space-x-1">
            <img
              src="https://via.placeholder.com/24"
              alt="icon"
              className="h-5 w-5 rounded-full"
            />
            <span>impact.sputnik.dao.near</span>
          </span>
        </label>
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-red-600"
          />
          <span className="ml-2">Remove 5% Chef Fees</span>
          <span className="ml-2 flex items-center space-x-1">
            <img
              src="https://via.placeholder.com/24"
              alt="icon"
              className="h-5 w-5 rounded-full"
            />
            <span>#build</span>
          </span>
        </label>
      </div>

      <div className="mt-6">
        <button
          className="w-full rounded-lg bg-red-500 py-3 text-center font-semibold text-white transition hover:bg-red-600"
          onClick={onConfirm}
        >
          Confirm donation
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDonation;
