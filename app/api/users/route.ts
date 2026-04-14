import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const users = await User.find({}).select('-password').sort({ role: 1 });
    return NextResponse.json({ success: true, count: users.length, users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const data = await req.json();
    const { userId } = data;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID required' }, { status: 400 });
    }

    await dbConnect();
    await User.findByIdAndDelete(userId);
    
    return NextResponse.json({ success: true, message: 'User irrevocably deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { userId, name, profession } = data;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID required' }, { status: 400 });
    }

    await dbConnect();
    const updatePayload: any = {};
    if (name) updatePayload.name = name;
    if (profession !== undefined) updatePayload.profession = profession;

    const updatedUser = await User.findByIdAndUpdate(userId, updatePayload, { new: true });
    
    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
