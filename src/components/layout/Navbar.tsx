'use client'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

const links = [
  { label: 'المنهاج',     href: '#curriculum' },
  { label: 'شنو غتتعلم', href: '#features' },
  { label: 'آراء الطلبة', href: '#testimonials' },
  { label: 'أسئلة',       href: '#faq' },
]

export default function Navbar() {
  const [pastHero,   setPastHero]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // The nav CTA stays neutral while the hero (which has its own green button) is on screen,
  // so there is only ever one green fill in view.
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { rootMargin: '-64px 0px 0px 0px' })
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  return (
    <header className="sticky top-0 z-50 h-16 bg-ink/80 backdrop-blur-md border-b border-hair">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">

        <a href="#hero" className="flex items-center gap-3 shrink-0" aria-label="Sisyph Lab">
          <span className="w-9 h-9 rounded-full overflow-hidden">
            <Image src="/logo.png" alt="" width={36} height={36} className="w-full h-full object-cover object-left" priority />
          </span>
          <bdi className="hidden sm:inline text-[15px] font-medium text-fg-1">Sisyph Lab</bdi>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="px-3 py-2 text-[15px] text-fg-2 hover:text-fg-1 transition-colors duration-fast">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#offer"
            className={`hidden sm:inline-flex items-center h-9 px-4 rounded-btn text-[15px] font-medium transition-colors duration-fast ${
              pastHero
                ? 'bg-accent text-accent-on hover:bg-accent-hover'
                : 'bg-surface-3 border border-hair text-fg-1 hover:border-hair-strong'
            }`}>
            اشترك
          </a>
          <button
            className="md:hidden w-10 h-10 inline-flex items-center justify-center text-fg-2 hover:text-fg-1"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'سد القائمة' : 'حل القائمة'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-b border-hair bg-ink">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="py-3 text-base text-fg-2 hover:text-fg-1 border-b border-hair last:border-0">
                {l.label}
              </a>
            ))}
            <a href="#offer" onClick={() => setMobileOpen(false)}
              className="mt-3 mb-1 h-11 inline-flex items-center justify-center rounded-btn bg-accent text-accent-on font-bold">
              اشترك
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
