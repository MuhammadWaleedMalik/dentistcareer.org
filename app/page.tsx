'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'position' | 'location'>('position');
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [heroKeyword, setHeroKeyword] = useState('');
  const [heroArea, setHeroArea] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/jobs?keyword=${encodeURIComponent(heroKeyword)}&area=${encodeURIComponent(heroArea)}`);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        if (data.success) {
          setFeaturedJobs(data.jobs.slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  const positionCategories = [
    { name: 'Associate Dentist', count: 511 },
    { name: 'Chair', count: 1 },
    { name: 'Chief', count: 2 },
    { name: 'Dental Assistant', count: 83 },
    { name: 'Dental Hygienist', count: 474 },
    { name: 'Dental Team Member', count: 2 },
    { name: 'Director', count: 2 },
  ];

  const positionCategories2 = [
    { name: 'Employee Dentist', count: 6 },
    { name: 'Endodontist', count: 52 },
    { name: 'Faculty', count: 6 },
    { name: 'Front Office / Administrative', count: 2 },
    { name: 'General Dentist', count: 1729 },
    { name: 'Manager', count: 12 },
    { name: 'Oral Surgeon', count: 73 },
  ];

  const positionCategories3 = [
    { name: 'Orthodontist', count: 11 },
    { name: 'Other', count: 7 },
    { name: 'Pedodontist', count: 64 },
    { name: 'Periodontist', count: 18 },
    { name: 'Professor', count: 2 },
    { name: 'Prosthodontist', count: 9 },
    { name: 'Specialist Dentist', count: 2 },
  ];

  const careerAdvice = [
    {
      image: '/placeholder1.jpg',
      title: 'Beyond the Clinical: Finding the Right Cultural Fit in a Dental Practice',
    },
    {
      image: '/placeholder2.jpg',
      title: 'Become an Orthodontist',
    },
    {
      image: '/placeholder3.jpg',
      title: "The Dental Associate Contract: 3 Clauses You Shouldn't Overlook",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-[#339933] text-3xl font-bold">ADA</span>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800">CareerCenter</h1>
                  <p className="text-sm text-gray-600">Opportunities for Dental Professionals</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                {session ? (
                  <>
                    <span className="text-gray-700">Signed in as {session.user?.name} </span>
                    <a href={`/dashboard/${(session.user as any)?.role}`} className="text-blue-600 hover:text-[#339933] font-bold mx-2">Dashboard</a>
                    <button onClick={() => { toast.success('Securely logged out.'); setTimeout(() => signOut({ callbackUrl: '/' }), 700); }} className="text-red-600 hover:underline font-bold">Log Out</button>
                  </>
                ) : (
                  <>
                    <span className="text-gray-700">Jobseekers </span>
                    <a href="/login" className="text-blue-600 hover:text-[#339933] transition-colors">Sign In</a>
                    <span className="text-gray-700"> or </span>
                    <a href="/signup" className="text-blue-600 hover:text-[#339933] transition-colors">Create Account</a>
                  </>
                )}
              </div>
              <a href={session && (session.user as any)?.role === 'employer' ? '/dashboard/employer' : '/login'}>
                <Button className="bg-blue-600 hover:bg-[#339933] text-white transition-colors">
                  Employers: Post a Job
                </Button>
              </a>
            </div>
          </div>

          <nav className="flex gap-6 border-t">
            <a href="/" className="py-3 text-[#339933] border-b-2 border-[#339933] font-bold transition-colors">Home</a>
            <a href="/jobs" className="py-3 text-gray-700 hover:text-[#339933] transition-colors">Find a Job</a>
            <a href="/newalert" className="py-3 text-gray-700 hover:text-[#339933] transition-colors">Job Alerts</a>
            <a href="/employers" className="py-3 text-gray-700 hover:text-[#339933] transition-colors">Search Employers</a>
            <a href="/careers" className="py-3 text-gray-700 hover:text-[#339933] transition-colors">Career Advice</a>
            <div className="ml-auto py-3">
              <span className="text-gray-700">Visit: </span>
              <a href="#" className="text-blue-600 hover:text-[#339933] transition-colors">ADA.org</a>
              <span className="mx-2">|</span>
              <a href="#" className="text-blue-600 hover:text-[#339933] transition-colors">ADA Career Planning</a>
            </div>
          </nav>
        </div>
      </header>

      <section className="bg-[#CDDDEA] py-16" style={{
        backgroundImage: 'url(/dental-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Find Your Next Dental Career Today
          </h2>
          <div className="flex gap-4 max-w-4xl mx-auto">
            <form onSubmit={handleHeroSearch} className="flex gap-4 w-full">
              <Input
                value={heroKeyword}
                onChange={(e) => setHeroKeyword(e.target.value)}
                placeholder="e.g. Dental Hygienist"
                className="flex-1 h-12"
              />
              <Input
                value={heroArea}
                onChange={(e) => setHeroArea(e.target.value)}
                placeholder="e.g. New York"
                className="flex-1 h-12"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 font-bold">
                Search Roles
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('position')}
              className={`px-6 py-2 font-semibold transition-colors ${
                activeTab === 'position'
                  ? 'bg-[#339933] text-white'
                  : 'bg-white text-[#339933] border border-[#339933] hover:bg-[#E6E6E6]'
              }`}
            >
              Position
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`px-6 py-2 font-semibold transition-colors ${
                activeTab === 'location'
                  ? 'bg-[#339933] text-white'
                  : 'bg-white text-[#339933] border border-[#339933] hover:bg-[#E6E6E6]'
              }`}
            >
              Location
            </button>
          </div>
          <a href="#" className="text-blue-600 hover:text-[#339933] flex items-center gap-1 transition-colors">
            View all <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-12">
          <div>
            {positionCategories.map((category) => (
              <a
                key={category.name}
                href="#"
                className="flex justify-between py-2 text-blue-600 hover:text-[#339933] transition-colors"
              >
                <span>{category.name}</span>
                <span className="text-gray-500">{category.count}</span>
              </a>
            ))}
          </div>
          <div>
            {positionCategories2.map((category) => (
              <a
                key={category.name}
                href="#"
                className="flex justify-between py-2 text-blue-600 hover:text-[#339933] transition-colors"
              >
                <span>{category.name}</span>
                <span className="text-gray-500">{category.count}</span>
              </a>
            ))}
          </div>
          <div>
            {positionCategories3.map((category) => (
              <a
                key={category.name}
                href="#"
                className="flex justify-between py-2 text-blue-600 hover:text-[#339933] transition-colors"
              >
                <span>{category.name}</span>
                <span className="text-gray-500">{category.count}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Featured Jobs</h3>
            <a href="/jobs" className="text-blue-600 hover:text-[#339933] flex items-center gap-1 transition-colors">
              View all jobs <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {featuredJobs.map((job, index) => (
              <div key={job._id || index} className="border rounded p-4 hover:shadow-lg transition-shadow">
                {job.companyName && (
                  <div className="font-semibold text-gray-700 mb-2">{job.companyName}</div>
                )}
                <h4 className="text-blue-600 hover:text-[#339933] font-semibold mb-2 transition-colors cursor-pointer">
                  {job.title}
                </h4>
                <p className="text-gray-600 text-sm">{job.location?.city}, {job.location?.state}</p>
                {job.salary && (
                  <p className="text-[#339933] text-sm font-semibold mt-1">{job.salary}</p>
                )}
                {job.type && (
                  <p className="text-gray-600 text-sm">{job.type}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="border rounded-lg p-8">
            <h3 className="text-[#339933] text-xl font-bold mb-4 flex items-center gap-2">
              Get instant job alerts <ChevronRight className="w-5 h-5" />
            </h3>
            <p className="text-gray-600">
              Personalised job recommendations sent straight to your email.
            </p>
          </div>
          <div className="border rounded-lg p-8">
            <h3 className="text-[#339933] text-xl font-bold mb-4 flex items-center gap-2">
              Create an account for free <ChevronRight className="w-5 h-5" />
            </h3>
            <p className="text-gray-600">
              Shortlist jobs, manage your job alerts and receive special offers.
            </p>
          </div>
        </div>

        <div className="border rounded-lg p-6 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Career Advice</h3>
            <a href="#" className="text-blue-600 hover:text-[#339933] flex items-center gap-1 transition-colors">
              View all articles <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {careerAdvice.map((article, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-gray-200 h-40 mb-4 rounded"></div>
                <h4 className="text-blue-600 group-hover:text-[#339933] font-semibold transition-colors">
                  {article.title}
                </h4>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="border rounded-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">About ADA CareerCenter</h3>
            <p className="text-gray-600 leading-relaxed">
              The ADA CareerCenter is the official online job board of the American Dental Association (ADA),
              and your number one online resource for searching dental career opportunities or recruiting dental
              professionals. Search or post opportunities for dentist jobs, oral surgeon jobs, orthodontist jobs,
              dental hygienist jobs, dental assistant jobs, and other dental positions.
            </p>
          </div>
          <div className="border border-[#339933] rounded-lg p-8">
            <h3 className="text-[#339933] text-xl font-bold mb-4">Advertise With Us</h3>
            <p className="text-gray-600 mb-6">
              Find the right candidate! The ADA offers a targeted audience online and in print for recruitment
              advertising in ADA CareerCenter in JADA.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Post a Job
            </Button>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Featured Employers</h3>
            <a href="#" className="text-blue-600 hover:text-[#339933] flex items-center gap-1 transition-colors">
              View all employers <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="border rounded p-4 flex items-center justify-center h-24 bg-gray-50">
                <div className="text-gray-400 text-sm">Employer Logo</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Featured Campaigns</h3>
            <a href="#" className="text-blue-600 hover:text-[#339933] flex items-center gap-1 transition-colors">
              More Jobs <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <ul className="list-disc list-inside">
            <li>
              <a href="#" className="text-blue-600 hover:text-[#339933] transition-colors">Tenured Jobs</a>
            </li>
          </ul>
        </div>
      </section>

      <footer className="bg-[#F0F0F0] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 mb-6 text-sm">
            <a href="#" className="text-blue-600 hover:text-[#339933] transition-colors">About Us</a>
            <a href="#" className="text-blue-600 hover:text-[#339933] transition-colors">Contact Us</a>
            <a href="#" className="text-blue-600 hover:text-[#339933] transition-colors">Terms & Conditions</a>
            <a href="#" className="text-blue-600 hover:text-[#339933] transition-colors">Privacy Policy</a>
            <a href="#" className="text-blue-600 hover:text-[#339933] transition-colors">Post a Job</a>
          </div>
          <div className="text-sm text-gray-600">
            © 2019 - 2026 American Dental Association. Powered by{' '}
            <a href="#" className="text-blue-600 hover:text-[#339933] transition-colors">
              Madgex Job Board Software
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
