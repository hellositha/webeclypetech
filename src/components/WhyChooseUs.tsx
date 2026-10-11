'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  ArrowRight,
  TrendingUp,
  Headphones,
  Sliders,
  PiggyBank,
  Network,
  CheckCircle2,
} from 'lucide-react';
import { WHY_CHOOSE_US, COMPANY_INFO } from '@/data/companyData';
import { ServiceIcon } from '@/components/ServiceIcon';

export function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background cyber accent elements */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-blue-600/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-sky-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
            <Award className="w-3.5 h-3.5" />
            Competitive Advantage &amp; Value Delivery
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Why Choose ECLYPE Technology?
          </h2>
          <p className="mt-3 text-slate-400 text-base sm:text-lg">
            Built on engineering excellence, predictable SLAs, and a steadfast commitment to your long-term operational success.
          </p>
        </div>

        {/* 6 Key Value Pillars from Prompt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {WHY_CHOOSE_US.map((pillar, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-sky-500/40 hover:bg-slate-900/90 transition-all duration-300 relative overflow-hidden backdrop-blur-sm hover:-translate-y-1 shadow-lg shadow-slate-950"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sky-400 group-hover:text-cyan-300 group-hover:border-sky-500/40 transition-colors">
                  <ServiceIcon name={pillar.iconName} className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-white font-mono block">
                    {pillar.metric}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    {pillar.metricLabel}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                {pillar.title}
              </h3>

              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                {pillar.description}
              </p>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-sky-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enterprise SLA Guarantee</span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Credo Card */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
              The ECLYPE Technology Guarantee
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {COMPANY_INFO.visionStatement}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We eliminate finger-pointing between multiple vendors by integrating hardware, structured cabling, cybersecurity, cloud orchestration, and enterprise ERP software under one unified SLA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href="/consultation"
              className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-600/30 flex items-center gap-2"
            >
              <span>Schedule Architecture Review</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/calculator"
              className="px-5 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-sm font-medium transition-colors"
            >
              Instant Cost Estimator
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
