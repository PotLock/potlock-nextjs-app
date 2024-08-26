import { naxiosInstance } from "@/common/contracts";

export default function getTransactionsFromHashes(
  transactionHashes: string,
  accountId: string,
) {
  const transactionHashesList = transactionHashes.split(",");

  const transactions = transactionHashesList.map((transactionHash) => {
    return naxiosInstance.rpcApi().txStatus(transactionHash, accountId);
  });

  return Promise.all(transactions);
}
