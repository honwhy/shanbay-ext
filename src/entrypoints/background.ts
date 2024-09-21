import { ofetch } from 'ofetch'

import type { ExMessage } from './types'

import { ExAction } from './types'

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((req, sender, sendResponse) => {
    console.log('Received message', req, sender, sendResponse)
    switch (req.action) {
      case ExAction.Collins:
        return youdaoQuery(req)
    }
    return true
  })
})

async function youdaoQuery(req: ExMessage) {
  const url = `https://dict.youdao.com/w/${req.word}`
  try {
    const data = await ofetch(url, { mode: 'no-cors', parseResponse: txt => txt })
    // console.log('collins data', data)
    return data
  }
  catch (e) {
    console.error('collins error', e)
    return null
  }
}
