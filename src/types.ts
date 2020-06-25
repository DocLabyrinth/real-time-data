export type GraphData = {
  keys: Array<string>
  data: { country?: string } & Array<{
    [dataKey: string]: string | number
  }>
}
