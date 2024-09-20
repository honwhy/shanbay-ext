import { isEmpty } from 'lodash-es'
import React, { useEffect, useState } from 'react'

import './style.scss'

interface Explains {
  mean: string
  p1: string
  p2: string
}

function parseData(res: string) {
  if (isEmpty(res))
    return

  const parser = new DOMParser()
  const doc = parser.parseFromString(res, 'text/html')
  const nodes = doc.querySelectorAll('#collinsResult .wt-container ul>li')
  const fn = [].map.bind(nodes, (it: Element) => ({
    mean: it.querySelector('.collinsMajorTrans>p')?.outerHTML.replaceAll(/\t+/g, ''),
    p1: it.querySelector('.examples p:first-child')?.textContent,
    p2: it.querySelector('.examples p:last-child')?.textContent,
  }))
  const data = fn() as Explains[]
  return data.filter(it2 => !isEmpty(it2.mean))
}
const CollinsReact: React.FC = () => {
  const [explainList, setExplainList] = useState<Explains[]>([])

  useEffect(() => {
    onQuery()
  }, [])

  function onQuery() {
    const wordElement = document.querySelector('div[class^="VocabPronounce_word"]')
    if (wordElement == null)
      return
    const word = wordElement.textContent
    browser.runtime.sendMessage(null, { action: 'collins', word }).then((res: string) => {
      // console.log('collins res', res)
      const data = parseData(res) || []
      setExplainList(data)
    })
  }

  return (
    <div className="collins-trans">
      {explainList.map((explain, index) => (
        <div className="mean-container" key={index}>
          <div className="mean">
            <span style={{ marginRight: '4px' }}>{`${index + 1}. `}</span>
            <span className="mean-text" dangerouslySetInnerHTML={{ __html: explain.mean }} />
          </div>
          {explain.p1 && explain.p2 && (
            <div className="examples">
              <p>
                例:
                {explain.p1}
              </p>
              <p>{explain.p2}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default CollinsReact
