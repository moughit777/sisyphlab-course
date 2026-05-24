# مونتاج برو — منصة كورسات احترافية

منصة كورسات عربية احترافية مع نظام حماية متقدم للفيديوهات.

## إعداد المشروع

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. إعداد Supabase
- أنشئ مشروعاً جديداً على [supabase.com](https://supabase.com)
- في SQL Editor، شغّل ملف `supabase/schema.sql`

### 3. متغيرات البيئة
انسخ `.env.local.example` إلى `.env.local` واملأ البيانات:
```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_PASSWORD=كلمة_مرور_قوية_جداً
ADMIN_JWT_SECRET=سر_طويل_جداً_32_حرفاً_على_الأقل
NEXT_PUBLIC_APP_URL=https://موقعك.com
NEXT_PUBLIC_WHATSAPP_NUMBER=212624821600
```

### 4. تشغيل المشروع
```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

---

## الصفحات

| الصفحة | الرابط | الوصف |
|--------|--------|-------|
| الرئيسية | `/` | صفحة المبيعات |
| الكورس | `/course/[TOKEN]` | صفحة الكورس المحمية |
| لوحة التحكم | `/admin` | إدارة الروابط |
| تسجيل الدخول | `/admin/login` | دخول المسؤول |

---

## إضافة فيديوهات الكورس

في ملف `src/lib/courseData.ts`، استبدل `YOUR_VIDEO_URL_X` بروابط الفيديوهات:
- يفضل رفع الفيديوهات على Cloudflare R2 أو Bunny CDN
- يجب أن تكون روابط MP4/WebM مباشرة

## إضافة الفيديو التعريفي

في `src/components/home/PromoVideoSection.tsx`:
- غيّر `PROMO_VIDEO_URL` برابط الفيديو المباشر، أو
- فعّل `USE_YOUTUBE = true` واستخدم YouTube ID

---

## ميزات الحماية

- ✅ رابط فريد لكل طالب (Token URL)
- ✅ منع Right-Click
- ✅ منع تحميل الفيديو
- ✅ Watermark ديناميكي (اسم الطالب + الوقت + IP)
- ✅ كشف Developer Tools وإيقاف الفيديو
- ✅ إخفاء الفيديو عند تغيير التبويب
- ✅ منع Drag للفيديو
- ✅ تنبيه عند محاولة PrintScreen
- ✅ إدارة الجلسات (حد أقصى للجلسات المتزامنة)
- ✅ سجل الأحداث المشبوهة
- ✅ منع PiP (Picture in Picture)

---

## لوحة التحكم

ادخل `/admin/login` وأدخل كلمة المرور من `.env.local`

### إنشاء رابط للطالب
1. اضغط "رابط جديد"
2. أدخل اسم الطالب
3. انسخ الرابط وأرسله له عبر واتساب
