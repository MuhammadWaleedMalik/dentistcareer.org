import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Employer from '@/lib/models/Employer';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('keyword') || '';

    const query: any = {};
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }

    const employers = await Employer.find(query)
      .populate('jobs')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: employers.length, employers });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
