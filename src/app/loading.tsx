export default function Loading() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-accent-purple/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-accent-purple border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p className="text-slate-500 text-sm">جارٍ التحميل...</p>
      </div>
    </div>
  )
}
