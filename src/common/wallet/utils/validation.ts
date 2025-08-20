import { naxiosInstance } from "@/common/blockchains/near-protocol/client";

type Role = {
  name: string;
  kind:
    | string
    | {
        Group: string[];
      };
  permissions: string[];
  vote_policy: {};
};

type Policy = {
  roles: Role[];
  default_vote_policy: {
    weight_kind: string;
    quorum: string;
    threshold: number[];
  };
  proposal_bond: string;
  proposal_period: string;
  bounty_bond: string;
  bounty_forgiveness_period: string;
};

function doesUserHaveDaoFunctionCallProposalPermissions(accountId: string, policy: Policy) {
  const userRoles = policy.roles.filter((role: any) => {
    if (role.kind === "Everyone") return true;
    return role.kind.Group && role.kind.Group.includes(accountId);
  });

  const kind = "call";
  const action = "AddProposal";

  // Check if the user is allowed to perform the action
  const allowed = userRoles.some(({ permissions }: any) => {
    return (
      permissions.includes(`${kind}:${action}`) ||
      permissions.includes(`${kind}:*`) ||
      permissions.includes(`*:${action}`) ||
      permissions.includes("*:*")
    );
  });

  return allowed;
}

export const validateUserInDao = async (daoAddress: string, accountId: string) => {
  const daoContractApi = naxiosInstance.contractApi({
    contractId: daoAddress,
  });

  const policy = await daoContractApi.view<{}, Policy>("get_policy");

  const hasPermission = doesUserHaveDaoFunctionCallProposalPermissions(accountId, policy);

  if (!hasPermission) return "The user does not have permission on this DAO.";
  return "";
};
