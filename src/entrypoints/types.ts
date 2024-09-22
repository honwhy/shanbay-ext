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

export type AutoRead = 'en' | 'false' | 'us'
export type Paraphrase = 'bilingual' | 'Chinese' | 'English'
export interface ExSettings {
  // 默认添加到单词本
  addBook: string
  // 定时提醒
  alarm: string
  // 自动发音
  autoRead: AutoRead
  // 双击选中查词
  clickLookup: string
  // 右键查词
  contextLookup: string
  // 显示例句按钮
  exampleSentence: string
  // 忽略站点
  ignoreSites: string | string []
  // 默认释义
  paraphrase: Paraphrase
  // 提示框内容
  reminderContent: string
}
export default {}
