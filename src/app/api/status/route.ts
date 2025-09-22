import { NextResponse } from 'next/server'
import { getDataStatus } from '@/lib/actions/course-actions'

export async function GET() {
  try {
    const status = await getDataStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error('Status API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get status',
        usingFallback: true,
        database: { status: 'unhealthy', timestamp: new Date() }
      },
      { status: 500 }
    )
  }
}