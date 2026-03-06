import mongoose from 'mongoose';
import { admissionSlug } from '../utils/slugify.js';

const admissionSchema = new mongoose.Schema(
  {
    program: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    institution: { type: String, required: true },
    department: { type: String },
    province: { type: String },
    session: { type: String },
    deadline: { type: Date },
    description: { type: String },
    eligibility: [{ type: String }],
    applicationInstructions: { type: String },
    link: { type: String },
    status: { type: String, enum: ['draft', 'active', 'closed'], default: 'active' },
    logoUrl: { type: String },
    views: { type: Number, default: 0 },
    source: { type: String, enum: ['manual', 'scraper'], default: 'manual' },
    scrapedAt: { type: Date },
    sourceUrl: { type: String },
  },
  { timestamps: true }
);

admissionSchema.index({ slug: 1 });
admissionSchema.index({ deadline: 1, status: 1 });
admissionSchema.index({ institution: 1, status: 1 });
admissionSchema.index({ program: 'text', institution: 'text', department: 'text' });

admissionSchema.pre('save', function (next) {
  if (!this.slug || this.isModified('program') || this.isModified('institution')) {
    this.slug = admissionSlug(this.program, this.institution);
  }
  next();
});

export const Admission = mongoose.model('Admission', admissionSchema);
