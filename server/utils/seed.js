import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: process.env.ADMIN_EMAIL || 'admin@blog.com',
    password: process.env.ADMIN_PASSWORD || 'Admin123!',
    role: 'admin',
    bio: 'Blog yöneticisi ve yazarı'
  },
  {
    name: 'Test User',
    email: 'user@blog.com',
    password: 'User123!',
    role: 'user',
    bio: 'Blog okuyucusu'
  }
];

const posts = [
  {
    title: 'İlk Gönderim',
    content: 'Bu benim ilk blog gönderim. Not defteri temalı yeni bloguma hoş geldiniz! Burada düşüncelerimi ve deneyimlerimi paylaşacağım. Teknoloji, tasarım ve yaşam hakkında yazılar yazıyor olacağım. Umarım keyif alırsınız!',
    category: 'Genel',
    tags: ['merhaba', 'ilk-yazı', 'blog'],
    isPublished: true,
    publishedAt: new Date('2025-09-20')
  },
  {
    title: 'Tasarım Hakkında',
    content: 'Bu blogun tasarımını gerçekten seviyorum. Gerçek bir not defterine yazıyormuşum gibi hissettiriyor. CSS harika bir araç! Modern web geliştirmede CSS\'in gücü inanılmaz. Flexbox, Grid, animasyonlar ve daha fazlası ile muhteşem kullanıcı deneyimleri yaratabiliriz.',
    category: 'Tasarım',
    tags: ['tasarım', 'css', 'ui-ux', 'web'],
    isPublished: true,
    publishedAt: new Date('2025-09-21')
  },
  {
    title: 'React ile Modern Web Geliştirme',
    content: 'React, modern web uygulamaları geliştirmek için harika bir kütüphane. Component-based mimari sayesinde kodlarımız daha modüler ve yeniden kullanılabilir oluyor. Hooks ile state management çok daha kolay hale geldi. Bu yazıda React\'in temellerinden ve best practice\'lerden bahsedeceğim.',
    category: 'Teknoloji',
    tags: ['react', 'javascript', 'web-development', 'frontend'],
    isPublished: true,
    publishedAt: new Date('2025-09-22')
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();
    console.log('🗑️  Data Cleared');

    // Create users
    const createdUsers = await User.create(users);
    console.log('👥 Users Created');

    const adminUser = createdUsers[0]._id;

    // Create posts with admin as author
    const postsWithAuthor = posts.map(post => ({
      ...post,
      author: adminUser
    }));

    const createdPosts = await Post.create(postsWithAuthor);
    console.log('📝 Posts Created');

    // Create sample comments
    const comments = [
      {
        content: 'Harika bir yazı! Teşekkürler.',
        author: createdUsers[1]._id,
        post: createdPosts[0]._id,
        isApproved: true
      },
      {
        content: 'Tasarım gerçekten çok güzel olmuş.',
        author: createdUsers[1]._id,
        post: createdPosts[1]._id,
        isApproved: true
      }
    ];

    await Comment.create(comments);
    console.log('💬 Comments Created');

    console.log('');
    console.log('✨ Data Import Successful!');
    console.log('');
    console.log('Admin credentials:');
    console.log(`Email: ${process.env.ADMIN_EMAIL || 'admin@blog.com'}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'Admin123!'}`);
    console.log('');

    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();

    console.log('🗑️  Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
