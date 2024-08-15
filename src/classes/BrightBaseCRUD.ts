import brightBaseSingleton from './BrightBaseSingleton'

export default class BrightBaseCRUD {
  private table: ReturnType<ReturnType<typeof brightBaseSingleton.getSupabase>['from']>

  constructor(tableName: string) {
    this.table = brightBaseSingleton.getSupabase().from(tableName)
  }

  // Create a new record
  async create<T>(record: T | T[]) {
    const { data, error } = await this.table.insert(record)

    if (error) throw new Error(error.message)

    return data
  }

  // Read records
  async read<T>(filters = {}, options: ReadOptions = {}) {
    let query = this.table.select(options.select ?? '*')

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value)
    }

    if (options.offset && options.limit) query = query.range(options.offset, options.offset + options.limit)
    else if (options.limit) query = query.limit(options.limit)
    if (options.order) {
      query = query.order(options.order.by, { ascending: options.order.ascending })
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)

    return data as T[]
  }

  // Update records
  async update<T extends Record<string, unknown>>(id: string | number, updates: Partial<T>) {
    let query = this.table.update(updates).eq('id', id)

    const { data, error } = await query

    if (error) throw new Error(error.message)

    return data
  }

  // Delete records
  async delete(id: string | number) {
    let query = this.table.delete().eq('id', id)

    const { data, error } = await query

    if (error) throw new Error(error.message)

    return data
  }
}

interface ReadOptions {
  select?: string
  limit?: number
  offset?: number
  order?: { by: string; ascending: boolean }
}
