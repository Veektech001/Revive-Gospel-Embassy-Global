import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."],
    },
    phone: { type: String, trim: true, maxlength: 30 },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["member", "admin"], default: "member" },
    resetTokenHash: { type: String, select: false },
    resetTokenExpires: { type: Date, select: false },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function (password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

// What the API sends back about a user (never the password hash)
userSchema.methods.toPublic = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    phone: this.phone || "",
    role: this.role,
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model("User", userSchema);
