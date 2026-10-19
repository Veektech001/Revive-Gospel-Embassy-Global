import mongoose from "mongoose";

// First-time visitor form
const visitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, trim: true, maxlength: 30 },
    email: { type: String, trim: true, lowercase: true, maxlength: 120 },
    address: { type: String, trim: true, maxlength: 200 },
    visitDate: { type: String, trim: true, maxlength: 20 },
    service: { type: String, enum: ["Sunday", "Friday"], default: "Sunday" },
    question: { type: String, trim: true, maxlength: 2000 },
    followedUp: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Newsletter subscribers
const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 120 },
  },
  { timestamps: true }
);

export const Visitor = mongoose.model("Visitor", visitorSchema);
export const Subscriber = mongoose.model("Subscriber", subscriberSchema);
