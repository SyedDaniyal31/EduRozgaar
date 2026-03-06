import mongoose from 'mongoose';
import { blogSlug } from '../utils/slugify.js';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    content: { type: String },
    tags: [{ type: String }],
    category: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    views: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: { type: Date },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ tags: 1, status: 1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

blogSchema.pre('save', function (next) {
  if (!this.slug || this.isModified('title')) {
    this.slug = blogSlug(this.title);
  }
  next();
});

export const Blog = mongoose.model('Blog', blogSchema);
