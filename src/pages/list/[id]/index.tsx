import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { potlock } from "@/common/api/potlock";
import { getList } from "@/common/contracts/potlock/lists";
import { AccountId } from "@/common/types";
import {
  ListAccounts,
  ListDetails,
  useListDeploymentSuccessRedirect,
} from "@/modules/lists";
import { useListForm } from "@/modules/lists/hooks/useListForm";

export interface SavedUsersType {
  accounts?: { account: AccountId; id?: number }[];
  admins?: { account: AccountId }[];
}

export default function Page() {
  useListDeploymentSuccessRedirect();
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([]);
  const [listDetails, setListDetails] = useState<any>(null);
  const [savedUsers, setSavedUsers] = useState<SavedUsersType>({
    accounts: [],
    admins: [],
  });
  const [status, setStatus] = useState<string>("all");

  const { admins, setAdmins } = useListForm();

  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = potlock.useListRegistrations({
    listId: parseInt(id as string),
    page_size: 500,
    ...(status !== "all" && { status }),
  });

  const { data: listData, isLoading: loadingListData } = potlock.useList({
    listId: parseInt(id as string),
  });

  useEffect(() => {
    setFilteredRegistrations(data ?? []);
  }, [data]);

  useEffect(() => {
    const fetchListDetails = () => {
      getList({ list_id: parseInt(id as any) as any })
        .then((response: any) => {
          setAdmins(response.admins);

          setListDetails(response);
          setSavedUsers({
            admins:
              response.admins?.map((admin: AccountId) => ({
                account: admin,
              })) ?? [],
          });
        })
        .catch((error) => {
          console.error("Error fetching list details:", error);
        });
    };

    fetchListDetails();
  }, [id, setAdmins]);

  return (
    <div className="md:px-[2rem] container  px-0   pb-10">
      <ListDetails
        admins={admins}
        listDetails={listDetails}
        savedUsers={savedUsers}
        setAdmins={setAdmins}
        setSavedUsers={setSavedUsers}
        data={data}
      />
      <ListAccounts
        listData={listData}
        isLoading={isLoading}
        loadingListData={loadingListData}
        filteredRegistrations={filteredRegistrations}
        setStatus={setStatus}
        setFilteredRegistrations={setFilteredRegistrations}
      />
    </div>
  );
}
