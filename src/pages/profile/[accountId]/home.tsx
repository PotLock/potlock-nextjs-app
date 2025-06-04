import { ReactElement, useMemo } from "react";

import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { NOOP_STRING, PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { listsContractHooks } from "@/common/contracts/core/lists";
import { isAccountId } from "@/common/lib";
import type { AccountId } from "@/common/types";
import {
  AccountGithubReposList,
  AccountSmartContractsList,
  useAccountSocialProfile,
} from "@/entities/_shared";
import { ProfileLayout } from "@/layout/profile/components/layout";
import { ProfileLayoutTeam } from "@/layout/profile/components/team";

const Section: React.FC<{ title: string; text?: string; children?: React.ReactNode }> = ({
  title,
  text,
  children,
}) => (
  <section className="mt-8 flex w-full flex-col items-start justify-start md:flex-row">
    <div className="md:w-54 md:min-w-54 mb-4 flex w-full">
      <p className="text-size-base font-600 text-[#2e2e2e]">{title}</p>
    </div>

    {text && <p className="m-0 flex w-full flex-col">{text}</p>}
    {children}
  </section>
);

export default function ProfileHomeTab() {
  const router = useRouter();
  const { accountId } = router.query as { accountId: AccountId };
  const isAccountIdValid = useMemo(() => isAccountId(accountId), [accountId]);
  const { profile } = useAccountSocialProfile({ enabled: isAccountIdValid, accountId });

  const { data: isRegistered = false } = listsContractHooks.useIsRegistered({
    enabled: isAccountIdValid,
    listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
    accountId: accountId ?? NOOP_STRING,
  });

  return (
    <div className="mb-18 flex w-full flex-col">
      {/* Header Container */}
      <div className="gap-2xl flex flex-col items-start justify-start">
        <h2 className="font-500 font-lora text-[32px] text-[#2e2e2e] md:text-[40px]">
          About {profile?.name}
        </h2>
      </div>

      <Section title="Overview">
        {profile && (
          <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose w-full">
            {profile.description}
          </ReactMarkdown>
        )}
      </Section>

      {isRegistered && (
        <>
          {profile?.plPublicGoodReason && (
            <Section title="Public Goods listing reasoning" text={profile.plPublicGoodReason} />
          )}

          <ProfileLayoutTeam profile={profile} />

          <Section title="Github repo(s)">
            <AccountGithubReposList profile={profile} />
          </Section>

          <Section title="Smart contracts">
            <AccountSmartContractsList profile={profile} />
          </Section>
        </>
      )}
    </div>
  );
}

ProfileHomeTab.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};
