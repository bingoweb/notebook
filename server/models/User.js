import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'İsim gereklidir'],
    trim: true,
    maxlength: [50, 'İsim 50 karakterden uzun olamaz']
  },
  email: {
    type: String,
    required: [true, 'Email gereklidir'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Geçerli bir email adresi giriniz']
  },
  password: {
    type: String,
    required: [true, 'Şifre gereklidir'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User&background=007bff&color=fff'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio 500 karakterden uzun olamaz']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate avatar URL based on name
userSchema.pre('save', function(next) {
  if (!this.avatar || this.avatar.includes('ui-avatars.com')) {
    const name = encodeURIComponent(this.name);
    this.avatar = `https://ui-avatars.com/api/?name=${name}&background=007bff&color=fff&size=200`;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
