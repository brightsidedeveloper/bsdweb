import { createClient, SupabaseClient } from '@supabase/supabase-js'
import debug from 'debug'

const log = debug('brightside:brightbase:singleton')

class BrightBaseSingleton {
  static instance: BrightBaseSingleton
  private supabase: SupabaseClient | null = null

  constructor() {
    if (BrightBaseSingleton.instance) {
      log('Returning existing instance')
      return BrightBaseSingleton.instance
    }
    log('Creating new instance')
    BrightBaseSingleton.instance = this
  }

  initialize(supabaseUrl: string, supabaseKey: string) {
    if (this.supabase) return log('Supabase already initialized')
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  getSupabase() {
    if (!this.supabase) {
      log('Supabase not initialized')
      throw new Error('Supabase not initialized')
    }
    return this.supabase
  }
}

const brightBaseSingleton = new BrightBaseSingleton()

export default brightBaseSingleton
