import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ar-MA', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const array = new Uint8Array(48)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array)
    for (const byte of array) result += chars[byte % chars.length]
  } else {
    for (let i = 0; i < 48; i++) result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export function maskIP(ip: string): string {
  if (ip.includes('.')) {
    const parts = ip.split('.')
    return `${parts[0]}.${parts[1]}.*.*`
  }
  if (ip.includes(':')) {
    const parts = ip.split(':')
    return `${parts.slice(0, 3).join(':')}:****`
  }
  return ip
}
