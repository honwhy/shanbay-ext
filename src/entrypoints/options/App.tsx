import { useToast } from '@/hooks/use-toast'
import { isEmpty, isString, set } from 'lodash-es'
import { useForm } from 'react-hook-form'

import type { ExSettings } from '../types'

import { defaultIgnoreSites, extensionSpecification } from '../constants'
import { debugLogger } from '../utils'
import './style.css'

async function getDefaultValues() {
  const settings = await storage.getItem<ExSettings>(`local:__shanbayExtensionSettings`)
  debugLogger('log', '__shanbayExtensionSettings: ', settings)
  if (isEmpty(settings)) {
    return {
      ...extensionSpecification,
      ignoreSites: '',
    }
  }
  return {
    ...settings,
    ignoreSites: (settings.ignoreSites as string[]).join('\n'),
  }
}
function App() {
  const { formState: { errors, isSubmitting }, handleSubmit, register } = useForm<ExSettings>({
    defaultValues: () => getDefaultValues(),
  })
  const { toast } = useToast()
  const onSubmit = useCallback((data: ExSettings) => {
    debugLogger('log', 'onSubmit: ', data)
    if (isString(data.ignoreSites)) {
      data.ignoreSites = data.ignoreSites.split('\n')
    }
    storage.setItem<ExSettings>(`local:__shanbayExtensionSettings`, data)
    toast({
      description: '保存成功',
    })
  }, [])
  return (
    <div id="main">
      <header>
        <h1>扇贝助手设置</h1>
      </header>
      <hr />
      <div className="height-0" id="saveRes">
        <div>
          <p>保存成功</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul>
          <li>
            <h3>1, 双击查词</h3>
            <p>
              <label>
                <input type="radio" value="true" {...register('clickLookup')} />
                是
                <input type="radio" value="false" {...register('clickLookup')} />
                否
              </label>
            </p>
            <h3>2, 右键菜单查词(重启Chrome才能生效)</h3>
            <p>
              <label>
                <input type="radio" value="true" {...register('contextLookup')} />
                是
                <input type="radio" value="false" {...register('contextLookup')} />
                否
              </label>
            </p>
          </li>
          <li>
            <h3>默认加入生词库</h3>
            <p>
              <label>
                <input type="radio" value="true" {...register('addBook')} />
                是
                <input type="radio" value="false" {...register('addBook')} />
                否
              </label>
            </p>
          </li>
          <li>
            <h3>显示例句按钮</h3>
            <p>
              <label>
                <input type="radio" value="true" {...register('exampleSentence')} />
                是
                <input type="radio" value="false" {...register('exampleSentence')} />
                否
              </label>
            </p>
          </li>
          <li>
            <h3>
              开启背单词定时提醒(每3小时)
              <i>请注意操作系统是不是关闭了浏览器的通知</i>
            </h3>
            <p>
              <label>
                <input type="radio" value="true" {...register('alarm')} />
                是
                <input type="radio" value="false" {...register('alarm')} />
                否
              </label>
            </p>
            <p>
              <strong>提醒内容定制: </strong>
              <input placeholder="少壮不努力，老大背单词" type="text" {...register('reminderContent')} />
            </p>
          </li>
          <li>
            <h3>默认发音</h3>
            <p className="select">
              <select {...register('autoRead')}>
                <option value="us">美音</option>
                <option value="en">英音</option>
                <option value="false">关闭</option>
              </select>
            </p>
          </li>
          <li>
            <h3>释义</h3>
            <p className="select">
              <select {...register('paraphrase')}>
                <option value="Chinese">只显示中文释义</option>
                <option value="English">只显示英文释义</option>
                <option value="bilingual">显示双语释义</option>
              </select>
            </p>
          </li>
          <li>
            <h3>屏蔽站点</h3>
            <div>
              <p>
                避免
                <a href="https://github.com/maicss/chrome-shanbay-v2#%E5%B7%B2%E7%9F%A5%E7%9A%84%E9%97%AE%E9%A2%98">已知问题</a>
                的影响，可以把某些站点列入屏蔽站点。默认屏蔽站点：
              </p>
              <ul className="ignore-sites">
                {
                  defaultIgnoreSites.map(site => (
                    <li key={site}>{site}</li>),
                  )
                }
              </ul>
              <label>
                <textarea
                  className="p-1"
                  placeholder="只添加域名，如：baidu.com，多个域名用回车分割"
                  rows={10}
                  style={{ width: '95%' }}
                  {...register('ignoreSites', { validate: (value) => {
                    const sites = value as string
                    if (sites && sites.length > 0) {
                      const result = sites.split('\n').every((site) => {
                        return site.trim().match(/^([\w-]+\.){1,2}\w+$/)
                      })
                      if (result) {
                        return result
                      }
                      return '屏蔽站点格式不正确'
                    }
                  } })}
                >
                </textarea>
                {errors.ignoreSites && (
                  <p className="text-red-500" role="alert">{errors.ignoreSites.message}</p>
                )}
              </label>
            </div>
          </li>
        </ul>

        <div id="saveP">
          <button disabled={isSubmitting} id="save" type="submit">保存</button>
        </div>
      </form>
      <hr />
      <details>
        <summary>关于</summary>
        <p>
          这个应用是基于
          <a href="https://github.com/honwhy/chrome-shanbay-v2">jinntrance</a>
          {' '}
          的扇贝查词应用的改进版。
        </p>
        <p>
          本项目的
          <a href="https://github.com/honwhy/shanbay-ext"> GitHub</a>
          {' '}
          地址。感觉有帮助的话给个赞。
        </p>
        <h3>问题反馈</h3>
        <p>
          反馈有两种方式：邮件和GitHub issue。
          <b>建议使用GitHub。</b>
        </p>
        <p>
          1, 本人
          <a href="mailto:maicss@foxmail.com?subject=Chrome-shanbay-extension-issue">邮箱</a>
        </p>
        <p>
          如果电脑上有邮箱应用并添加了邮箱账号，可以直接点击，主题为也已经在链接里写好了。如果没有，主题一定要写成“Chrome-shanbay-extension-issue”。
        </p>
        <p>
          ⚠️ 邮件内容一定要包括：操作系统的名称、版本，chrome的名称（有正式版，开发版，金丝雀版等等）、版本号。尽量描述清楚问题出现的原因，最好有配图，GIF最好。
        </p>
        <p>
          2,
          <a href="https://github.com/honwhy/shanbay-ext/issues/new/choose">GitHub issue</a>
        </p>
        <p>issue的内容也尽量按照上面的格式，这样方便定位问题、解决问题。</p>
        <hr />
        <p>
          最后，祝你们插件用得愉快，英语进步快，不要像我，
          <strong>老大背单词(╯°□°）╯︵ ┻━┻</strong>
          。
        </p>
      </details>
    </div>
  )
}

export default App
