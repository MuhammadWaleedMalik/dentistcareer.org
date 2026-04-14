'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function JobAlertsPage() {
  const [formData, setFormData] = useState({
    email: '',
    keyword: '',
    location: '',
    frequency: 'Daily',
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMessage('Job alert created successfully!');
        setFormData({ email: '', keyword: '', location: '', frequency: 'Daily' });
      } else {
        setMessage('Failed to create alert.');
      }
    } catch (err) {
      setMessage('An error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b py-4 px-8 flex justify-between items-center bg-white shadow-sm">
        <a href="/" className="text-2xl font-bold text-[#339933]">ADA CareerCenter</a>
        <div className="flex gap-4">
          <a href="/jobs" className="text-gray-700 hover:text-[#339933]">Find a Job</a>
          <a href="/newalert" className="text-gray-700 font-bold text-[#339933]">Job Alerts</a>
          <a href="/employers" className="text-gray-700 hover:text-[#339933]">Search Employers</a>
          <a href="/careers" className="text-gray-700 hover:text-[#339933]">Career Advice</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Create a job alert</h1>
        <p className="text-gray-600 mb-8">
          Be the first to apply - get daily alerts with the latest jobs sent directly to your inbox.
        </p>

        {message && (
          <div className="mb-6 p-4 rounded bg-green-50 text-[#339933] font-semibold border border-green-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-bold text-gray-800 mb-2">What is your email address? *</label>
            <Input 
              required 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-2">What job title are you currently seeking?</label>
            <Input 
              placeholder="e.g. Dental Hygienist"
              value={formData.keyword}
              onChange={(e) => setFormData({...formData, keyword: e.target.value})}
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-2">In which location would you prefer to work?</label>
            <Input 
              placeholder="e.g. New York"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-2">How often should we send you jobs? *</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="frequency" 
                  value="Daily" 
                  checked={formData.frequency === 'Daily'}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                />
                Daily
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="frequency" 
                  value="Weekly" 
                  checked={formData.frequency === 'Weekly'}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                />
                Weekly
              </label>
            </div>
          </div>

          <div className="pt-6 border-t">
            <Button type="submit" className="bg-[#339933] hover:bg-green-700 text-white font-bold py-2 px-6 rounded float-right">
              Send me new jobs
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
