'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'


const links = [
  { label: 'الرئيسية',    href: '#hero' },
  { label: 'عن الكورس',   href: '#promo' },
  { label: 'المميزات',    href: '#features' },
  { label: 'المحتوى',     href: '#curriculum' },
  { label: 'آراء الطلاب', href: '#testimonials' },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
          scrolled
            ? 'bg-brand-black/95 backdrop-blur-xl border-b border-brand-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">

          {/* ── Logo ── */}
          <a href="#hero" className="flex items-center group">
            <div className="h-10 w-auto overflow-hidden">
              <Image
                src="/logo.svg"
                alt="Sisyph Lab"
                width={140}
                height={42}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
          </a>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-2 text-sm text-brand-gray hover:text-brand-white rounded-lg hover:bg-brand-card transition-all duration-200"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* ── CTA ── */}
          <div className="hidden lg:block">
            <motion.a
              href="#cta"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-green px-5 py-2.5 rounded-xl text-sm font-bold"
            >
              ابدأ الآن ←
            </motion.a>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="lg:hidden p-2 text-brand-gray hover:text-brand-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1,  y: 0 }}
            exit={{   opacity: 0,  y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-brand-dark/98 backdrop-blur-xl border-b border-brand-border lg:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm text-brand-gray hover:text-brand-white hover:bg-brand-card rounded-xl transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#cta"
                onClick={() => setMobileOpen(false)}
                className="block mt-2 px-4 py-3 text-center rounded-xl bg-brand-green text-black font-bold text-sm"
              >
                ابدأ الآن
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
