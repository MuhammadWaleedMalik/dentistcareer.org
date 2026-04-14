'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function EmployerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({ title: '', description: '', city: '', state: '', tags: '', peopleNeeded: 1 });
  const [applications, setApplications] = useState<any[]>([]);
  const [employerJobs, setEmployerJobs] = useState<any[]>([]);

  const fetchApplications = () => {
    if (!session) return;
    fetch(`/api/applications?employer=${(session.user as any).id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setApplications(data.applications);
      });
  };

  const fetchMyJobs = () => {
    if (!session) return;
    fetch(`/api/jobs?employerId=${(session.user as any).id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setEmployerJobs(data.jobs);
      });
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session && (session.user as any).role !== 'employer') {
      router.push(`/dashboard/${(session.user as any).role}`);
    } else if (session) {
      fetchApplications();
      fetchMyJobs();
    }
  }, [session, status, router]);

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagList = formData.tags.split(',').map(tag => tag.trim()).filter(t => t.length > 0);
    if (tagList.length < 3) {
      toast.error('You must actively stipulate at least 3 relevant tags.');
      return;
    }

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: { city: formData.city, state: formData.state },
          tags: tagList,
          peopleNeeded: formData.peopleNeeded,
          employerId: (session?.user as any)?.id,
          companyName: session?.user?.name,
          status: 'pending' // Admin needs to approve
        })
      });
      if (res.ok) {
        toast.success('Job architecture instantiated securely! Pending admin verification.');
        setFormData({ title: '', description: '', city: '', state: '', tags: '', peopleNeeded: 1 });
        fetchMyJobs(); // Optimistic data refetch to drop directly below zero-refresh
      } else {
        toast.error('Database connection fragmented.');
      }
    } catch {
      toast.error('Transmission error occurred.');
    }
  };

  const handleJobDelete = async (jobId: string) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      });
      if (res.ok) {
        toast.success('Job schema totally purged.');
        setEmployerJobs(prev => prev.filter(job => job._id !== jobId)); // Deep optimistic filter!
      }
    } catch {
      toast.error('Destructive attempt collapsed.');
    }
  };

  const handleApprove = async (id: string, cachedJobId: string) => {
    const res = await fetch('/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: id, status: 'approved' })
    });
    if (res.ok) {
      toast.success('Applicant Granted Clearance! Syncing arrays...');
      fetchApplications();
      fetchMyJobs(); // Enforce Quota checking display refreshes
    }
  };

  const handleReject = async (id: string) => {
    const res = await fetch('/api/applications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: id })
    });
    if (res.ok) {
      toast.success('Candidate data successfully obliterated.');
      fetchApplications(); // or setApplications optimistic
    }
  };

  if (status === 'loading') return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 to-white relative overflow-hidden flex flex-col">
      {/* Decorative corporate geometry */}
      <div className="absolute top-[-50px] right-[100px] w-[500px] h-[500px] bg-blue-100/50 blur-[100px] rounded-full pointer-events-none"></div>

      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 px-8 shadow-sm relative z-10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <a href="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500">ADA Master Employer</a>
          <a href="/" className="text-sm font-semibold text-gray-500 hover:text-black">Return Home</a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Employer Executive Dashboard</h1>
        <p className="text-gray-500 mb-10 font-medium text-lg">Your centralized command station for building careers and monitoring candidate trajectories.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/70 backdrop-blur-xl p-8 border border-white rounded-3xl shadow-2xl shadow-blue-900/5">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-[#339933] mb-6">Instantiate New Role</h2>
            <form onSubmit={handleJobSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Matrix Title</label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-white/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role Description Blueprint</label>
                <textarea required className="w-full bg-white/50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tags (Comma separated, exactly 3+ req)</label>
                <Input required placeholder="e.g. Endodontist, Local, Salary" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="bg-white/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Applicant Quota Limit</label>
                <Input required type="number" min="1" value={formData.peopleNeeded} onChange={e => setFormData({...formData, peopleNeeded: parseInt(e.target.value)})} className="bg-white/50 w-1/3" />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City Locality</label>
                  <Input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="bg-white/50" />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State Demark</label>
                  <Input required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="bg-white/50" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] shadow-lg transition-transform text-white font-bold h-12 rounded-xl">Execute Role Deployment</Button>
            </form>
          </div>

          <div className="bg-white/70 backdrop-blur-xl p-8 border border-white rounded-3xl shadow-2xl shadow-blue-900/5">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-[#339933] mb-2">Global Live Tracker</h2>
            <p className="text-gray-500 mb-6 text-sm">Visualize candidates dynamically injected directly under their schemas.</p>
            
            {employerJobs.length === 0 ? (
              <div className="p-8 text-center text-gray-400 italic font-semibold border-2 border-dashed border-gray-200 rounded-2xl">Awaiting job instantiation...</div>
            ) : (
              <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2">
                {employerJobs.map((job) => (
                  <div key={job._id} className="border border-blue-100 bg-white p-5 rounded-2xl shadow-sm relative group hover:border-blue-300 transition-colors">
                    <span className={`absolute top-4 right-4 px-3 py-1 uppercase text-[10px] font-black tracking-wider rounded-md ${job.status === 'closed' ? 'bg-red-100 text-red-700' : job.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-emerald-700'}`}>
                       {job.status}
                    </span>
                    <h3 className="font-extrabold text-slate-800 text-lg mb-1 pr-16">{job.title}</h3>
                    <div className="flex justify-between items-center pr-2 mb-4">
                       <p className="font-bold text-blue-600 text-sm bg-blue-50 px-2 py-0.5 rounded inline-block">Quota Fill: {job.acceptedCount || 0} / {job.peopleNeeded || 1}</p>
                       <button onClick={() => handleJobDelete(job._id)} className="text-xs font-bold text-red-400 hover:text-white hover:bg-red-500 px-3 py-1 rounded transition-colors">Perm-Delete Job</button>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-widest mb-3">Live Candidates</h4>
                      <div className="space-y-3">
                        {applications.filter(app => app.jobId === job._id).map((app) => (
                          <div key={app._id} className="border border-gray-100 p-3 rounded-xl bg-gray-50 relative shadow-inner">
                            {app.status === 'approved' && (
                              <div className="absolute top-2 right-2 flex items-center gap-1 text-green-600 text-xs font-bold bg-green-100 px-2 py-0.5 rounded shadow-sm">✓ SECURED</div>
                            )}
                            <h5 className="font-bold text-gray-800 text-sm">{app.name}</h5>
                            <p className="text-gray-500 font-mono text-[10px] mt-2 block">C: {app.phone} | <a href={`mailto:${app.email}`} className="text-blue-500 hover:underline">{app.email}</a></p>
                            
                            {app.status === 'pending' && job.status !== 'closed' && (
                              <div className="flex gap-2 mt-3">
                                <Button size="sm" className="bg-[#339933] text-white hover:bg-emerald-700 text-xs h-7 py-0" onClick={() => handleApprove(app._id, job._id)}>Accept</Button>
                                <Button size="sm" variant="outline" className="text-red-500 font-bold border-red-200 hover:bg-red-50 text-xs h-7 py-0" onClick={() => handleReject(app._id)}>Reject</Button>
                              </div>
                            )}
                            {app.status === 'pending' && job.status === 'closed' && (
                              <p className="text-[10px] font-bold text-red-500 italic mt-2 bg-red-50 inline-block px-1 rounded">Quota Fulfilled - Rejection Default</p>
                            )}
                          </div>
                        ))}
                        {applications.filter(app => app.jobId === job._id).length === 0 && (
                          <p className="text-xs text-slate-400 italic">No candidates detected upon current scan interval.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
