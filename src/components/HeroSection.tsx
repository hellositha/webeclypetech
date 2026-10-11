'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowRight,
  Server,
  Cloud,
  CheckCircle2,
  CalendarCheck,
  Calculator,
  Terminal,
  Activity,
  Zap,
} from 'lucide-react';
import { COMPANY_INFO } from '@/data/companyData';

interface HeroSectionProps {
  onOpenInquiry: (serviceId?: string) => void;
}

export function HeroSection({ onOpenInquiry }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-slate-950">
      {/* Background cyber grid & glow effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-500/10 border border-sky-500/30 text-sky-400 mb-6 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Integrated IT Solutions &amp; Services Provider</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Enterprise IT Infrastructure,{' '}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Cloud &amp; Business Software
            </span>
          </h1>

          {/* Mission Statement */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 max-w-3xl mx-auto backdrop-blur-md shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-1">
              Our Mission
            </p>
            <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
              &ldquo;{COMPANY_INFO.mission}&rdquo;
            </p>
          </div>

          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Your single trusted partner for Data Centers, 24/7 Managed NOC, Biometric HRM, Enterprise ERP, IP CCTV surveillance, and Zero-Trust Network Defense.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/consultation"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xl shadow-sky-600/30 transition-all hover:scale-[1.02]"
            >
              <CalendarCheck className="w-5 h-5" />
              Book Technical Consultation
            </Link>

            <button
              onClick={() => onOpenInquiry()}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600 transition-all shadow-md"
            >
              <span>Get Custom Quote</span>
              <ArrowRight className="w-4 h-4 text-sky-400" />
            </button>

            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/60 transition-all"
            >
              <Calculator className="w-4 h-4 text-cyan-400" />
              Project Cost Estimator
            </Link>
          </div>

          {/* Quick trust metrics strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            {COMPANY_INFO.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>{stat.label}</span>
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-2xl font-black text-white tracking-tight flex items-baseline gap-1">
                  {stat.value}
                  {stat.suffix && (
                    <span className="text-xs font-normal text-slate-400">{stat.suffix}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Architecture Console Preview */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-lg">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                eclypetech-core-telemetry ~ cluster-status
              </span>
            </div>
            <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              POSTGRESQL DB CONNECTED &bull; 4 DIVISIONS OPERATIONAL
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="text-sky-400 font-bold mb-1 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" /> [DIV-01] INFRASTRUCTURE
              </div>
              <p className="text-slate-300">Tier III Data Center SAN/Cabling</p>
              <p className="text-slate-500 mt-1">CCTV AI NVR • Biometrics Active</p>
              <div className="mt-2 text-emerald-400 text-[10px]">● Redundant Core OK</div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="text-cyan-400 font-bold mb-1 flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5" /> [DIV-02] CLOUD &amp; NOC
              </div>
              <p className="text-slate-300">Azure &bull; M365 Enterprise Sync</p>
              <p className="text-slate-500 mt-1">Immutable Backup 15m RPO</p>
              <div className="mt-2 text-emerald-400 text-[10px]">● 24/7 Managed NOC Live</div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="text-purple-400 font-bold mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> [DIV-03] SOFTWARE SUITE
              </div>
              <p className="text-slate-300">HRM &bull; ERP &bull; CRM &bull; Stock</p>
              <p className="text-slate-500 mt-1">Multi-Warehouse Barcodes &bull; Payroll</p>
              <div className="mt-2 text-emerald-400 text-[10px]">● Ledger Sync Synchronized</div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> [DIV-04] CONSULTING &amp; API
              </div>
              <p className="text-slate-300">Enterprise System Integration</p>
              <p className="text-slate-500 mt-1">Custom API Bridges &bull; Migration</p>
              <div className="mt-2 text-emerald-400 text-[10px]">● SLA Response &lt; 10m</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
