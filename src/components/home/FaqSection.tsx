'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: 'واش خاصني نكون كنعرف شي حاجة فالمونتاج قبل؟',
    a: 'لا. الموديول الأول كيبدا من الصفر: فين تلقى البرنامج، شنو خاصك باش تبدا، وشرح الواجهة زر بزر.',
  },
  {
    q: 'شنو البرامج والأجهزة اللي غنحتاج؟',
    a: <>غتحتاج حاسوب (<bdi>PC</bdi> ولا <bdi>Mac</bdi>) و <bdi>Premiere Pro</bdi> و <bdi>After Effects</bdi>. كاين دروس كيوريوك فين تلقاهم وكيفاش تثبتهم.</>,
  },
  {
    q: 'كيفاش كنشترك؟',
    a: 'كتصيفط لينا فواتساب، كنتفاهمو على الدفع، ومن بعد كيوصلك رابط شخصي فيه الكورس كامل.',
  },
  {
    q: 'واش كاين دعم إلا تبلوكيت؟',
    a: 'إيه. كاين دعم مباشر فواتساب، وكتجاوب على الأسئلة ديالك.',
  },
  {
    q: 'واش الكورس غيعلمني نلقى الخدمة؟',
    a: 'إيه. كاين دروس على طريقة إيجاد أول كليان، تلات طرق باش تجيب كليان جداد، وشحال تقدر تربح من المونتاج.',
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="py-20 md:py-28 border-t border-hair">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12">
        <h2 className="lg:col-span-4 text-[28px] md:text-[36px] font-bold">أسئلة كتتعاود</h2>
        <div className="lg:col-span-8 border-y border-hair divide-y divide-hair">
          {FAQ.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={i}>
                <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-5 text-start">
                  <span className="text-lg font-medium text-fg-1">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-fg-3 shrink-0 transition-transform duration-base ease-out ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <p className="pb-6 text-fg-2 max-w-[40rem]">{f.a}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
