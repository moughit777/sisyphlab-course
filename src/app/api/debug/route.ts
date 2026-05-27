import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

export async function GET() {
  const supabase = getServiceClient()

  const r1 = await supabase.from('tokens').select('*').order('created_at', { ascending: false }).limit(1)
  const r2 = await supabase.from('access_logs').select('*, tokens(student_name, token)').limit(1)

  return NextResponse.json({
    tokens_error: r1.error ? { message: r1.error.message, code: r1.error.code, details: r1.error.details } : null,
    tokens_ok: !r1.error,
    logs_error: r2.error ? { message: r2.error.message, code: r2.error.code, details: r2.error.details } : null,
    logs_ok: !r2.error,
  })
}
