'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, ChevronDown, Shield, QrCode, Users, BarChart, Mail, Hash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const navItems = [
  { name: 'Home', href: '/' },
  {
    name: 'About',
    href: '#',
    subItems: [
      { name: 'WHAT IS VENTURE CRAFT?', href: '/about/venture-craft' },
      { name: '2026 THEME', href: '/about/theme' },
      { name: 'KFUPM & DTV', href: '/about/kfupm-dtv' },
    ]
  },
  {
    name: 'Application',
    href: '#',
    subItems: [
      { name: 'ELIGIBILITY & CRITERIA', href: '/apply/eligibility' },
      { name: 'JUDGING RUBRICS', href: '/apply/rubrics' },
      { name: 'APPLICATION MATERIALS', href: '/apply/materials' },
      { name: 'FAQ', href: '/apply/faq' },
      { name: 'Apply Now', href: '/apply' },
    ]
  },
  { name: 'Ambassadors', href: '/ambassadors' },
  { name: 'Challenge', href: '/outreach-challenge' },
  { name: 'Contact Us', href: '/contact', type: 'link' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isJudge, setIsJudge] = useState(false);
  const [isUltimateJudge, setIsUltimateJudge] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [isAmbassadorLead, setIsAmbassadorLead] = useState(false);
  const [isAmbassador, setIsAmbassador] = useState(false);
  const [isOutreachLead, setIsOutreachLead] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [notificationCount, setNotificationCount] = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      setNotificationCount(0);
      return;
    }
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc: any) => {
      if (doc.exists()) {
        const data = doc.data();
        const points = data.points || 0;
        const lastSeen = data.lastSeenPoints || 0;
        if (points > lastSeen) {
          setNotificationCount(points - lastSeen);
        } else {
          setNotificationCount(0);
        }
      }
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsAmbassador(false);
        return;
      }
      try {
        // 1. Check if Admin
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        setIsAdmin(adminDoc.exists());

        // 2. Check if Judge
        const judgeDoc = await getDoc(doc(db, 'judges', user.uid));
        if (judgeDoc.exists()) {
          setIsJudge(true);
          const judgeData = judgeDoc.data();
          const role = (judgeData.role || '').toLowerCase();
          setIsUltimateJudge(role === 'ultimate' || !judgeData.team);
          setIsSupervisor(role === 'supervisor');
        } else {
          setIsJudge(false);
          setIsUltimateJudge(false);
          setIsSupervisor(false);
        }

        // 3. Check if Ambassador Lead
        const leadDoc = await getDoc(doc(db, 'ambassadors_lead', user.uid));
        setIsAmbassadorLead(leadDoc.exists());

        // 4. Check if Ambassador
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === 'ambassador') {
            const ambDoc = await getDoc(doc(db, 'ambassadors', user.uid));
            if (ambDoc.exists()) {
              setIsAmbassador(true);
            } else {
              setIsAmbassador(false);
              updateDoc(doc(db, 'users', user.uid), { role: 'user', ambassadorId: null }).catch(console.error);
            }
          } else {
            setIsAmbassador(false);
          }
        } else {
          setIsAmbassador(false);
        }

        // 5. Check if Outreach Leader
        const outreachLeadDoc = await getDoc(doc(db, 'outreach_leaders', user.uid));
        setIsOutreachLead(outreachLeadDoc.exists());
      } catch (error) {
        console.error('Role check failed:', error);
        setIsAdmin(false);
        setIsAmbassador(false);
        setIsOutreachLead(false);
      }
    };
    checkRole();
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

  const isApplying = (pathname === '/apply' && searchParams.get('step') !== null) || pathname === '/ambassadors/apply';
  if (isApplying || pathname === '/signin' || pathname === '/signup' || pathname === '/verify-email' || pathname === '/socials') return null;

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
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => item.subItems && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.subItems ? (
                  <div className="flex items-center gap-1 cursor-pointer py-2">
                    <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${activeDropdown === item.name ? 'text-vc-mint' : 'text-white/90 group-hover:text-vc-mint'}`}>
                      {item.name}
                    </span>
                    <ChevronDown size={14} className={`text-white/50 transition-transform duration-300 ${activeDropdown === item.name ? 'rotate-180 text-vc-mint' : ''}`} />

                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 0, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 0, scale: 0.98 }}
                          className="absolute left-0 mt-2 w-64 bg-[#111111] border border-white/5 shadow-2xl z-50 top-full"
                        >
                          <div className="flex flex-col">
                            {item.subItems.map((subItem) => {
                              const isApplyNow = subItem.name === 'Apply Now';
                              return (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className={`flex items-center px-6 py-4 text-[13px] font-bold uppercase tracking-widest transition-all border-b border-white/[0.03] last:border-b-0 ${isApplyNow
                                    ? 'text-vc-mint hover:text-vc-mint/80 hover:bg-white/5'
                                    : 'text-white/90 hover:text-vc-mint hover:bg-white/5'
                                    }`}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {subItem.name}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-xs font-bold uppercase tracking-widest text-white/90 hover:text-vc-mint transition-colors py-2"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:block relative min-w-[100px]">
            {!authLoading && (
              user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#21428f] to-vc-teal flex items-center justify-center text-white">
                        <User size={18} />
                      </div>
                      {notificationCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center px-1 border border-[#0D1B1A]"
                        >
                          <span className="text-[9px] font-black text-white">+{notificationCount}</span>
                        </motion.div>
                      )}
                    </div>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/90 group-hover:text-white">
                      {user.displayName?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown size={14} className={`text-white/50 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-3 w-64 bg-[#0D1B1A] border border-white/10 shadow-2xl z-50 rounded-2xl overflow-hidden"
                        >
                          <div className="p-5 border-b border-white/10 bg-white/[0.02]">
                            <p className="text-base font-bold text-white mb-0.5">{user.displayName || 'User'}</p>
                            <div className="flex flex-wrap gap-2 items-center mt-1">
                              <p className="text-xs font-medium text-white/50 truncate max-w-[150px]">{user.email}</p>
                              {isAdmin && (
                                <span className="px-1.5 py-0.5 bg-vc-mint/20 border border-vc-mint/30 rounded text-[9px] font-bold text-vc-mint uppercase tracking-wider">Admin</span>
                              )}
                              {isJudge && !isAdmin && (
                                <span className="px-1.5 py-0.5 bg-vc-mint/20 border border-vc-mint/30 rounded text-[9px] font-bold text-vc-mint uppercase tracking-wider">Judge</span>
                              )}
                              {isAmbassadorLead && !isAdmin && (
                                <span className="px-1.5 py-0.5 bg-vc-mint/20 border border-vc-mint/30 rounded text-[9px] font-bold text-vc-mint uppercase tracking-wider">Lead</span>
                              )}
                            </div>
                          </div>

                          <div className="py-2">
                            <Link
                              href="/profile"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <User size={16} />
                              My Profile
                            </Link>

                            {(isAdmin || isJudge || isAmbassadorLead || isOutreachLead) && (
                              <div className="mt-1 pt-1 border-t border-white/10">
                                <p className="px-5 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">Management</p>
                                {(isAdmin || isJudge) && (
                                  <Link
                                    href="/admin"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="w-full flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/5 transition-all"
                                  >
                                    <div className="w-[18px] flex justify-center">
                                      <div className="w-1.5 h-1.5 bg-vc-mint rounded-full" />
                                    </div>
                                    Startup Applications
                                  </Link>
                                )}
                                {(isAdmin || isAmbassadorLead) && (
                                  <Link
                                    href="/admin?tab=ambassadors"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="w-full flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/5 transition-all"
                                  >
                                    <div className="w-[18px] flex justify-center">
                                      <Users size={14} className="text-vc-mint" />
                                    </div>
                                    Ambassador Management
                                  </Link>
                                )}
                                {(isAdmin || isUltimateJudge) && (
                                  <Link
                                    href="/admin?tab=judges"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="w-full flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/5 transition-all"
                                  >
                                    <div className="w-[18px] flex justify-center">
                                      <Shield size={14} className="text-vc-mint" />
                                    </div>
                                    Judges
                                  </Link>
                                )}

                                {isAdmin && (
                                  <>
                                    <Link
                                      href="/qr"
                                      onClick={() => setIsProfileOpen(false)}
                                      className="w-full flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                      <div className="w-[18px] flex justify-center">
                                        <QrCode size={14} className="text-vc-mint" />
                                      </div>
                                      QR Generator
                                    </Link>
                                    <Link
                                      href="/admin?tab=broadcast"
                                      onClick={() => setIsProfileOpen(false)}
                                      className="w-full flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                      <div className="w-[18px] flex justify-center">
                                        <Mail size={14} className="text-vc-mint" />
                                      </div>
                                      Email Center
                                    </Link>
                                  </>
                                )}
                                {(isAdmin || isOutreachLead) && (
                                  <Link
                                    href="/admin?tab=outreach"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="w-full flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/5 transition-all"
                                  >
                                    <div className="w-[18px] flex justify-center">
                                      <Hash size={14} className="text-vc-mint" />
                                    </div>
                                    Outreach Challenge
                                  </Link>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="p-2 border-t border-white/10 mt-1">
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all group"
                            >
                              <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
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
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white group-hover:text-vc-mint transition-colors">
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
            <>
              {/* Transparent backdrop to close menu when clicking anywhere */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[45] md:hidden"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="md:hidden absolute top-20 left-4 right-4 z-50 overflow-hidden"
              >
                <div className="glass-panel p-6 flex flex-col gap-4 bg-[#0D1B1A]/95 !backdrop-blur-lg border border-white/10 shadow-2xl max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
                  {navItems.map((item) => (
                    <div key={item.name} className="flex flex-col gap-2">
                      {item.subItems ? (
                        <>
                          <div className="flex items-center justify-between text-lg font-bold text-vc-mint/50 uppercase tracking-widest px-1">
                            {item.name}
                          </div>
                          <div className="flex flex-col gap-3 pl-4 border-l border-white/10 ml-1">
                            {item.subItems.map((subItem) => {
                              const isApplyNow = subItem.name === 'Apply Now';
                              return (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className={`block py-3 px-4 text-xs font-bold uppercase tracking-widest border-l border-white/5 transition-all ${isApplyNow
                                    ? 'text-vc-mint hover:text-vc-mint/80 border-l-vc-mint'
                                    : 'text-white/70 hover:text-vc-mint hover:border-vc-mint'
                                    }`}
                                  onClick={() => setIsOpen(false)}
                                >
                                  {subItem.name}
                                </Link>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-sm font-bold uppercase tracking-widest text-white/90 hover:text-vc-mint"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
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
                            <p className="text-xs font-bold uppercase tracking-widest text-white leading-tight">{user.displayName || 'User'}</p>
                            <p className="text-xs text-white/50">{user.email}</p>
                          </div>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/90 hover:text-vc-mint"
                          onClick={() => setIsOpen(false)}
                        >
                          <User size={18} className="text-vc-mint" />
                          My Profile
                        </Link>

                        {(isAdmin || isJudge || isAmbassadorLead || isOutreachLead) && (
                          <>
                            {(isAdmin || isJudge) && (
                              <Link
                                href="/admin"
                                className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-vc-mint"
                                onClick={() => setIsOpen(false)}
                              >
                                <Shield size={20} />
                                Startup Applications
                              </Link>
                            )}
                            {(isAdmin || isAmbassadorLead) && (
                              <Link
                                href="/admin?tab=ambassadors"
                                className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-vc-mint"
                                onClick={() => setIsOpen(false)}
                              >
                                <Users size={20} />
                                Ambassador Management
                              </Link>
                            )}
                            {(isAdmin || isUltimateJudge) && (
                              <Link
                                href="/admin?tab=judges"
                                className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-vc-mint"
                                onClick={() => setIsOpen(false)}
                              >
                                <Shield size={20} />
                                Judges
                              </Link>
                            )}
                            {isAdmin && (
                              <>
                                <Link
                                  href="/qr"
                                  className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-vc-mint"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <QrCode size={20} />
                                  QR Generator
                                </Link>
                                <Link
                                  href="/admin?tab=broadcast"
                                  className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-vc-mint"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <Mail size={20} />
                                  Email Center
                                </Link>
                              </>
                            )}
                            {(isAdmin || isOutreachLead) && (
                              <Link
                                href="/admin?tab=outreach"
                                className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-vc-mint"
                                onClick={() => setIsOpen(false)}
                              >
                                <Hash size={20} />
                                Outreach Challenge
                              </Link>
                            )}
                          </>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-red-400 hover:text-red-300"
                        >
                          <LogOut size={18} />
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
                          <span className="text-sm font-bold uppercase tracking-widest text-white group-hover:text-vc-mint transition-colors">
                            Sign in
                          </span>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav >
  );
}
