import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Sparkles, Menu, X, Atom, Lock } from 'lucide-react';
import SocialIcons from './SocialIcons';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.pathname]);

  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Research', href: '/research' },
    { name: 'Projects', href: '/projects' },
    { name: 'Publications', href: '/publications' },
    { name: 'Patents', href: '/patents' },
    { name: 'Awards', href: '/awards' },
    { name: 'Teaching', href: '/teaching' },
    { name: 'Blog', href: '/blog' },
    { name: 'Updates', href: '/updates' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`
        sticky top-0 z-40
        transition-all duration-300
        bg-[#071A2B]/95
        backdrop-blur-xl
        border-b
        ${scrolled
          ? 'border-[#2DD4BF]/20 shadow-[0_8px_30px_rgba(0,0,0,0.25)]'
          : 'border-white/[0.08]'
        }
      `}
    >
      {/* Top micro cyan accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2DD4BF]/60 to-transparent" />

      {/* Main Single Navbar Row */}
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex justify-between items-center gap-4">
        {/* Brand: Atom Logo + Name */}
        <Link href="/" className="flex items-center space-x-3 group shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[#0E334E]/60 border border-[#2DD4BF]/40 flex items-center justify-center shadow-[0_0_12px_rgba(45,212,191,0.25)] group-hover:border-[#2DD4BF] transition-all">
            <Atom className="w-5 h-5 text-[#2DD4BF] group-hover:rotate-180 transition-transform duration-700" />
          </div>

          <div>
            <span className="font-heading text-[15px] sm:text-[17px] font-semibold tracking-[-0.01em] text-white group-hover:text-[#5EEAD4] transition-colors leading-tight block">
              Dr. Prabh Deep Singh
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-[#2DD4BF] uppercase tracking-[0.16em] block mt-0.5 font-medium">
              AI & Healthcare Lab
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navLinks.map((link) => {
            const isActive = router.pathname === link.href || (router.pathname === '/' && link.name === 'About');

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative
                  py-1.5
                  text-[13px]
                  font-medium
                  whitespace-nowrap
                  transition-colors
                  duration-200
                  ${isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                  }
                `}
              >
                {link.name}

                {/* Active Indicator Underline */}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-[19px] h-[2.5px] rounded-full bg-[#2DD4BF] shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* AI Chat Button */}
          <Link
            href="/ai-assistant"
            className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-[#0D9488] to-[#0F766E] hover:from-[#14B8A6] hover:to-[#0D9488] text-white border border-[#5EEAD4]/30 text-xs font-semibold shadow-[0_4px_16px_rgba(13,148,136,0.3)] hover:shadow-[0_4px_22px_rgba(45,212,191,0.45)] transition-all duration-200 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FDE047] group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-medium">Chat with ProfAI</span>
          </Link>

          {/* Faculty Admin Portal Button */}
          <Link
            href="/admin"
            title="Faculty Administration Portal"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-white/70 bg-white/[0.04] border border-white/[0.12] hover:text-white hover:bg-white/[0.09] hover:border-[#2DD4BF]/50 hover:shadow-[0_0_12px_rgba(45,212,191,0.25)] transition-all duration-200"
          >
            <Lock className="w-3.5 h-3.5 text-[#2DD4BF]" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-white/80 bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.1] hover:text-white transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#081D30] border-t border-white/[0.08] px-4 sm:px-6 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
          {/* Mobile Social Media Icons */}
          <div className="pb-3.5 mb-3 border-b border-white/[0.08] flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono text-[#2DD4BF] uppercase tracking-[0.14em] font-medium">
              Connect & Follow
            </span>
            <SocialIcons iconSize="w-3.5 h-3.5" showTooltips={false} className="flex-wrap justify-center" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-4 border-b border-white/[0.08]">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href || (router.pathname === '/' && link.name === 'About');

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-3 py-2.5 rounded-lg text-xs font-medium text-center transition-all duration-200 border
                    ${isActive
                      ? 'bg-[#0F766E] text-white border-[#2DD4BF]/40 shadow-[0_2px_10px_rgba(15,118,110,0.3)]'
                      : 'bg-white/[0.035] text-white/70 border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
                    }
                  `}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <Link
              href="/ai-assistant"
              className="flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#0D9488] text-white px-4 py-2.5 rounded-lg text-sm font-medium border border-[#5EEAD4]/30 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#FDE047]" />
              <span>Chat with ProfAI Digital Twin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}