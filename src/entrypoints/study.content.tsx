import { checking } from './components/collins/index'

export default defineContentScript({
  main() {
    checking()
  },

  matches: ['https://web.shanbay.com/wordsweb/*'],
})
