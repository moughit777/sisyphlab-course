import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { verifyAdminToken } from '@/lib/adminAuth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = verifyAdminToken(req)
  if (!authResult.ok) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const supabase = getServiceClient()

  // Deactivate all sessions
  await supabase.from('sessions').update({ is_active: false }).eq('token_id', params.id)

  // Clear registration data so student can re-register with new password
  const { error } = await supabase
    .from('tokens')
    .update({ is_registered: false, password_hash: null })
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: 'خطأ في إعادة التعيين' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
