import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Employer from '@/lib/models/Employer';

export async function POST(req: Request) {
  try {
    const { name, email, password, role, employerName, profession } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userPayload: any = {
      name,
      email,
      password: hashedPassword,
      role: role === 'employer' ? 'employer' : 'jobseeker',
    };

    if (role === 'jobseeker' && profession) {
      userPayload.profession = profession;
    }

    const newUser = await User.create(userPayload);

    // If an employer, also create an Employer profile stub
    if (newUser.role === 'employer') {
      await Employer.create({
        name: employerName || name, // Provide employer company name
        userId: newUser._id,
      });
    }

    return NextResponse.json({ message: 'User registered successfully', user: { id: newUser._id, email, role: newUser.role } }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
