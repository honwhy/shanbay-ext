import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

import { ExAction } from '../types'
import './style.css'

interface ExCookie {
  expirationDate: number
  name: string
  value: string
}
function App() {
  const [isLogin, setLogin] = useState(false)
  useEffect(() => {
    browser.runtime.sendMessage(null, { action: ExAction.GetAuthInfo })
      .then((res) => {
        const cookie = res as ExCookie
        if (cookie) {
          setLogin(true)
        }
      })
  }, [])
  const handleBatchAdd = () => {
    browser.tabs.create({ url: 'https://web.shanbay.com/wordsweb/#/collection' })
  }
  const handleBeginLearning = () => {
    browser.tabs.create({ url: 'https://web.shanbay.com/wordsweb/#/collection' })
  }
  const handleLogin = () => {
    browser.tabs.create({ url: 'https://web.shanbay.com/web/account/login/' })
  }
  return (
    <div>
      <h2>扇贝查词插件</h2>
      <ul>
        <li><a href="https://github.com/honwhy/shanbay-ext">关于插件</a></li>
        {isLogin
        && (
          <>
            <li><button id="batch-add" onClick={handleBatchAdd}>批量添加单词</button></li>
            <li><button id="begin-learning" onClick={handleBeginLearning}>开始背单词</button></li>
            <li><button id="options">插件设置</button></li>
            <li><button id="logout">退出</button></li>
          </>
        )}
        {!isLogin && <li><button id="login" onClick={handleLogin}>登录</button></li>}
      </ul>
    </div>
  )
}

export default App
