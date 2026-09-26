import { WA_URL } from './constants'

export default function CTASection() {
  return (
    <section id="cta" className="py-24 md:py-32 border-t border-hair text-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[28px] md:text-[36px] font-bold max-w-[36rem] mx-auto">
          أول فيديو كتمونطيه مزيان، هو اللي كيجيب الكليان الثاني.
        </h2>
        <p className="mt-4 text-fg-2 max-w-[32rem] mx-auto">
          صيفط لينا فواتساب وسولنا على أي حاجة قبل ما تشترك.
        </p>
        <a href={WA_URL} target="_blank" rel="noopener noreferrer"
          className="mt-10 inline-flex items-center h-12 px-6 rounded-btn bg-accent text-accent-on font-bold hover:bg-accent-hover transition-colors duration-fast">
          تواصل معانا فواتساب
        </a>
      </div>
    </section>
  )
}
