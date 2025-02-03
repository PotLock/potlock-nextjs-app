import React, { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/router";

import { ListRegistration, indexer } from "@/common/api/indexer";
import { AccountId } from "@/common/types";
import { PageWithBanner, Spinner } from "@/common/ui/components";
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

  const listRegistrations: ListRegistration[] = useMemo(() => {
    return data?.results ?? [];
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

  return loadingListData ? (
    <div className="flex h-[80vh] items-center justify-center">
      <Spinner className="w-25 h-25" />
    </div>
  ) : (
    <RootLayout
      title={listDetails?.name ?? ""}
      description={listDetails?.description ?? ""}
      image={listDetails?.cover_image_url ?? ""}
    >
      <PageWithBanner>
        <ListDetails
          admins={admins}
          listDetails={listDetails}
          listId={listId}
          savedUsers={savedUsers}
          setAdmins={setAdmins}
        />
        <ListAccounts
          listData={listData}
          isLoading={isLoading}
          loadingListData={loadingListData}
          listRegistrations={listRegistrations}
          setStatus={setStatus}
        />
      </PageWithBanner>
    </RootLayout>
  );
}
