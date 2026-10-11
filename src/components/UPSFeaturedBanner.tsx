'use client';

import React from 'react';
import Link from 'next/link';
import {
  Zap,
  BatteryCharging,
  Snowflake,
  Wrench,
  Box,
  Droplets,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export function UPSFeaturedBanner() {
  const spotlightItems = [
    {
      title: 'Modular UPS Systems',
      category: '1kVA - 800kVA',
      description:
        'Zero transfer time (VFI-SS-111) double-conversion online architecture with 99.2% ECO mode efficiency and hot-swap modules.',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      badge: '0ms Transfer',
      href: '/ups-solutions#ups-systems',
    },
    {
      title: 'LiFePO4 Battery Storage',
      category: 'Energy Storage',
      description:
        'Advanced Lithium-Ion battery cabinets with 3-tier BMS, 15-year design lifespan, and 60% floor space reduction over VRLA.',
      icon: <BatteryCharging className="w-5 h-5 text-emerald-400" />,
      badge: '15-Yr Lifespan',
      href: '/ups-solutions#battery-replacement',
    },
    {
      title: 'Precision In-Row Cooling',
      category: 'Thermal Management',
      description:
        'Close-coupled in-row air conditioning and cold/hot aisle containment targeting sub-1.25 Data Center PUE.',
      icon: <Snowflake className="w-5 h-5 text-cyan-400" />,
      badge: 'PUE < 1.25',
      href: '/ups-solutions#cooling-solutions',
    },
    {
      title: '24/7 UPS Service & PM',
      category: 'Mission-Critical SLA',
      description:
        'Guaranteed 2-hour emergency dispatch, resistive load bank testing, FLIR infrared thermography, and capacitor overhauls.',
      icon: <Wrench className="w-5 h-5 text-sky-400" />,
      badge: '< 2 Hr SLA',
      href: '/ups-solutions#ups-service-maintenance',
    },
    {
      title: 'Containerised Data Centers',
      category: 'Prefabricated Edge',
      description:
        'All-in-one 20ft/40ft weatherproof ISO containers with pre-integrated UPS, in-row cooling, gas fire suppression, and racks in 4 weeks.',
      icon: <Box className="w-5 h-5 text-teal-400" />,
      badge: '4-Wk Deploy',
      href: '/ups-solutions#containerised-data-centers',
    },
    {
      title: 'High-Density Liquid Cooling',
      category: 'AI & HPC Computing',
      description:
        'Direct-to-Chip (D2C) cold plates and Liquid Distribution Units (CDU) handling 100kW+ per rack for NVIDIA AI GPU clusters.',
      icon: <Droplets className="w-5 h-5 text-indigo-400" />,
      badge: '100kW+ / Rack',
      href: '/ups-solutions#liquid-cooling',
    },
  ];

  return (
    <section className="py-20 bg-slate-950 border-t border-b border-slate-800/80 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-10 w-72 h-72 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-slate-800">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5" />
              SPECIALIZED CRITICAL POWER &amp; DATA CENTER INFRASTRUCTURE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Enterprise UPS Systems, Thermal &amp; Containerised Facilities
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Power disruptions and thermal bottlenecks threaten modern digital operations. ECLYPE Technology delivers end-to-end mission-critical power architectures, battery energy storage, precision cooling, and modular edge data centers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/ups-solutions#sizing-modeler"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-colors flex items-center gap-2"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sizing Modeler</span>
            </Link>
            <Link
              href="/ups-solutions"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            >
              <span>Explore Complete UPS Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 6 Spotlight Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spotlightItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-slate-700 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-amber-400">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    {item.category}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-amber-300 transition-colors">
                <span>View Architecture &amp; Specs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Hotline Bottom Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Need an On-Site Power or Cooling Assessment?</div>
              <div className="text-[11px] text-slate-400">
                Our certified engineers conduct load-bank testing, thermal imaging, and runtime analysis.
              </div>
            </div>
          </div>

          <Link
            href="/ups-solutions#sizing-modeler"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white shrink-0 transition-colors"
          >
            Request Power Assessment &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
