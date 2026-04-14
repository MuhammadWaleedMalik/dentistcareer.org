'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EmployersPage() {
  const [employers, setEmployers] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEmployers = async (searchKeyword = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/employers?keyword=${encodeURIComponent(searchKeyword)}`);
      const data = await res.json();
      if (data.success) {
        setEmployers(data.employers);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEmployers(keyword);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b py-4 px-8 flex justify-between items-center shadow-sm">
        <a href="/" className="text-2xl font-bold text-[#339933]">ADA CareerCenter</a>
        <div className="flex gap-4">
          <a href="/jobs" className="text-gray-700 hover:text-[#339933]">Find a Job</a>
          <a href="/newalert" className="text-gray-700 hover:text-[#339933]">Job Alerts</a>
          <a href="/employers" className="text-[#339933] font-bold border-b-2 border-[#339933]">Search Employers</a>
          <a href="/careers" className="text-gray-700 hover:text-[#339933]">Career Advice</a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex gap-8">
        <aside className="w-1/3">
          <h2 className="text-xl font-bold mb-4">Search employers</h2>
          <div className="bg-white p-6 border rounded shadow-sm">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Keyword</label>
                <Input
                  placeholder="i.e. employer name"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-[#339933] hover:bg-green-700 text-white">
                Search
              </Button>
            </form>
          </div>
        </aside>

        <section className="w-2/3">
          <h2 className="text-xl font-semibold mb-6">Found {employers.length} employers</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-4">
              {employers.map((emp) => (
                <div key={emp._id} className="bg-white p-6 border rounded shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <h3 className="text-lg font-bold text-blue-600 hover:underline cursor-pointer mb-2"><a href={emp.website} target="_blank">{emp.name}</a></h3>
                  <p className="text-sm text-gray-600 mb-4">{emp.description || 'Dental Practice'}</p>
                  <p className="text-sm font-semibold text-gray-500 mt-auto">{emp.jobs?.length || 0} jobs</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
