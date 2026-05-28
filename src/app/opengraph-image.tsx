import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'مونتاج برو - كورس المونتاج الاحترافي'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #080a08 0%, #0f1a0f 50%, #080a08 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          direction: 'rtl',
          position: 'relative',
        }}
      >
        {/* Green glow */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Badge */}
        <div
          style={{
            background: 'rgba(34,197,94,0.15)',
            border: '1px solid rgba(34,197,94,0.4)',
            color: '#4ade80',
            padding: '8px 24px',
            borderRadius: '999px',
            fontSize: '18px',
            marginBottom: '24px',
            letterSpacing: '1px',
          }}
        >
          SISYPH LAB
        </div>

        {/* Title */}
        <div
          style={{
            color: '#ffffff',
            fontSize: '72px',
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}
        >
          مونتاج برو
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: '#9ca3af',
            fontSize: '28px',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          كورس المونتاج الاحترافي
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '40px' }}>
          {[
            { value: '+400', label: 'طالب' },
            { value: '+40', label: 'ساعة' },
            { value: '4.9', label: 'تقييم' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '16px 32px',
              }}
            >
              <span style={{ color: '#4ade80', fontSize: '32px', fontWeight: 'bold' }}>
                {stat.value}
              </span>
              <span style={{ color: '#9ca3af', fontSize: '18px' }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            color: '#6b7280',
            fontSize: '20px',
          }}
        >
          sisyphlab.com
        </div>
      </div>
    ),
    { ...size }
  )
}
