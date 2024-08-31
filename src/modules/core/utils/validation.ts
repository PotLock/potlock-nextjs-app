import { naxiosInstance } from "@/common/api/near";

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

export function doesUserHaveDaoFunctionCallProposalPermissions(
  accountId: string,
  policy: Policy,
) {
  const userRoles = policy.roles.filter((role: any) => {
    console.log("policy", policy);

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

export const checkIfDaoAddress = (address: string): boolean => {
  return address.endsWith(
    process.env.NEXT_PUBLIC_NETWORK
      ? "sputnik-dao.near"
      : "sputnik-dao.testnet", // TODO: not sure about this one
  );
};

export const validateUserInDao = async (
  daoAddress: string,
  accountId: string,
) => {
  const isValidAddress = checkIfDaoAddress(daoAddress);

  if (!isValidAddress) return "Please enter a valid DAO address.";

  const daoContractApi = naxiosInstance.contractApi({
    contractId: daoAddress,
  });

  const policy = await daoContractApi.view<{}, Policy>("get_policy");
  console.log("policy", policy);

  const hasPermission = doesUserHaveDaoFunctionCallProposalPermissions(
    accountId,
    policy,
  );

  if (!hasPermission) return "The user does not have permission on this DAO.";
  return "";
};

export function updateList(list: string[], item: string): string[] {
  const index = list.indexOf(item);
  if (index === -1) {
    // Item does not exist, add it
    list.push(item);
  } else {
    // Item exists, remove it
    list.splice(index, 1);
  }
  return list;
}
