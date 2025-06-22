# Dövme Randevu Sistemi

Modern bir dövme stüdyosu için kapsamlı randevu ve yönetim sistemi.

## 🏗️ Proje Yapısı

```
dovme-randevu-sistemi/
├── frontend/          # React müşteri sitesi
├── admin-panel/       # React admin yönetim paneli
├── backend/           # Node.js API
├── archive/           # Eski HTML versiyonu (referans)
└── README.md
```

### Branch'ler

* `main`: Ana branch
* `backend`: Backend geliştirmeleri
* `frontend`: Frontend geliştirmeleri
* `develop`: Geliştirme branch'i

## 🚀 Teknolojiler

### Backend
* **Node.js** - Server runtime
* **Express.js** - Web framework
* **MongoDB** - Veritabanı
* **JWT Authentication** - Kimlik doğrulama
* **Multer** - Dosya yükleme
* **Sharp** - Resim işleme
* **Nodemailer** - Email gönderimi
* **Winston** - Loglama

### Frontend (Müşteri Sitesi)
* **React** - Modern UI framework
* **React Router** - Sayfa yönlendirme
* **CSS Modules** - Stil yönetimi
* **Webpack** - Build sistemi

### Admin Panel
* **React 19** - En güncel React versiyonu
* **Material-UI** - Modern UI bileşenleri
* **Axios** - HTTP client
* **JWT** - Kimlik doğrulama

### Gelecek Teknolojiler (Planlanan)
* **Next.js** - React framework
* **TypeScript** - Tip güvenliği
* **Tailwind CSS** - CSS framework
* **React Hook Form** - Form yönetimi
* **Zod** - Form validasyonu

## 📋 Özellikler

### Müşteri Özellikleri
- ✅ Randevu alma formu
- ✅ Galeri görüntüleme
- ✅ İletişim sayfası
- ✅ Responsive tasarım

### Admin Özellikleri
- ✅ Dashboard istatistikleri
- ✅ Randevu yönetimi
- ✅ Kullanıcı yönetimi
- ✅ Güvenli giriş sistemi

### API Özellikleri
- ✅ RESTful API
- ✅ JWT authentication
- ✅ File upload
- ✅ Email notifications
- ✅ Error handling
- ✅ Security middleware

## 🛠️ Kurulum

### Backend
```bash
# Backend branch'ine geç
git checkout backend

# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env

# Uygulamayı başlat
npm run dev
```

### Frontend (Müşteri Sitesi)
```bash
# Frontend branch'ine geç
git checkout frontend

# Bağımlılıkları yükle
npm install

# Uygulamayı başlat
npm run dev
```

### Admin Panel
```bash
cd admin-panel
npm install
npm start
```

## 🔐 Environment Variables

Backend için `.env` dosyası oluşturun:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dovme-randevu
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

## 📱 Kullanım

1. **Müşteri Sitesi**: `http://localhost:3000`
2. **Admin Panel**: `http://localhost:3001`
3. **API**: `http://localhost:5000/api`

## 👥 Ekip Çalışma Kuralları

1. Her geliştirici kendi branch'inde çalışır
2. Değişiklikler bitince PR açılır
3. Code review yapılır
4. Onaylanınca main branch'ine merge edilir

## 🤝 Katkıda Bulunanlar

* @aydindogan23 (AYDIN DOĞAN)
* @L3x4-4 (Furkan Tarhan)
* @aydindogan24

## 📄 Lisans

MIT

## 📞 İletişim

Proje hakkında sorularınız için GitHub Issues kullanabilirsiniz.
