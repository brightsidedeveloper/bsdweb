import brightBaseSingleton from './classes/BrightBaseSingleton'
import BrightBaseAuth from './classes/BrightBaseAuth'
import BrightBaseCRUD from './classes/BrightBaseCRUD'
import BrightBaseRealtime from './classes/BrightBaseRealtime'

function initBrightBase(supabaseUrl: string, supabaseKey: string) {
  brightBaseSingleton.initializeSupabase(supabaseUrl, supabaseKey)
}

export { initBrightBase, BrightBaseAuth, BrightBaseCRUD, BrightBaseRealtime }
