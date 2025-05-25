# Dövme Randevu Sistemi

Modern bir dövme stüdyosu için randevu ve bilgi sistemi.

## Proje Yapısı

### Branch'ler
- `main`: Ana branch
- `backend`: Backend geliştirmeleri
- `frontend`: Frontend geliştirmeleri
- `develop`: Geliştirme branch'i

### Teknolojiler

#### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (Dosya yükleme)
- Sharp (Resim işleme)
- Nodemailer (Email gönderimi)
- Winston (Loglama)

#### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod (Form validasyonu)

## Kurulum

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

### Frontend
```bash
# Frontend branch'ine geç
git checkout frontend

# Bağımlılıkları yükle
npm install

# Uygulamayı başlat
npm run dev
```

## Ekip Çalışma Kuralları

1. Her geliştirici kendi branch'inde çalışır
2. Değişiklikler bitince PR açılır
3. Code review yapılır
4. Onaylanınca main branch'ine merge edilir

## Katkıda Bulunanlar

- @aydindogan23 (AYDIN DOĞAN)
- @L3x4-4 (Furkan Tarhan)
- @aydindogan24

## Lisans

MIT
