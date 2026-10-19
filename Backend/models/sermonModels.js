import mongoose from "mongoose";

const sermonSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Enter a sermon title."], trim: true, maxlength: 150 },
    speaker: { type: String, trim: true, default: "Apostle Light Iwuh", maxlength: 100 },
    series: { type: String, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 2000 },
    date: { type: Date, required: [true, "Enter the date the sermon was preached."] },
    published: { type: Boolean, default: true },

    // The audio file. Members only get a short-lived link, never this data.
    audio: {
      provider: { type: String, enum: ["cloudinary", "local"] },
      publicId: String, // Cloudinary id
      format: String, // mp3, m4a ...
      localPath: String, // file name inside uploads/audio when stored locally
      bytes: Number,
      durationSec: Number,
      originalName: String,
    },

    // Cover photo (public)
    image: {
      provider: { type: String, enum: ["cloudinary", "local"] },
      url: String,
      publicId: String,
      localPath: String,
    },

    downloads: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

sermonSchema.index({ date: -1 });

// Safe public view
sermonSchema.methods.toPublic = function ({ admin = false } = {}) {
  const out = {
    id: this._id.toString(),
    title: this.title,
    speaker: this.speaker,
    series: this.series || "",
    description: this.description || "",
    date: this.date.toISOString().slice(0, 10),
    imageUrl: this.image?.url || "",
    hasAudio: Boolean(this.audio?.provider),
    audioFormat: this.audio?.format || "",
    audioBytes: this.audio?.bytes || 0,
    durationSec: this.audio?.durationSec || 0,
  };
  if (admin) {
    out.published = this.published;
    out.downloads = this.downloads;
    out.createdAt = this.createdAt;
  }
  return out;
};

export const Sermon = mongoose.model("Sermon", sermonSchema);
