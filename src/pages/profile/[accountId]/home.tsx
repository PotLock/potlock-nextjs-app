import { ReactElement, useMemo } from "react";

import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { listsContractHooks } from "@/common/contracts/core";
import { isAccountId } from "@/common/lib";
import type { AccountId } from "@/common/types";
import { useAccountSocialProfile } from "@/entities/_shared/account";
import { Team } from "@/entities/project";
import AboutItem from "@/layout/profile/components/AboutItem";
import Github from "@/layout/profile/components/Github";
import { ProfileLayout } from "@/layout/profile/components/ProfileLayout";
import SmartContract from "@/layout/profile/components/SmartContract";

export default function ProfileHomeTab() {
  const router = useRouter();
  const { accountId } = router.query as { accountId: AccountId };
  const isAccountIdValid = useMemo(() => isAccountId(accountId), [accountId]);
  const { profile } = useAccountSocialProfile({ enabled: isAccountIdValid, accountId });

  const { data: isRegistered = false } = listsContractHooks.useIsRegistered({
    enabled: isAccountIdValid,
    accountId: accountId ?? "noop",
    listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
  });

  return (
    <div className="mb-18 flex w-full flex-col">
      {/* Header Container */}
      <div className="gap-2xl flex flex-col items-start justify-start">
        <h2 className="font-500 font-lora text-[32px] text-[#2e2e2e] md:text-[40px]">
          About {profile?.name}
        </h2>
      </div>

      <AboutItem
        title="Overview"
        element={
          profile ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose w-full">
              {profile.description}
            </ReactMarkdown>
          ) : null
        }
      />

      {isRegistered && (
        <>
          <AboutItem
            title="Why we are a public good"
            text={profile?.plPublicGoodReason || "None provided"}
          />
          <Team profile={profile} />
          <AboutItem title="Github repo(s)" element={<Github profile={profile} />} />
          <AboutItem title="Smart contracts" element={<SmartContract profile={profile} />} />
        </>
      )}
    </div>
  );
}

ProfileHomeTab.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};
