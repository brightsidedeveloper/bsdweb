import debug from 'debug'
import brightBaseSingleton from './BrightBaseSingleton'
import { BrightBaseRealtimeEvents } from 'src'

const log = debug('brightbase:realtime')

export default class BrightBaseRealtime<T extends BrightBaseRealtimeEvents> {
  name: string
  status: 'SUBSCRIBED' | 'TIMED_OUT' | 'CLOSED' | 'CHANNEL_ERROR' = 'CLOSED'
  private channel: ReturnType<ReturnType<typeof brightBaseSingleton.getSupabase>['channel']>
  private listeners: { [K in keyof T]?: ((data: T[K]) => void)[] } = {}

  constructor(channelName: string) {
    this.name = channelName
    this.channel = brightBaseSingleton.getSupabase().channel(channelName)
    log('Channel created:', channelName)
  }

  // Subscribe to a channel
  subscribe() {
    if (this.status === 'SUBSCRIBED') return () => this.unsubscribe()

    if (this.status === 'CLOSED') this.channel = brightBaseSingleton.getSupabase().channel(this.name)

    this.channel
      .on('broadcast', { event: '*' }, ({ event, payload }) => {
        log('Received event: %o', payload)
        if (this.listeners[event]) {
          log('Notifying %d listeners', this.listeners[event]!.length)
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
    log('Subscribed to event: %s', event)

    return () => this.off(event, callback)
  }

  off<K extends keyof T>(event: K, callback: (data: T[K]) => void) {
    if (!this.listeners[event]) return log('No listeners for event: %s', event)
    this.listeners[event] = this.listeners[event]!.filter((cb) => cb !== callback)
    log('Unsubscribed from event: %s', event)
  }

  emit<K extends string>(event: K, payload: T[K]) {
    this.channel
      .send({ event, payload, type: 'broadcast' })
      .then(() => {
        log('Sent event: %s %o', event, payload)
      })
      .catch((error) => {
        log('Failed to send event: %s %o', event, error)
      })
  }

  unsubscribe() {
    this.channel.unsubscribe()
    this.status = 'CLOSED'
  }
}
