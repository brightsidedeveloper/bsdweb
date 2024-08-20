import debug from 'debug'

const log = debug('brightbase:storage')

export default class BrightBaseStorage {
  constructor() {
    log('BrightBaseStorage created')
  }

  first(callback: () => void): this {
    callback()
    return this
  }
}
