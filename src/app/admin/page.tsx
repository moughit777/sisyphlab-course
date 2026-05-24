'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Activity, Shield, Plus, Copy, Trash2, ToggleLeft, ToggleRight,
  LogOut, RefreshCw, Eye, X, Check, AlertCircle, Zap, Clock, Globe,
  ChevronDown, ExternalLink,
} from 'lucide-react'
import { Token, AccessLog, AdminStats } from '@/lib/types'
import { formatDate } from '@/lib/utils'

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('admin_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'tokens' | 'logs'>('tokens')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [tokens, setTokens] = useState<Token[]>([])
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState(false)

  // Create form state
  const [form, setForm] = useState({ student_name: '', student_email: '', expires_at: '', max_sessions: '1', notes: '' })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [newTokenUrl, setNewTokenUrl] = useState('')

  const fetchAll = useCallback(async () => {
    try {
      const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() }
      const [statsRes, tokensRes, logsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/tokens', { headers }),
        fetch('/api/admin/logs', { headers }),
      ])

      if (statsRes.status === 401) { router.push('/admin/login'); return }

      const [statsData, tokensData, logsData] = await Promise.all([
        statsRes.json(), tokensRes.json(), logsRes.json(),
      ])

      setStats(statsData)
      setTokens(tokensData.tokens || [])
      setLogs(logsData.logs || [])
      setAuthorized(true)
    } catch {
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { fetchAll() }, [fetchAll])

  async function handleCreateToken() {
    if (!form.student_name.trim()) { setCreateError('اسم الطالب مطلوب'); return }
    setCreating(true)
    setCreateError('')

    try {
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          student_name: form.student_name,
          student_email: form.student_email || undefined,
          expires_at: form.expires_at || undefined,
          max_sessions: parseInt(form.max_sessions),
          notes: form.notes || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setCreateError(data.error || 'حدث خطأ'); return }

      setNewTokenUrl(data.access_url)
      setTokens(prev => [data.token, ...prev])
      setForm({ student_name: '', student_email: '', expires_at: '', max_sessions: '1', notes: '' })
      fetchAll()
    } catch {
      setCreateError('خطأ في الاتصال')
    } finally {
      setCreating(false)
    }
  }

  async function toggleToken(token: Token) {
    await fetch(`/api/tokens/${token.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ is_active: !token.is_active }),
    })
    setTokens(prev => prev.map(t => t.id === token.id ? { ...t, is_active: !t.is_active } : t))
  }

  async function deleteToken(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا الرابط؟')) return
    await fetch(`/api/tokens/${id}`, { method: 'DELETE', headers: getAuthHeaders() as HeadersInit })
    setTokens(prev => prev.filter(t => t.id !== id))
  }

  function copyUrl(token: string) {
    const url = `${window.location.origin}/course/${token}`
    navigator.clipboard.writeText(url)
    setCopiedId(token)
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function handleLogout() {
    localStorage.removeItem('admin_token')
    await fetch('/api/admin-auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  function getEventBadge(type: string) {
    const map: Record<string, { label: string; cls: string }> = {
      access: { label: 'دخول', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
      denied: { label: 'مرفوض', cls: 'bg-red-500/15 text-red-400 border-red-500/20' },
      session_conflict: { label: 'تعارض جلسة', cls: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
      suspicious: { label: 'مشبوه', cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
      video_start: { label: 'بدء فيديو', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
    }
    const b = map[type] || { label: type, cls: 'bg-dark-500/30 text-slate-400 border-dark-400/40' }
    return <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${b.cls}`}>{b.label}</span>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-accent-purple/20 border-t-accent-purple rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">تحميل لوحة التحكم...</p>
        </div>
      </div>
    )
  }

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-dark-900" dir="rtl">
      {/* Header */}
      <header className="border-b border-dark-500/50 bg-dark-800/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">مونتاج برو</span>
            <span className="text-dark-300 text-xs hidden sm:block">/ لوحة التحكم</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAll}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-500/50 transition-colors"
              title="تحديث"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-500/50 transition-colors text-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'إجمالي الروابط', value: stats?.total_tokens || 0, color: 'text-accent-purple-light' },
            { icon: Shield, label: 'روابط نشطة', value: stats?.active_tokens || 0, color: 'text-emerald-400' },
            { icon: Activity, label: 'جلسات نشطة', value: stats?.active_sessions || 0, color: 'text-accent-blue-light' },
            { icon: Clock, label: 'أحداث (24س)', value: stats?.recent_accesses || 0, color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="p-5 rounded-2xl glass border border-dark-400/30">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-xs text-slate-500">{s.label}</span>
              </div>
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 p-1 rounded-xl bg-dark-700/50 w-fit border border-dark-500/40">
          {[
            { id: 'tokens', label: 'الروابط', icon: Users },
            { id: 'logs', label: 'السجلات', icon: Activity },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'tokens' | 'logs')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-accent-purple text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tokens tab */}
        {activeTab === 'tokens' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">روابط الوصول ({tokens.length})</h2>
              <button
                onClick={() => { setShowCreateModal(true); setNewTokenUrl('') }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white text-sm font-semibold hover:shadow-glow-purple transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                رابط جديد
              </button>
            </div>

            <div className="space-y-3">
              {tokens.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>لا توجد روابط بعد — أنشئ أول رابط الآن</p>
                </div>
              ) : (
                tokens.map(token => (
                  <motion.div
                    key={token.id}
                    layout
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl glass border border-dark-400/30 hover:border-dark-300/50 transition-colors"
                  >
                    {/* Status indicator */}
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 sm:mt-0 ${token.is_active ? 'bg-emerald-400' : 'bg-slate-600'}`} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white text-sm">{token.student_name}</span>
                        {token.student_email && (
                          <span className="text-xs text-slate-500">{token.student_email}</span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${token.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-dark-500/30 text-slate-500 border-dark-400/30'}`}>
                          {token.is_active ? 'نشط' : 'معطل'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 font-mono truncate">
                        /course/{token.token.substring(0, 20)}...
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        أُنشئ: {formatDate(token.created_at)}
                        {token.expires_at && ` · ينتهي: ${formatDate(token.expires_at)}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => copyUrl(token.token)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-500/50 transition-colors"
                        title="نسخ الرابط"
                      >
                        {copiedId === token.token ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <a
                        href={`/course/${token.token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-500/50 transition-colors"
                        title="فتح الرابط"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => toggleToken(token)}
                        className={`p-1.5 rounded-lg transition-colors ${token.is_active ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-500 hover:bg-dark-500/50'}`}
                        title={token.is_active ? 'تعطيل' : 'تفعيل'}
                      >
                        {token.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => deleteToken(token.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Logs tab */}
        {activeTab === 'logs' && (
          <div>
            <h2 className="font-bold text-white mb-4">سجل الأحداث ({logs.length})</h2>
            <div className="rounded-2xl glass border border-dark-400/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-500/50">
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">الحدث</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">الطالب</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">IP</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">الوقت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-12 text-center text-slate-500">لا توجد سجلات</td>
                      </tr>
                    ) : (
                      logs.map(log => (
                        <tr key={log.id} className="border-b border-dark-500/20 hover:bg-dark-500/10 transition-colors">
                          <td className="px-4 py-3">{getEventBadge(log.event_type)}</td>
                          <td className="px-4 py-3 text-slate-300 text-xs">{(log as any).tokens?.student_name || '—'}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs font-mono">{log.ip_address || '—'}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{new Date(log.created_at).toLocaleString('ar-MA')}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Token Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) { setShowCreateModal(false); setNewTokenUrl('') } }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-dark-700 rounded-3xl border border-dark-400/50 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-dark-500/50 flex items-center justify-between">
                <h3 className="font-bold text-white">إنشاء رابط جديد</h3>
                <button onClick={() => { setShowCreateModal(false); setNewTokenUrl('') }} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {newTokenUrl ? (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h4 className="font-bold text-white mb-2">تم إنشاء الرابط بنجاح!</h4>
                  <p className="text-slate-400 text-sm mb-4">انسخ الرابط وأرسله للطالب</p>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-dark-800/60 border border-dark-400/40 mb-4">
                    <span className="text-xs font-mono text-slate-300 truncate flex-1 text-left">{newTokenUrl}</span>
                    <button
                      onClick={() => { navigator.clipboard.writeText(newTokenUrl); }}
                      className="flex-shrink-0 p-1.5 rounded-lg bg-accent-purple/20 text-accent-purple-light hover:bg-accent-purple/30 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => { setShowCreateModal(false); setNewTokenUrl('') }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white text-sm font-semibold"
                  >
                    إغلاق
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {createError && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {createError}
                    </div>
                  )}

                  {[
                    { key: 'student_name', label: 'اسم الطالب *', placeholder: 'محمد أحمد', type: 'text' },
                    { key: 'student_email', label: 'البريد الإلكتروني', placeholder: 'student@email.com', type: 'email' },
                    { key: 'expires_at', label: 'تاريخ الانتهاء (اختياري)', placeholder: '', type: 'datetime-local' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">{f.label}</label>
                      <input
                        type={f.type}
                        value={(form as any)[f.key]}
                        onChange={(e) => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full px-3 py-2.5 rounded-xl bg-dark-600/60 border border-dark-400/40 text-white placeholder-slate-600 focus:outline-none focus:border-accent-purple/50 text-sm"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">أقصى عدد جلسات متزامنة</label>
                    <select
                      value={form.max_sessions}
                      onChange={(e) => setForm(prev => ({ ...prev, max_sessions: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-600/60 border border-dark-400/40 text-white focus:outline-none focus:border-accent-purple/50 text-sm"
                    >
                      {[1,2,3].map(n => <option key={n} value={n}>{n} {n === 1 ? 'جلسة' : 'جلسات'}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">ملاحظات (اختياري)</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="ملاحظات إضافية..."
                      rows={2}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-600/60 border border-dark-400/40 text-white placeholder-slate-600 focus:outline-none focus:border-accent-purple/50 text-sm resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { setShowCreateModal(false); setCreateError('') }}
                      className="flex-1 py-2.5 rounded-xl border border-dark-400/50 text-slate-400 hover:text-white hover:bg-dark-500/50 text-sm transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleCreateToken}
                      disabled={creating}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-semibold text-sm disabled:opacity-60 hover:shadow-glow-purple transition-all"
                    >
                      {creating ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          إنشاء...
                        </span>
                      ) : 'إنشاء الرابط'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
