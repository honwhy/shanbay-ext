import { debugLogger } from '@/entrypoints/utils.ts'
import React from 'react'
import ReactDOM from 'react-dom/client'

import Collins from './Collins.tsx'

export function checking() {
  let isMounted = false
  // @ts-expect-error app instance
  let root: ReactDOM.Root = null
  const timerId = setInterval(() => {
    debugLogger('debug', 'checking')
    const container = document.querySelector('div[class^=\'CollinsTrans_container\']')
    if (isMounted) {
      if (container == null) {
        root?.unmount()
        isMounted = false
      }
      clearInterval(timerId)
      return
    }
    if (container != null) {
      // 并且collins到期了
      if (container.textContent?.startsWith('你的柯林斯词典到期')) {
        debugLogger('debug', 'collins expired')
        root = ReactDOM.createRoot(container)
        root.render(<React.StrictMode><Collins /></React.StrictMode>)
        isMounted = true
      }
    }
    else {
      debugLogger('debug', 'not mounted')
      root?.unmount()
      isMounted = false
    }
  }, 1000)
}
