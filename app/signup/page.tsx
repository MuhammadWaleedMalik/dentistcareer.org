'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function SignUp() {
  const [isEmployer, setIsEmployer] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employerName: '',
    profession: ''
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        role: isEmployer ? 'employer' : 'jobseeker',
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('Account created successfully');
      await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      router.push('/');
      router.refresh();
    } else {
      toast.error(data.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 border rounded-lg shadow-sm">
        <h2 className="text-[#339933] text-3xl font-bold text-center mb-6">Create Account</h2>
        
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            className={`px-4 py-2 font-semibold transition-colors ${!isEmployer ? 'bg-[#339933] text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setIsEmployer(false)}
          >
            Jobseeker
          </button>
          <button
            type="button"
            className={`px-4 py-2 font-semibold transition-colors ${isEmployer ? 'bg-[#339933] text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setIsEmployer(true)}
          >
            Employer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#339933]"
            />
          </div>
          {isEmployer && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Company/Practice Name</label>
              <input
                type="text"
                name="employerName"
                value={formData.employerName}
                onChange={handleChange}
                required={isEmployer}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#339933]"
              />
            </div>
          )}
          {!isEmployer && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Your Profession</label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required={!isEmployer}
                placeholder="e.g. Dental Hygienist"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#339933]"
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#339933]"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#339933]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-[#339933] text-white font-bold py-3 rounded transition-colors"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <a href="/login" className="text-blue-600 hover:text-[#339933]">Sign In</a>
        </div>
      </div>
    </div>
  );
}
