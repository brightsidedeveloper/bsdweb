import debug from 'debug'
import brightBaseSingleton from './BrightBaseSingleton'

const log = debug('brightside:brightbase:realtime')

export default class BrightBaseRealtime<T extends { [event: string]: { [key: string]: unknown } }> {
  name: string
  status: 'SUBSCRIBED' | 'TIMED_OUT' | 'CLOSED' | 'CHANNEL_ERROR' = 'CLOSED'
  private channel: ReturnType<ReturnType<typeof brightBaseSingleton.getSupabase>['channel']>
  private listeners: { [K in keyof T]?: ((data: T[K]) => void)[] } = {}

  constructor(channelName: string) {
    this.name = channelName
    this.channel = brightBaseSingleton.getSupabase().channel(channelName)
    log('Channel created: "%s"', channelName)
  }

  // Subscribe to a channel
  subscribe() {
    if (this.status === 'SUBSCRIBED') return () => this.unsubscribe()

    if (this.status === 'CLOSED') this.channel = brightBaseSingleton.getSupabase().channel(this.name)

    this.channel
      .on('broadcast', { event: '*' }, ({ event, payload }) => {
        log('"%s" channel received event: "%s": %o', this.name, event, payload)
        if (this.listeners[event]) {
          log('Notifying %d listeners of "%s" event in "%s" channel', this.listeners[event]!.length, event, this.name)
          this.listeners[event]!.forEach((callback) => {
            callback(payload)
          })
        }
      })
      .subscribe()

    return () => this.unsubscribe()
  }

  on<K extends keyof T>(event: K, callback: (data: T[K]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event]!.push(callback)
    log('"%s" channel subscribed to event: "%s"', this.name, event)

    return () => this.off(event, callback)
  }

  off<K extends keyof T>(event: K, callback: (data: T[K]) => void) {
    if (!this.listeners[event]) return log('No listeners for event %s in "%s" channel', event, this.name)
    this.listeners[event] = this.listeners[event]!.filter((cb) => cb !== callback)
    log('Unsubscribed from event: %s', event)
  }

  emit<K extends string>(event: K, payload: T[K]) {
    this.channel
      .send({ event, payload, type: 'broadcast' })
      .then(() => {
        log('Channel "%s" sent event: "%s": %o', this.name, event, payload)
      })
      .catch((error) => {
        log('Channel "%s" failed to send event: "%s": %o', this.name, event, error)
      })
  }

  unsubscribe() {
    this.channel.unsubscribe()
    this.status = 'CLOSED'
    log('Unsubscribed from %s', this.name)
  }
}
