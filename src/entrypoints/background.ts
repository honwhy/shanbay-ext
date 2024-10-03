import { ofetch } from 'ofetch'

import type { ExError, ExMessage } from './types'

import { ExAction } from './types'
import { debugLogger } from './utils'

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((req, sender, sendResponse) => {
    debugLogger('info', 'Received message', req, sender, sendResponse)
    switch (req.action) {
      case ExAction.Collins:
        return youdaoQuery(req)
      case ExAction.GetAuthInfo:
        return getAuthInfo()
      case ExAction.Lookup:
        return lookup(req)
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

// TODO 后端和前端返回的code需要约定
async function lookup(req: ExMessage) {
  const url = `https://apiv3.shanbay.com/abc/words/senses?vocabulary_content=${req.word}`
  try {
    const data = await ofetch(url, { credentials: 'include', mode: 'cors', parseResponse: JSON.parse })
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
