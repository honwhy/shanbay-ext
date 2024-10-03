// DictInfoComponent.tsx
import type { ExReponse, WordData } from '@/entrypoints/types'

import { ExAction } from '@/entrypoints/types'
import { debugLogger } from '@/entrypoints/utils'
import React, { useEffect, useState } from 'react'

interface DictInfoComponentProps {
  word: string
}

const DictInfoComponent: React.FC<DictInfoComponentProps> = ({ word }) => {
  const [data, setData] = useState<null | WordData>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<boolean | null>(null)

  useEffect(() => {
    const fetchDataFromApi = async () => {
      setLoading(true)
      try {
        const resp = await browser.runtime.sendMessage({
          action: ExAction.Lookup,
          word,
        }) as ExReponse
        const { data, status } = resp
        if (status === 200) {
          setData(data as WordData)
        }
        else {
          setError([400, 401, 403].includes(status))
        }
      }
      catch (e) {
        debugLogger('error', 'lookup error', e)
        setError(true)
      }
      finally {
        setLoading(false)
      }
    }

    fetchDataFromApi()
  }, [word])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div className="has-error" id="shanbay-title">
        <div className="error-message">请求失败，请登录后刷新本页面</div>
        <div className="login"><a className="shanbay-btn" href="https://web.shanbay.com/web/account/login/" target="_blank">去登录</a></div>
      </div>
    )
  }

  return (
    <div id="shanbay-inner">
      <div id="shanbay-title">
        <span className="word">
          {data?.content}
        </span>
        <a className="check-detail" href={`https://web.shanbay.com/wordsweb/#/detail/${data?.id}`} target="_blank"> 查看详情 </a>
        <div className="phonetic-symbols">
          {
            data && data.audios && data.audios.length > 0 && data.audios[0].uk && (
              <div>
                <span>uk: </span>
                <small>
                  /
                  {data.audios[0].uk.ipa}
                  /
                </small>
              </div>
            )
          }
        </div>
      </div>
      <div id="shanbay-content">
        <div className="simple-definition">
          {
            data?.definitions.cn.length
            && (
              <div>
                <b>中文：</b>
                {
                  data.definitions.cn.map((p, idx) => (
                    <div key={`${p.dict_id}_${idx}`}>
                      <span style={{ color: '#333' }}>
                        {p.pos}
                        {' '}
                      </span>
                      <span>{p.def}</span>
                    </div>
                  ),
                  )
                }
              </div>
            )
          }
        </div>
        <div className="hide" id="shanbay-example-sentence-div"></div>
        <div id="shanbay-footer">
          <span className="hide" id="shanbay-example-sentence-span"><button className="shanbay-btn" id="shanbay-example-sentence-btn">查看例句</button></span>
        </div>
      </div>
    </div>
  )
}

export default DictInfoComponent
