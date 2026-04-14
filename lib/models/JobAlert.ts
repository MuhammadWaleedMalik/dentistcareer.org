import mongoose from 'mongoose';

const JobAlertSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    keyword: { type: String }, // Position or title
    location: { type: String },
    frequency: { type: String, enum: ['Daily', 'Weekly'], default: 'Daily' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.JobAlert || mongoose.model('JobAlert', JobAlertSchema);
