import Dexie, { EntityTable } from "dexie";

import { TStop } from "@/models/Stop";


type Stores = {
  recentStops: EntityTable<TStop>,
};

const idb = new Dexie("LoopMapping") as Dexie & Stores;

idb.version(1).stores({
  recentStops: "++, &fullText",
});


export default idb;