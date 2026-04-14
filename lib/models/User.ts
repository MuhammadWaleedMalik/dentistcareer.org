import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['jobseeker', 'employer', 'admin'], required: true },
  profession: { type: String },
  profileRef: { type: Schema.Types.ObjectId, ref: 'Employer' }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
