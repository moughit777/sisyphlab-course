import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'مونتاج برو — الكورس',
  robots: { index: false, follow: false },
}

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return children
}
