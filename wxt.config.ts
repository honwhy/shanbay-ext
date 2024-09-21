import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    host_permissions: [
      'https://dict.youdao.com/',
      'https://www.wordsmyth.net/',
      '*://*.shanbay.com/*',
    ],
    minimum_chrome_version: '88',
    name: '扇贝单词助手V3',
    permissions: [
      'cookies',
      'storage',
    ],
  },
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
})
