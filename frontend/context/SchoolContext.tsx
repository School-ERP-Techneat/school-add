'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type School = {
  name: string
  logoUrl: string
  website?: string
  contactPhone?: string
  establishmentYear?: number
  board?: string
  medium?: string
  schoolType?: string
  address?: {
    city?: string
    state?: string
  }
}

type SchoolContextType = {
  school: School | null
  loading: boolean
}

const SchoolContext = createContext<SchoolContextType>({
  school: null,
  loading: true,
})

export const SchoolProvider = ({ children }: { children: React.ReactNode }) => {
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedCode = localStorage.getItem('schoolCode')
    const cachedSchool = localStorage.getItem('schoolData')

    if (!storedCode) {
      console.warn('No schoolCode found in localStorage')
      setLoading(false)
      return
    }

    if (cachedSchool) {
      setSchool(JSON.parse(cachedSchool))
      setLoading(false)
      return
    }

    async function fetchSchool() {
      try {
        const res = await fetch(`http://localhost:4000/api/school/${storedCode}`)
        const result = await res.json()
        if (result.success) {
          setSchool(result.data)
          localStorage.setItem('schoolData', JSON.stringify(result.data))
          console.log('Fetched school data:', result.data)
        } else {
          console.warn('API responded with success: false')
        }
      } catch (err) {
        console.error('Error fetching school:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSchool()
  }, [])

  return (
    <SchoolContext.Provider value={{ school, loading }}>
      {children}
    </SchoolContext.Provider>
  )
}

export const useSchool = () => useContext(SchoolContext)
