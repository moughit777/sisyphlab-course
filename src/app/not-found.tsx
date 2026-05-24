import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4" dir="rtl">
      <div className="text-center">
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">الصفحة غير موجودة</h1>
        <p className="text-slate-400 mb-8">الصفحة التي تبحث عنها غير موجودة أو تم حذفها</p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-semibold hover:opacity-90 transition-opacity"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  )
}
