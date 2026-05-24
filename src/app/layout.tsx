import type { Metadata } from 'next'
import { Tajawal } from 'next/font/google'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  display: 'swap',
  variable: '--font-tajawal',
})

export const metadata: Metadata = {
  title: 'مونتاج برو | كورس المونتاج الاحترافي',
  description: 'تعلم مونتاج احترافي مع Premiere Pro و After Effects — صناعة Reels، مونتاج سوشيال ميديا، مؤثرات بصرية',
  keywords: 'مونتاج, premiere pro, after effects, reels, تعليم, كورس, مغرب',
  openGraph: {
    title: 'مونتاج برو | كورس المونتاج الاحترافي',
    description: 'تعلم مونتاج احترافي من الصفر حتى الاحتراف',
    type: 'website',
    locale: 'ar_MA',
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#080a08" />
      </head>
      <body className={`${tajawal.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
