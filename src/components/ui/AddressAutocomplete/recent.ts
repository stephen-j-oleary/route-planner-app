import { useLiveQuery } from "dexie-react-hooks";

import { RecentStops, TStop } from "@/models/Stop";
import idb from "@/utils/idb";


const MAX_RECENT_STOPS = 10;

export async function saveRecentStop(stop: TStop) {
  await idb.transaction("rw", "recentStops", async () => {
    await RecentStops.where({ fullText: stop.fullText }).delete();

    const count = await RecentStops.count();
    if (count >= MAX_RECENT_STOPS) await RecentStops.orderBy(":id").limit(1).delete();

    await RecentStops.put(stop);
  })
}

export function useRecentStops() {
  const data = useLiveQuery(() => RecentStops.orderBy(":id").reverse().toArray());

  return { data };
}