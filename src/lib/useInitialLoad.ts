import { useEffect, useRef, useState } from "react";
import { useIsFetching } from "@tanstack/react-query";

/**
 * True once the page's initial Firestore fetches (portfolio content,
 * projects, testimonials) have settled at least once. Used to gate a loading
 * screen so visitors don't see a flash of empty content before data arrives.
 */
export function useInitialLoad(): boolean {
  const fetching =
    useIsFetching({ queryKey: ["portfolio"] }) +
    useIsFetching({ queryKey: ["projects"] }) +
    useIsFetching({ queryKey: ["testimonials"] });
  const hasFetched = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (fetching > 0) hasFetched.current = true;
    if (hasFetched.current && fetching === 0) setReady(true);
  }, [fetching]);

  return ready;
}
