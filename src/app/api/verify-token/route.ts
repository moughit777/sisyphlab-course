import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { checkRateLimit } from '@/lib/rateLimit'
import { v4 as uuidv4 } from 'uuid'

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
      .select('id, student_name, is_active, max_sessions, expires_at, token')
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

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { data: activeSessions } = await supabase
      .from('sessions')
      .select('id')
      .eq('token_id', tokenData.id)
      .eq('is_active', true)
      .gt('last_active', fiveMinutesAgo)

    const sessionCount = activeSessions?.length || 0

    if (sessionCount >= (tokenData.max_sessions || 1)) {
      await supabase.from('access_logs').insert({
        token_id: tokenData.id,
        event_type: 'session_conflict',
        ip_address: ip,
        metadata: { active_sessions: sessionCount },
      })
      return NextResponse.json({
        valid: false,
        error: 'هذا الرابط مفتوح بالفعل في جهاز آخر. أغلق الجلسات الأخرى وحاول مرة أخرى.',
      })
    }

    const sessionKey = uuidv4()
    await supabase.from('sessions').insert({
      token_id: tokenData.id,
      session_key: sessionKey,
      ip_address: ip,
      user_agent: req.headers.get('user-agent'),
    })

    await supabase.from('access_logs').insert({
      token_id: tokenData.id,
      event_type: 'access',
      ip_address: ip,
      user_agent: req.headers.get('user-agent'),
    })

    return NextResponse.json({ valid: true, token: tokenPayload, session_key: sessionKey, ip })
  } catch (err) {
    console.error('verify-token error:', err)
    return NextResponse.json({ valid: false, error: 'خطأ داخلي في الخادم' }, { status: 500 })
  }
}
