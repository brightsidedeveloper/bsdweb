import debug from 'debug'
import brightBaseSingleton from './BrightBaseSingleton'

const log = debug('brightbase:crud')

export default class BrightBaseCRUD {
  private name: string
  private table: ReturnType<ReturnType<typeof brightBaseSingleton.getSupabase>['from']>

  constructor(tableName: string) {
    this.table = brightBaseSingleton.getSupabase().from(tableName)
    this.name = tableName
    log('Table created:', tableName)
  }

  private reCreateTable() {
    this.table = brightBaseSingleton.getSupabase().from(this.name)
  }

  // Create a new record
  async create<T>(record: T | T[]) {
    this.reCreateTable()
    const { data, error } = await this.table.insert(record)

    if (error) {
      log('Error creating record:', error.message)
      throw new Error(error.message)
    }
    log('Record created: ', record)
    return data
  }

  // Read records
  async read<T>(filters = {}, options: ReadOptions = {}) {
    this.reCreateTable()
    let query = this.table.select('*')

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value)
    }

    if (options.offset && options.limit) query = query.range(options.offset, options.offset + options.limit)
    else if (options.limit) query = query.limit(options.limit)
    if (options.order) {
      query = query.order(options.order.by, { ascending: options.order.ascending })
    }

    const { data, error } = await query

    if (error) {
      log('Error reading records:', error.message)
      throw new Error(error.message)
    }

    if (!data) throw Error('No Data was found.')

    log('Records read:', data)

    return data as T[]
  }

  // Update records
  async update<T extends Record<string, unknown>>(id: string | number, updates: Partial<T>) {
    this.reCreateTable()
    const query = this.table.update(updates).eq('id', id)

    const { data, error } = await query

    if (error) {
      log('Error updating record: %s', id, '\n', error.message)
      throw new Error(error.message)
    }

    log('Record updated:', id, updates)
    return data
  }

  // Delete records
  async delete(id: string | number) {
    this.reCreateTable()
    const query = this.table.delete().eq('id', id)

    const { data, error } = await query

    if (error) {
      log('Error deleting record: %s', id, '\n', error.message)
      throw new Error(error.message)
    }

    log('Record deleted:', id)

    return data
  }
}

interface ReadOptions {
  limit?: number
  offset?: number
  order?: { by: string; ascending: boolean }
}
