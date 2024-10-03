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
  GetAuthInfo = 'GetAuthInfo',
  GetWordExample = 'GetWordExample',
  Lookup = 'Lookup',
}

export interface ExReponse {
  data: unknown
  msg: string
  status: number
}
export interface ExError {
  data: unknown
  message: string
  status: number

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

// 单词查询结果
interface Audio {
  ipa: string
  name: string
  sense_id: null | string
  urls: string[]
}

interface Definition {
  def: string
  dict_id: string
  pos: string
  sense_id: string
}

interface Definitions {
  cn: Definition[]
  en: Definition[]
  en_v2: Definition[]
}

export interface WordData {
  audios: { uk: Audio, us: Audio }[]
  content: string
  definitions: Definitions
  id: string
  id_int: string
  labels: number[]
  ref_id: string
  vocab_type: string
}
