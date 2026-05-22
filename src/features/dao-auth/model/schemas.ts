import { prop } from "remeda";
import { object } from "zod";

import { nearProtocolSchemas } from "@/common/blockchains/near-protocol";
import { sputnikDaoQueries } from "@/common/contracts/sputnikdao2";
import type { AccountId, FromSchema } from "@/common/types";

export type DaoAuthOptionSchemaParams = {
  listedAccountIds: AccountId[];
  memberAccountId: AccountId;
};

export const getDaoAuthOptionSchema = ({
  listedAccountIds,
  memberAccountId,
}: DaoAuthOptionSchemaParams) =>
  object({
    accountId: nearProtocolSchemas.validAccountId,
  })
    .refine(({ accountId }) => !listedAccountIds.includes(accountId), {
      message: "This DAO is already listed",
      path: ["accountId"],
    })
    .refine(
      async ({ accountId }) =>
        sputnikDaoQueries
          .getPermissions({ daoAccountId: accountId, accountId: memberAccountId })
          .then(prop("canSubmitProposals"))
          .catch((err) => {
            console.error(err);
            return false;
          }),

      { message: "Insufficient DAO permissions.", path: ["accountId"] },
    );

export type DaoAuthOptionInputs = FromSchema<ReturnType<typeof getDaoAuthOptionSchema>>;
