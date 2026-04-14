import mongoose, { Schema } from 'mongoose';

const jobSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    city: String,
    state: String,
  },
  salary: String,
  type: String,
  tags: [{ type: String }],
  employerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: String,
  status: { type: String, enum: ['pending', 'active', 'closed'], default: 'pending' },
  peopleNeeded: { type: Number, default: 1 },
  acceptedCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Job || mongoose.model('Job', jobSchema);
