import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

// PATCH — heartbeat to keep session alive
export async function PATCH(req: NextRequest) {
  try {
    const { tokenId } = await req.json()
    if (!tokenId) return NextResponse.json({ ok: false }, { status: 400 })

    const supabase = getServiceClient()
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0'

    await supabase
      .from('sessions')
      .update({ last_active: new Date().toISOString() })
      .eq('token_id', tokenId)
      .eq('is_active', true)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

// DELETE — close session (logout)
export async function DELETE(req: NextRequest) {
  try {
    const { session_key } = await req.json()
    if (!session_key) return NextResponse.json({ ok: false }, { status: 400 })

    const supabase = getServiceClient()
    await supabase
      .from('sessions')
      .update({ is_active: false })
      .eq('session_key', session_key)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
