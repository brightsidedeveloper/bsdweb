import brightBaseSingleton from "./classes/BrightBaseSingleton"
import BrightBaseAuth from "./classes/BrightBaseAuth"
import BrightBaseCRUD from "./classes/BrightBaseCRUD"
import BrightBaseRealtime from "./classes/BrightBaseRealtime"
import BrightBaseStorage from "./classes/BrightBaseStorage"

function initBrightBase(supabaseUrl: string, supabaseKey: string) {
  brightBaseSingleton.initializeSupabase(supabaseUrl, supabaseKey)
}

// * Classes
export {
  initBrightBase,
  BrightBaseAuth,
  BrightBaseCRUD,
  BrightBaseRealtime,
  BrightBaseStorage,
}

// * Hooks
export { default as useBrightSuspenseQuery } from "./hooks/crud/useBrightSuspenseQuery"

// * Types

// * Interfaces
export interface BrightBaseRealtimeEvents {
  [event: string]: unknown
}
export interface BrightBaseCRUDTableRecord {
  [key: string]: unknown
}
