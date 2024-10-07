import { decode } from '@/entrypoints/decodes'
import { ofetch } from 'ofetch'

import type { RootObject } from './dailys'
import type { ExError, ExMessage, ExSettings } from './types'

import { defaultIgnoreSites } from './constants'
import { ExAction } from './types'
import { debugLogger, devMode } from './utils'

let settings: null | Partial<ExSettings> = {}

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((req, sender, sendResponse) => {
    debugLogger('debug', 'background received message', req, sender, sendResponse)
    switch (req.action) {
      case ExAction.Collins:
        return youdaoQuery(req)
      case ExAction.GetAuthInfo:
        return getAuthInfo()
      case ExAction.Lookup:
        return lookup(req)
      case ExAction.GetWordExample:
        return getWordExample(req)
      case ExAction.AddOrForget:
        return addOrForget(req)
      case ExAction.ForwardAudio:
        return forwardAudio(req)
    }
    return true
  })
  storage.getItem<ExSettings>(`local:__shanbayExtensionSettings`).then((res) => {
    settings = res
  })
  const unwatch = storage.watch<ExSettings>(`local:__shanbayExtensionSettings`, (newVal) => {
    settings = newVal
    getDailyTask()
  })

  browser.runtime.onInstalled.addListener(() => {
    getDailyTask()
  })
  browser.runtime.onSuspend.addListener(() => {
    unwatch()
  })
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      contexts: ['selection'],
      id: 'shanbay-lookup',
      title: '在扇贝网中查找 %s',
    })
  })
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    debugLogger('debug', 'contextMenus onClicked', info, tab)
    // ignore sites
    const url = tab?.url
    let ignored = false
    if (defaultIgnoreSites.some(site => isUrlMatchDomain(url!, site))) {
      ignored = true
    }
    else {
      ignored = false
    }
    if (settings && settings.ignoreSites && (settings.ignoreSites as string[]).some(site => isUrlMatchDomain(url!, site))) {
      ignored = true
    }
    else {
      ignored = false
    }
    browser.tabs.sendMessage(tab!.id!, {
      action: ExAction.LookupClicked,
      data: {
        ignored,
        word: info.selectionText?.trim(),
      },
    })
  })

  // @ts-expect-error: MV3 only API not typed
  browser.offscreen.createDocument({
    justification: '<your justification here>',
    reasons: ['CLIPBOARD'],
    url: '/offscreen.html',
  })
})

async function youdaoQuery(req: ExMessage) {
  const url = `https://dict.youdao.com/w/${req.word}`
  try {
    const data = await ofetch(url, { mode: 'no-cors', parseResponse: txt => txt })
    return data
  }
  catch (e) {
    debugLogger('error', 'youdaoQuery error', e)
    return null
  }
}

async function getAuthInfo() {
  const result = await browser.cookies.getAll({ domain: 'shanbay.com', name: 'auth_token' })
  return result[0]
}

interface CheckWordAddedResp {
  data: {
    objects: Array<{ exists: boolean | string }>
  }
}
async function lookup(req: ExMessage) {
  const url = `https://apiv3.shanbay.com/abc/words/senses?vocabulary_content=${req.word}`
  try {
    const data = await ofetch(url, { credentials: 'include', mode: 'cors', parseResponse: JSON.parse })
    const data2 = (await checkWordAdded(data.id)) as CheckWordAddedResp
    data.exists = data2.data.objects[0].exists
    return { data, msg: 'success', status: 200 }
  }
  catch (e) {
    debugLogger('error', 'lookup error', e)
    const ee = e as ExError
    return {
      data: ee.data,
      msg: ee.message,
      status: ee.status,
    }
  }
}

async function checkWordAdded(id: string) {
  const url = `https://apiv3.shanbay.com/wordscollection/words_check?vocab_ids=${id}`
  try {
    const data = await ofetch(url, { credentials: 'include', mode: 'cors', parseResponse: JSON.parse })
    return { data, msg: 'success', status: 200 }
  }
  catch (e) {
    debugLogger('error', 'checkWordAdded error', e)
    const ee = e as ExError
    return {
      data: ee.data,
      msg: ee.message,
      status: ee.status,
    }
  }
}

async function addOrForget(req: ExMessage) {
  const url = `https://apiv3.shanbay.com/news/words`
  try {
    const data = await ofetch(
      url,
      { body: JSON.stringify({ article_id: '', business_id: 2, paragraph_id: '', sentence_id: '', source_content: '', source_name: '', summary: req.word, vocab_id: req.wordId }), credentials: 'include', headers: {
        'Content-Type': 'application/json',
      }, method: 'POST', mode: 'cors', parseResponse: JSON.parse },
    )
    return { data, msg: 'success', status: 200 }
  }
  catch (e) {
    debugLogger('error', 'addOrForget error', e)
    const ee = e as ExError
    return {
      data: ee.data,
      msg: ee.message,
      status: ee.status,
    }
  }
}

async function getWordExample(req: ExMessage) {
  const url = `https://apiv3.shanbay.com/abc/words/vocabularies/${req.id}/examples`
  try {
    const data = await ofetch(url, { credentials: 'include', mode: 'cors', parseResponse: JSON.parse })
    return { data, msg: 'success', status: 200 }
  }
  catch (e) {
    debugLogger('error', 'getWordExample error', e)
    const ee = e as ExError
    return {
      data: ee.data,
      msg: ee.message,
      status: ee.status,
    }
  }
}

/**
 * 每3小时检测一下今天的剩余单词数量, 必须登录扇贝之后才可以使用
 * @function getDailyTask
 */
function getDailyTask() {
  const reminderName = 'remindAlarm'
  if (settings?.alarm === 'true') {
    browser.alarms.create(reminderName, {
      delayInMinutes: devMode ? 1 : 60,
      periodInMinutes: devMode ? 10 : 180,
    })
    browser.alarms.onAlarm.addListener(async () => {
      if (settings?.alarm === 'false')
        return browser.alarms.clear(reminderName)
      try {
        const resp = await getDailyTaskCount()
        if (resp.status === 200) {
          const json = JSON.parse(resp.data) as RootObject
          const total = json.total
          if (total === 0) {
            browser.action.setBadgeText({ text: '' })
          }
          else {
            browser.action.setBadgeText({ text: `${total}` })
            browser.notifications.create({
              iconUrl: browser.runtime.getURL('/icon/128.png'),
              message: `今日剩余单词数量为${total}，请及时学习！`,
              title: '扇贝单词学习提醒',
              type: 'basic',
            })
          }
        }
      }
      catch (e: unknown) {
        debugLogger('error', 'get daily task failed, cause: ', e)
      }
    })
  }
  else {
    browser.alarms.clear(reminderName)
  }
}

async function getDailyTaskCount() {
  const url = `https://apiv3.shanbay.com/wordscollection/learning/words/today_learning_items?page=1&type_of=REVIEW&ipp=10`
  try {
    const data = await ofetch(url, { credentials: 'include', mode: 'cors', parseResponse: JSON.parse })
    const result = decode(data.data)
    return { data: result, msg: 'success', status: 200 }
  }
  catch (e) {
    debugLogger('error', 'getDailyTaskCount error', e)
    const ee = e as ExError
    return {
      data: ee.data,
      msg: ee.message,
      status: ee.status,
    }
  }
}

function isUrlMatchDomain(url: string, domain: string): boolean {
  const regex = new RegExp(`^https?://(www\\.)?${domain}`, 'i')
  return regex.test(url)
}

async function forwardAudio(req: ExMessage) {
  const url = req.url
  if (url) {
    browser.runtime.sendMessage({
      action: ExAction.PlayAudio,
      url,
    })
  }
}
