import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getServiceClient } from '@/lib/supabase'
import { generateToken } from '@/lib/utils'
import { verifyAdminToken } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  const authResult = verifyAdminToken(req)
  if (!authResult.ok) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) { console.error('GET /api/tokens error:', error); return NextResponse.json({ error: error.message }, { status: 500 }) }
  return NextResponse.json({ tokens: data })
}

export async function POST(req: NextRequest) {
  const authResult = verifyAdminToken(req)
  if (!authResult.ok) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  try {
    const body = await req.json()
    const { student_name, student_email, student_whatsapp, student_password } = body

    if (!student_name) {
      return NextResponse.json({ error: 'اسم الطالب مطلوب' }, { status: 400 })
    }

    const token = generateToken()
    const supabase = getServiceClient()

    const password_hash = student_password ? await bcrypt.hash(student_password, 10) : null

    const { data, error } = await supabase
      .from('tokens')
      .insert({
        token,
        student_name,
        student_email: student_email || null,
        student_whatsapp: student_whatsapp || null,
        password_hash: password_hash || null,
        is_registered: !!password_hash,
        is_active: true,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return NextResponse.json({
      token: data,
      access_url: `${appUrl}/course/${token}`,
    })
  } catch (err) {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 })
  }
}
