/* eslint-disable perfectionist/sort-imports */
import './style.css'
import { createUi } from './components/popover'

export default defineContentScript({
  // 2. Set cssInjectionMode
  cssInjectionMode: 'ui',
  excludeMatches: [
    '*://*.shanbay.com/*',
    '*://*.hjenglish.com/*',
    '*://*.codepen.io/*',
    '*://*.jsfiddle.net/*',
    '*://*.jsbin.com/*',
    '*://*.codesandbox.io/*',
    '*://*.github1s.com/*',
  ],

  async main(ctx) {
    // 3. Define your UI
    const ui = await createUi(ctx)

    // 4. Mount the UI
    ui.mount()
  },
  matches: ['<all_urls>'],
})
