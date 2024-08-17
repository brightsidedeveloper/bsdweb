import brightBaseSingleton from './BrightBaseSingleton'

export default class BrightBaseEdge {
  private edge: ReturnType<typeof brightBaseSingleton.getSupabase>['functions']

  constructor() {
    this.edge = brightBaseSingleton.getSupabase().functions
  }

  async callFunction(functionName: string, params: Record<string, any>) {
    const { data, error } = await this.edge.invoke(functionName, params)

    if (error) {
      throw new Error(error.message)
    }

    return data
  }
}
