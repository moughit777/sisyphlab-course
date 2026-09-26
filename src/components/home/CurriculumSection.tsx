'use client'
import { useState } from 'react'
import { ChevronDown, Lock } from 'lucide-react'
import { DEMO_COURSE } from '@/lib/courseData'
import { formatDuration } from '@/lib/utils'

const OUTCOMES: Record<number, string> = {
  1: 'تفهم السوق، شحال تقدر تربح، وشنو خاصك باش تبدا.',
  2: 'تمونطي فيديو كامل بوحدك، من الملفات الخام حتى التصدير.',
  3: 'تزيد الموشن والنصوص المتحركة على الفيديوهات ديالك.',
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function CurriculumSection() {
  const [open, setOpen] = useState<string | null>(null)
  const modules = DEMO_COURSE.modules || []
  const totalLessons = modules.reduce((a, m) => a + (m.lessons?.length || 0), 0)

  return (
    <section id="curriculum" className="py-20 md:py-28 border-t border-hair">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 className="text-[28px] md:text-[36px] font-bold">المنهاج</h2>
          <p className="text-fg-3 num">
            <bdi>{totalLessons}</bdi> درس، <bdi>{modules.length}</bdi> موديولات
          </p>
        </div>

        <div className="mt-12 md:mt-16 border-y border-hair divide-y divide-hair">
          {modules.map(m => {
            const isOpen = open === m.id
            const secs = m.lessons?.reduce((a, l) => a + (l.duration_seconds || 0), 0) || 0
            const app = m.order_index === 3 ? 'Ae' : 'Pr'
            return (
              <div key={m.id}>
                <button
                  onClick={() => setOpen(isOpen ? null : m.id)}
                  aria-expanded={isOpen}
                  className="w-full grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[3rem_1fr_auto] items-center gap-4 py-5 md:py-6 text-start group"
                >
                  <span className="num text-sm text-fg-3"><bdi>{pad(m.order_index)}</bdi></span>
                  <span className="min-w-0">
                    <span className="block text-lg font-medium text-fg-1 group-hover:text-white transition-colors duration-fast">{m.title}</span>
                    <span className="block mt-1 text-fg-2 text-[15px]">{OUTCOMES[m.order_index]}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="hidden sm:inline text-sm text-fg-3 num">
                      <bdi>{m.lessons?.length}</bdi> درس · <bdi>{formatDuration(secs)}</bdi>
                    </span>
                    <span className="rounded-full border border-hair px-2.5 py-0.5 text-xs text-fg-2"><bdi>{app}</bdi></span>
                    <ChevronDown className={`w-5 h-5 text-fg-3 transition-transform duration-base ease-out ${isOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>

                {isOpen && (
                  <ol className="pb-6 md:ps-16 ps-14">
                    {m.lessons?.map((l, li) => (
                      <li key={l.id} className="flex items-center gap-4 py-2.5 border-t border-hair first:border-0">
                        <span className="num text-xs text-fg-3 w-6 shrink-0"><bdi>{pad(li + 1)}</bdi></span>
                        <span className="flex-1 min-w-0 text-fg-2">{l.title}</span>
                        {l.duration_seconds ? (
                          <span className="num text-sm text-fg-3 shrink-0"><bdi>{formatDuration(l.duration_seconds)}</bdi></span>
                        ) : null}
                        <Lock className="w-3.5 h-3.5 text-fg-4 shrink-0" aria-label="مقفول" />
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )
          })}
        </div>

        <p className="mt-6 text-sm text-fg-3">
          الدروس كيتحلّو بعد الاشتراك، وكيوصلك رابط شخصي فيه الكورس كامل.
        </p>
      </div>
    </section>
  )
}
