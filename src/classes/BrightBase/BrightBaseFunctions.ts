import { SupabaseClient } from '@supabase/supabase-js'
import brightBaseSingleton from './BrightBaseSingleton'
import debug from 'debug'

const log = debug('brightside:brightbase:functions')

/**
 * Class representing Supabase RPC functions.
 * @template T The type mapping of RPC functions to their arguments and return types.
 */
export default class BrightBaseFunctions<
  T extends Record<
    string,
    {
      args?: Record<string, unknown> // Arguments for the RPC call
      returns: unknown // Return type of the RPC call
    }
  >
> {
  private supabase: SupabaseClient

  // Create a functions record based on the provided types
  public functions: {
    [K in keyof T]: (
      args?: T[K]['args'],
      opts?: { head?: boolean; get?: boolean; count?: 'exact' | 'planned' | 'estimated' }
    ) => Promise<T[K]['returns']>
  }

  constructor(funcs: (keyof T)[]) {
    this.supabase = brightBaseSingleton.getSupabase()
    this.functions = this.initializeFunctions(funcs)
  }

  first(callback: () => void) {
    callback() // Executes synchronously
    return this.functions // Returns the instance for chaining
  }

  /**
   * Initializes the RPC functions dynamically based on the type T.
   */
  private initializeFunctions(funcs: (keyof T)[]) {
    const functions = {} as {
      [K in keyof T]: (
        args?: T[K]['args'],
        opts?: { head?: boolean; get?: boolean; count?: 'exact' | 'planned' | 'estimated' }
      ) => Promise<T[K]['returns']>
    }

    funcs.forEach((funcName) => {
      functions[funcName] = async (
        args?: T[typeof funcName]['args'],
        opts?: { head?: boolean; get?: boolean; count?: 'exact' | 'planned' | 'estimated' }
      ) => {
        return this.rpc(funcName, args, opts)
      }
    })

    return functions
  }

  /**
   * Executes a remote procedure call (RPC) in Supabase.
   * @param {keyof T} funcName - The name of the RPC function to call.
   * @param {T[keyof T]['args']} [args={}] - The arguments to pass to the RPC function.
   * @param {object} [options] - Additional options for the RPC function.
   * @returns {Promise<T[keyof T]['returns']>} The data returned by the RPC function.
   * @throws {Error} If there is an error during the RPC call.
   */
  private async rpc(
    funcName: keyof T,
    args: T[keyof T]['args'] = {},
    options?: { head?: boolean; get?: boolean; count?: 'exact' | 'planned' | 'estimated' }
  ): Promise<T[keyof T]['returns']> {
    const { data, error } = await this.supabase.rpc(funcName as string, args as Record<string, unknown>, options)

    if (error) {
      log('Error running rpc: "%s" \nWith these args: %o \n The error: %s', funcName, args, error.message)
      throw new Error(error.message)
    }

    return data as T[keyof T]['returns']
  }
}
