import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { verifyAdminToken } from '@/lib/adminAuth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = verifyAdminToken(req)
  if (!authResult.ok) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  try {
    const supabase = getServiceClient()

    // deactivate all active sessions for this token_id
    const { error } = await supabase
      .from('sessions')
      .update({ is_active: false })
      .eq('token_id', params.id)
      .eq('is_active', true)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 })
  }
}
