import debug from 'debug'
import brightBaseSingleton from './BrightBaseSingleton'

const log = debug('brightbase:realtime')

export default class BrightBaseRealtime {
  private channel: ReturnType<ReturnType<typeof brightBaseSingleton.getSupabase>['channel']>
  private listeners: Record<string, ((data: unknown) => void)[]> = {}

  constructor(channelName: string) {
    this.channel = brightBaseSingleton.getSupabase().channel(channelName)
    log('Channel created:', channelName)
  }

  // Subscribe to a channel
  subscribe() {
    this.channel.subscribe((status) => log('Channel status: %s', status))

    this.channel.on('broadcast', { event: '*' }, (payload) => {
      const { event, data } = payload
      log('Received event:', event, data)
      if (this.listeners[event]) {
        this.listeners[event].forEach((callback) => callback(data))
      }
    })
  }

  on(event: string, callback: (data: unknown) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  off(event: string, callback: (data: unknown) => void) {
    if (!this.listeners[event]) {
      return
    }
    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
  }

  emit(event: string, data: unknown) {
    this.channel.send({ event, data, type: 'broadcast' })
  }

  unsubscribe() {
    this.channel.unsubscribe()
  }
}
