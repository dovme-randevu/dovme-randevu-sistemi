# Dövme Randevu Sistemi

Modern bir dövme stüdyosu için RESTful API.

## Özellikler

- Kullanıcı yönetimi (kayıt, giriş, profil)
- Dövme yönetimi (ekleme, düzenleme, silme)
- Randevu sistemi
- Email bildirimleri
- Dosya yükleme ve işleme
- Güvenlik önlemleri
- Loglama sistemi

## Teknolojiler

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (Dosya yükleme)
- Sharp (Resim işleme)
- Nodemailer (Email gönderimi)
- Winston (Loglama)

## Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/dovme-randevu/dovme-randevu-sistemi.git
cd dovme-randevu-sistemi
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını oluşturun:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tattoo-studio
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Email ayarları
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_NAME=Tattoo Studio
FROM_EMAIL=your_email@gmail.com
```

4. Uygulamayı başlatın:
```bash
# Geliştirme modu
npm run dev

# Prodüksiyon modu
npm start
```

## API Endpoint'leri

### Auth
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Kullanıcı bilgileri

### Tattoos
- `GET /api/tattoos` - Tüm dövmeler
- `GET /api/tattoos/:id` - Dövme detayı
- `POST /api/tattoos` - Yeni dövme
- `PUT /api/tattoos/:id` - Dövme güncelleme
- `DELETE /api/tattoos/:id` - Dövme silme

### Appointments
- `GET /api/appointments` - Tüm randevular
- `GET /api/appointments/:id` - Randevu detayı
- `POST /api/appointments` - Yeni randevu
- `PUT /api/appointments/:id` - Randevu güncelleme
- `DELETE /api/appointments/:id` - Randevu iptali

## Lisans

MIT
