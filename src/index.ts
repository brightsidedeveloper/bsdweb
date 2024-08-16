import brightBaseSingleton from "./classes/BrightBaseSingleton"
import BrightBaseAuth from "./classes/BrightBaseAuth"
import BrightBaseCRUD from "./classes/BrightBaseCRUD"
import BrightBaseRealtime from "./classes/BrightBaseRealtime"
import BrightBaseStorage from "./classes/BrightBaseStorage"

function initBrightBase(supabaseUrl: string, supabaseKey: string) {
  brightBaseSingleton.initializeSupabase(supabaseUrl, supabaseKey)
}

export {
  initBrightBase,
  BrightBaseAuth,
  BrightBaseCRUD,
  BrightBaseRealtime,
  BrightBaseStorage,
}

export interface BrightBaseRealtimeEventsConstraint {
  [event: string]: unknown
}
export interface BrightBaseCRUDTableRecordConstraint {
  [key: string]: unknown
}
