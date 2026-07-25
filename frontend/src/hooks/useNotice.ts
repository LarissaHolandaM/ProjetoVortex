import { useEffect, useState } from "react";

export function useNotice(timeoutMs = 3500) {
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = setTimeout(() => setNotice(""), timeoutMs);
    return () => clearTimeout(timeout);
  }, [notice, timeoutMs]);

  return { notice, setNotice };
}
