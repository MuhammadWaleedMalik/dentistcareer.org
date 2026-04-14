import mongoose from 'mongoose';

const EmployerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    website: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  },
  { timestamps: true }
);

export default mongoose.models.Employer || mongoose.model('Employer', EmployerSchema);
