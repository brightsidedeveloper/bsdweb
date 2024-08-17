import { createClient, SupabaseClient } from '@supabase/supabase-js'

class BrightBaseSingleton {
  static instance: BrightBaseSingleton
  private supabase: SupabaseClient | null = null

  constructor() {
    if (BrightBaseSingleton.instance) {
      return BrightBaseSingleton.instance
    }
    BrightBaseSingleton.instance = this
  }

  initialize(supabaseUrl: string, supabaseKey: string) {
    if (this.supabase) return
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  getSupabase() {
    if (!this.supabase) {
      throw new Error('Supabase not initialized')
    }
    return this.supabase
  }
}

const brightBaseSingleton = new BrightBaseSingleton()

export default brightBaseSingleton
