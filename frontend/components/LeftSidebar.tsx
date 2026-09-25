import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Menu, 
  X, 
  LogIn, 
  Lock,
  Sparkles, 
  BookOpen, 
  FileText, 
  Cpu, 
  Award, 
  GraduationCap, 
  Mail, 
  ChevronRight
} from 'lucide-react';
import { SOCIAL_LINKS } from './SocialIcons';

export default function LeftSidebar() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filter key social links to feature vertically like the reference
  const primarySocialIds = ['x', 'facebook', 'youtube', 'instagram', 'github', 'scholar', 'linkedin'];
  const verticalSocials = SOCIAL_LINKS.filter(s => primarySocialIds.includes(s.id));

  const quickNav = [
    { name: 'Home / Overview', href: '/', icon: Cpu },
    { name: 'About Professor', href: '/about', icon: GraduationCap },
    { name: 'Research Lab', href: '/research', icon: Cpu },
    { name: 'Projects', href: '/projects', icon: BookOpen },
    { name: 'Publications', href: '/publications', icon: FileText },
    { name: 'Patents & IP', href: '/patents', icon: Award },
    { name: 'Contact & Lab', href: '/contact', icon: Mail },
  ];

  return (
    <>
      {/* =========================================================================
          SLIM VERTICAL DOCK (DESKTOP)
      ========================================================================== */}
      <aside 
        aria-label="Side Navigation & Social Channels"
        className="hidden md:flex fixed top-0 left-0 bottom-0 w-16 z-50 flex-col items-center justify-between py-4 bg-[#041220]/95 backdrop-blur-xl border-r border-white/[0.08] shadow-[4px_0_24px_rgba(0,0,0,0.35)] transition-all duration-300"
      >
        {/* TOP SECTION: Avatar & Menu Toggle */}
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Avatar with Status Dot */}
          <Link 
            href="/about" 
            title="Dr. Prabh Deep Singh — Profile"
            className="group relative w-10 h-10 rounded-full overflow-hidden border border-[#2DD4BF]/50 shadow-[0_0_12px_rgba(45,212,191,0.25)] hover:scale-105 transition-all duration-200"
          >
            <img
              src="/professor-photo.jpg"
              alt="Dr. Prabh Deep Singh"
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
            />
            {/* Live Green Online Dot */}
            <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-[#041220] shadow-[0_0_6px_#10B981]" />
          </Link>

          {/* Drawer Menu Button (Hamburger) */}
          <button
            type="button"
            onClick={() => setDrawerOpen(!drawerOpen)}
            title={drawerOpen ? "Close Quick Directory" : "Open Quick Directory"}
            aria-label="Toggle Quick Directory"
            className={`
              w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200
              ${drawerOpen 
                ? 'bg-[#0D9488] text-white shadow-[0_0_12px_rgba(13,148,136,0.5)]' 
                : 'text-slate-300 hover:text-white hover:bg-white/[0.08] active:scale-95'
              }
            `}
          >
            {drawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Subtle separator */}
          <div className="w-8 h-[1px] bg-white/[0.08] my-1" />
        </div>

        {/* MIDDLE SECTION: Vertical Social Icons */}
        <div className="flex flex-col items-center gap-2.5 my-auto">
          {verticalSocials.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.ariaLabel}
                className="group relative w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Icon className="w-4 h-4 transition-colors group-hover:text-[#5EEAD4]" />

                {/* Right-sliding Tooltip */}
                <div className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide bg-[#071E33]/95 text-white border border-[#2DD4BF]/30 shadow-[0_4px_16px_rgba(0,0,0,0.5)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 whitespace-nowrap z-50">
                  {item.name}
                  {/* Small pointer */}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 -mr-[1px] border-4 border-transparent border-r-[#071E33]" />
                </div>
              </a>
            );
          })}
        </div>

        {/* BOTTOM SECTION: Admin Portal Shortcut */}
        <div className="flex flex-col items-center gap-2 w-full">
          {/* Subtle separator */}
          <div className="w-8 h-[1px] bg-white/[0.08] mb-1" />

          <Link
            href="/admin"
            title="Faculty Admin Portal"
            className="group relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#5EEAD4] hover:bg-white/[0.08] transition-all duration-200 active:scale-95"
          >
            <Lock className="w-4 h-4 text-[#2DD4BF] group-hover:scale-110 transition-transform" />

            {/* Right-sliding Tooltip */}
            <div className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide bg-[#071E33]/95 text-white border border-[#2DD4BF]/30 shadow-[0_4px_16px_rgba(0,0,0,0.5)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 whitespace-nowrap z-50">
              Faculty Admin Portal
              <span className="absolute right-full top-1/2 -translate-y-1/2 -mr-[1px] border-4 border-transparent border-r-[#071E33]" />
            </div>
          </Link>
        </div>
      </aside>

      {/* =========================================================================
          SLIDE-OUT QUICK DIRECTORY DRAWER (Opens when Hamburger is clicked)
      ========================================================================== */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer content (Positioned next to the left dock) */}
          <div className="relative md:left-16 w-80 max-w-[85vw] h-full bg-[#05172A] border-r border-[#2DD4BF]/20 shadow-[8px_0_36px_rgba(0,0,0,0.6)] flex flex-col justify-between p-6 z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-[#2DD4BF]/40">
                    <img src="/professor-photo.jpg" alt="Dr. Prabh Deep Singh" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white leading-tight">Dr. Prabh Deep Singh</h3>
                    <p className="text-[10px] font-mono text-[#2DD4BF] uppercase tracking-wider">AI & Healthcare Lab</p>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-4 space-y-1">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2 mb-2">Quick Navigation</p>
                {quickNav.map((link) => {
                  const Icon = link.icon;
                  const isActive = router.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`
                        flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all
                        ${isActive 
                          ? 'bg-[#0D9488] text-white shadow-[0_2px_10px_rgba(13,148,136,0.3)]' 
                          : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#2DD4BF]" />
                        <span>{link.name}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    </Link>
                  );
                })}
              </div>

              {/* AI Chat Shortcut */}
              <div className="pt-2">
                <Link
                  href="/ai-assistant"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#0D9488] to-[#0F766E] text-white text-xs font-semibold shadow-[0_4px_16px_rgba(13,148,136,0.3)] hover:brightness-110 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
                  <span>Chat with ProfAI Assistant</span>
                </Link>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-white/[0.08] text-center">
              <p className="text-[11px] text-slate-400">
                Department of Computer Science & Engineering
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
