import brightBaseSingleton from './classes/BrightBase/BrightBaseSingleton'
import BrightBaseAuth from './classes/BrightBase/BrightBaseAuth'
import BrightBaseCRUD from './classes/BrightBase/BrightBaseCRUD'
import BrightBaseRealtime from './classes/BrightBase/BrightBaseRealtime'
import BrightBaseStorage from './classes/BrightBase/BrightBaseStorage'
import BrightWebTheme from './classes/BrightWeb/BrightWebTheme'

function initBrightBase(supabaseUrl: string, supabaseKey: string) {
  brightBaseSingleton.initialize(supabaseUrl, supabaseKey)
}

// * Classes
export { initBrightBase, BrightBaseAuth, BrightBaseCRUD, BrightBaseRealtime, BrightBaseStorage }
export { BrightWebTheme }

// * Context
export * from '@tanstack/react-query'
export { default as BrightQueryProvider } from './context/BrightProvider'

export { default as wetToast } from './utils/wetToast'
export { toast } from 'react-hot-toast'

// * Hooks

// * Types

// * Interfaces

export { BrightBaseCRUDTableRecord } from './types/crud'
export { BrightBaseRealtimeEvents } from './types/realtime'
