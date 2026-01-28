'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Registration', href: '/registration' },
  { name: 'Ambassadors', href: '/ambassadors' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === '/registration' || pathname === '/ambassadors' || pathname === '/signin' || pathname === '/signup' || pathname === '/verify-email') return null;

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
            <Link href="/signin" className="inline-block group relative p-[1.5px] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-[#23bcab] to-vc-teal opacity-70 group-hover:from-vc-mint/80 group-hover:to-vc-mint group-hover:opacity-100 transition-all duration-300" />
              <div className="relative px-8 py-2 rounded-full bg-[#0D1B1A] flex items-center justify-center group-hover:bg-[#0D1B1A]/80 transition-colors">
                <span className="text-sm font-bold text-white group-hover:text-vc-mint transition-colors">
                  Sign in
                </span>
              </div>
            </Link>
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
                <Link
                  href="/signin"
                  className="group relative p-[1.5px] rounded-xl overflow-hidden transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#23bcab] to-vc-teal opacity-70 group-hover:from-vc-mint/80 group-hover:to-vc-mint group-hover:opacity-100 transition-all duration-300" />
                  <div className="relative w-full py-3 rounded-xl bg-[#0D1B1A] flex items-center justify-center group-hover:bg-[#0D1B1A]/80 transition-colors">
                    <span className="text-lg font-bold text-white group-hover:text-vc-mint transition-colors">
                      Sign in
                    </span>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
