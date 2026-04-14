'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function JobseekerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [profileForm, setProfileForm] = useState({ name: '', profession: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session && (session.user as any).role !== 'jobseeker') {
      router.push(`/dashboard/${(session.user as any).role}`);
    } else if (session) {
      setProfileForm({ name: session.user.name || '', profession: '' }); // Pulling dynamic prof needs an expanded user fetch, assume blank on fresh load or cache hit
      
      // Fetch applications purely linked
      fetch(`/api/applications?jobseeker=${(session.user as any).id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setApplications(data.applications);
        });
      
      // Fetch open jobs!
      fetch(`/api/jobs`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setAvailableJobs(data.jobs.slice(0, 10)); // Display 10 max natively
        });
    }
  }, [session, status, router]);

  const handleWithdraw = async (appId: string) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId })
      });
      if (res.ok) {
        toast.success('Application successfully withdrawn');
        setApplications(applications.filter(app => app._id !== appId));
      }
    } catch {
      toast.error('Could not withdraw application');
    }
  };

  const handleProfilePatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: (session?.user as any).id, name: profileForm.name, profession: profileForm.profession })
      });
      if (res.ok) {
        toast.success('Your professional profile has been updated!');
      } else {
        toast.error('Unable to verify credential update.');
      }
    } catch {
      toast.error('System synchronization failed.');
    }
  };

  if (status === 'loading') return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 relative overflow-hidden flex flex-col">
      {/* Absolute Decorative Blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-200/50 blur-[100px] rounded-full mix-blend-multiply rounded-full animate-blob pointer-events-none"></div>
      <div className="absolute top-[20%] left-[-100px] w-[400px] h-[400px] bg-emerald-200/50 blur-[100px] rounded-full mix-blend-multiply rounded-full animate-blob pointer-events-none animation-delay-2000"></div>

      <header className="bg-white/60 backdrop-blur-xl border-b border-white/20 py-4 px-8 shadow-sm relative z-10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <a href="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#339933] to-blue-600">ADA CareerCenter</a>
          <a href="/" className="text-sm font-semibold text-gray-500 hover:text-black">Return Home</a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Jobseeker Terminal</h1>
        <p className="text-gray-600 mb-12 font-medium tracking-wide">Orchestrate your applications, profile configurations, and direct-job targeting below.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-8">
            <div className="p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-blue-900/5 border border-white/40">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">Profile Settings</h3>
              <form onSubmit={handleProfilePatch} className="space-y-4">
                 <div>
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Legal Name</label>
                   <Input required value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="bg-white/50 border-gray-100" />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Target Profession</label>
                   <Input required placeholder="Update your role" value={profileForm.profession} onChange={e => setProfileForm({...profileForm, profession: e.target.value})} className="bg-white/50 border-gray-100" />
                 </div>
                 <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md">Commit Profile Update</Button>
              </form>
            </div>

            <div className="p-8 bg-gradient-to-br from-[#339933] to-emerald-600 text-white rounded-2xl shadow-xl shadow-green-900/10 border border-green-500/20 text-center">
              <h3 className="text-5xl font-black mb-2">{applications.length}</h3>
              <p className="font-semibold text-green-100 uppercase tracking-widest text-sm">Applications Sent</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-blue-900/5 border border-white/40">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-blue-100 pb-4 mb-6">Your Application History</h3>
              {applications.length === 0 ? (
                <div className="text-center py-12">
                   <p className="text-gray-400 font-semibold italic text-lg">No intelligence found. You haven't executed any applications yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map(app => (
                    <div key={app._id} className="bg-white/80 border border-gray-100 rounded-xl p-5 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                      <div>
                        <h4 className="font-extrabold text-blue-900 text-lg">{app.jobTitle}</h4>
                        <p className="text-sm font-medium text-gray-500">{app.companyName}</p>
                        <p className="text-xs text-gray-400 mt-2 font-mono">Dispatched: {new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                          app.status === 'approved' ? 'bg-green-100 text-green-700 shadow-sm shadow-green-200' : 'bg-yellow-100 text-yellow-700 shadow-sm shadow-yellow-200'
                        }`}>
                          {app.status}
                        </span>
                        {app.status !== 'approved' && (
                          <button onClick={() => handleWithdraw(app._id)} className="text-xs font-bold text-red-500 hover:text-red-700 underline transition-colors">
                            Withdraw Record
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-blue-900/5 border border-white/40">
              <div className="flex justify-between items-center border-b border-blue-100 pb-4 mb-6">
                 <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#339933] to-emerald-600">Live Global Job Network</h3>
                 <a href="/jobs" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition">View Directory →</a>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                {availableJobs.map(job => (
                  <div key={job._id} className="group bg-white p-5 border border-gray-100 rounded-xl shadow-sm hover:border-emerald-300 transition-colors">
                     <div className="flex justify-between items-start">
                        <div>
                           <h4 className="font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">{job.title}</h4>
                           <p className="text-sm text-gray-500 mt-1">{job.location?.city}, {job.location?.state} • {job.companyName}</p>
                        </div>
                        <a href="/jobs"><Button size="sm" variant="outline" className="text-xs font-bold text-emerald-700 border-emerald-200 hover:bg-emerald-50">Quick Apply Mode</Button></a>
                     </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
