import debug from 'debug'
import brightBaseSingleton from './BrightBaseSingleton'

const log = debug('brightside:brightbase:crud')

/**
 * Class representing CRUD operations for a Supabase table.
 * @template TableRecord The type of table record.
 * @template CreateOptions The configuration object for create operations.
 */
export default class BrightBaseCRUD<
  TableRecord extends { [key: string]: unknown },
  CreateOptions extends { OmitOnCreate: keyof TableRecord; OptionalOnCreate: keyof TableRecord } = {
    OmitOnCreate: 'id' | 'created_at'
    OptionalOnCreate: ''
  }
> {
  name: string
  private table: ReturnType<ReturnType<typeof brightBaseSingleton.getSupabase>['from']>

  /**
   * Creates an instance of BrightBaseCRUD.
   * @param {string} tableName - The name of the table.
   * @example
   * const userTable = new BrightBaseCRUD<User>('users');
   */
  constructor(tableName: string) {
    this.table = brightBaseSingleton.getSupabase().from(tableName)
    this.name = tableName
    log('Table created:', tableName)
  }

  /**
   * Recreates the table instance.
   * @private
   */
  private reCreateTable() {
    this.table = brightBaseSingleton.getSupabase().from(this.name)
  }

  /**
   * Creates a new record or records in the table.
   * @param {CreateTableRecord | CreateTableRecord[]} record - The record or records to be created. If an array is provided, multiple records will be created. You can omit fields that are optional or should be omitted on creation.
   * @returns {Promise<TableRecord[]>} The created records.
   * @throws {Error} If there is an error during record creation.
   * @example
   * userTable.create({ name: 'John Doe', email: 'john@example.com' }).then((users) => console.log(users)).catch(err => wetToast(err.message, { icon: '❌' })
   */
  async create<
    CreateTableRecord extends Omit<TableRecord, CreateOptions['OmitOnCreate'] | CreateOptions['OptionalOnCreate']> &
      Partial<Pick<TableRecord, CreateOptions['OptionalOnCreate']>>
  >(record: CreateTableRecord | CreateTableRecord[]) {
    this.reCreateTable()
    const { data, error } = await this.table.insert(record).select()

    if (error) {
      log('Error creating record in table "%s": %s', this.name, error.message)
      throw new Error(error.message)
    }
    log('Record created in table "%s": ', this.name, record)
    return data as TableRecord[]
  }

  /**
   * Reads records from the table based on the provided filters and options.
   * @param {Partial<{ [key in keyof TableRecord]: TableRecord[key] }>} [filters={}] - The filters to apply to the query.
   * @param {ReadOptions} [options={}] - The options for the query, such as limit and order.
   * @returns {Promise<TableRecord[]>} The fetched records.
   * @throws {Error} If there is an error during record retrieval or no data is found.
   * @example
   * userTable.read({ name: 'John Doe' }, { limit: 10 }).then((users) => console.log(users)).catch(err => wetToast(err.message, { icon: '❌' })
   */
  async read(
    filters: Partial<{ [key in keyof TableRecord]: TableRecord[key] }> = {},
    /**
     * Options for the read method.
     * @property {number} [limit] - The maximum number of records to retrieve.
     * @property {number} [offset] - The number of records to skip before starting to collect the result set.
     * @property {{ by: string; ascending: boolean }} [order] - The ordering options.
     * @property {string} order.by - The field by which to order the results.
     * @property {boolean} order.ascending - Whether the order should be ascending.
     */
    options: {
      limit?: number
      offset?: number
      order?: { by: string; ascending: boolean }
    } = {}
  ) {
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
    } else query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      log('Error reading records in table "%s": %s', this.name, error.message)
      throw new Error(error.message)
    }

    if (!data) throw Error('No Data was found.')

    log('Read records from "%s" table with these filters and options: %o \n Data: %o', this.name, { filters, options }, data)

    return data as TableRecord[]
  }

  /**
   * Updates a record in the table by its ID.
   * @param {TableRecord['id']} id - The ID of the record to update.
   * @param {Partial<TableRecord>} updates - The updates to apply to the record.
   * @returns {Promise<TableRecord[]>} The updated records.
   * @throws {Error} If there is an error during the update.
   * @example
   * userTable.update('id_of_record', { name: 'Jane Doe' }).then((users) => console.log(users)).catch(err => wetToast(err.message, { icon: '❌' })
   */
  async update(id: TableRecord['id'], updates: Partial<TableRecord>) {
    this.reCreateTable()
    const query = this.table.update(updates).eq('id', id)

    const { data, error } = await query.select()

    if (error) {
      log('Error updating record with id: "%s" in table "%s"', id, this.name, '\n', error.message)
      throw new Error(error.message)
    }

    log('Record(s) in "%s" table updated: %o', this.name, data)
    return data as TableRecord[]
  }

  /**
   * Deletes a record from the table by its ID.
   * @param {TableRecord['id']} id - The ID of the record to delete.
   * @returns {Promise<TableRecord[]>} The deleted record.
   * @throws {Error} If there is an error during deletion.
   * @example
   * userTable.delete('id_of_record').then((users) => console.log(users)).catch(err => wetToast(err.message, { icon: '❌' })
   */
  async delete(id: TableRecord['id']) {
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
