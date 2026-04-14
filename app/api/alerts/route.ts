import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import JobAlert from '@/lib/models/JobAlert';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await dbConnect();
    
    // validate simple
    if (!data.email || !data.frequency) {
        return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const alert = await JobAlert.create(data);
    return NextResponse.json({ success: true, alert }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
