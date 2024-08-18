import brightBaseSingleton from './classes/BrightBase/BrightBaseSingleton'
import BrightBaseAuth from './classes/BrightBase/BrightBaseAuth'
import BrightBaseCRUD from './classes/BrightBase/BrightBaseCRUD'
import BrightBaseRealtime from './classes/BrightBase/BrightBaseRealtime'
import BrightBaseStorage from './classes/BrightBase/BrightBaseStorage'
import BrightWebTheme from './classes/BrightWeb/BrightWebTheme'
import clsx from 'clsx'

export function initBrightBase(supabaseUrl: string, supabaseKey: string) {
  brightBaseSingleton.initialize(supabaseUrl, supabaseKey)
}

// * Dependencies
export * from '@tanstack/react-query'
export { clsx as tw }

// * Classes
export { BrightBaseAuth, BrightBaseCRUD, BrightBaseRealtime, BrightBaseStorage }
export { BrightWebTheme }

// * Context
export { default as BrightProvider } from './context/BrightProvider'
export { default as BrightQueryDevTools } from './context/BrightQueryDevTools'

// * Utils
export { default as wetToast } from './utils/wetToast'
export { toast } from 'react-hot-toast'
export { default as cn } from './utils/cn'
export { default as childrenWithProps } from './utils/childrenWithProps'
