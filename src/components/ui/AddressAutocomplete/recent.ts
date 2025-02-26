import { useLiveQuery } from "dexie-react-hooks";

import { RecentStops, TStop } from "@/models/Stop";


export async function saveRecentStop(stop: TStop) {
  await RecentStops.where({ fullText: stop.fullText }).delete();
  await RecentStops.put(stop);
}

export function useRecentStops() {
  const data = useLiveQuery(() => RecentStops.toArray());

  return { data };
}