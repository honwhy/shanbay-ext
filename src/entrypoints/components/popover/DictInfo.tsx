// FetchDataComponent.tsx
import { ExAction } from '@/entrypoints/types'
import React, { useEffect, useState } from 'react'

interface FetchDataComponentProps {
  word: string
}

const FetchDataComponent: React.FC<FetchDataComponentProps> = ({ word }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const data = await browser.runtime.sendMessage({
          action: ExAction.Lookup,
          word,
        })
        setData(data)
      }
      catch (error: unknown) {
        setError(error as Error)
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
      <div>
        Error:
        {error.message}
      </div>
    )
  }

  return <div>{JSON.stringify(data)}</div>
}

export default FetchDataComponent
