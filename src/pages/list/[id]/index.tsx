import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { indexer } from "@/common/api/indexer";
import { AccountId } from "@/common/types";
import { PageWithBanner } from "@/common/ui/components";
import {
  ListAccounts,
  ListDetails,
  SavedUsersType,
  useListDeploymentSuccessRedirect,
} from "@/entities/list";
import { useListForm } from "@/entities/list/hooks/useListForm";
import { RootLayout } from "@/layout/components/root-layout";

export default function SingleList() {
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
  const { id } = router.query as { id: string };
  const listId = parseInt(id);

  const { data, isLoading } = indexer.useListRegistrations({
    listId,
    page_size: 500,
    ...(status !== "all" && { status }),
  });

  const { data: listData, isLoading: loadingListData } = indexer.useList({
    listId,
  });

  // TODO: use `useMemo` for filtered data instead
  useEffect(() => {
    setFilteredRegistrations(data?.results ?? []);
  }, [data]);

  useEffect(() => {
    if (loadingListData) return;
    setAdmins(listData?.admins?.map((admin) => admin?.id) as AccountId[]);
    setListDetails(listData);

    setSavedUsers({
      accounts:
        data?.results.map((registration) => ({
          accountId: registration?.registrant?.id,
          registrationId: registration?.id,
        })) ?? [],
      admins:
        listData?.admins?.map((admin) => ({
          accountId: admin?.id,
        })) ?? [],
    });
  }, [loadingListData, isLoading, setAdmins, listData, data]);

  return (
    <RootLayout
      title={listDetails?.name ?? ""}
      description={listDetails?.description ?? ""}
      image={listDetails?.cover_image_url ?? ""}
    >
      <PageWithBanner>
        <ListDetails
          admins={admins}
          listDetails={listDetails}
          savedUsers={savedUsers}
          setAdmins={setAdmins}
        />
        <ListAccounts
          listData={listData}
          isLoading={isLoading}
          loadingListData={loadingListData}
          filteredRegistrations={filteredRegistrations}
          setStatus={setStatus}
          setFilteredRegistrations={setFilteredRegistrations}
        />
      </PageWithBanner>
    </RootLayout>
  );
}
