import mongoose, { Schema } from 'mongoose';

const applicationSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  employerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jobseekerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  appliedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);
