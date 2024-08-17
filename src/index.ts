import brightBaseSingleton from './classes/BrightBaseSingleton'
import BrightBaseAuth from './classes/BrightBaseAuth'
import BrightBaseCRUD from './classes/BrightBaseCRUD'
import BrightBaseRealtime from './classes/BrightBaseRealtime'
import BrightBaseStorage from './classes/BrightBaseStorage'

function initBrightBase(supabaseUrl: string, supabaseKey: string) {
  brightBaseSingleton.initialize(supabaseUrl, supabaseKey)
}

// * Classes
export { initBrightBase, BrightBaseAuth, BrightBaseCRUD, BrightBaseRealtime, BrightBaseStorage }

// * Context
export * from '@tanstack/react-query'
export { default as BrightQueryProvider } from './context/BrightQueryProvider'

// * Hooks

// * Types

// * Interfaces

export { BrightBaseCRUDTableRecord } from './types/crud'
export { BrightBaseRealtimeEvents } from './types/realtime'
