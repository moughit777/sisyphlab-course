const FEATURED = {
  name: 'يوسف التازي', role: 'فريلانسر', city: 'فاس', initial: 'ي',
  text: 'كنت خايف من برامج Adobe، ولكن الشرح كان مبسط بزاف. دابا عندي خدمة فريلانس وكنكسب من المونتاج.',
  result: '1,200$ فأول شهر فريلانس',
}

const OTHERS = [
  {
    name: 'محمد العمراني', role: 'مصور فيديو', city: 'الدار البيضاء', initial: 'م',
    text: 'هاد الكورس بدّل مساري المهني بالكامل. كنت كنقطع فيديوهات عادية ودابا كنخدم فبروجيات كبيرة ومدفوعة مزيان.',
    result: 'أول كليان من بعد 3 سيمانات',
  },
  {
    name: 'ريم القادري', role: 'إعلامية', city: 'مراكش', initial: 'ر',
    text: 'الـ Color Grading وحدها تستاهل ثمن الكورس.',
  },
  {
    name: 'سارة بنسعيد', role: 'صانعة محتوى', city: 'أكادير', initial: 'س',
    text: 'من مجرد ما كملت الكورس، المشاهدات ديال الريلزات ديالي تلاتضعفات! تعلمت أسرار المونتاج السريع.',
    result: 'المشاهدات ×3 فشهر',
  },
  {
    name: 'عمر بوعزيز', role: 'يوتيوبر', city: 'طنجة', initial: 'ع',
    text: 'After Effects كانت حلم بعيد عليا. مع هاد الكورس فهمت كولشي خطوة بخطوة، والموشن ولا ساهل.',
    result: '+15k مشترك ف4 شهور',
  },
  {
    name: 'فاطمة الزهراء', role: 'مسؤولة تسويق', city: 'الرباط', initial: 'ف',
    text: 'وفّر عليا الكورس بزاف ديال الفلوس اللي كنت كنعطيها للمونطور. دابا كنصاوب الفيديوهات بوحدي.',
  },
  {
    name: 'خالد الإدريسي', role: 'مصمم جرافيك', city: 'تطوان', initial: 'خ',
    text: 'الكورس زاد على مهاراتي فالتصميم. دابا كنعرض خدمات مونتاج وتصميم بجوج، وكنكسب كثر بكثير.',
    result: 'دخل إضافي كل شهر',
  },
]

function Person({ name, role, city, initial, size = 40 }: { name: string; role: string; city: string; initial: string; size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="rounded-full bg-surface-3 border border-hair text-fg-2 font-medium flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}>
        {initial}
      </span>
      <span>
        <span className="block text-fg-1 font-medium text-[15px]">{name}</span>
        <span className="block text-fg-3 text-sm">{role}، {city}</span>
      </span>
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-28 border-t border-hair">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 className="text-[28px] md:text-[36px] font-bold">شنو قالو الطلبة</h2>
          <p className="text-fg-3">
            تقييم <bdi className="num text-fg-1 font-medium">4.9/5</bdi> من كثر من <bdi className="num">120</bdi> طالب
          </p>
        </div>

        {/* Featured quote — breaks the grid on purpose */}
        <figure className="mt-12 md:mt-16 py-10 md:py-12 border-y border-hair">
          <blockquote className="text-2xl md:text-[28px] text-fg-1 leading-[1.6] max-w-[48rem]">
            «{FEATURED.text}»
          </blockquote>
          <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <Person {...FEATURED} size={48} />
            <span className="text-fg-2"><bdi className="num">{FEATURED.result}</bdi></span>
          </figcaption>
        </figure>

        {/* Varied-height cards (CSS columns, no equal-height grid) */}
        <div className="mt-6 columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6">
          {OTHERS.map(t => (
            <figure key={t.name} className="break-inside-avoid mb-4 md:mb-6 bg-surface-1 border border-hair rounded-card p-6">
              <blockquote className="text-fg-2">{t.text}</blockquote>
              {t.result && <p className="mt-4 text-sm text-fg-1 font-medium">{t.result}</p>}
              <figcaption className="mt-6">
                <Person {...t} size={36} />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
