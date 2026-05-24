import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { tokenId, eventType, metadata } = await req.json()
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0'

    const supabase = getServiceClient()
    await supabase.from('access_logs').insert({
      token_id: tokenId || null,
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
