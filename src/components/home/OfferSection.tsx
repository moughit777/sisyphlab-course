import { Check } from 'lucide-react'
import { WA_URL } from './constants'
import { DEMO_COURSE } from '@/lib/courseData'

const lessons = DEMO_COURSE.modules?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0

const INCLUDES = [
  <><bdi className="num">{lessons}</bdi> درس فيديو فـ <bdi>Premiere Pro</bdi> و <bdi>After Effects</bdi></>,
  'دروس على كيفاش تلقى الكليان وتحدد الثمن',
  'دعم مباشر فواتساب إلا تبلوكيتي فشي حاجة',
  'تحديثات مجانية مدى الحياة',
]

export default function OfferSection() {
  return (
    <section id="offer" className="py-20 md:py-28 border-t border-hair">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-surface-2 border border-accent/30 rounded-card p-6 sm:p-8">
          <p className="text-sm text-fg-3">الكورس الكامل</p>
          <h2 className="mt-2 text-[28px] font-bold">إتقان المونتاج: من الصفر لأول كليان</h2>

          <ul className="mt-8 space-y-4">
            {INCLUDES.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-fg-2">
                <Check className="w-5 h-5 text-accent shrink-0 mt-1" strokeWidth={2} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <a href={WA_URL} target="_blank" rel="noopener noreferrer"
            className="mt-10 flex items-center justify-center gap-2 h-12 px-6 rounded-btn bg-accent text-accent-on font-bold hover:bg-accent-hover transition-colors duration-fast">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            اشترك عبر واتساب
          </a>
          <p className="mt-4 text-sm text-fg-3 text-center">
            كتجاوب فدقايق، وبلا حتى التزام. من بعد الدفع كيوصلك الرابط ديالك.
          </p>
        </div>

        {/* A testimonial next to the CTA, not only in the testimonials block */}
        <figure className="max-w-md mx-auto mt-8 text-center">
          <blockquote className="text-fg-2">«الـ Color Grading وحدها تستاهل ثمن الكورس.»</blockquote>
          <figcaption className="mt-2 text-sm text-fg-3">ريم القادري، مراكش</figcaption>
        </figure>
      </div>
    </section>
  )
}
