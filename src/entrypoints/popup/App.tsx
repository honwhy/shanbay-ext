import { Button } from '@/components/ui/button'

import { ExAction } from '../types'

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

  return (
    <>
      <Button>
        popup
        {isLogin ? '已登录' : '未登录'}
      </Button>
    </>
  )
}

export default App
