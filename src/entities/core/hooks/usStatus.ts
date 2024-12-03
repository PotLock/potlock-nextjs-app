import { useState } from "react";

type Status = "ready" | "loading";

const useStatus = (initialStatus: Status = "ready") => {
  const [status, setStatus] = useState(initialStatus);

  return {
    status,
    setStatus,
  };
};

export default useStatus;
