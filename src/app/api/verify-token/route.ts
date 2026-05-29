import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { checkRateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || '0.0.0.0'

    if (!checkRateLimit(`verify-token:${ip}`, 20, 5 * 60 * 1000)) {
      return NextResponse.json({ valid: false, error: 'محاولات كثيرة — حاول بعد 5 دقائق' }, { status: 429 })
    }

    const body = await req.json()
    const { token, session_key: storedSessionKey } = body

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ valid: false, error: 'رابط غير صالح' }, { status: 400 })
    }

    const supabase = getServiceClient()

    const { data: tokenData, error } = await supabase
      .from('tokens')
      .select('id, student_name, is_active, max_sessions, expires_at, token, is_registered')
      .eq('token', token)
      .single()

    if (error || !tokenData) {
      await supabase.from('access_logs').insert({
        event_type: 'denied',
        ip_address: ip,
        metadata: { reason: 'token_not_found', token_attempt: token.substring(0, 8) + '...' },
      })
      return NextResponse.json({ valid: false, error: 'هذا الرابط غير موجود' })
    }

    if (!tokenData.is_active) {
      return NextResponse.json({ valid: false, error: 'هذا الرابط تم تعطيله. يرجى التواصل معنا.' })
    }

    if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, error: 'انتهت صلاحية هذا الرابط.' })
    }

    // First-time visitor — needs to register
    if (!tokenData.is_registered) {
      return NextResponse.json({ valid: false, needs_registration: true })
    }

    const tokenPayload = {
      id: tokenData.id,
      student_name: tokenData.student_name,
      is_active: tokenData.is_active,
      max_sessions: tokenData.max_sessions,
      expires_at: tokenData.expires_at,
    }

    // If returning user sends a stored session_key, try to reuse that session
    if (storedSessionKey && typeof storedSessionKey === 'string') {
      const { data: existingSession } = await supabase
        .from('sessions')
        .select('id')
        .eq('token_id', tokenData.id)
        .eq('session_key', storedSessionKey)
        .eq('is_active', true)
        .single()

      if (existingSession) {
        await supabase
          .from('sessions')
          .update({ last_active: new Date().toISOString(), ip_address: ip })
          .eq('id', existingSession.id)

        return NextResponse.json({ valid: true, token: tokenPayload, session_key: storedSessionKey, ip })
      }
    }

    // No valid session — must authenticate with password
    return NextResponse.json({ valid: false, needs_auth: true })
  } catch (err) {
    console.error('verify-token error:', err)
    return NextResponse.json({ valid: false, error: 'خطأ داخلي في الخادم' }, { status: 500 })
  }
}
