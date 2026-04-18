/**
 * Clear all users from database and reseed admin
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/omio_studio';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  phone: { type: String, default: '' },
  company: { type: String, default: '' },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
}, { timestamps: true });

async function clearAndSeed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    const User = mongoose.model('User', UserSchema);

    // Clear all users
    await User.deleteMany({});
    console.log('🗑️  All users cleared from database');

    // Create admin user
    const adminHash = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Om (Admin)',
      email: 'admin@omio.studio',
      password: adminHash,
      role: 'admin',
      company: 'Omio Studio'
    });
    console.log('✅ Admin user recreated: admin@omio.studio / admin123');

    await mongoose.connection.close();
    console.log('✅ Done! Database cleared and admin reseeded.');
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

clearAndSeed();
