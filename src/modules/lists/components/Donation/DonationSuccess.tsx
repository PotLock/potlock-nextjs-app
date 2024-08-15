const DonationSuccess = ({ totalAmount, breakdown, txnHash, onClose }: any) => (
  <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
    <div className="flex items-center justify-between">
      <div className="flex w-full justify-center">
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_12276_29409)">
            <rect x="6" y="6" width="48" height="48" rx="24" fill="#DD3345" />
            <path
              d="M26.7931 33.8769L22.6231 29.7069L21.2031 31.1169L26.7931 36.7069L38.7931 24.7069L37.3831 23.2969L26.7931 33.8769Z"
              fill="white"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_12276_29409"
              x="0"
              y="0"
              width="60"
              height="60"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feMorphology
                radius="6"
                operator="dilate"
                in="SourceAlpha"
                result="effect1_dropShadow_12276_29409"
              />
              <feOffset />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.996078 0 0 0 0 0.901961 0 0 0 0 0.898039 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_12276_29409"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_12276_29409"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
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

    <h2 className="mt-4 text-center text-xl font-semibold">
      Donation Successful
    </h2>
    <p className="mt-2 text-center text-sm text-gray-700">
      {totalAmount} NEAR ~${(totalAmount * 7).toFixed(2)} has been donated to
      <span className="font-medium"> Dao Ashe, Cold collective</span> and 3
      others.
    </p>
    <div className="mt-2 text-center">
      <a href="#" className="text-sm text-red-500 hover:underline">
        View donation
      </a>
    </div>
    <div className="mt-4 flex justify-center">
      <button className="flex items-center space-x-2 rounded-lg bg-gray-200 p-2 px-4">
        <span>Share to</span>
        <span className="text-xl">X</span>
      </button>
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

    <div className="mt-6 text-center text-sm text-gray-500">
      <p>Txn Hash: {txnHash}</p>
    </div>
  </div>
);

export default DonationSuccess;
