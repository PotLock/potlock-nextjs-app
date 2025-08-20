import type { AccountId } from "@/common/types";

import { get_policy } from "./client";

export type GetPermissionsInputs = {
  daoAccountId: AccountId;
  accountId: AccountId;
};

export type GetPermissionsResult = {
  canSubmitProposals: boolean;
};

export const getPermissions = ({
  daoAccountId,
  accountId,
}: GetPermissionsInputs): Promise<GetPermissionsResult> =>
  get_policy({ accountId: daoAccountId }).then((policy) => {
    console.log(policy);

    const roles = policy.roles.filter((role) => {
      switch (role.kind) {
        case "Everyone": {
          return true;
        }

        default: {
          if ("Group" in role.kind) {
            return role.kind.Group.includes(accountId);
          } else if ("Member" in role.kind) {
            return role.kind.Member.includes(accountId);
          } else return false;
        }
      }
    });

    return {
      canSubmitProposals: roles.some(({ permissions }) => {
        const kind = "call";
        const action = "AddProposal";

        return (
          permissions.includes(`${kind}:${action}`) ||
          permissions.includes(`${kind}:*`) ||
          permissions.includes(`*:${action}`) ||
          permissions.includes("*:*")
        );
      }),
    };
  });
