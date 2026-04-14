'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CareerAdvicePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchArticles = async (searchKeyword = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles?keyword=${encodeURIComponent(searchKeyword)}`);
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles(keyword);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b py-4 px-8 flex justify-between items-center shadow-sm">
        <a href="/" className="text-2xl font-bold text-[#339933]">ADA CareerCenter</a>
        <div className="flex gap-4">
          <a href="/jobs" className="text-gray-700 hover:text-[#339933]">Find a Job</a>
          <a href="/newalert" className="text-gray-700 hover:text-[#339933]">Job Alerts</a>
          <a href="/employers" className="text-gray-700 hover:text-[#339933]">Search Employers</a>
          <a href="/careers" className="text-[#339933] font-bold border-b-2 border-[#339933]">Career Advice</a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex gap-8">
        <aside className="w-1/3">
          <h2 className="text-xl font-bold mb-4">Search Articles</h2>
          <div className="bg-white p-6 border rounded shadow-sm">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Filter Articles</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Keywords"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <Button type="submit" className="bg-[#339933] hover:bg-green-700 text-white">
                    Q
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </aside>

        <section className="w-2/3">
          <h2 className="text-xl font-semibold mb-6">Found {articles.length} articles</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <div key={article._id} className="bg-white p-6 border rounded shadow-sm flex flex-col hover:shadow-md transition">
                  <h3 className="text-lg font-bold text-blue-600 hover:underline cursor-pointer mb-2">{article.title}</h3>
                  <div className="text-xs text-gray-500 mb-3">{new Date(article.createdAt).toLocaleDateString()}</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{article.excerpt}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
