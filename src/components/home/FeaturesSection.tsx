import { Layers, Smartphone, Palette, Briefcase, Download } from 'lucide-react'

/* A static, hand-drawn take on an NLE timeline: tracks, clips and a playhead.
   It shows the thing the course actually teaches instead of a decorative icon. */
const TRACKS: { name: string; clips: { start: number; width: number; tone: 'v' | 'g' | 'a' | 't' }[] }[] = [
  { name: 'V3', clips: [{ start: 38, width: 22, tone: 't' }, { start: 70, width: 16, tone: 't' }] },
  { name: 'V2', clips: [{ start: 12, width: 14, tone: 'g' }, { start: 52, width: 30, tone: 'g' }] },
  { name: 'V1', clips: [{ start: 0, width: 24, tone: 'v' }, { start: 25, width: 31, tone: 'v' }, { start: 57, width: 43, tone: 'v' }] },
  { name: 'A1', clips: [{ start: 0, width: 56, tone: 'a' }, { start: 57, width: 43, tone: 'a' }] },
  { name: 'A2', clips: [{ start: 8, width: 70, tone: 'a' }] },
]

const TONE: Record<string, string> = {
  v: 'bg-[#2A3350] border-[#3A4668]',
  g: 'bg-[#33294A] border-[#473A66]',
  t: 'bg-surface-4 border-hair-strong',
  a: 'bg-[#1E3326] border-[#2B4A36]',
}

function Timeline() {
  return (
    <div dir="ltr" className="rounded-btn border border-hair bg-ink overflow-hidden select-none" aria-hidden>
      {/* Ruler */}
      <div className="flex h-7 border-b border-hair text-[10px] text-fg-4 num">
        <div className="w-10 shrink-0 border-r border-hair" />
        <div className="relative flex-1">
          {['00:00', '00:05', '00:10', '00:15', '00:20'].map((t, i) => (
            <span key={t} className="absolute top-1.5" style={{ left: `${i * 23 + 1}%` }}>{t}</span>
          ))}
        </div>
      </div>
      {/* Tracks */}
      <div className="relative">
        {TRACKS.map(track => (
          <div key={track.name} className="flex h-9 border-b border-hair last:border-0">
            <div className="w-10 shrink-0 border-r border-hair flex items-center justify-center text-[11px] text-fg-3 num">
              {track.name}
            </div>
            <div className="relative flex-1">
              {track.clips.map((c, i) => (
                <div key={i}
                  className={`absolute top-1.5 bottom-1.5 rounded-[3px] border ${TONE[c.tone]}`}
                  style={{ left: `${c.start}%`, width: `calc(${c.width}% - 2px)` }} />
              ))}
            </div>
          </div>
        ))}
        {/* Playhead */}
        <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: 'calc(40px + (100% - 40px) * 0.47)' }}>
          <div className="w-px h-full bg-accent" />
        </div>
      </div>
    </div>
  )
}

const SMALL = [
  {
    icon: Layers,
    title: 'موشن ب After Effects',
    desc: 'Keyframes، نصوص متحركة، وأنيميشن بسيط كيعطي للفيديو طابع احترافي.',
  },
  {
    icon: Smartphone,
    title: 'ريلز وتيك توك',
    desc: 'قص سريع، كتابة على الفيديو ومؤثرات صوتية كيخليو الناس تكمل الفيديو للآخر.',
  },
  {
    icon: Briefcase,
    title: 'من المهارة للفلوس',
    desc: 'كيفاش تبني بورتفوليو صغير، فين تلقى الكليان، وكيفاش تحدد الثمن ديالك. هادشي كامل فدروس مخصصة ليه.',
    wide: true,
  },
  {
    icon: Palette,
    title: 'التلوين',
    desc: 'تصحيح الألوان والـ Color Grading باش الفيديو يبان سينمائي.',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 border-t border-hair">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[28px] md:text-[36px] font-bold max-w-[40rem]">
          شنو غتقدر دير فآخر الكورس
        </h2>
        <p className="mt-4 text-fg-2 max-w-[36rem]">
          ماشي غير تعرف البرامج. غتعرف تسلّم فيديو كامل: من ترتيب الملفات حتى التصدير.
        </p>

        <div className="mt-12 md:mt-16 grid md:grid-cols-3 gap-4 md:gap-6">

          {/* Dominant tile */}
          <div className="md:col-span-2 md:row-span-2 bg-surface-1 border border-hair rounded-card p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-2 text-sm text-fg-3">
              <span className="rounded-full border border-hair px-2.5 py-0.5 text-xs text-fg-2"><bdi>Pr</bdi></span>
              14 درس تطبيقي
            </div>
            <h3 className="mt-4 text-xl font-medium">المونتاج ب <bdi>Premiere Pro</bdi> من الأول للآخر</h3>
            <p className="mt-2 text-fg-2 max-w-[32rem]">
              تنظيم الملفات، القص، الصوت، الكتابة، الانتقالات، التلوين والتصدير. كل درس فيه تطبيق على فيديو حقيقي.
            </p>
            <div className="mt-8 md:mt-auto pt-2">
              <Timeline />
            </div>
          </div>

          {SMALL.map(s => (
            <div key={s.title}
              className={`bg-surface-1 border border-hair rounded-card p-6 hover:border-hair-strong transition-colors duration-base ${s.wide ? 'md:col-span-2' : ''}`}>
              <div className="flex items-center gap-3">
                <s.icon className="w-5 h-5 text-fg-2 shrink-0" strokeWidth={1.75} />
                <h3 className="text-xl font-medium">{s.title}</h3>
              </div>
              <p className="mt-3 text-fg-2">{s.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 flex items-center gap-2 text-sm text-fg-3">
          <Download className="w-4 h-4" strokeWidth={1.75} />
          وفالأخير: أحسن إعدادات التصدير لكل منصة، بأحسن جودة وأصغر حجم.
        </p>
      </div>
    </section>
  )
}
