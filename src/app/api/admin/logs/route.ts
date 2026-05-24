import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { verifyAdminToken } from '../../admin-auth/route'

export async function GET(req: NextRequest) {
  const authResult = verifyAdminToken(req)
  if (!authResult.ok) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('access_logs')
    .select('*, tokens(student_name, token)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ logs: data })
}
