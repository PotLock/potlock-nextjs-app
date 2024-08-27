import { useEffect, useState } from "react";

import { Pot } from "@/common/api/potlock";
import { naxiosInstance } from "@/common/contracts";

import { ConfigProtocol } from "../models/types";

export const useProtocolConfig = (potDetail: Pot) => {
  // Get Protocol Config
  const [configContractId, configViewMethodName] =
    potDetail.protocol_config_provider?.split(":") || ["", ""];

  const [protocolConfig, setConfig] = useState<ConfigProtocol>();

  useEffect(() => {
    if (configContractId && configViewMethodName) {
      naxiosInstance
        .contractApi({ contractId: configContractId })
        .view<{}, ConfigProtocol>(configViewMethodName)
        .then((config) => {
          setConfig(config);
        });
    }
  }, [configContractId, configViewMethodName]);

  return protocolConfig;
};