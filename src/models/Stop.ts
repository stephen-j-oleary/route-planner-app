import idb from "@/utils/idb";


export type TStop = {
  fullText: string,
  mainText?: string,
  secondaryText?: string,
  /** The coordinates formatted: "lat,lng" */
  coordinates: string,
  /** The time stopped in minutes */
  duration?: number,
};


export const RecentStops = idb.recentStops;