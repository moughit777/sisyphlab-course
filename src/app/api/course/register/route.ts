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
    const { token, name, email, password, phone } = body

    if (!token || !name || !email || !password || !phone) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'كلمة السر يجب أن تكون 6 أحرف على الأقل' }, { status: 400 })
    }

    const supabase = getServiceClient()

    const { data: tokenData, error } = await supabase
      .from('tokens')
      .select('id, student_name, is_active, max_sessions, expires_at, is_registered')
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

    if (tokenData.is_registered) {
      return NextResponse.json({ error: 'تم التسجيل مسبقاً — ادخل بكلمة السر' }, { status: 409 })
    }

    const password_hash = await bcrypt.hash(password, 10)

    const { error: updateError } = await supabase
      .from('tokens')
      .update({
        student_name: name,
        student_email: email,
        student_whatsapp: phone,
        password_hash,
        is_registered: true,
      })
      .eq('id', tokenData.id)

    if (updateError) {
      return NextResponse.json({ error: 'خطأ في الحفظ' }, { status: 500 })
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
      metadata: { action: 'first_registration' },
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
