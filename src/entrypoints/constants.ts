import type { AutoRead, Paraphrase } from './types'

// 默认屏蔽的网站
export const defaultIgnoreSites = ['shanbay.com', 'hjenglish.com', 'codepen.io', 'jsfiddle.net', 'jsbin.com', 'codesandbox.io', 'github1s.com']

/**
 * 扩展设置的名称、名称的说明、取值范围的数组
 * @namespace {Array} extensionSpecification
 * @property {string} * - 各种名称
 * @property {string} desc - 名称的说明
 * @property {Array} enum - 取值范围
 */
export const extensionSpecification = {
  addBook: 'false',
  alarm: 'true',
  autoRead: 'false' as AutoRead,
  clickLookup: 'true',
  contextLookup: 'true',
  exampleSentence: 'true',
  ignoreSites: [],
  paraphrase: 'bilingual' as Paraphrase,
  reminderContent: '少壮不努力，老大背单词',
}

export default {}
