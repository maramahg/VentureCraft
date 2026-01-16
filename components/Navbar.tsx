'use client';

import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Theme', href: '#theme' },
  { name: 'Timeline', href: '#timeline' },
  { name: 'Prizes', href: '#prizes' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 px-4 py-4 md:py-6">
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vc-teal to-vc-mint">
              VentureCraft
            </span>
            <span className="text-white/50 text-sm hidden sm:inline-block border-l border-white/20 pl-2">
              2026
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-white/80 hover:text-vc-mint transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-vc-mint transition-all group-hover:w-full" />
              </a>
            ))}
            <button className="btn-primary px-5 py-2 rounded-full text-sm">
              Apply Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-20 left-4 right-4"
          >
            <div className="glass-panel p-6 flex flex-col gap-4 bg-vc-green-dark/95 backdrop-blur-xl">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium text-white/90 hover:text-vc-mint"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <hr className="border-white/10" />
              <button className="btn-primary w-full py-3 rounded-xl font-medium">
                Submit Your Idea
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
