import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { getServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || '0.0.0.0'

    const body = await req.json()
    const { token, email, password } = body

    if (!token || !email || !password) {
      return NextResponse.json({ error: 'البيانات ناقصة' }, { status: 400 })
    }

    const supabase = getServiceClient()

    const { data: tokenData, error } = await supabase
      .from('tokens')
      .select('id, student_name, student_email, is_active, max_sessions, expires_at, is_registered, password_hash')
      .eq('token', token)
      .single()

    if (error || !tokenData) {
      return NextResponse.json({ error: 'الرابط غير صالح' }, { status: 404 })
    }

    if (!tokenData.is_active) {
      return NextResponse.json({ error: 'هذا الرابط تم تعطيله' }, { status: 403 })
    }

    if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ error: 'انتهت صلاحية هذا الرابط' }, { status: 403 })
    }

    if (!tokenData.is_registered || !tokenData.password_hash) {
      return NextResponse.json({ error: 'لم يتم التسجيل بعد' }, { status: 400 })
    }

    if (tokenData.student_email?.toLowerCase() !== email.toLowerCase()) {
      await supabase.from('access_logs').insert({
        token_id: tokenData.id,
        event_type: 'denied',
        ip_address: ip,
        metadata: { reason: 'wrong_email' },
      })
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة السر غير صحيحة' }, { status: 401 })
    }

    const passwordOk = await bcrypt.compare(password, tokenData.password_hash)
    if (!passwordOk) {
      await supabase.from('access_logs').insert({
        token_id: tokenData.id,
        event_type: 'denied',
        ip_address: ip,
        metadata: { reason: 'wrong_password' },
      })
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة السر غير صحيحة' }, { status: 401 })
    }

    // check session limit
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { data: activeSessions } = await supabase
      .from('sessions')
      .select('id')
      .eq('token_id', tokenData.id)
      .eq('is_active', true)
      .gt('last_active', fiveMinutesAgo)

    if ((activeSessions?.length || 0) >= (tokenData.max_sessions || 1)) {
      await supabase.from('access_logs').insert({
        token_id: tokenData.id,
        event_type: 'session_conflict',
        ip_address: ip,
        metadata: { active_sessions: activeSessions?.length },
      })
      return NextResponse.json({
        error: 'هذا الرابط مفتوح في جهاز آخر. أغلق الجلسات الأخرى وحاول مرة أخرى.',
      }, { status: 409 })
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

    return NextResponse.json({
      ok: true,
      session_key: sessionKey,
      ip,
      token: {
        id: tokenData.id,
        student_name: tokenData.student_name,
        is_active: tokenData.is_active,
        max_sessions: tokenData.max_sessions,
        expires_at: tokenData.expires_at,
      },
    })
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 })
  }
}
