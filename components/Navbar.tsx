'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, ChevronDown, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Apply Now', href: '/apply' },
  { name: 'Ambassadors', href: '/ambassadors' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        setIsAdmin(adminDoc.exists());
      } catch (error) {
        console.error('Admin check failed:', error);
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsProfileOpen(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isApplying = pathname === '/apply' && searchParams.get('step') !== null;
  if (isApplying || pathname === '/ambassadors' || pathname === '/signin' || pathname === '/signup' || pathname === '/verify-email') return null;

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 px-4 py-4 md:py-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel px-6 py-3 flex items-center justify-between !backdrop-blur-md">
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src="/logo.png"
                alt="Venture Craft Logo"
                width={160}
                height={40}
                className="h-7 md:h-8 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 ml-auto mr-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-white/90 hover:text-vc-mint transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:block relative min-w-[100px]">
            {!authLoading && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#21428f] to-vc-teal flex items-center justify-center text-white">
                      <User size={18} />
                    </div>
                    <span className="text-sm font-medium text-white/90 group-hover:text-white">
                      {user.displayName?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown size={14} className={`text-white/50 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-[-1]"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-3 w-64 bg-[#0D1B1A] border border-white/10 shadow-2xl z-50 rounded-2xl overflow-hidden"
                        >
                          <div className="p-5 border-b border-white/10 bg-white/[0.02]">
                            <p className="text-base font-bold text-white mb-0.5">{user.displayName || 'User'}</p>
                            <p className="text-xs font-medium text-white/50 truncate">{user.email}</p>
                          </div>

                          <div className="py-2">
                            <Link
                              href="/profile"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-5 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <User size={18} />
                              My Profile
                            </Link>

                            {isAdmin && (
                              <div className="mt-1 pt-1 border-t border-white/10">
                                <p className="px-5 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">Admin</p>
                                <Link
                                  href="/admin"
                                  onClick={() => setIsProfileOpen(false)}
                                  className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all"
                                >
                                  <div className="w-[18px] flex justify-center">
                                    <div className="w-1.5 h-1.5 bg-vc-mint rounded-full" />
                                  </div>
                                  Applications
                                </Link>
                              </div>
                            )}
                          </div>

                          <div className="p-2 border-t border-white/10 mt-1">
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all group"
                            >
                              <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/signin" className="inline-block group relative p-[1.5px] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#21428f] to-vc-teal opacity-70 group-hover:from-vc-mint/80 group-hover:to-vc-mint group-hover:opacity-100 transition-all duration-300" />
                  <div className="relative px-8 py-2 rounded-full bg-[#0D1B1A] flex items-center justify-center group-hover:bg-[#0D1B1A]/80 transition-colors">
                    <span className="text-sm font-bold text-white group-hover:text-vc-mint transition-colors">
                      Sign in
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white ml-auto"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="md:hidden absolute top-20 left-4 right-4 z-50"
            >
              <div className="glass-panel p-6 flex flex-col gap-4 bg-[#0D1B1A]/95 !backdrop-blur-lg border border-white/10 shadow-2xl">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-white/90 hover:text-vc-mint"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <hr className="border-white/10" />
                {!authLoading && (
                  user ? (
                    <>
                      <div className="flex items-center gap-3 px-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#21428f] to-vc-teal flex items-center justify-center text-white">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{user.displayName || 'User'}</p>
                          <p className="text-xs text-white/50">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 text-lg font-medium text-white/90 hover:text-vc-mint"
                        onClick={() => setIsOpen(false)}
                      >
                        <User size={20} className="text-vc-mint" />
                        My Profile
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 text-lg font-bold text-vc-mint"
                          onClick={() => setIsOpen(false)}
                        >
                          <Shield size={20} />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 text-lg font-medium text-red-400 hover:text-red-300"
                      >
                        <LogOut size={20} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/signin"
                      className="group relative p-[1.5px] rounded-xl overflow-hidden transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#21428f] to-vc-teal opacity-70 group-hover:from-vc-mint/80 group-hover:to-vc-mint group-hover:opacity-100 transition-all duration-300" />
                      <div className="relative w-full py-3 rounded-xl bg-[#0D1B1A] flex items-center justify-center group-hover:bg-[#0D1B1A]/80 transition-colors">
                        <span className="text-lg font-bold text-white group-hover:text-vc-mint transition-colors">
                          Sign in
                        </span>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
