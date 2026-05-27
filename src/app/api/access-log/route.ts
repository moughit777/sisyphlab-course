import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

const ALLOWED_EVENTS = new Set(['video_start', 'video_pause', 'suspicious'])

export async function POST(req: NextRequest) {
  try {
    const { tokenId, sessionKey, eventType, metadata } = await req.json()
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0'

    if (!eventType || !ALLOWED_EVENTS.has(eventType)) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    if (!tokenId || !sessionKey) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }

    const supabase = getServiceClient()

    const { data: session } = await supabase
      .from('sessions')
      .select('id')
      .eq('token_id', tokenId)
      .eq('session_key', sessionKey)
      .eq('is_active', true)
      .single()

    if (!session) return NextResponse.json({ ok: false }, { status: 401 })

    await supabase.from('access_logs').insert({
      token_id: tokenId,
      event_type: eventType,
      ip_address: ip,
      user_agent: req.headers.get('user-agent'),
      metadata: metadata || {},
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
