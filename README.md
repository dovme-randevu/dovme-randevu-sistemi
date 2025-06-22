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

## 🚀 Teknolojiler

### Frontend (Müşteri Sitesi)
- **React** - Modern UI framework
- **React Router** - Sayfa yönlendirme
- **CSS Modules** - Stil yönetimi
- **Webpack** - Build sistemi

### Admin Panel
- **React 19** - En güncel React versiyonu
- **Material-UI** - Modern UI bileşenleri
- **Axios** - HTTP client
- **JWT** - Kimlik doğrulama

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Veritabanı
- **Mongoose** - ODM
- **JWT** - Token tabanlı kimlik doğrulama
- **Multer** - Dosya yükleme
- **Sharp** - Resim işleme
- **Nodemailer** - Email gönderimi
- **Winston** - Loglama

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
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend (Müşteri Sitesi)
```bash
cd dovme-randevu-sistemi/frontend
npm install
npm start
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

## 🤝 Katkıda Bulunanlar

- @aydindogan23 (AYDIN DOĞAN)
- @L3x4-4 (Furkan Tarhan)
- @aydindogan24

## 📄 Lisans

MIT

## 📞 İletişim

Proje hakkında sorularınız için GitHub Issues kullanabilirsiniz. 