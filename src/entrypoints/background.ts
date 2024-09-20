import { ofetch } from 'ofetch'

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((req, sender, sendResponse) => {
    console.log('Received message', req, sender, sendResponse)

    const url = `https://dict.youdao.com/w/eng/${req.word}`
    try {
      return query(url)
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (e) {
      //
    }
  })
})

async function query(url: string) {
  try {
    const data = await ofetch(url, { mode: 'no-cors', parseResponse: txt => txt })
    // console.log('collins data', data)
    return data
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (e) {
    //
  }
}
