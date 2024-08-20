import { createClient, SupabaseClient } from '@supabase/supabase-js'
import debug from 'debug'

const log = debug('brightside:brightbase:singleton')

class BrightBaseSingleton {
  static instance: BrightBaseSingleton
  private supabase: SupabaseClient | null = null
  private supabaseUrl: string | null = null

  constructor() {
    if (BrightBaseSingleton.instance) {
      log('Returning existing instance')
      return BrightBaseSingleton.instance
    }
    BrightBaseSingleton.instance = this
    log('Created singleton instance of BrightBase')
  }

  initialize(supabaseUrl: string, supabaseKey: string) {
    if (this.supabase) return log('Supabase already initialized')
    this.supabase = createClient(supabaseUrl, supabaseKey)
    this.supabaseUrl = supabaseUrl
    log('Supabase initialized')
  }

  getSupabase() {
    if (!this.supabase) {
      log('Supabase not initialized')
      throw new Error('Supabase not initialized')
    }
    return this.supabase
  }

  getSupabaseUrl() {
    if (!this.supabaseUrl) {
      log('Supabase URL not initialized')
      throw new Error('Supabase URL not initialized')
    }
    return this.supabaseUrl
  }
}

const brightBaseSingleton = new BrightBaseSingleton()

export default brightBaseSingleton
