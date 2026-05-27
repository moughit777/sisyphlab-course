import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { verifyAdminToken } from '@/lib/adminAuth'

const ALLOWED_UPDATE_FIELDS = [
  'student_name',
  'student_email',
  'expires_at',
  'max_sessions',
  'notes',
  'is_active',
] as const

type AllowedField = typeof ALLOWED_UPDATE_FIELDS[number]

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = verifyAdminToken(req)
  if (!authResult.ok) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  try {
    const body = await req.json()

    const updateData: Partial<Record<AllowedField, unknown>> = {}
    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (key in body) updateData[key] = body[key]
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('tokens')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ token: data })
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = verifyAdminToken(req)
  if (!authResult.ok) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const supabase = getServiceClient()
  const { error } = await supabase.from('tokens').delete().eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
