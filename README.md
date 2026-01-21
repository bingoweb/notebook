# 📓 Kişisel Blog - Not Defteri Temalı Full-Stack Uygulama

Modern, responsive ve kullanıcı dostu bir blog platformu. MERN Stack (MongoDB, Express, React, Node.js) ile geliştirilmiştir.

[![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb)](https://www.mongodb.com/)

---

## 🆕 Son Güncellemeler (v2.1.0)

### ✨ Gerçekçi Not Defteri Efektleri
- 📄 Kağıt dokusu ve gerçekçi sayfa efektleri
- 🔢 Otomatik sayfa numaralandırma
- ⭐ Yer imi göstergeleri (featured posts)
- 🌀 Spiral delik efektleri
- 🖊️ Karalama ve mürekkep lekeleri
- 📑 Sayfa ayraçları

### 🛡️ Gelişmiş Hata Yönetimi
- ErrorBoundary ile React hata yakalama
- Loading spinner component
- PropTypes validation
- Improved error messages

### 🔧 Kod Kalitesi
- ESLint configuration
- Backend/Frontend API consistency
- Enhanced PostCard component

**Detaylı değişiklikler için:** [CHANGELOG.md](CHANGELOG.md)

---

## ✨ Özellikler

### 🎨 Frontend
- ✅ **React 18** - Modern hooks ve concurrent rendering
- ✅ **Vite** - Ultra-hızlı build ve HMR
- ✅ **React Router v6** - Declarative routing
- ✅ **Context API** - Auth & Theme state management
- ✅ **Responsive Design** - Mobil-first approach
- ✅ **Dark Mode** - Göz dostu karanlık tema
- ✅ **Gerçekçi Not Defteri Teması** 🆕 - Kağıt dokusu, sayfa numaraları
- ✅ **Smooth Animations** - CSS transitions ve keyframes
- ✅ **Error Boundaries** 🆕 - Graceful error handling
- ✅ **PropTypes** 🆕 - Runtime type validation
- ✅ **Accessibility** - WCAG 2.1 AA uyumlu
- ✅ **SEO Optimize** - Meta tags ve schema markup

### 🔧 Backend
- ✅ **Node.js & Express** - RESTful API architecture
- ✅ **MongoDB & Mongoose** - NoSQL database, schema validation
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-Based Access Control** - Admin ve user rolleri
- ✅ **Security** - Helmet, CORS, Rate Limiting
- ✅ **Password Hashing** - Bcrypt ile güvenli şifre

### 📝 Blog Özellikleri
- ✅ Blog yazıları CRUD (Create, Read, Update, Delete)
- ✅ Markdown desteği
- ✅ Kategori ve etiket sistemi
- ✅ Beğeni sistemi (authenticated users)
- ✅ Arama ve filtreleme (başlık, kategori, etiket)
- ✅ Admin panel (CMS)
- ✅ Slug generation (Turkish character support)
- ✅ Reading time calculation
- ✅ Auto excerpt generation

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js (v18+)
- MongoDB (local veya Atlas)
- npm

### Backend Kurulumu

```bash
# Server dizinine git
cd server

# Dependencies yükle
npm install

# Environment variables
cp .env.example .env

# .env dosyasını düzenle:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/notebook-blog
# JWT_SECRET=your_secret_key

# Database seed (örnek data)
npm run seed

# Development server
npm run dev

# Server: http://localhost:5000
```

### Frontend Kurulumu

```bash
# Client dizinine git
cd client

# Dependencies yükle
npm install

# Environment variables (opsiyonel)
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api

# Development server
npm run dev

# Uygulama: http://localhost:5173
```

---

## 🔐 Varsayılan Admin Hesabı

```
Email: admin@blog.com
Şifre: Admin123!
```

⚠️ **Production'da mutlaka bu bilgileri değiştirin!**

---

## 📁 Proje Yapısı

```
notebook/
│
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx    # 🆕 Error boundary
│   │   │   ├── Loading.jsx          # 🆕 Loading component
│   │   │   ├── PostCard.jsx         # 🆕 Enhanced with PropTypes
│   │   │   ├── Navigation.jsx       # Header navigation
│   │   │   └── Footer.jsx           # Footer
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   └── ThemeContext.jsx     # Theme state
│   │   ├── pages/
│   │   │   ├── Home.jsx             # 🆕 With Loading component
│   │   │   ├── Admin.jsx            # Admin dashboard
│   │   │   └── Login.jsx            # Login/Register
│   │   ├── services/
│   │   │   └── api.js               # Axios configuration
│   │   ├── App.css                  # Main CSS
│   │   ├── NotebookEnhancements.css # 🆕 Realistic effects
│   │   ├── App.jsx                  # 🆕 With ErrorBoundary
│   │   └── main.jsx                 # 🆕 CSS imports
│   ├── eslint.config.js             # 🆕 ESLint config
│   └── package.json                 # 🆕 Updated dependencies
│
├── server/                          # Node.js Backend
│   ├── controllers/                 # Request handlers
│   ├── middleware/                  # Express middleware
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # Express routes
│   ├── utils/                       # Utilities
│   └── server.js                    # Express app
│
├── CHANGELOG.md                     # 🆕 Detailed changelog
├── README.md                        # 🆕 This file (updated)
├── index.html                       # Legacy (reference)
├── style.css                        # Legacy (reference)
└── script.js                        # Legacy (reference)
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı (auth required)
- `PUT /api/auth/profile` - Profil güncelleme (auth required)

### Posts
- `GET /api/posts` - Tüm yazılar (query: search, category, tag)
- `GET /api/posts/:slug` - Slug ile yazı getir
- `POST /api/posts` - Yeni yazı (admin only)
- `PUT /api/posts/id/:id` - Yazı güncelle (admin only)
- `DELETE /api/posts/id/:id` - Yazı sil (admin only)
- `PUT /api/posts/id/:id/like` - Beğen/beğeniyi kaldır (auth required)

### Comments
- `GET /api/comments/:postId` - Post yorumları
- `POST /api/comments` - Yorum ekle (auth required)
- `PUT /api/comments/comment/:id` - Yorum güncelle (auth required)
- `DELETE /api/comments/comment/:id` - Yorum sil (auth required)
- `PUT /api/comments/comment/:id/approve` - Yorumu onayla (admin only)

---

## 🛠 Teknoloji Stack

### Frontend
- React 18.2.0
- React Router DOM 6.21.1
- Vite 5.0.11
- Axios 1.6.5
- React Markdown 9.0.1
- React Hot Toast 2.4.1
- prop-types 15.8.1 🆕

### Backend
- Node.js 18+
- Express 4.18.2
- MongoDB (Latest)
- Mongoose 8.1.0
- JWT 9.0.2
- Bcrypt 2.4.3
- Helmet 7.1.0
- CORS 2.8.5

---

## 🎨 Yeni Not Defteri Efektleri

### NotebookEnhancements.css Özellikleri

**Kağıt Efektleri:**
- Gerçekçi kağıt dokusu (subtle grid)
- Sayfa köşe kıvrımı (hover)
- Gölge ve derinlik efektleri
- Renk tonu varyasyonları

**Sayfa Özellikleri:**
- 🔢 CSS counters ile sayfa numaraları
- 📑 Dekoratif sayfa ayraçları (• • •)
- 📏 Kenar boşluğu göstergesi
- 🌀 Geliştirilmiş spiral delikler

**İnteraktif:**
- ⭐ Featured yazılar için bookmark
- 🖊️ Karalama efektleri (hover)
- 💧 Mürekkep lekeleri
- ✏️ El yazısı çizgileri

---

## 🎯 Tasarım Prensibi

**Mevcut not defteri temalı tasarım tamamen korunmuştur.**

- ✅ Orijinal CSS korundu (`App.css`)
- ✅ Yeni özellikler ayrı dosyada (`NotebookEnhancements.css`)
- ✅ Renk şeması değişmedi
- ✅ Dark mode desteği devam ediyor
- ✅ Responsive özellikler korundu
- ✅ Accessibility standartları korundu

---

## 🧪 Kod Kalitesi

```bash
# ESLint kontrolü
cd client
npm run lint

# Backend lint (opsiyonel)
cd server
npm run lint
```

**Lint Sonuçları:**
- ✅ 0 error
- ⚠️ 29 warnings (non-critical)

---

## 📦 Production Build

```bash
# Frontend build
cd client
npm run build
# Dosyalar: client/dist/

# Backend production
cd server
npm start
```

---

## 📋 Changelog

Detaylı değişiklikler için [CHANGELOG.md](CHANGELOG.md) dosyasına bakın.

**Son Güncelleme (v2.1.0):**
- ✨ Gerçekçi not defteri efektleri (367 satır CSS)
- 🛡️ ErrorBoundary ve Loading components
- 📦 PropTypes validation
- 🔧 ESLint configuration
- 🔍 API consistency check
- 📊 9 dosya değişti, +550 satır

---

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

MIT Lisansı - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👤 Yazar

**Not Defteri Blog**
- GitHub: [@bingoweb](https://github.com/bingoweb)

---

⭐ **Projeyi beğendiyseniz yıldız vermeyi unutmayın!**

**Made with ❤️ and ☕**