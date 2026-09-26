const LINKS = [
  { label: 'المنهاج',     href: '#curriculum' },
  { label: 'آراء الطلبة', href: '#testimonials' },
  { label: 'أسئلة',       href: '#faq' },
  { label: 'واتساب',      href: 'https://wa.me/212771169875' },
]

export default function Footer() {
  return (
    <footer className="border-t border-hair py-12 text-fg-3 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map(l => (
            <a key={l.label} href={l.href}
              {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="hover:text-fg-2 transition-colors duration-fast">
              {l.label}
            </a>
          ))}
        </nav>
        <p>
          © <bdi className="num">{new Date().getFullYear()}</bdi> <bdi>Sisyph Lab</bdi>. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  )
}
