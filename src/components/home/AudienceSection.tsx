const FOR_WHO = [
  {
    title: 'ما عمرك حليتي برنامج مونتاج',
    desc: 'كنبداو من التثبيت وشرح الواجهة، حتى الاختصارات اللي كيخدمو بيهم المحترفين. ما كنفترضو حتى حاجة.',
  },
  {
    title: 'باغي تخدم فريلانس',
    desc: 'كاين دروس كاملين على كيفاش تلقى أول كليان، تلات طرق باش تجيب كليان جداد، وشحال تقدر تطلب.',
  },
  {
    title: 'عندك صفحة ولا قناة',
    desc: 'غتولي تمونطي ريلز وفيديوهات ديالك بوحدك، بالكتابة والمؤثرات الصوتية والتلوين، بلا ما تخلص شي حد.',
  },
]

export default function AudienceSection() {
  return (
    <section id="for-who" className="py-20 md:py-28 border-t border-hair">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <h2 className="text-[28px] md:text-[36px] font-bold">لمن هاد الكورس؟</h2>
          <p className="mt-4 text-fg-2 max-w-[28rem]">
            الكورس مبني على خدمة حقيقية: كل موديول كيسالي بحاجة كتقدر تخدمها وتبيعها.
            ما كاينش حشو، وما كاينش نظريات بلا تطبيق.
          </p>
        </div>

        <ol className="lg:col-span-7 border-t border-hair">
          {FOR_WHO.map((f, i) => (
            <li key={f.title} className="grid grid-cols-[2.5rem_1fr] gap-4 py-6 border-b border-hair">
              <span className="num text-sm text-fg-3 pt-1"><bdi>{String(i + 1).padStart(2, '0')}</bdi></span>
              <div>
                <h3 className="text-xl font-medium">{f.title}</h3>
                <p className="mt-2 text-fg-2">{f.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
