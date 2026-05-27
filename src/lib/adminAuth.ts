import { NextRequest } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('ADMIN_JWT_SECRET environment variable is required')
}

export function createAdminToken(): string {
  const payload = { admin: true, iat: Date.now(), exp: Date.now() + 24 * 60 * 60 * 1000 }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', JWT_SECRET!).update(encoded).digest('base64url')
  return `${encoded}.${sig}`
}

export function verifyAdminToken(req: NextRequest): { ok: boolean } {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '') || req.cookies.get('admin_token')?.value

  if (!token) return { ok: false }

  try {
    const dotIndex = token.lastIndexOf('.')
    if (dotIndex === -1) return { ok: false }

    const encodedPayload = token.slice(0, dotIndex)
    const sig = token.slice(dotIndex + 1)

    const expectedSig = createHmac('sha256', JWT_SECRET!).update(encodedPayload).digest('base64url')

    const sigBuf = Buffer.from(sig)
    const expectedBuf = Buffer.from(expectedSig)
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
      return { ok: false }
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString())
    if (payload.exp < Date.now()) return { ok: false }
    if (!payload.admin) return { ok: false }

    return { ok: true }
  } catch {
    return { ok: false }
  }
}
