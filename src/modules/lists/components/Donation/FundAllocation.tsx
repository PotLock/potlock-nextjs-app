import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { potlock } from "@/common/api/potlock";
import { IPFS_NEAR_SOCIAL_URL, NEAR_TOKEN_DENOM } from "@/common/constants";
import { truncate } from "@/common/lib";
import { useTokenBalance } from "@/modules/token";

const FundAllocation = ({
  projects,
  handleAddToCart,
  selectedProjects,
  setSelectedProjects,
  setProjects,
}: any) => {
  const [allocationMethod, setAllocationMethod] = useState("evenly");
  const [amount, setAmount] = useState<number>(0);
  const {
    query: { id },
  } = useRouter();

  const { balanceFloat } = useTokenBalance({ tokenId: NEAR_TOKEN_DENOM });

  const { data, isLoading } = potlock.useListRegistrations({
    listId: parseInt(id as string),
  });

  useEffect(() => {
    setProjects(data ?? []);
  }, [data, isLoading, setProjects]);

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

  const NO_IMAGE =
    "https://i.near.social/magic/large/https://near.social/magic/img/account/null.near";

  return (
    <div>
      <div className="">
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
            className={`mt-2 rounded-md border p-2 opacity-50 ${allocationMethod === "manually" && "border-red-500"}`}
          >
            <label className="flex items-center">
              <input
                type="radio"
                value="manually"
                checked={allocationMethod === "manually"}
                disabled
                onChange={() => setAllocationMethod("manually")}
                className="form-radio h-4 w-4 text-red-600 disabled:opacity-70"
              />
              <span className="ml-2 text-sm opacity-70">
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
            {balanceFloat} NEAR available
          </p>
        </div>

        <div className="mt-1 flex items-center rounded-md border p-1">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="NEAR 0.00"
            className="w-full rounded-lg border-0 p-2 text-sm focus:ring-0"
          />
          <span className="ml-2 text-sm text-gray-500">
            ${isNaN(amount) ? 0 : (amount * 7).toFixed(2)}
          </span>
        </div>
      </div>
      <div className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">
            {projects?.length || 0} Projects
          </h3>
          {projects?.length && (
            <button
              onClick={() => {
                selectAllProjects();
              }}
              className="text-sm text-red-600 hover:underline"
            >
              Select all
            </button>
          )}
        </div>
        <div className="mt-2 max-h-48 overflow-y-auto">
          {isLoading ? (
            <>
              <p>Loading...</p>
            </>
          ) : (
            projects.map((project: any) => (
              <div
                key={project.id}
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
                  src={
                    project.registrant?.near_social_profile_data?.image
                      ?.ipfs_cid
                      ? IPFS_NEAR_SOCIAL_URL +
                        project.registrant?.near_social_profile_data?.image
                          ?.ipfs_cid
                      : NO_IMAGE
                  }
                  alt="project"
                  className="ml-3 h-8 w-8 rounded-full"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {project.registrant?.near_social_profile_data?.name || ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    @{truncate(project.registrant?.id, 30)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-between px-5 pb-5">
        <button
          disabled
          className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed"
        >
          Add to cart
        </button>
        <button
          className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={
            isNaN(amount) ||
            amount <= 0 ||
            amount > Number(balanceFloat) ||
            selectedProjects.length === 0
          }
          onClick={() => handleAddToCart(amount, selectedProjects)}
        >
          Proceed to donate
        </button>
      </div>
    </div>
  );
};

export default FundAllocation;
