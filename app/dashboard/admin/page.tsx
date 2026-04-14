'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({ title: '', excerpt: '', content: '' });
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session && (session.user as any).role !== 'admin') {
      router.push(`/dashboard/${(session.user as any).role}`);
    } else if (session) {
      fetchAllData();
    }
  }, [session, status, router]);

  const fetchAllData = () => {
    fetch('/api/jobs?admin=true').then(res => res.json()).then(data => data.success && setAllJobs(data.jobs));
    fetch('/api/users').then(res => res.json()).then(data => data.success && setUsers(data.users));
    fetch('/api/articles').then(res => res.json()).then(data => data.success && setArticles(data.articles));
  };

  const handleUserDelete = async (userId: string) => {
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        toast.success('User obliterated thoroughly');
        fetch('/api/users').then(res => res.json()).then(data => data.success && setUsers(data.users));
      }
    } catch {
      toast.error('Failed to eliminate user');
    }
  };

  const handleArticleDelete = async (articleId: string) => {
    try {
      const res = await fetch('/api/articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId })
      });
      if (res.ok) {
        toast.success('Editorial piece removed.');
        fetch('/api/articles').then(res => res.json()).then(data => data.success && setArticles(data.articles));
      }
    } catch {
      toast.error('Failed to eliminate article');
    }
  };

  const handleJobAction = async (jobId: string, actionStatus: string) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, status: actionStatus })
      });
      if (res.ok) {
        toast.success(`Job marked as ${actionStatus}`);
        fetch('/api/jobs?admin=true').then(res => res.json()).then(data => data.success && setAllJobs(data.jobs));
      } else {
        toast.error('Failed to update job');
      }
    } catch {
      toast.error('Error updating job');
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
        toast.success(`Job irrevocably deleted`);
        fetch('/api/jobs?admin=true').then(res => res.json()).then(data => data.success && setAllJobs(data.jobs));
      }
    } catch {
      toast.error('Failed to eliminate job');
    }
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          authorId: (session?.user as any)?.id
        })
      });
      if (res.ok) {
        toast.success('Career advice article posted successfully!');
        setFormData({ title: '', excerpt: '', content: '' });
        fetch('/api/articles').then(res => res.json()).then(data => data.success && setArticles(data.articles));
      } else {
        toast.error('Failed to post article');
      }
    } catch {
      toast.error('Error occurred.');
    }
  };

  if (status === 'loading') return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Absolute Geometric Glows for Ultra-Modern Tech Aesthetic */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-100px] w-[400px] h-[400px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none"></div>

      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700 py-4 px-8 shadow-sm relative z-10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <a href="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">ADA Admin Override</a>
          <a href="/" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Terminate Session →</a>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">System Global Authority</h1>
        <p className="text-slate-400 mb-10 font-medium text-lg">Central hub to manage jobs, user telemetry, and editorial architecture.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* USERS MANAGER */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-xl p-6 border border-slate-700 rounded-3xl shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">User Database</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {users.filter(u => u.role !== 'admin').map(user => (
                  <div key={user._id} className="border border-slate-700 bg-slate-800/80 p-4 rounded-2xl relative shadow-inner">
                    <span className={`absolute top-4 right-4 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${user.role === 'employer' ? 'bg-cyan-900/50 text-cyan-400' : 'bg-emerald-900/50 text-emerald-400'}`}>{user.role}</span>
                    <h3 className="font-bold text-slate-100 text-lg mb-1">{user.name}</h3>
                    <p className="font-mono text-xs text-slate-400 mb-2">{user.email}</p>
                    
                    {user.role === 'jobseeker' && (
                       <p className="text-xs font-semibold text-slate-300 bg-slate-700/50 px-2 py-1 rounded inline-block mb-4 border border-slate-600">Profession: {user.profession || 'Undisclosed'}</p>
                    )}
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive" className="w-full text-xs bg-red-900/80 hover:bg-red-600 border border-red-700" onClick={() => handleUserDelete(user._id)}>Purge Identity</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {/* JOBS MANAGER */}
            <div className="bg-slate-800/50 backdrop-blur-xl p-6 border border-slate-700 rounded-3xl shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Global Jobs Ledger</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {allJobs.map(job => (
                  <div key={job._id} className="border border-slate-700 bg-slate-800/80 p-5 rounded-2xl relative">
                    <div className="absolute top-4 right-4">
                      {job.status === 'pending' ? (
                        <span className="text-amber-400 font-bold bg-amber-900/30 px-2 py-1 rounded text-[10px] uppercase tracking-wider">PENDING</span>
                      ) : (
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${job.status === 'closed' ? 'bg-red-900/30 text-red-500' : 'bg-emerald-900/30 text-emerald-400'}`}>
                          {job.status}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-100 text-base max-w-[70%]">{job.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">{job.companyName}</p>
                    
                    <div className="flex gap-2 mt-auto">
                       {job.status === 'pending' && <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-500" onClick={() => handleJobAction(job._id, 'active')}>Approve</Button>}
                       {job.status === 'active' && <Button size="sm" variant="outline" className="text-amber-400 border-amber-800 hover:bg-amber-900/50 hover:text-amber-300" onClick={() => handleJobAction(job._id, 'pending')}>Revoke</Button>}
                       <Button size="sm" variant="destructive" className="bg-red-900/80 hover:bg-red-600" onClick={() => handleJobDelete(job._id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EDITORIAL CMS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-800/50 backdrop-blur-xl p-6 border border-slate-700 rounded-3xl shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Post Editorial</h2>
                <form onSubmit={handleArticleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Headline</label>
                    <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-slate-700/50 border-slate-600 text-white focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Excerpt</label>
                    <Input required value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="bg-slate-700/50 border-slate-600 text-white focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Content Body</label>
                    <textarea required className="w-full bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}></textarea>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:scale-[1.02] shadow-lg transition-transform text-white font-bold h-10 rounded-xl">Publish Article</Button>
                </form>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl p-6 border border-slate-700 rounded-3xl shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Live Articles</h2>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {articles.length === 0 ? (
                      <p className="text-sm italic text-slate-500">No editorials published.</p>
                   ) : (
                     articles.map(article => (
                       <div key={article._id} className="border border-slate-700 bg-slate-800/80 p-4 rounded-xl flex justify-between items-start gap-4">
                         <div>
                            <h4 className="font-bold text-slate-200 text-sm">{article.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{article.excerpt}</p>
                         </div>
                         <button onClick={() => handleArticleDelete(article._id)} className="text-red-400 hover:text-red-300 font-bold text-xs shrink-0 self-center border border-red-900/50 bg-red-900/20 px-3 py-1.5 rounded">Trash</button>
                       </div>
                     ))
                   )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(94, 234, 212, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(94, 234, 212, 0.8);
        }
      `}</style>
    </div>
  );
}
