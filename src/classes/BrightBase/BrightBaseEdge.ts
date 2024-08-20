import brightBaseSingleton from './BrightBaseSingleton'

export default class BrightBaseEdge<T extends { [funcName: string]: { [key: string]: unknown } }> {
  private edge: ReturnType<typeof brightBaseSingleton.getSupabase>['functions']

  constructor() {
    this.edge = brightBaseSingleton.getSupabase().functions
  }

  first(callback: () => void): this {
    callback()
    return this
  }

  async invoke<K extends keyof T>(functionName: K, payload: T[K]) {
    const { data, error } = await this.edge.invoke(functionName as string, {
      body: payload,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }
}
