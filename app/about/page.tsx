'use client';

import Footer from '@/components/Footer';

import Image from 'next/image';

export default function AboutPage() {
    return (
        <main
            className="relative flex flex-col overflow-hidden"
            style={{ background: 'linear-gradient(108deg, rgba(0, 80, 74, 0.80) 0.62%, #001D1B 99.26%)' }}
        >
            {/* Decorative Pattern - Top Left (Fixed Background) */}
            <div className="fixed top-0 -left-20 md:-left-10 w-[200px] h-[400px] md:w-[300px] md:h-[600px] pointer-events-none z-0 opacity-[0.20] md:opacity-[0.35]">
                <Image
                    src="/pattern-left-v2.png"
                    alt=""
                    width={300}
                    height={620}
                    className="object-contain w-full h-full"
                    style={{ objectPosition: 'left top' }}
                />
            </div>

            {/* Decorative Pattern - Bottom Right (Fixed Background) */}
            <div className="fixed bottom-0 right-0 w-[150px] h-[150px] md:w-[250px] md:h-[250px] overflow-hidden pointer-events-none z-0">
                <div className="relative w-full h-full opacity-[0.03] md:opacity-5">
                    {/* Create organic rounded shapes */}
                    <div className="absolute bottom-0 right-0 translate-x-8 translate-y-8 md:translate-x-12 md:translate-y-12">
                        {/* Large rounded rectangle */}
                        <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-24 h-14 md:w-48 md:h-28 rounded-[1.5rem] md:rounded-[2rem] bg-white" />
                        {/* Medium square */}
                        <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-12 h-12 md:w-24 md:h-24 rounded-[0.75rem] md:rounded-[1.5rem] bg-vc-teal" />
                        {/* Small rounded rectangle */}
                        <div className="absolute bottom-20 right-2 md:bottom-40 md:right-4 w-10 h-8 md:w-20 md:h-14 rounded-[0.75rem] md:rounded-[1.5rem] bg-white/70" />
                    </div>
                </div>
            </div>

            {/* Background Lights - it looks noisy i may remove it */}
            {/* <BackgroundLights /> */}

            {/* Content */}
            <div className="relative z-10 flex flex-col w-[111.11%] -ml-[5.555%] origin-top mb-[-45%] md:mb-[-10%]" style={{ transform: 'scale(0.9)' }}>
                {/* About Section */}
                <section className="relative min-h-screen flex items-center pt-32 pb-20">
                    <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 relative z-10">
                        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 md:gap-6">
                            <div className="text-center">
                                {/* Title */}
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 font-poppins uppercase tracking-tighter leading-tight whitespace-nowrap">
                                    <span
                                        className="text-transparent bg-clip-text"
                                        style={{ backgroundImage: 'linear-gradient(to bottom right, #ffffff, #ffffff, #23bcab)' }}
                                    >
                                        What is Venture Craft
                                    </span>
                                </h1>

                                {/* First Paragraph */}
                                <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed mb-4 md:mb-6 font-poppins">
                                    Venture Craft is KFUPM's premier international deep-tech startup competition,
                                    designed to inspire and empower the next generation of innovators. With a focus
                                    on sustainability and cutting-edge technology, we bring together talented students,
                                    researchers, and recent graduates from around the world to transform bold ideas
                                    into impactful solutions.
                                </p>

                                {/* Second Paragraph */}
                                <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed font-poppins">
                                    Through a comprehensive program of mentorship, resources, and global exposure,
                                    Venture Craft provides participants with the tools they need to succeed in the
                                    competitive landscape of deep-tech entrepreneurship. Join us in shaping the
                                    future of energy, industry, and sustainable innovation.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* KFUPM Section */}
                <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/kfupm-bg.png"
                            alt="KFUPM Campus"
                            fill
                            className="object-contain object-center opacity-[0.15] invert"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#001D1B]/30 to-[#001D1B]" />
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 relative z-10">
                        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 md:gap-6">
                            <div className="text-center">
                                {/* Title */}
                                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 font-poppins uppercase tracking-tighter leading-tight">
                                    <span
                                        className="text-transparent bg-clip-text"
                                        style={{ backgroundImage: 'linear-gradient(to bottom right, #ffffff, #ffffff, #23bcab)' }}
                                    >
                                        KFUPM
                                    </span>
                                </h2>

                                {/* Subtitle */}
                                <p className="text-vc-mint text-lg md:text-xl font-semibold mb-8 font-poppins">
                                    King Fahd University of Petroleum & Minerals
                                </p>

                                {/* Rankings Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12 w-full max-w-4xl mx-auto">
                                    {/* Card 1 */}
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-vc-teal/50 hover:bg-white/10 transition-all duration-300">
                                        <p className="text-4xl md:text-5xl font-bold text-vc-mint mb-2 font-poppins">67th</p>
                                        <p className="text-white/60 text-sm md:text-base font-poppins">QS World University Rankings 2026</p>
                                    </div>

                                    {/* Card 2 */}
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-vc-teal/50 hover:bg-white/10 transition-all duration-300">
                                        <p className="text-4xl md:text-5xl font-bold text-vc-mint mb-2 font-poppins">1st</p>
                                        <p className="text-white/60 text-sm md:text-base font-poppins">Middle East and Africa Rankings by THE</p>
                                    </div>

                                    {/* Card 3 */}
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-vc-teal/50 hover:bg-white/10 transition-all duration-300">
                                        <p className="text-4xl md:text-5xl font-bold text-vc-mint mb-2 font-poppins">5th</p>
                                        <p className="text-white/60 text-sm md:text-base font-poppins">Petroleum Engineering Ranking by QS</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed mb-4 md:mb-6 font-poppins max-w-3xl mx-auto">
                                    KFUPM is Saudi Arabia's leading research university, renowned for its excellence
                                    in science, engineering, and technology. As a global hub for innovation, KFUPM
                                    is committed to preparing leaders who drive economic transformation and sustainable
                                    development.
                                </p>

                                {/* Second Paragraph */}
                                <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed font-poppins max-w-3xl mx-auto">
                                    Through Venture Craft, KFUPM extends its mission beyond traditional education,
                                    creating a platform where brilliant minds from around the world can collaborate,
                                    innovate, and bring deep-tech solutions to life that address the world's most
                                    pressing energy and sustainability challenges.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* DTV Section */}
                <section className="relative min-h-screen flex items-center py-20 overflow-hidden border-t border-white/5">

                    <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 relative z-10">
                        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 md:gap-6">
                            <div className="text-center">
                                {/* Title */}
                                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 font-poppins uppercase tracking-tighter leading-tight">
                                    <span
                                        className="text-transparent bg-clip-text"
                                        style={{ backgroundImage: 'linear-gradient(to bottom right, #ffffff, #ffffff, #23bcab)' }}
                                    >
                                        Dhahran Techno Valley
                                    </span>
                                </h2>

                                {/* Subtitle */}
                                <p className="text-vc-mint text-lg md:text-xl font-semibold mb-8 font-poppins">
                                    The Global Hub of Choice for Technology & Innovation
                                </p>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12 w-full max-w-4xl mx-auto">
                                    {/* Card 1 */}
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-vc-teal/50 hover:bg-white/10 transition-all duration-300">
                                        <p className="text-4xl md:text-5xl font-bold text-vc-mint mb-2 font-poppins">20+</p>
                                        <p className="text-white/60 text-sm md:text-base font-poppins">Specialized R&D Centers</p>
                                    </div>

                                    {/* Card 2 */}
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-vc-teal/50 hover:bg-white/10 transition-all duration-300">
                                        <p className="text-4xl md:text-5xl font-bold text-vc-mint mb-2 font-poppins">1,750+</p>
                                        <p className="text-white/60 text-sm md:text-base font-poppins">Professionals</p>
                                    </div>

                                    {/* Card 3 */}
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-vc-teal/50 hover:bg-white/10 transition-all duration-300">
                                        <p className="text-4xl md:text-5xl font-bold text-vc-mint mb-2 font-poppins">520+</p>
                                        <p className="text-white/60 text-sm md:text-base font-poppins">Patents Claimed</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed mb-4 md:mb-6 font-poppins max-w-3xl mx-auto">
                                    Dhahran Techno Valley (DTV) is Saudi Arabia's leading hub for energy, sustainability, and
                                    innovation. In partnership with KFUPM and leading global corporations, DTV connects exceptional
                                    research talent with tailored startup programs, early-stage funding, and a thriving innovation ecosystem.
                                </p>

                                {/* Second Paragraph */}
                                <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed font-poppins max-w-3xl mx-auto">
                                    With a mission to transform bold ideas into real-world impact, DTV targets supporting 160 deep-tech
                                    startups by 2027. Through initiatives like the Dream Realization Lab and the National Semiconductor Hub,
                                    participants are empowered to shape the future of technology in line with Vision 2030.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div >
            <Footer />
        </main >
    );
}
