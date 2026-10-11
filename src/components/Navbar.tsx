'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Layers,
  Calculator,
  CalendarCheck,
  PhoneCall,
  Lock,
  ArrowRight,
  Server,
  Cloud,
  LayoutGrid,
  Cpu,
  Zap,
  Mail,
} from 'lucide-react';
import { COMPANY_INFO, DIVISIONS } from '@/data/companyData';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const pathname = usePathname();

  const divisionIcons: Record<string, React.ReactNode> = {
    infrastructure: <Server className="w-4 h-4 text-sky-400" />,
    cloud: <Cloud className="w-4 h-4 text-cyan-400" />,
    software: <LayoutGrid className="w-4 h-4 text-purple-400" />,
    consulting: <Cpu className="w-4 h-4 text-emerald-400" />,
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      {/* Top Banner Notice */}
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 text-xs bg-slate-900/90 border-b border-slate-800/40 text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-sky-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            24/7 Managed NOC & SOC Active
          </span>
          <span className="text-slate-600">|</span>
          <span>Enterprise SLA: &lt; 10 min response</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">ISO 27001 &amp; SOC 2 Aligned Architecture</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            className="flex items-center gap-1 hover:text-sky-300 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
            <span>{COMPANY_INFO.phone}</span>
          </a>
          <span className="text-slate-600">|</span>
          <Link
            href="/webmail"
            className="flex items-center gap-1 text-slate-300 hover:text-sky-400 transition-colors font-medium"
          >
            <Mail className="w-3 h-3 text-sky-400" />
            <span>Webmail</span>
          </Link>
          <span className="text-slate-600">|</span>
          <Link
            href="/admin"
            className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors font-medium"
          >
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-shadow">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-sky-300 transition-colors">
                  ECLYPE <span className="text-sky-400">Technology</span>
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium hidden sm:block">
                Integrated IT Solutions
              </p>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === '/' ? 'text-sky-400 bg-sky-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <Link
                href="/services"
                className={`px-3 py-2 text-sm font-medium rounded-lg inline-flex items-center gap-1 transition-colors ${
                  pathname.startsWith('/services') || pathname === '/ups-solutions' || pathname === '/voip-pbx-solutions'
                    ? 'text-sky-400 bg-sky-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Services
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </Link>

              {servicesDropdown && (
                <div className="absolute top-full left-0 w-88 bg-slate-900/98 border border-slate-800 rounded-2xl shadow-2xl p-3.5 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  {/* Featured Solutions Suites */}
                  <div className="mb-2.5 pb-2.5 border-b border-slate-800/80 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold px-2 block mb-1">
                      Featured Solutions Suites
                    </span>

                    {/* VoIP PBX & Call Center Suite */}
                    <Link
                      href="/services/voip-pbx-solutions"
                      className="flex items-start gap-3 p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                            VoIP PBX &amp; Call Center
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-400 text-slate-950 font-black">
                            FEATURED
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          SIP Trunks, Dual-Language IVR, Unlimited Ext.
                        </p>
                      </div>
                    </Link>

                    {/* UPS Solutions */}
                    <Link
                      href="/services/ups-solutions"
                      className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                            UPS Solutions &amp; Thermal
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                            FEATURED
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          UPS Systems, Li-ion Batteries, In-Row &amp; Liquid Cooling
                        </p>
                      </div>
                    </Link>
                  </div>

                  {/* 4 Practice Divisions */}
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1">
                    Our 4 Practice Divisions
                  </div>
                  <div className="space-y-0.5">
                    {DIVISIONS.map((div) => (
                      <Link
                        key={div.id}
                        href={`/divisions#${div.id}`}
                        className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="mt-0.5 p-1 rounded-md bg-slate-950 border border-slate-800 group-hover:border-slate-700">
                          {divisionIcons[div.id]}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-400 transition-colors">
                            {div.name}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            {div.mainServices}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Bottom link to all services */}
                  <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 px-2 flex justify-between items-center text-xs">
                    <Link
                      href="/services"
                      className="text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1"
                    >
                      <span>Explore All 10 Core Services</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/divisions"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === '/divisions'
                  ? 'text-sky-400 bg-sky-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Divisions Matrix
            </Link>

            <Link
              href="/#solution-matcher"
              className="px-3 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              Solution Finder
            </Link>

            <Link
              href="/calculator"
              className={`px-3 py-2 text-sm font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors ${
                pathname === '/calculator'
                  ? 'text-sky-400 bg-sky-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4 text-cyan-400" />
              Cost Estimator
            </Link>

            <Link
              href="/#why-us"
              className="px-3 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              Why Us
            </Link>

            <Link
              href="/contact"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === '/contact'
                  ? 'text-sky-400 bg-sky-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/consultation"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 shadow-md shadow-sky-600/30 transition-all hover:scale-[1.02]"
            >
              <CalendarCheck className="w-4 h-4" />
              Book Consultation
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/consultation"
              className="px-3 py-1.5 text-xs font-semibold bg-sky-600 text-white rounded-lg"
            >
              Consult
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-900"
          >
            Home
          </Link>
          {/* Services Group */}
          <div className="space-y-1">
            <Link
              href="/services"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-semibold text-white hover:bg-slate-900"
            >
              Services &amp; Solutions
            </Link>
            <div className="pl-3 space-y-1">
              <Link
                href="/services/voip-pbx-solutions"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"
              >
                <span className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-blue-400" />
                  VoIP PBX &amp; Call Center
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-400 text-slate-950 font-black">
                  NEW
                </span>
              </Link>
              <Link
                href="/services/ups-solutions"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  UPS Solutions &amp; Thermal Suite
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                  FEATURED
                </span>
              </Link>
              <Link
                href="/services"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-1 rounded-md text-xs text-slate-400 hover:text-sky-400"
              >
                &bull; View All 10 Core Services &rarr;
              </Link>
            </div>
          </div>
          <Link
            href="/divisions"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-900"
          >
            Our 4 Divisions
          </Link>
          <Link
            href="/calculator"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-900"
          >
            Cost Estimator
          </Link>
          <Link
            href="/consultation"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-900"
          >
            Book Free Consultation
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-900"
          >
            Contact &amp; 24/7 Helpdesk
          </Link>
          <Link
            href="/webmail"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-sky-400 hover:bg-slate-900 border border-sky-500/30"
          >
            <Mail className="w-4 h-4 inline mr-2 text-sky-400" />
            Webmail Portal
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-emerald-400 hover:bg-slate-900 border border-emerald-500/30"
          >
            Admin Dashboard
          </Link>
        </div>
      )}
    </header>
  );
}
