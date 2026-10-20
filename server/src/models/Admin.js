import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
)

adminSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash)
}

export const Admin = mongoose.model('Admin', adminSchema)
