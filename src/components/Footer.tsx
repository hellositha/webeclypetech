'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Zap,
  PhoneCall,
} from 'lucide-react';
import { COMPANY_INFO, DIVISIONS, CORE_SERVICES } from '@/data/companyData';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-300">
      {/* Upper Newsletter & Mission Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Industry Insights &amp; IT Bulletins
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Stay ahead of enterprise IT &amp; cybersecurity trends
              </h3>
              <p className="mt-2 text-slate-400 text-sm max-w-xl">
                Get monthly deep dives on cloud infrastructure, zero-trust network hardening, ERP modernization, and proactive maintenance direct from ECLYPE Technology engineers.
              </p>
            </div>
            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your enterprise email..."
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      'Joining...'
                    ) : (
                      <>
                        Subscribe <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                {status === 'success' && (
                  <p className="text-emerald-400 text-xs flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {message}
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-rose-400 text-xs mt-1">{message}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  ECLYPE <span className="text-sky-400">Technology</span>
                </span>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Integrated IT Solutions &amp; Services Provider
                </p>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              <strong className="text-slate-200">Our Mission:</strong> {COMPANY_INFO.mission}
            </p>

            <div className="space-y-2 pt-2 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-white transition-colors">
                  {COMPANY_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white transition-colors">
                  {COMPANY_INFO.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{COMPANY_INFO.hours}</span>
              </div>
            </div>
          </div>

          {/* 4 Divisions */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Core Divisions
            </h4>
            <ul className="space-y-2 text-sm">
              {DIVISIONS.map((div) => (
                <li key={div.id}>
                  <Link
                    href={`/divisions#${div.id}`}
                    className="text-slate-400 hover:text-sky-400 transition-colors block leading-snug"
                  >
                    {div.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/divisions"
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1"
                >
                  View Division Matrix <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Services Column 1 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Infrastructure &amp; Cloud
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {CORE_SERVICES.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="hover:text-sky-400 transition-colors block truncate"
                    title={service.title}
                  >
                    {service.number}. {service.title}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <Link
                  href="/voip-pbx-solutions"
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 text-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>VoIP PBX &amp; Call Center Suite</span>
                </Link>
                <Link
                  href="/ups-solutions"
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 text-xs transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>UPS Systems &amp; Cooling Suite</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Services Column 2 & Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Software &amp; Tools
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {CORE_SERVICES.slice(5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="hover:text-sky-400 transition-colors block truncate"
                    title={service.title}
                  >
                    {service.number}. {service.title}
                  </Link>
                </li>
              ))}
              <li className="pt-3 border-t border-slate-800 space-y-1.5">
                <Link
                  href="/calculator"
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 block"
                >
                  → IT Project Cost Estimator
                </Link>
                <Link
                  href="/consultation"
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300 block"
                >
                  → Book Technical Consultation
                </Link>
                <Link
                  href="/webmail"
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" /> Enterprise Webmail
                </Link>
                <Link
                  href="/admin"
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" /> Admin Leads Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Certifications & Compliance strip */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Certifications &amp; Standards:</span>
              {COMPANY_INFO.certifications.map((cert) => (
                <span
                  key={cert}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]"
                >
                  {cert}
                </span>
              ))}
            </div>
            <div className="text-xs text-slate-500">
              PostgreSQL Connected • High-Availability Stack
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-slate-800/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {COMPANY_INFO.legalName}. All rights reserved.</p>
          <p className="text-slate-400 italic font-medium">
            &quot;{COMPANY_INFO.visionStatement}&quot;
          </p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              Terms of SLA
            </Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              Security Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
