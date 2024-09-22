import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

import { ExAction } from '../types'
import './style.css'

function App() {
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
      <ul>
        <li>
          <h3>1, 双击查词</h3>
          <p>
            <label>
              <input checked name="clickLookup" type="radio" value="true" />
              是
              <input name="clickLookup" type="radio" value="false" />
              否
            </label>
          </p>
          <h3>2, 右键菜单查词(重启Chrome才能生效)</h3>
          <p>
            <label>
              <input checked name="contextLookup" type="radio" value="true" />
              是
              <input name="contextLookup" type="radio" value="false" />
              否
            </label>
          </p>
        </li>
        <li>
          <h3>默认加入生词库</h3>
          <p>
            <label>
              <input name="addBook" type="radio" value="true" />
              是
              <input checked name="addBook" type="radio" value="false" />
              否
            </label>
          </p>
        </li>
        <li>
          <h3>显示例句按钮</h3>
          <p>
            <label>
              <input name="exampleSentence" type="radio" value="true" />
              是
              <input checked name="exampleSentence" type="radio" value="false" />
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
              <input checked name="alarm" type="radio" value="true" />
              是
              <input name="alarm" type="radio" value="false" />
              否
            </label>
          </p>
          <p>
            <strong>提醒内容定制: </strong>
            <input name="reminderContent" type="text" value="少壮不努力，老大背单词" />
          </p>
        </li>
        <li>
          <h3>默认发音</h3>
          <p className="select">
            <select name="autoRead">
              <option value="us">美音</option>
              <option value="en">英音</option>
              <option selected value="false">关闭</option>
            </select>
          </p>
        </li>
        <li>
          <h3>释义</h3>
          <p className="select">
            <select name="paraphrase">
              <option value="Chinese">只显示中文释义</option>
              <option value="English">只显示英文释义</option>
              <option selected value="bilingual">显示双语释义</option>
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
            <ul className="ignore-sites"></ul>
            <label>
              <textarea name="ignoreSites" placeholder="只添加域名，如：baidu.com，多个域名用回车分割" rows="10" style={{ width: '95%' }}></textarea>
            </label>
          </div>
        </li>
      </ul>

      <div id="saveP">
        <button id="save">保存</button>
      </div>

      <hr />
      <details>
        <summary>关于</summary>
        <p>
          这个应用是基于
          <a href="https://github.com/jinntrance/shanbay-crx">jinntrance</a>
          {' '}
          的扇贝查词应用的改进版。
        </p>
        <p>
          本项目的
          <a href="https://github.com/maicss/chrome-shanbay-v2"> GitHub</a>
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
          <a href="https://github.com/maicss/chrome-shanbay-v2/issues/new/choose">GitHub issue</a>
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
