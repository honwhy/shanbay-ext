// 插件内的通讯
export interface ExMessage {
  action: string
  url?: string
  word?: string
  wordId?: string
}

export enum ExAction {
  AddOrForget = 'AddOrForget',
  Collins = 'Collins',
  GetAuthInfo = 'getAuthInfo',
  GetWordExample = 'GetWordExample',
  Lookup = 'Lookup',
}

export default {}
