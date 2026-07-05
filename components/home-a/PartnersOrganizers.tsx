'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PartnersOrganizers() {
  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #001a15 0%, #00120F 100%)' }}
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#4FD1C5]/15 to-transparent mb-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-4 block">
            Institutional Partners
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-5">
            The Organizations Behind VentureCraft
          </h2>
        </motion.div>

        {/* Main organizers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          {[
            {
              badge: 'Organized by',
              name: 'KFUPM',
              full: 'King Fahd University of Petroleum & Minerals',
              desc: 'One of the top research universities in the Middle East, KFUPM leads science, engineering, and deep-tech innovation in the Gulf region.',
              href: 'https://www.kfupm.edu.sa',
              accent: true,
            },
            {
              badge: 'In collaboration with',
              name: 'DTV',
              full: 'Dhahran Tech Valley',
              desc: 'A world-class innovation ecosystem in Dhahran, connecting startups, researchers, and industry leaders to accelerate deep-tech ventures.',
              href: 'https://www.dtv.com.sa',
              accent: false,
            },
          ].map((org) => (
            <motion.a
              key={org.name}
              href={org.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className={`block rounded-3xl p-8 border transition-all duration-400 ${
                org.accent
                  ? 'border-[#4FD1C5]/25 bg-[#4FD1C5]/5'
                  : 'border-white/8 bg-white/3'
              }`}
            >
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/35 font-bold mb-3">{org.badge}</div>
              <div className="text-3xl font-black text-white mb-1">{org.name}</div>
              <div className="text-sm text-[#4FD1C5] font-semibold mb-4">{org.full}</div>
              <p className="text-white/40 text-sm leading-relaxed">{org.desc}</p>
            </motion.a>
          ))}
        </div>

        {/* Sponsor placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-white/20 text-sm font-medium">
            Partner and sponsor logos to be announced · Contact us to become a partner
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-[#4FD1C5]/70 hover:text-[#4FD1C5] transition-colors"
          >
            Become a Partner →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
