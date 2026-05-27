import { NextRequest, NextResponse } from 'next/server'
import { createAdminToken } from '@/lib/adminAuth'
import { timingSafeEqual } from 'crypto'
import { checkRateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0'

    if (!checkRateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json({ error: 'محاولات كثيرة — حاول بعد 15 دقيقة' }, { status: 429 })
    }

    const { password } = await req.json()

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json({ error: 'لم يتم تكوين كلمة مرور الإدارة' }, { status: 500 })
    }

    const passBuffer = Buffer.from(password ?? '')
    const expectedBuffer = Buffer.from(adminPassword)
    const isValid =
      passBuffer.length === expectedBuffer.length &&
      timingSafeEqual(passBuffer, expectedBuffer)

    if (!isValid) {
      return NextResponse.json({ error: 'كلمة مرور خاطئة' }, { status: 401 })
    }

    const token = createAdminToken()

    const response = NextResponse.json({ ok: true, token })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('admin_token')
  return response
}
