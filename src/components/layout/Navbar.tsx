"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", to: "hero" },
  { name: "About", to: "role" },
  { name: "Benefits", to: "benefits" },
  { name: "Vision", to: "vision" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0D2B2B]/80 backdrop-blur-md py-4 shadow-lg border-b border-white/5" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <ScrollLink 
          to="hero" 
          smooth={true} 
          duration={800} 
          className="cursor-pointer font-bold text-xl md:text-2xl text-white tracking-tighter"
        >
          VENTURE <span className="text-vc-mint">CRAFT</span>
        </ScrollLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <ScrollLink
              key={link.name}
              to={link.to}
              smooth={true}
              duration={800}
              spy={true}
              offset={-100}
              className="text-sm font-medium text-gray-300 hover:text-vc-mint cursor-pointer transition-colors uppercase tracking-wide"
              activeClass="!text-vc-mint"
            >
              {link.name}
            </ScrollLink>
          ))}
          <ScrollLink
             to="cta"
             smooth={true}
             duration={800}
          >
            <button className="px-5 py-2 rounded-full border border-vc-mint text-vc-mint text-sm font-semibold hover:bg-vc-mint hover:text-[#0D2B2B] transition-all">
              Join Now
            </button>
          </ScrollLink>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0D2B2B] border-t border-white/10"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <ScrollLink
                  key={link.name}
                  to={link.to}
                  smooth={true}
                  duration={800}
                  offset={-100}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-gray-300 hover:text-vc-mint cursor-pointer transition-colors"
                >
                  {link.name}
                </ScrollLink>
              ))}
              <ScrollLink
                 to="cta"
                 smooth={true}
                 duration={800}
                 onClick={() => setIsOpen(false)}
              >
                  <button className="w-full py-3 rounded-lg bg-vc-mint text-[#0D2B2B] font-bold mt-2">
                    Join Now
                  </button>
              </ScrollLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
