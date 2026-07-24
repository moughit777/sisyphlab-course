import type { Metadata } from 'next'
import { Tajawal, IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'
import { GlobalBackground } from '@/components/ui/global-background'

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  display: 'swap',
  variable: '--font-tajawal',
})

const ibmPlex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm',
})

export const metadata: Metadata = {
  title: 'مونتاج برو | كورس المونتاج الاحترافي',
  description: 'كيفاش دير أول 1000 دولار من المونتاج — كورس مغربي متكامل مع Premiere Pro و After Effects من الصفر حتى الاحتراف.',
  keywords: 'مونتاج, premiere pro, after effects, reels, تعليم, كورس, مغرب, sisyphlab, مونتاج احترافي, فيديو',
  metadataBase: new URL('https://sisyphlab.com'),
  alternates: {
    canonical: 'https://sisyphlab.com',
  },
  openGraph: {
    title: 'مونتاج برو | كورس المونتاج الاحترافي',
    description: 'كيفاش دير أول 1000 دولار من المونتاج — كورس مغربي متكامل مع Premiere Pro و After Effects من الصفر حتى الاحتراف.',
    type: 'website',
    locale: 'ar_MA',
    url: 'https://sisyphlab.com',
    siteName: 'Sisyph Lab',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'مونتاج برو - كورس المونتاج الاحترافي',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مونتاج برو | كورس المونتاج الاحترافي',
    description: 'كيفاش دير أول 1000 دولار من المونتاج — كورس مغربي متكامل من الصفر حتى الاحتراف.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${ibmPlex.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#070B1A" />
      </head>
      <body className={`${tajawal.className} ${ibmPlex.variable} antialiased`}>
        <GlobalBackground />
        {children}
      </body>
    </html>
  )
}
