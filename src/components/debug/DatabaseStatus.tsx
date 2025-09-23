'use client'

import { useState, useEffect } from 'react'

interface DatabaseStatus {
  database: {
    status: string
    timestamp: Date
    database?: string
  }
  counts: {
    courses: number
    learningPaths: number
    courseModules: number
  }
  usingFallback: boolean
  lastChecked: Date
  error?: string
}

export default function DatabaseStatus({ className = '' }: { className?: string }) {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/status')
        if (response.ok) {
          const data = await response.json()
          setStatus(data)
        }
      } catch (error) {
        console.error('Failed to fetch database status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className={`text-sm text-gray-500 ${className}`}>Checking database status...</div>
  }

  if (!status) {
    return (
      <div className={`text-sm text-red-500 ${className}`}>Unable to check database status</div>
    )
  }

  const isHealthy = status.database.status === 'healthy'
  const statusColor = isHealthy ? 'text-green-600' : 'text-red-600'
  const fallbackText = status.usingFallback ? ' (using fallback data)' : ''

  return (
    <div className={`text-sm ${className}`}>
      <div className={`font-medium ${statusColor}`}>
        Database: {isHealthy ? '✅ Healthy' : '❌ Unhealthy'}
        {fallbackText}
      </div>
      <div className="mt-1 text-gray-600">
        Data: {status.counts.courses} courses, {status.counts.learningPaths} paths,{' '}
        {status.counts.courseModules} modules
      </div>
      {status.error && <div className="mt-1 text-xs text-red-500">Error: {status.error}</div>}
      <div className="mt-1 text-xs text-gray-400">
        Last checked: {status.lastChecked.toLocaleTimeString()}
      </div>
    </div>
  )
}
