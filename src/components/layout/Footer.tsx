import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-black py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Logo */}
          <a href="#hero" className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <Image src="/logo.png" alt="Sisyph Lab" width={32} height={32} className="w-full h-full object-cover object-left" />
            </div>
          </a>

          <p className="text-xs text-brand-muted">
            © {new Date().getFullYear()} Sisyph Lab — جميع الحقوق محفوظة
          </p>

          <div className="flex items-center gap-4 text-xs text-brand-muted">
            <a href="#" className="hover:text-brand-gray transition-colors">سياسة الخصوصية</a>
            <span>·</span>
            <a href="#" className="hover:text-brand-gray transition-colors">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
