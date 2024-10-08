// DictInfoComponent.tsx
import type { ExampleData, ExReponse, ExSettings, WordData } from '@/entrypoints/types'

import { ExAction, AutoRead } from '@/entrypoints/types'
import { debugLogger } from '@/entrypoints/utils'
import React, { Fragment, useEffect, useState } from 'react'

interface DictInfoComponentProps {
  word: string
}

const DictInfoComponent: React.FC<DictInfoComponentProps> = ({ word }) => {
  const [data, setData] = useState<null | WordData>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)
  const [failed, setFailed] = useState<boolean>(false)
  const ukAudioRef = useRef<HTMLAudioElement>(null)
  const usAudioRef = useRef<HTMLAudioElement>(null)
  const [settings, setSettings] = useState<ExSettings | null>(null)
  const [exampleData, setExampleData] = useState<ExampleData[] | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDataFromApi = async () => {
      setLoading(true)
      try {
        const resp = await browser.runtime.sendMessage({
          action: ExAction.Lookup,
          word,
        }) as ExReponse
        debugLogger('info', 'lookup resp', resp)
        const { data, status } = resp
        if (status === 200) {
          setData(data as WordData)
        }
        else if (status === 404) {
          setFailed(true)
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
  useEffect(() => {
    if (settings && data) {
      const { autoRead } = settings
      switch(autoRead) {
        case AutoRead.en:
          onPlayAudio(data.audios[0].uk.urls[0])
          break
        case AutoRead.us:
          onPlayAudio(data.audios[0].us.urls[0])
          break
      }
    }
  }, [data])
  useEffect(() => {
    storage.getItem<ExSettings>(`local:__shanbayExtensionSettings`).then((res) => {
      setSettings(res)
    })
    const unwatch = storage.watch<ExSettings>(`local:__shanbayExtensionSettings`, (newVal) => {
      setSettings(newVal)
    })
    return unwatch
  }, [])
  const onPlayAudio = (url: string) => {
    browser.runtime.sendMessage({
      action: ExAction.ForwardAudio,
      url,
    })
  }
  const getWordExample = async () => {
    if (!data || !data.id) return
    const resp = await browser.runtime.sendMessage({
      action: ExAction.GetWordExample,
      id: data.id,
    }) as ExReponse
    debugLogger('info', 'getWordExample resp', resp)
    const { data: _data, status } = resp
    if (status === 200) {
      const exampleData = _data as ExampleData[]
      if (exampleData.length) {
        setExampleData(exampleData)
      }
    }
  }
  const onAddOrForget = async () => {
    if (!data ||!data.content || !data.id) return
    const resp = await browser.runtime.sendMessage({
      action: ExAction.AddOrForget,
      word: data.content,
      wordId: data.id,
    }) as ExReponse
    debugLogger('info', 'onAddOrForget resp', resp)
    const { data: _data, status } = resp
    if (status === 200) {
      toast({
        description: '操作成功',
      })
      setData({
        ...data,
        exists: !data.exists
      })
    }
  }
  const { paraphrase, exampleSentence } = settings || {}
  if (loading) {
    return <div>查询中...</div>
  }

  if (error) {
    return (
      <div id="shanbay-inner">
        <div className="has-error" id="shanbay-title">
          <div className="error-message">请求失败，请登录后刷新本页面</div>
          <div className="login"><a className="shanbay-btn" href="https://web.shanbay.com/web/account/login/" target="_blank">去登录</a></div>
        </div>
      </div>
    )
  }
  if (failed) {
    return (
      <div id="shanbay-inner">
        <div className="has-error" id="shanbay-title">
          <div className="error-message">未查询到单词</div>
        </div>
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
                {data.audios[0].uk.urls.length > 0 && (
                  <span className="speaker uk" onClick={() => onPlayAudio(data.audios[0].uk.urls[0])}>
                    <audio ref={ukAudioRef} src={data.audios[0].uk.urls[0]} />
                  </span>
                )}
              </div>
            )
          }
          {
            data && data.audios && data.audios.length > 0 && data.audios[0].us && (
              <div>
                <span>us: </span>
                <small>
                  /
                  {data.audios[0].us.ipa}
                  /
                </small>
                {data.audios[0].us.urls.length > 0 && (
                  <span className="speaker us" onClick={() => onPlayAudio(data.audios[0].us.urls[0])}>
                    <audio ref={usAudioRef} src={data.audios[0].us.urls[0]} />
                  </span>
                )}
              </div>
            )
          }
        </div>
      </div>
      <div id="shanbay-content">
        <div className="simple-definition">
          {
            paraphrase !== 'English' &&
            data && data?.definitions.cn.length > 0
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
          {
            paraphrase !== 'Chinese' &&
            data && data?.definitions.en.length > 0
            && (
              <div>
                <b>英文：</b>
                {
                  data.definitions.en.map((p, idx) => (
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
        {
          exampleData && (
            <div className="simple-definition" id="shanbay-example-sentence-div">
              {
                exampleData.map((item, index) => (
                  <Fragment key={index}>
                  <p>{index + 1},
                    <span dangerouslySetInnerHTML={{ __html: item.content_en.replaceAll('vocab', 'b') }}></span>
                    <span className="speaker" onClick={() => onPlayAudio(item.audio.us.urls[0])}>
                      <audio src={item.audio.us.urls[0]}></audio>
                    </span>
                  </p>
                  <p>{item.content_cn}</p>
                  </Fragment>
                ))
              }
            </div>
          )
        }
        <div id="shanbay-footer">
          {exampleSentence && !exampleData &&
            (<span id="shanbay-example-sentence-span">
              <button className="shanbay-btn" id="shanbay-example-sentence-btn" onClick={getWordExample}>查看例句</button>
              </span>)
          }
          {
            data && data.exists !== 'error' && (
              <span id="shanbay-add-word-span">
                {
                  data.exists ? 
                  <button id="shanbay-add-word-btn" className='shanbay-btn forget' onClick={onAddOrForget}>我忘了</button> :
                  <button id="shanbay-add-word-btn" className='shanbay-btn' onClick={onAddOrForget}>添加</button>
                }
              </span>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default DictInfoComponent
