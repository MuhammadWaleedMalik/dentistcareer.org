import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/lib/models/Job';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('keyword') || '';
    const area = searchParams.get('area') || '';
    const fetchStatus = searchParams.get('status');
    const employerId = searchParams.get('employerId');
    const isAdmin = searchParams.get('admin');

    // Build the query
    const query: any = {};
    
    if (employerId) {
      query.employerId = employerId;
    }
    
    if (fetchStatus) {
      query.status = fetchStatus;
    } else if (!employerId && !isAdmin) {
      query.status = 'active';
    }

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (area) {
      query.$or = [
        ...(query.$or || []),
        { 'location.city': { $regex: area, $options: 'i' } },
        { 'location.state': { $regex: area, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    console.error('Job fetching error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    if (!data.tags || !Array.isArray(data.tags) || data.tags.length < 3) {
      return NextResponse.json({ success: false, message: 'Please provide at least three tags.' }, { status: 400 });
    }
    
    await dbConnect();
    const job = await Job.create(data);
    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { jobId, status } = data;
    
    if (!jobId || !status) {
      return NextResponse.json({ success: false, message: 'Job ID and Status required' }, { status: 400 });
    }

    await dbConnect();
    const updatedJob = await Job.findByIdAndUpdate(jobId, { status }, { new: true });
    
    return NextResponse.json({ success: true, job: updatedJob }, { status: 200 });
  } catch (error) {
    console.error('Job update error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const data = await req.json();
    const { jobId } = data;

    if (!jobId) {
      return NextResponse.json({ success: false, message: 'Job ID required' }, { status: 400 });
    }

    await dbConnect();
    await Job.findByIdAndDelete(jobId);
    
    return NextResponse.json({ success: true, message: 'Job deleted securely' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
