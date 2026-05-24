export interface Token {
  id: string
  token: string
  student_name: string
  student_email?: string
  is_active: boolean
  max_sessions: number
  created_at: string
  expires_at?: string
  notes?: string
}

export interface Session {
  id: string
  token_id: string
  session_key: string
  ip_address?: string
  user_agent?: string
  created_at: string
  last_active: string
  is_active: boolean
}

export interface AccessLog {
  id: string
  token_id?: string
  event_type: 'access' | 'denied' | 'video_start' | 'video_pause' | 'suspicious' | 'session_conflict'
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, unknown>
  created_at: string
  tokens?: { student_name: string; token: string }
}

export interface Course {
  id: string
  title: string
  description?: string
  thumbnail_url?: string
  is_active: boolean
  created_at: string
  modules?: Module[]
}

export interface Module {
  id: string
  course_id: string
  title: string
  order_index: number
  created_at: string
  lessons?: Lesson[]
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  description?: string
  video_url: string
  duration_seconds?: number
  order_index: number
  is_preview: boolean
  thumbnail_url?: string
  created_at: string
}

export interface AdminStats {
  total_tokens: number
  active_tokens: number
  total_sessions: number
  active_sessions: number
  total_logs: number
  recent_accesses: number
}

export interface VerifyTokenResult {
  valid: boolean
  token?: Token
  session_key?: string
  error?: string
}
