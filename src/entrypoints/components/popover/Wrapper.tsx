import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { debugLogger } from '@/entrypoints/utils'
import { isEmpty } from 'lodash-es'
import React, { useEffect } from 'react'

import DictInfo from './DictInfo.tsx'

const WrapperReact: React.FC = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [popoverPosition, setPopoverPosition] = useState({ left: 0, top: 0 })
  function pendingSearchSelection() {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0).cloneRange()
      const rangeText = range.toString().trim()
      if (isEmpty(rangeText) || !rangeText.match(/^[a-z\s']+$/i)) {
        setIsPopoverOpen(false)
        return
      }
      setSelectedText(rangeText)
      setIsPopoverOpen(true)
      const rect = range.getBoundingClientRect()
      const position = {
        left: rect.left,
        top: rect.top,
      }
      debugLogger('info', 'position', position)
      debugLogger('info', 'selectedText', rangeText)
      setPopoverPosition(position)
    }
    else {
      setIsPopoverOpen(false)
    }
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isPopoverOpen && event.target && !(event.target as Element).closest('shanbay-helper-v3')) {
        setIsPopoverOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isPopoverOpen])

  useEffect(() => {
    document.addEventListener('dblclick', pendingSearchSelection)
    return () => {
      document.removeEventListener('dblclick', pendingSearchSelection)
    }
  }, [])
  return (
    <>
      {isPopoverOpen && (
        <Popover
          open={isPopoverOpen}
        >
          <PopoverTrigger style={{
            left: popoverPosition.left,
            minHeight: '14px',
            position: 'fixed',
            top: popoverPosition.top,
            visibility: 'hidden',
            width: 'fit-content',
            wordBreak: 'keep-all',
          }}
          >
            {selectedText}
          </PopoverTrigger>
          <PopoverContent>
            <div className="rounded bg-white p-4 shadow-lg">
              <p>{selectedText}</p>
              <DictInfo word={selectedText} />
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}

export default WrapperReact
