'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function JobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Application Modal State
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '' });

  const fetchJobs = async (searchKeyword = '', searchArea = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?keyword=${encodeURIComponent(searchKeyword)}&area=${encodeURIComponent(searchArea)}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(keyword, area);
  };

  const openApplyModal = (job: any) => {
    if (!session) {
      toast.error('You must log in to apply for a job.');
      return;
    }
    if ((session.user as any).role !== 'jobseeker') {
      toast.error('Only jobseekers can apply for jobs.');
      return;
    }
    setSelectedJob(job);
    setApplyForm({ name: session.user?.name || '', email: session.user?.email || '', phone: '' });
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJob._id,
          employerId: selectedJob.employerId,
          jobseekerId: (session?.user as any).id,
          jobTitle: selectedJob.title,
          companyName: selectedJob.companyName || 'Unknown Company',
          name: applyForm.name,
          email: applyForm.email,
          phone: applyForm.phone
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Successfully applied for the job!');
        setSelectedJob(null);
      } else {
        toast.error(data.message || 'Failed to apply.');
      }
    } catch {
      toast.error('Application failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Basic header placeholder so it matches app layout mentally */}
      <header className="bg-white border-b py-4 px-8 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-[#339933]">ADA CareerCenter</a>
        <div className="flex gap-4">
          <a href="/jobs" className="text-gray-700 hover:text-[#339933]">Find a Job</a>
          <a href="/newalert" className="text-gray-700 hover:text-[#339933]">Job Alerts</a>
          <a href="/employers" className="text-gray-700 hover:text-[#339933]">Search Employers</a>
          <a href="/careers" className="text-gray-700 hover:text-[#339933]">Career Advice</a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-1/4">
          <div className="bg-white p-6 border rounded shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Filter jobs</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Keywords</label>
                <Input
                  placeholder="e.g. Dental Hygienist"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Area / Location</label>
                <Input
                  placeholder="e.g. New York or NY"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-[#339933] text-white">
                Search
              </Button>
            </form>
          </div>
        </aside>

        {/* Job Results */}
        <section className="w-3/4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Found {jobs.length} jobs</h1>
          {loading ? (
            <p>Loading jobs...</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="bg-white p-6 border border-[#339933] border-l-4 rounded shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-blue-600 hover:underline cursor-pointer">{job.title}</h3>
                      <ul className="text-sm text-gray-600 mt-2 space-y-1">
                        <li>• {job.location.city}, {job.location.state} (US)</li>
                        {job.salary && <li>• {job.salary}</li>}
                        <li>• {job.companyName}</li>
                        {job.tags && job.tags.length > 0 && (
                          <li className="mt-2 text-xs font-semibold text-gray-500">
                            Tags: {job.tags.join(', ')}
                          </li>
                        )}
                      </ul>
                      <p className="text-sm text-gray-500 mt-4 line-clamp-2">{job.description}</p>
                    </div>
                    <Button onClick={() => openApplyModal(job)} className="bg-blue-600 text-white hover:bg-blue-700">Apply Now</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Quick Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Apply for {selectedJob.title}</h2>
            <p className="text-gray-600 mb-6 text-sm italic">You are applying as {session?.user?.name}. Please confirm your contact details down below. Attachments like resumes/PDFs are not accepted for this role.</p>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <Input required value={applyForm.name} onChange={(e) => setApplyForm({...applyForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <Input type="email" required value={applyForm.email} onChange={(e) => setApplyForm({...applyForm, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                <Input required value={applyForm.phone} onChange={(e) => setApplyForm({...applyForm, phone: e.target.value})} placeholder="e.g. 555-123-4567" />
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 bg-[#339933] text-white hover:bg-green-700">Confirm Application</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setSelectedJob(null)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
