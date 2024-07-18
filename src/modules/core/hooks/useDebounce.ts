import { useEffect, useState } from "react";

export default function useDebounce(data: any, delay: number) {
  const [value, setValue] = useState(data);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setValue(data);
    }, delay);
    return () => {
      clearTimeout(timerId);
    };
  }, [data, delay]);
  return value;
}
