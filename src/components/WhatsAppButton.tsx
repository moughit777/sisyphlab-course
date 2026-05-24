'use client'
import { motion } from 'framer-motion'

export default function WhatsAppButton() {
  const URL = 'https://wa.me/212624821600?text=السلام%20عليكم%2C%20أريد%20الاشتراك%20في%20كورس%20المونتاج'

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2.5, type: 'spring', stiffness: 200 }}
    >
      {/* Pulse rings */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-15" style={{ animationDelay: '0.7s' }} />

      <motion.a
        href={URL}
        target="_blank"
        rel="noopener noreferrer"
        title="تواصل معنا على واتساب"
        className="relative flex items-center justify-center w-14 h-14 rounded-full"
        style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', boxShadow: '0 4px 20px rgba(37,211,102,0.45)' }}
        whileHover={{ scale: 1.13, boxShadow: '0 6px 32px rgba(37,211,102,0.65)' }}
        whileTap={{ scale: 0.93 }}
      >
        {/* Official WhatsApp SVG logo */}
        <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 3C8.82 3 3 8.82 3 16c0 2.38.65 4.6 1.77 6.52L3 29l6.66-1.74A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3Z"
            fill="white"
            fillOpacity="0.15"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 4.5C9.648 4.5 4.5 9.648 4.5 16c0 2.3.65 4.44 1.77 6.26L4.5 27.5l5.38-1.74A11.47 11.47 0 0 0 16 27.5c6.352 0 11.5-5.148 11.5-11.5S22.352 4.5 16 4.5Zm-4.18 6.3c.25 0 .52.01.75.62l.96 2.44c.22.56.08.88-.18 1.22l-.5.6c-.18.22-.17.44-.04.66.56.95 1.3 1.8 2.16 2.46.76.58 1.62 1.02 2.54 1.26.24.06.46.01.62-.17l.6-.68c.3-.34.62-.44 1.1-.2l2.3 1.08c.5.24.62.5.52.92-.1.42-.7 1.6-1.42 1.82-.72.22-1.62.22-2.78-.28-1.16-.5-5.06-2.6-6.6-6.02-.74-1.66-.52-2.9-.08-3.5.44-.6 1.3-.83 1.55-.83Z"
            fill="white"
          />
        </svg>
      </motion.a>
    </motion.div>
  )
}
