import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import User from '../lib/models/User';
import Job from '../lib/models/Job';
import Employer from '../lib/models/Employer';
import Article from '../lib/models/Article';

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    console.error('MONGO URI not found!');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  // Clear existing data
  await User.deleteMany({});
  await Job.deleteMany({});
  await Employer.deleteMany({});
  await Article.deleteMany({});
  
  const adminPasswordHash = await bcrypt.hash('@Abc123', 10);
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Users (Admin, Employer, Jobseeker)
  const adminUser = await User.create({
    name: 'Main Admin',
    email: 'admin@center.com',
    password: adminPasswordHash,
    role: 'admin',
  });

  const employerUser1 = await User.create({
    name: 'John Clinic Owner',
    email: 'john@dentalclinic.com',
    password: passwordHash,
    role: 'employer',
  });

  const employerUser2 = await User.create({
    name: 'Sarah Hospital HR',
    email: 'sarah@smilecare.com',
    password: passwordHash,
    role: 'employer',
  });

  const jobseekerUser = await User.create({
    name: 'Jane Dentist',
    email: 'jane@jobseeker.com',
    password: passwordHash,
    role: 'jobseeker',
  });

  // 2. Create Employers Profiles
  const employer1 = await Employer.create({
    name: 'Bright Direction Dental LLC',
    description: 'A thriving dental practice in Toledo offering compassionate care.',
    website: 'https://brightdirectiondental.com',
    userId: employerUser1._id,
  });

  const employer2 = await Employer.create({
    name: 'Avanta Dental',
    description: 'Providing high-quality lifetime patient care in a fun, fast-paced environment.',
    website: 'https://avantadental.com',
    userId: employerUser2._id,
  });

  // 3. Create Jobs
  const job1 = await Job.create({
    title: 'Lead Dentist',
    description: 'Seeking an experienced, compassionate General Dentist to join our thriving team. Great benefits and sign-on bonus.',
    location: { city: 'Toledo', state: 'OH' },
    salary: '$150,000 - $200,000',
    type: 'Full-time',
    tags: ['General Dentist'],
    employerId: employer1._id,
    companyName: employer1.name,
    status: 'active',
  });

  const job2 = await Job.create({
    title: 'Associate Dentist',
    description: 'Looking for a self-motivated dentist to provide high-quality lifetime patient care in Yakima.',
    location: { city: 'Yakima', state: 'WA' },
    salary: '$350K+ average salary',
    type: 'Full-time',
    tags: ['Associate Dentist'],
    employerId: employer2._id,
    companyName: employer2.name,
    status: 'active',
  });

  const job3 = await Job.create({
    title: 'Dental Hygienist',
    description: 'Join our friendly team in New York. Part-time position available.',
    location: { city: 'New York', state: 'NY' },
    salary: '$40 - $55 / hour',
    type: 'Part-time',
    tags: ['Dental Hygienist'],
    employerId: employer1._id,
    companyName: employer1.name,
    status: 'active',
  });

  // Push job references to employers
  employer1.jobs.push(job1._id);
  employer1.jobs.push(job3._id);
  await employer1.save();
  employer2.jobs.push(job2._id);
  await employer2.save();

  // 4. Create Articles (Career Advice)
  await Article.create({
    title: 'Exit with Confidence: High-Impact Advertising for Your Practice Sale',
    excerpt: 'Selling your dental practice? Learn how to reach 150,000+ dentists.',
    content: 'Full content about selling practices...',
    authorId: adminUser._id,
  });

  await Article.create({
    title: 'The True Cost of an Empty Chair: Why Your Practice Needs an Employer Account',
    excerpt: 'Stop losing revenue to unfilled positions. Upgrade your account today.',
    content: 'Full content about upgrading employer accounts...',
    authorId: adminUser._id,
  });

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
