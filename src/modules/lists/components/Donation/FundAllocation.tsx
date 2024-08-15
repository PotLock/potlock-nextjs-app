import { useState } from "react";

const FundAllocation = ({
  availableAmount,
  projects,
  handleAddToCart,
  onClose,
}: any) => {
  const [allocationMethod, setAllocationMethod] = useState("evenly");
  const [amount, setAmount] = useState(0);
  const [selectedProjects, setSelectedProjects] = useState<any>([]);

  const handleProjectSelection = (project: any) => {
    if (selectedProjects.includes(project)) {
      setSelectedProjects(
        selectedProjects.filter((selected: any) => selected !== project),
      );
    } else {
      setSelectedProjects([...selectedProjects, project]);
    }
  };
  const selectAllProjects = () => {
    setSelectedProjects(projects);
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <div className="flex items-center justify-between bg-red-500 p-4">
        <h2 className="text-xl font-semibold text-white">Donate to list</h2>
        <button onClick={onClose} className="text-white hover:text-white">
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
      <div className="mt-6 px-5">
        <h3 className="text-sm font-medium text-gray-700">
          How do you want to allocate funds?
        </h3>
        <div className="mt-2">
          <div
            className={`rounded-md border p-2 ${allocationMethod === "evenly" && "border-red-500"}`}
          >
            <label className="flex items-center">
              <input
                type="radio"
                value="evenly"
                checked={allocationMethod === "evenly"}
                onChange={() => setAllocationMethod("evenly")}
                className="form-radio h-4 w-4 text-red-600"
              />
              <span className="ml-2 text-sm">
                Evenly (allocate funds evenly across multiple projects)
              </span>
            </label>
          </div>
          <div
            className={`mt-2 rounded-md border p-2 ${allocationMethod === "manually" && "border-red-500"}`}
          >
            <label className="flex items-center">
              <input
                type="radio"
                value="manually"
                checked={allocationMethod === "manually"}
                onChange={() => setAllocationMethod("manually")}
                className="form-radio h-4 w-4 text-red-600"
              />
              <span className="ml-2 text-sm">
                Manually (Specify amount for each project)
              </span>
            </label>
          </div>
        </div>
      </div>
      <div className="mt-6 px-5">
        <div className="flex justify-between">
          {" "}
          <label className="text-sm font-medium text-gray-700">Amount</label>
          <p className="mt-1 text-xs text-gray-500">
            {availableAmount} NEAR available
          </p>
        </div>

        <div className="mt-1 flex items-center rounded-md border p-1">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value, 10))}
            max={availableAmount}
            placeholder="NEAR 0.00"
            className="w-full rounded-lg border-0 p-2 text-sm focus:ring-0"
          />
          <span className="ml-2 text-sm text-gray-500">
            ${(amount * 7).toFixed(2)}
          </span>
        </div>
      </div>
      <div className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">30 Projects</h3>
          <button
            onClick={() => {
              selectAllProjects();
            }}
            className="text-sm text-red-600 hover:underline"
          >
            Select all
          </button>
        </div>
        <div className="mt-2 max-h-48 overflow-y-auto">
          {projects.map((project: any, index: number) => (
            <div
              key={index}
              className={`flex items-center rounded-lg p-2 ${
                selectedProjects.includes(project as any)
                  ? "bg-red-50"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleProjectSelection(project)}
            >
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-red-600"
                checked={selectedProjects.includes(project as any)}
                onChange={() => handleProjectSelection(project)}
              />
              <img
                src="https://via.placeholder.com/32"
                alt="project"
                className="ml-3 h-8 w-8 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium">{project.name}</p>
                <p className="text-xs text-gray-500">@project ID</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-between px-5 pb-5">
        <button className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
          Add to cart
        </button>
        <button
          className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
          onClick={() => handleAddToCart(amount, selectedProjects)}
        >
          Proceed to donate
        </button>
      </div>
    </div>
  );
};

export default FundAllocation;
