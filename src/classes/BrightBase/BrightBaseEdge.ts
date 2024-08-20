import brightBaseSingleton from './BrightBaseSingleton'

export default class BrightBaseEdge<T extends { [funcName: string]: Record<string, unknown> }> {
  private edge: ReturnType<typeof brightBaseSingleton.getSupabase>['functions']

  constructor() {
    this.edge = brightBaseSingleton.getSupabase().functions
  }

  async invoke<K extends keyof T>(functionName: K, payload: Record<K, T[K]>) {
    const { data, error } = await this.edge.invoke(functionName as string, {
      body: payload,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }
}
