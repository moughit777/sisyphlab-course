import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { verifyAdminToken } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  const authResult = verifyAdminToken(req)
  if (!authResult.ok) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const supabase = getServiceClient()
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

  const [tokens, activeSessions, recentLogs, totalLogs] = await Promise.all([
    supabase.from('tokens').select('id, is_active'),
    supabase.from('sessions').select('id').eq('is_active', true).gt('last_active', fiveMinutesAgo),
    supabase.from('access_logs').select('id').gt('created_at', oneDayAgo),
    supabase.from('access_logs').select('id', { count: 'exact', head: true }),
  ])

  const totalTokens = tokens.data?.length || 0
  const activeTokens = tokens.data?.filter(t => t.is_active).length || 0

  return NextResponse.json({
    total_tokens: totalTokens,
    active_tokens: activeTokens,
    active_sessions: activeSessions.data?.length || 0,
    recent_accesses: recentLogs.data?.length || 0,
    total_logs: totalLogs.count || 0,
  })
}
