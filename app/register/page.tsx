'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      login(data.token, data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 relative overflow-hidden flex flex-col font-inter">
      {/* Mobile Header - Sleek & Native */}
      <div className="md:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
        <div className="flex items-center h-14 px-4">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center text-gray-900 active:scale-95 transition-transform duration-200"
          >
            <span className="text-2xl font-bold text-[#201d1e] -ml-1">&lt;</span>
          </button>
          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-[17px] font-bold tracking-tight text-gray-900">Create Account</h1>
          </div>
          <div className="ml-auto w-7 h-7" /> {/* Balance spacer */}
        </div>
      </div>

      {/* Background Elements - Desktop Only */}
      <div className="hidden md:block absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 -left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 relative z-10 w-full max-w-7xl mx-auto">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#201d1e] tracking-tight mb-3">
              Join Rudy
            </h2>
            <p className="text-gray-500 text-base md:text-lg font-medium">
              Create an account for exclusive access
            </p>
          </div>

          <div className="bg-white md:bg-white/80 md:backdrop-blur-2xl rounded-[2.5rem] md:shadow-2xl md:shadow-black/5 p-2 md:p-8 md:border md:border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-600 px-5 py-4 rounded-2xl text-sm flex items-center animate-shake border border-red-100">
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                    First Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#201d1e] transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50 md:bg-white border-2 border-transparent rounded-2xl focus:ring-0 focus:border-[#201d1e] focus:bg-white transition-all duration-300 text-gray-900 font-semibold placeholder:text-gray-300 placeholder:font-normal"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                    Last Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#201d1e] transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50 md:bg-white border-2 border-transparent rounded-2xl focus:ring-0 focus:border-[#201d1e] focus:bg-white transition-all duration-300 text-gray-900 font-semibold placeholder:text-gray-300 placeholder:font-normal"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#201d1e] transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50 md:bg-white border-2 border-transparent rounded-2xl focus:ring-0 focus:border-[#201d1e] focus:bg-white transition-all duration-300 text-gray-900 font-semibold placeholder:text-gray-300 placeholder:font-normal"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#201d1e] transition-colors">
                      <Phone className="h-5 w-5" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50 md:bg-white border-2 border-transparent rounded-2xl focus:ring-0 focus:border-[#201d1e] focus:bg-white transition-all duration-300 text-gray-900 font-semibold placeholder:text-gray-300 placeholder:font-normal"
                      placeholder="+234..."
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#201d1e] transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50 md:bg-white border-2 border-transparent rounded-2xl focus:ring-0 focus:border-[#201d1e] focus:bg-white transition-all duration-300 text-gray-900 font-semibold placeholder:text-gray-300 placeholder:font-normal"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#201d1e] transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      className="block w-full pl-12 pr-12 py-4 bg-gray-50 md:bg-white border-2 border-transparent rounded-2xl focus:ring-0 focus:border-[#201d1e] focus:bg-white transition-all duration-300 text-gray-900 font-semibold placeholder:text-gray-300 placeholder:font-normal"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-[#201d1e] active:scale-90 transition-all"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 bg-[#201d1e] text-white rounded-2xl font-black text-lg shadow-2xl shadow-black/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-50 group mt-4 overflow-hidden relative"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : (
                  <>
                    <span className="relative z-10">Create Account</span>
                    <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center pb-8 md:pb-0">
              <p className="text-gray-500 font-bold">
                Already have an account?{' '}
                <Link href="/login" className="text-[#201d1e] font-black border-b-2 border-[#201d1e] pb-0.5 hover:opacity-70 transition-opacity">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
