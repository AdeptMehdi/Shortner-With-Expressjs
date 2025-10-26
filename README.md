# 🔗 Link Shortener API

## 📖 مقدمه

پروژه **Link Shortener API** یک سرویس کوتاه‌کننده لینک امن و مقیاس‌پذیر است که با استفاده از Express.js ساخته شده. این API قابلیت‌های پیشرفته‌ای مانند اعتبارسنجی URL، محدودیت نرخ درخواست، لاگ‌گیری جامع و معماری تمیز را ارائه می‌دهد.

### ✨ ویژگی‌های اصلی:
- ✅ **کوتاه کردن URL امن** - اعتبارسنجی و پاک‌سازی پیشرفته
- ✅ **محدودیت نرخ درخواست** - جلوگیری از سوءاستفاده
- ✅ **لاگ‌گیری جامع** - ردیابی دقیق درخواست‌ها و پاسخ‌ها
- ✅ **معماری تمیز** - جداسازی مناسب لایه‌ها
- ✅ **مدیریت خطا** - کلاس‌های خطای سفارشی
- ✅ **پیکربندی محیطی** - تنظیمات قابل تنظیم
- ✅ **اعتبارسنجی ورودی** - بررسی‌های امنیتی دقیق
- ✅ **تست کامل** - پوشش ۱۰۰٪ تست

## 🛠️ تکنولوژی‌ها

### Backend:
- **Node.js** - محیط اجرای جاوااسکریپت
- **Express.js** - فریم‌ورک وب
- **Body-parser** - تجزیه بدنه درخواست
- **Helmet** - تنظیمات امنیتی HTTP
- **CORS** - مدیریت cross-origin requests
- **Express-rate-limit** - محدودیت نرخ درخواست
- **Express-validator** - اعتبارسنجی ورودی

### Development & Testing:
- **Jest** - فریم‌ورک تست
- **Supertest** - تست API
- **Nodemon** - توسعه خودکار
- **Dotenv** - مدیریت متغیرهای محیطی

### Security & Quality:
- ✅ **تست کامل** - ۸ تست موفق
- ✅ **اعتبارسنجی امنیتی** - جلوگیری از URLهای مخرب
- ✅ **محدودیت نرخ** - جلوگیری از سوءاستفاده
- ✅ **لاگ‌گیری** - ردیابی کامل عملیات

## 📡 API Endpoints

### Health Check
```http
GET /health
```
**پاسخ:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-26T18:49:51.212Z"
}
```

### کوتاه کردن URL
```http
POST /shorten
POST /shortenUrl  # endpoint جایگزین
Content-Type: application/json

{
  "url": "https://example.com"
}
```
**پاسخ:**
```json
{
  "shortUrl": "http://localhost:4000/a1b2c3d4",
  "originalUrl": "https://example.com"
}
```

### تغییر مسیر به URL اصلی
```http
GET /:id
```
**پاسخ:** تغییر مسیر به URL اصلی

## 🧪 تست‌ها

پروژه شامل تست‌های جامعی است که تمام endpointها و قابلیت‌های امنیتی را پوشش می‌دهد:

### اجرای تست‌ها:
```bash
npm test
```

### پوشش تست:
- ✅ تست endpoint سلامت
- ✅ تست کوتاه کردن URL معتبر
- ✅ تست خطا برای URL خالی
- ✅ تست خطا برای URL نامعتبر
- ✅ تست تغییر مسیر
- ✅ تست ۴۰۴ برای ID نامعتبر
- ✅ تست endpoint جایگزین `/shortenUrl`
- ✅ تست اعتبارسنجی امنیتی برای URLهای مخرب

### نمونه خروجی تست:
```
PASS tests/server.test.js
Link Shortener API
  √ should return health status (42 ms)
  √ should shorten a valid URL (34 ms)
  √ should return 400 for missing URL (26 ms)
  √ should return 400 for invalid URL (32 ms)
  √ should redirect to original URL for valid short ID (31 ms)
  √ should return 404 for invalid short ID (16 ms)
  √ should work with /shortenUrl endpoint (18 ms)
  √ should return 400 for malicious URL (26 ms)

Test Suites: 1 passed, 1 total
Tests: 8 passed, 8 total
```

## 🚀 راه‌اندازی

### ۱. نصب وابستگی‌ها
```bash
npm install
```

### ۲. تنظیم متغیرهای محیطی
```bash
cp .env.example .env
# ویرایش .env با تنظیمات مورد نظر
```

### ۳. اجرای تست‌ها
```bash
npm test
```

### ۴. راه‌اندازی سرور
```bash
npm start
```

## 📁 ساختار پروژه

```
📁 ShortnerWithExpress/
├── 📄 server.js              # نقطه ورود اصلی
├── 📄 package.json           # وابستگی‌ها و اسکریپت‌ها
├── 📄 .env.example          # قالب متغیرهای محیطی
├── 📁 config/                # مدیریت پیکربندی
├── 📁 middleware/            # middlewareهای سفارشی
├── 📁 routes/                # تعریف روت‌ها
├── 📁 services/              # منطق کسب‌وکار
├── 📁 utils/                 # توابع کمکی
└── 📁 tests/                 # فایل‌های تست
```

## 🔒 ویژگی‌های امنیتی

- **اعتبارسنجی پیشرفته URL** - مسدود کردن پروتکل‌های مخرب
- **محدودیت نرخ درخواست** - ۱۰۰ درخواست در ۱۵ دقیقه
- **پاک‌سازی ورودی** - حذف کاراکترهای خطرناک
- **هدرهای امنیتی** - تنظیمات Helmet
- **مدیریت CORS** - سیاست‌های cross-origin
- **پاک‌سازی خطاها** - عدم نمایش اطلاعات حساس

## 📊 لاگ‌گیری

اپلیکیشن لاگ‌گیری جامعی برای دیباگ و نظارت ارائه می‌دهد:

- **لاگ درخواست‌ها** - تمام درخواست‌های ورودی با هدرها
- **لاگ تجزیه بدنه** - داده‌های خام و تجزیه‌شده
- **لاگ لایه سرویس** - عملیات اعتبارسنجی و ذخیره‌سازی
- **لاگ خطاها** - اطلاعات خطا با stack trace
- **لاگ امنیتی** - شکست‌های اعتبارسنجی و محدودیت نرخ

---

**ساخته شده با ❤️ با استفاده از Express.js، Node.js و بهترین شیوه‌های توسعه وب مدرن.**
