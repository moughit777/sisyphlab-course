import { NextRequest, NextResponse } from 'next/server'
import { createAdminToken } from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json({ error: 'لم يتم تكوين كلمة مرور الإدارة' }, { status: 500 })
    }

    // Direct comparison (for simplicity — use bcrypt in production)
    const isValid = password === adminPassword

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
