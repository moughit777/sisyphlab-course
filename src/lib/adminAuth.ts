import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-this'

export function createAdminToken(): string {
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
