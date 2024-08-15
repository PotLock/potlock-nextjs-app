const ConfirmDonation = ({
  totalAmount,
  breakdown,
  onConfirm,
  onBack,
  onClose,
}: any) => (
  <div className="overflow-hidden rounded-lg bg-white shadow-md">
    <div className="mb-4 flex items-center justify-between bg-red-500 p-4">
      <h2 className="text-xl font-semibold text-white">Confirm donation</h2>
      <button onClick={onClose} className="text-white">
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
    <div className="p-4">
      <div className="">
        <h3 className="text-sm font-medium text-gray-700">Total amount</h3>
        <div onClick={onClose} className="mt-2 flex items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="9" stroke="#292929" stroke-width="2" />
            <path
              d="M15.9346 7C15.5637 7 15.2204 7.19167 15.0262 7.5075L12.9358 10.6108C12.9057 10.6555 12.8928 10.7096 12.8996 10.7631C12.9064 10.8166 12.9324 10.8658 12.9728 10.9015C13.0132 10.9372 13.0652 10.957 13.1191 10.9572C13.173 10.9574 13.2252 10.9379 13.2658 10.9025L15.3233 9.11833C15.3354 9.10747 15.3503 9.10035 15.3663 9.09785C15.3823 9.09535 15.3987 9.09758 15.4135 9.10426C15.4283 9.11093 15.4408 9.12177 15.4495 9.13545C15.4582 9.14912 15.4627 9.16504 15.4625 9.18125V14.7687C15.4625 14.7859 15.4573 14.8027 15.4474 14.8167C15.4376 14.8308 15.4236 14.8414 15.4075 14.8473C15.3914 14.8531 15.3738 14.8538 15.3573 14.8493C15.3407 14.8448 15.3259 14.8353 15.315 14.8221L9.09583 7.37708C8.99584 7.25886 8.87127 7.16388 8.73079 7.09875C8.59032 7.03363 8.43733 6.99993 8.2825 7H8.06542C7.78285 7 7.51186 7.11225 7.31205 7.31205C7.11225 7.51186 7 7.78285 7 8.06542L7 15.9346C7 16.1666 7.07577 16.3924 7.21579 16.5774C7.35581 16.7625 7.55243 16.8968 7.77576 16.9599C7.99908 17.023 8.2369 17.0114 8.45306 16.927C8.66922 16.8425 8.8519 16.6898 8.97333 16.4921L11.0637 13.3887C11.0939 13.3441 11.1068 13.2899 11.1 13.2364C11.0932 13.183 11.0672 13.1338 11.0268 13.0981C10.9864 13.0624 10.9344 13.0426 10.8804 13.0424C10.8265 13.0422 10.7744 13.0617 10.7337 13.0971L8.67625 14.8817C8.66418 14.8924 8.64924 14.8994 8.63325 14.9018C8.61727 14.9042 8.60093 14.902 8.58622 14.8952C8.57152 14.8885 8.55908 14.8777 8.55043 14.864C8.54178 14.8504 8.53728 14.8345 8.5375 14.8183V9.23C8.53747 9.21284 8.54273 9.19609 8.55257 9.18203C8.56242 9.16798 8.57636 9.1573 8.5925 9.15147C8.60863 9.14563 8.62618 9.14492 8.64273 9.14943C8.65929 9.15394 8.67405 9.16345 8.685 9.17667L14.9033 16.6225C15.1058 16.8617 15.4033 16.9996 15.7167 17H15.9337C16.2163 17.0001 16.4873 16.888 16.6872 16.6884C16.8872 16.4888 16.9997 16.2179 17 15.9354V8.06542C16.9999 7.78288 16.8876 7.51196 16.6878 7.31218C16.488 7.11239 16.2171 7.00011 15.9346 7Z"
              fill="#292929"
            />
          </svg>

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
