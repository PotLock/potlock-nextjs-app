import { useEffect, useState } from "react";

import { Pot } from "@/common/api/indexer";
import { naxiosInstance } from "@/common/api/near-protocol/client";

export type ProtocolConfig = {
  basis_points: number;
  account_id: string;
};

export const useProtocolConfig = (potDetail: Pot) => {
  // Get Protocol Config
  const [configContractId, configViewMethodName] = potDetail.protocol_config_provider?.split(
    ":",
  ) || ["", ""];

  const [protocolConfig, setConfig] = useState<ProtocolConfig>();

  useEffect(() => {
    if (configContractId && configViewMethodName) {
      naxiosInstance
        .contractApi({ contractId: configContractId })
        .view<{}, ProtocolConfig>(configViewMethodName)
        .then((config) => {
          setConfig(config);
        });
    }
  }, [configContractId, configViewMethodName]);

  return protocolConfig;
};
