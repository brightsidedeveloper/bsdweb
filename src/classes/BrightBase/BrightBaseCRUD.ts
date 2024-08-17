import debug from 'debug'
import brightBaseSingleton from './BrightBaseSingleton'
import { BrightBaseCRUDTableRecord } from 'src'

const log = debug('brightside:brightbase:crud')

export default class BrightBaseCRUD<
  T extends BrightBaseCRUDTableRecord,
  CO extends { OmitOnCreate: keyof T; OptionalOnCreate: keyof T } = {
    OmitOnCreate: OmitOnCreate
    OptionalOnCreate: OptionalOnCreate
  }
> {
  name: string
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
  async create<C extends Omit<T, CO['OmitOnCreate'] | CO['OptionalOnCreate']> & Partial<Pick<T, CO['OptionalOnCreate']>>>(record: C | C[]) {
    this.reCreateTable()
    const { data, error } = await this.table.insert(record).select()

    if (error) {
      log('Error creating record in table "%s": %s', this.name, error.message)
      throw new Error(error.message)
    }
    log('Record created in table "%s": ', this.name, record)
    return data as T[]
  }

  // Read records
  async read(filters: Partial<{ [key in keyof T]: T[key] }> = {}, options: ReadOptions = {}) {
    this.reCreateTable()
    let query = this.table.select('*')

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value)
    }

    if (options.offset && options.limit) query = query.range(options.offset, options.offset + options.limit)
    else if (options.limit) query = query.limit(options.limit)
    if (options.order) {
      query = query.order(options.order.by, {
        ascending: options.order.ascending,
      })
    }

    const { data, error } = await query

    if (error) {
      log('Error reading records in table "%s": %s', this.name, error.message)
      throw new Error(error.message)
    }

    if (!data) throw Error('No Data was found.')

    log('Records with filters: %o, options: %o, from "%s" table:', filters, options, this.name, data)

    return data as T[]
  }

  // Update records
  async update(id: T['id'], updates: Partial<T>) {
    this.reCreateTable()
    const query = this.table.update(updates).eq('id', id)

    const { data, error } = await query.select()

    if (error) {
      log('Error updating record with id: "%s" in table "%s"', id, this.name, '\n', error.message)
      throw new Error(error.message)
    }

    log('Record(s) in "%s" table updated:', data)
    return data as T[]
  }

  // Delete records
  async delete(id: T['id']) {
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

type OmitOnCreate = 'id' | 'created_at'
type OptionalOnCreate = ''
