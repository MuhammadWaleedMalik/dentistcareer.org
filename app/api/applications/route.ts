import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/lib/models/Application';
import Job from '@/lib/models/Job';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const employerId = searchParams.get('employer');
    const jobseekerId = searchParams.get('jobseeker');
    
    let query: any = {};
    if (employerId) query.employerId = employerId;
    if (jobseekerId) query.jobseekerId = jobseekerId;

    const apps = await Application.find(query).sort({ appliedAt: -1 });
    return NextResponse.json({ success: true, count: apps.length, applications: apps }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await dbConnect();
    
    // Check if duplicate application
    const existing = await Application.findOne({ jobId: data.jobId, jobseekerId: data.jobseekerId });
    if (existing) {
      return NextResponse.json({ success: false, message: 'You have already applied for this job.' }, { status: 400 });
    }

    const app = await Application.create(data);
    return NextResponse.json({ success: true, application: app }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { applicationId, status } = data;
    await dbConnect();
    const updated = await Application.findByIdAndUpdate(applicationId, { status }, { new: true });
    
    if (status === 'approved' && updated) {
      const job = await Job.findById(updated.jobId);
      if (job) {
         job.acceptedCount = (job.acceptedCount || 0) + 1;
         if (job.acceptedCount >= (job.peopleNeeded || 1)) {
           await Job.findByIdAndDelete(job._id);
         } else {
           await job.save();
         }
      }
    }
    
    return NextResponse.json({ success: true, application: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const data = await req.json();
    const { applicationId } = data;
    await dbConnect();
    await Application.findByIdAndDelete(applicationId);
    return NextResponse.json({ success: true, message: 'Application rejected completely' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
