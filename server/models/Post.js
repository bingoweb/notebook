import mongoose from 'mongoose';
import slugify from 'slugify';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Başlık gereklidir'],
    trim: true,
    maxlength: [200, 'Başlık 200 karakterden uzun olamaz']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'İçerik gereklidir']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Özet 500 karakterden uzun olamaz']
  },
  category: {
    type: String,
    required: [true, 'Kategori gereklidir'],
    enum: ['Genel', 'Tasarım', 'Teknoloji', 'Yaşam', 'Diğer'],
    default: 'Genel'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  readingTime: {
    type: Number,
    default: 1
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title
postSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }

  // Turkish character mapping for slug
  const turkishMap = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };

  let title = this.title;
  Object.keys(turkishMap).forEach(key => {
    title = title.replace(new RegExp(key, 'g'), turkishMap[key]);
  });

  this.slug = slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });

  next();
});

// Calculate reading time based on content (assuming 200 words per minute)
postSchema.pre('save', function(next) {
  if (!this.isModified('content')) {
    return next();
  }

  const wordsPerMinute = 200;
  const wordCount = this.content.trim().split(/\s+/).length;
  this.readingTime = Math.ceil(wordCount / wordsPerMinute) || 1;

  next();
});

// Auto-generate excerpt from content if not provided
postSchema.pre('save', function(next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 200).trim() + '...';
  }
  next();
});

// Update likes count
postSchema.pre('save', function(next) {
  this.likesCount = this.likes.length;
  next();
});

// Virtual for comments
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
});

// Indexes for better query performance
postSchema.index({ slug: 1 });
postSchema.index({ author: 1 });
postSchema.index({ category: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ isPublished: 1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
