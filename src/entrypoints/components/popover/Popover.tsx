import { debugLogger } from '@/entrypoints/utils'

const PopoverReact: React.FC = () => {
  function pendingSearchSelection() {
    debugLogger('info', 'pendingSearchSelection')
  }
  useEffect(() => {
    document.addEventListener('dblclick', pendingSearchSelection)
    return () => {
      document.removeEventListener('dblclick', pendingSearchSelection)
    }
  }, [])
  return (
    <div>Hello</div>
  )
}

export default PopoverReact
