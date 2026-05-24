import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-this'

// Simple JWT-like token (base64 encoded payload + signature)
function createAdminToken(): string {
  const payload = { admin: true, iat: Date.now(), exp: Date.now() + 24 * 60 * 60 * 1000 }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = Buffer.from(JWT_SECRET + encoded).toString('base64url').substring(0, 32)
  return `${encoded}.${signature}`
}

export function verifyAdminToken(req: NextRequest): { ok: boolean } {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '') || req.cookies.get('admin_token')?.value

  if (!token) return { ok: false }

  try {
    const [encodedPayload, sig] = token.split('.')
    const expectedSig = Buffer.from(JWT_SECRET + encodedPayload).toString('base64url').substring(0, 32)
    if (sig !== expectedSig) return { ok: false }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString())
    if (payload.exp < Date.now()) return { ok: false }
    if (!payload.admin) return { ok: false }

    return { ok: true }
  } catch {
    return { ok: false }
  }
}

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
