export type BarGraphData = {
  keys: Array<string>
  data: { country?: string } & Array<{
    [dataKey: string]: string | number
  }>
}

export type SunburstData = {
  name: string
  children?: SunburstData[]
  loc?: number
}
