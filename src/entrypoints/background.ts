import { ofetch } from 'ofetch'

import type { ExError, ExMessage } from './types'

import { ExAction } from './types'
import { debugLogger } from './utils'

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((req, sender, sendResponse) => {
    debugLogger('debug', 'Received message', req, sender, sendResponse)
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
    }
    return true
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
    debugLogger('error', 'getWordExample error', e)
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
