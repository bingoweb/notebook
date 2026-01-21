# 📓 Kişisel Blog - Not Defteri Temalı Full-Stack Uygulama

Modern, responsive ve kullanıcı dostu bir blog platformu. MERN Stack (MongoDB, Express, React, Node.js) ile geliştirilmiştir.

## ✨ Özellikler

### Frontend
- ✅ **React 18** - Modern komponent tabanlı mimari
- ✅ **Vite** - Hızlı build ve geliştirme deneyimi
- ✅ **React Router** - SPA navigation
- ✅ **Context API** - Global state management
- ✅ **Responsive Design** - Mobil, tablet ve desktop uyumlu
- ✅ **Dark Mode** - Karanlık/Aydınlık tema geçişi
- ✅ **Not Defteri Teması** - Özgün ve şık tasarım
- ✅ **Animasyonlar** - Smooth transitions
- ✅ **Accessibility** - WCAG 2.1 AA standartlarına uyumlu
- ✅ **SEO Optimize** - Meta tags ve schema markup

### Backend
- ✅ **Node.js & Express** - RESTful API
- ✅ **MongoDB** - NoSQL database
- ✅ **JWT Authentication** - Güvenli kullanıcı yönetimi
- ✅ **Role-Based Access** - Admin ve user rolleri
- ✅ **Mongoose ODM** - Schema validation
- ✅ **Security** - Helmet, CORS, Rate Limiting

### Blog Özellikleri
- ✅ Blog yazıları oluşturma, düzenleme, silme
- ✅ Kategori ve etiket sistemi
- ✅ Beğeni ve paylaşım
- ✅ Arama ve filtreleme
- ✅ Admin panel (CMS)

## 🚀 Hızlı Başlangıç

### Backend
```bash
cd server
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm run seed  # Örnek data
npm run dev   # http://localhost:5000
```

### Frontend
```bash
cd client
npm install
npm run dev   # http://localhost:5173
```

## 🔐 Default Admin
- Email: `admin@blog.com`
- Şifre: `Admin123!`

## 📁 Proje Yapısı
```
notebook/
├── server/          # Backend (Node.js + Express + MongoDB)
├── client/          # Frontend (React + Vite)
├── index.html       # Legacy (referans)
├── style.css        # Legacy (referans)
└── script.js        # Legacy (referans)
```

## 🎨 Tasarım
Mevcut not defteri temalı tasarım tamamen korunmuştur. Tüm CSS ve görsel öğeler aynı şekilde React'e taşınmıştır.

---
⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!