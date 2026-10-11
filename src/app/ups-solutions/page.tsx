'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import {
  Zap,
  BatteryCharging,
  Snowflake,
  Wrench,
  Cpu,
  Server,
  Box,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  CalendarCheck,
  Clock,
  Download,
  Sliders,
  Activity,
  Layers,
  ChevronRight,
  FileText,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import {
  UPS_SOLUTION_SECTIONS,
  FEATURED_UPS_PRODUCTS,
  UPS_SERVICE_PLANS,
  FeaturedProduct,
} from '@/data/upsData';
import { COMPANY_INFO } from '@/data/companyData';

export default function UPSSolutionsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<FeaturedProduct | null>(null);

  // Sizing Modeler State
  const [loadKva, setLoadKva] = useState<number>(30);
  const [runtimeMins, setRuntimeMins] = useState<number>(30);
  const [batteryType, setBatteryType] = useState<'lithium' | 'vrla'>('lithium');
  const [redundancy, setRedundancy] = useState<'N' | 'N+1' | '2N'>('N+1');
  const [includeCooling, setIncludeCooling] = useState<boolean>(true);
  const [includeSmartPdu, setIncludeSmartPdu] = useState<boolean>(true);
  const [specSubmitting, setSpecSubmitting] = useState<boolean>(false);
  const [specSubmitted, setSpecSubmitted] = useState<boolean>(false);
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactCompany, setContactCompany] = useState<string>('');

  const loadKvaId = useId();
  const runtimeMinsId = useId();

  // Dynamic calculations for Sizing Modeler
  const effectiveCapacityKva = redundancy === '2N' ? loadKva * 2 : redundancy === 'N+1' ? Math.ceil(loadKva * 1.3) : loadKva;
  const batteryWeightReduction = batteryType === 'lithium' ? '65%' : '0%';
  const footprintSavings = batteryType === 'lithium' ? '55% smaller' : 'Standard footprint';
  const estimatedLifespan = batteryType === 'lithium' ? '12 - 15 Years' : '4 - 6 Years';

  const getRecommendedModel = () => {
    if (effectiveCapacityKva <= 3) return 'ECLYPE EdgeProtect RT 3kVA';
    if (effectiveCapacityKva <= 10) return 'ECLYPE PowerTower Pro 10kVA';
    if (effectiveCapacityKva <= 120) return 'ECLYPE ModuPower 3-Phase (Hot-Swap)';
    return 'ECLYPE MegaGrid Facility (200kVA - 800kVA)';
  };

  const handleSpecSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpecSubmitting(true);
    try {
      const notes = `UPS Solution Sizing Request:
Load: ${loadKva} kVA | Redundancy: ${redundancy} (${effectiveCapacityKva} kVA total)
Runtime: ${runtimeMins} mins | Battery: ${batteryType === 'lithium' ? 'LiFePO4 Lithium-Ion' : 'VRLA Lead Acid'}
Include In-Row Cooling: ${includeCooling ? 'Yes' : 'No'} | Smart iPDUs: ${includeSmartPdu ? 'Yes' : 'No'}
Recommended Base Model: ${getRecommendedModel()}`;

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          company: contactCompany,
          serviceId: 'data-center',
          divisionId: 'infrastructure',
          budget: effectiveCapacityKva > 100 ? '$100,000+' : '$25,000 - $50,000',
          urgency: 'High',
          message: notes,
        }),
      });

      if (res.ok) {
        setSpecSubmitted(true);
      }
    } catch (err) {
      console.error('Failed to submit spec inquiry:', err);
    } finally {
      setSpecSubmitting(false);
    }
  };

  const getPillarIcon = (name: string) => {
    switch (name) {
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-400" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-6 h-6 text-emerald-400" />;
      case 'Snowflake':
        return <Snowflake className="w-6 h-6 text-cyan-400" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-sky-400" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-purple-400" />;
      case 'Server':
        return <Server className="w-6 h-6 text-blue-400" />;
      case 'Box':
        return <Box className="w-6 h-6 text-teal-400" />;
      case 'Droplets':
        return <Droplets className="w-6 h-6 text-indigo-400" />;
      default:
        return <Zap className="w-6 h-6 text-sky-400" />;
    }
  };

  const filteredProducts =
    activeCategory === 'all'
      ? FEATURED_UPS_PRODUCTS
      : FEATURED_UPS_PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-sky-400 font-semibold">UPS Solutions &amp; Thermal Systems</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-medium">
                <Zap className="w-3.5 h-3.5" />
                MISSION-CRITICAL POWER &amp; DATA CENTER THERMAL SUITE
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Continuous Power. <br />
                <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Precision Thermal Control.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                From modular 3-phase online double-conversion UPS systems and long-life Lithium-ion battery cabinets to precision in-row cooling, prefabricated containerised edge data centers, and 100kW+ direct-to-chip liquid cooling.
              </p>

              {/* Quick Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 pb-2">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-black text-white">0 ms</div>
                  <div className="text-[11px] text-slate-400">Transfer Time (VFI)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">99.2%</div>
                  <div className="text-[11px] text-slate-400">ECO Electrical Eff.</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-black text-sky-400">&lt; 2 Hr</div>
                  <div className="text-[11px] text-slate-400">Emergency SLA Dispatch</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-black text-indigo-400">100 kW+</div>
                  <div className="text-[11px] text-slate-400">Per Rack Liquid Cooling</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#featured-products"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-sky-600/25 flex items-center gap-2"
                >
                  <span>Featured UPS Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#sizing-modeler"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-sm transition-colors flex items-center gap-2"
                >
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Interactive Sizing &amp; Runtime</span>
                </a>
              </div>
            </div>

            {/* Right Hero Graphic Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    24/7/365 POWER TELEMETRY ACTIVE
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">TIER III / IV READY</span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Double-Conversion Online (VFI)</div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Pure sine wave output isolating sensitive IT loads from harmonics, spikes, sags, and surges.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <BatteryCharging className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">LiFePO4 Lithium Energy Storage</div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        15-year lifecycle with per-cell BMS telemetry, 3x faster recharge, and 60% floor space savings.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                      <Snowflake className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Close-Coupled Thermal Systems</div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        In-row precision cooling, aisle containment, and D2C cold-plate liquid loops for 100kW+ racks.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-sky-400" />
                    <span className="text-xs text-slate-300 font-mono">Emergency Power Dispatch:</span>
                  </div>
                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="text-xs font-bold text-white font-mono hover:text-sky-400 transition-colors"
                  >
                    {COMPANY_INFO.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. QUICK NAVIGATION STRIP */}
      {/* ------------------------------------------------------------- */}
      <section className="sticky top-20 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 py-3 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-medium scrollbar-none py-1">
            <span className="text-slate-500 uppercase tracking-wider font-mono pr-2 text-[10px] shrink-0">
              Jump to Solution:
            </span>
            {UPS_SOLUTION_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80 shrink-0 transition-colors"
              >
                {sec.shortTitle}
              </a>
            ))}
            <a
              href="#featured-products"
              className="px-3 py-1.5 rounded-lg bg-sky-950/50 hover:bg-sky-900 text-sky-300 border border-sky-800/60 shrink-0 font-semibold"
            >
              Featured Products
            </a>
            <a
              href="#sizing-modeler"
              className="px-3 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 shrink-0 font-semibold"
            >
              Sizing Modeler
            </a>
            <a
              href="#service-plans"
              className="px-3 py-1.5 rounded-lg bg-purple-950/50 hover:bg-purple-900 text-purple-300 border border-purple-800/60 shrink-0 font-semibold"
            >
              SLA Plans
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. CORE SOLUTIONS SHOWCASE (8 PILLARS) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {UPS_SOLUTION_SECTIONS.map((section, idx) => (
          <div
            key={section.id}
            id={section.id}
            className="scroll-mt-36 p-8 md:p-12 rounded-3xl bg-slate-900/60 border border-slate-800/80 relative overflow-hidden"
          >
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Overview & Highlights */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-md">
                    {getPillarIcon(section.iconName)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold block">
                      {section.category} &bull; PILLAR {idx + 1}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  <span className="ml-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/10 border border-sky-500/20 text-sky-400">
                    {section.badge}
                  </span>
                </div>

                <p className="text-sm font-semibold text-sky-200/90 leading-relaxed font-mono">
                  {section.tagline}
                </p>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {section.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Architectural Highlights:
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {section.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-300 leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capabilities */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Engineering Capabilities:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {section.capabilities.map((c, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Specs Panel & Metric Badge */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <div className="text-xs font-mono text-slate-400">BENCHMARK PERFORMANCE</div>
                      <div className="text-2xl font-black text-white mt-0.5">{section.metric.value}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 font-mono uppercase">{section.metric.label}</div>
                      <div className="text-xs font-bold text-emerald-400 mt-0.5">ECLYPE Verified</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                      Technical Specifications:
                    </h3>
                    <div className="space-y-2">
                      {section.technicalSpecs.map((spec, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 border-b border-slate-800/60 text-xs"
                        >
                          <span className="text-slate-400 font-medium">{spec.label}</span>
                          <span className="text-white font-mono font-semibold text-right max-w-[60%]">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href="#sizing-modeler"
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-white text-center flex items-center justify-center gap-2 transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5 text-sky-400" />
                      <span>Size Solution in Sizing Modeler</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. FEATURED UPS PRODUCTS CATALOG */}
      {/* ------------------------------------------------------------- */}
      <section id="featured-products" className="py-20 bg-slate-900/40 border-y border-slate-800 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono font-semibold">
              <Zap className="w-3.5 h-3.5" />
              HARDWARE &amp; INFRASTRUCTURE CATALOG
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured UPS &amp; Critical Power Hardware
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore enterprise-grade power protection systems, modular 3-phase architectures, advanced lithium battery cabinets, and prefabricated edge data center enclosures.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {[
                { id: 'all', label: 'All Hardware' },
                { id: 'modular-3phase', label: 'Modular 3-Phase UPS' },
                { id: 'rackmount', label: 'Rackmount Edge UPS' },
                { id: 'facility', label: 'Facility 800kVA UPS' },
                { id: 'battery', label: 'LiFePO4 Battery Cabinets' },
                { id: 'container', label: 'Containerised Edge DC' },
                { id: 'liquid-cooling', label: 'Liquid Cooling CDU' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === tab.id
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-sky-500/40 transition-all shadow-xl group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                      {product.categoryLabel}
                    </span>
                    {product.badge && (
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                      {product.model}
                    </h3>
                    <div className="text-xs font-mono text-emerald-400 font-semibold mt-1">
                      {product.capacityRange}
                    </div>
                  </div>

                  {/* Highlights Checklist */}
                  <div className="space-y-1.5 pt-2">
                    {product.keyHighlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Specs Grid */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Topology:</span>
                      <span className="text-slate-200">{product.topology}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Efficiency:</span>
                      <span className="text-emerald-400">{product.efficiency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Form Factor:</span>
                      <span className="text-slate-200">{product.formFactor}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    <span>View Full Specs</span>
                  </button>

                  <a
                    href="#sizing-modeler"
                    className="p-2.5 rounded-xl bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white transition-colors"
                    title="Request Quote"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. INTERACTIVE SIZING & RUNTIME MODELER */}
      {/* ------------------------------------------------------------- */}
      <section id="sizing-modeler" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
              <Sliders className="w-3.5 h-3.5" />
              INTERACTIVE CAPACITY &amp; RUNTIME MODELER
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Design &amp; Size Your Critical Power Architecture
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Model your power requirement, select runtime targets, and configure redundant thermal containment. Our engine estimates required equipment capacity and submits an RFP directly to our power engineering team.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* IT Load Slider */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor={loadKvaId} className="text-xs font-mono font-bold text-slate-300 uppercase">
                    1. IT Compute Load (kVA / kW)
                  </label>
                  <span className="text-lg font-black text-sky-400 font-mono">{loadKva} kVA</span>
                </div>
                <input
                  id={loadKvaId}
                  type="range"
                  min={3}
                  max={500}
                  step={loadKva > 100 ? 25 : loadKva > 30 ? 10 : 1}
                  value={loadKva}
                  onChange={(e) => setLoadKva(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>3 kVA (Edge Closet)</span>
                  <span>30 kVA (Server Room)</span>
                  <span>120 kVA (Data Center)</span>
                  <span>500 kVA (Facility)</span>
                </div>
              </div>

              {/* Desired Runtime Slider */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor={runtimeMinsId} className="text-xs font-mono font-bold text-slate-300 uppercase">
                    2. Desired Battery Runtime (Minutes)
                  </label>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {runtimeMins >= 60 ? `${runtimeMins / 60} Hour(s)` : `${runtimeMins} Minutes`}
                  </span>
                </div>
                <input
                  id={runtimeMinsId}
                  type="range"
                  min={10}
                  max={240}
                  step={10}
                  value={runtimeMins}
                  onChange={(e) => setRuntimeMins(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>10 Min (Gen Hand-off)</span>
                  <span>30 Min</span>
                  <span>60 Min (1 Hr)</span>
                  <span>240 Min (4 Hrs)</span>
                </div>
              </div>

              {/* Battery Tech & Redundancy Selection */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase block">
                    3. Battery Energy Chemistry
                  </span>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setBatteryType('lithium')}
                      className={`p-3 rounded-xl text-xs font-bold text-left transition-all ${
                        batteryType === 'lithium'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <div className="font-bold">LiFePO4 Lithium</div>
                      <div className="text-[10px] opacity-80 mt-0.5">15-Yr Life &bull; -65% Weight</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBatteryType('vrla')}
                      className={`p-3 rounded-xl text-xs font-bold text-left transition-all ${
                        batteryType === 'vrla'
                          ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <div className="font-bold">VRLA Lead Acid</div>
                      <div className="text-[10px] opacity-80 mt-0.5">5-Yr Life &bull; Lower CapEx</div>
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase block">
                    4. Redundancy Level
                  </span>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {(['N', 'N+1', '2N'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setRedundancy(lvl)}
                        className={`p-3 rounded-xl text-xs font-bold text-center transition-all ${
                          redundancy === lvl
                            ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <div>{lvl}</div>
                        <div className="text-[9px] opacity-80 mt-0.5">
                          {lvl === 'N' ? 'Single' : lvl === 'N+1' ? 'Parallel' : 'Dual Feed'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Addon Checkboxes */}
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCooling}
                    onChange={(e) => setIncludeCooling(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 bg-slate-900 border-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Include In-Row Precision Cooling</div>
                    <div className="text-[10px] text-slate-400">Close-coupled DX air containment</div>
                  </div>
                </label>

                <label className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSmartPdu}
                    onChange={(e) => setIncludeSmartPdu(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 bg-slate-900 border-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Include Intelligent iPDUs</div>
                    <div className="text-[10px] text-slate-400">Per-outlet power metering &amp; cycling</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Right Summary & RFP Submission Box */}
            <div className="lg:col-span-5">
              <div className="p-6 md:p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold block mb-1">
                    PRELIMINARY ARCHITECTURE SPECIFICATION
                  </span>
                  <h3 className="text-xl font-bold text-white">{getRecommendedModel()}</h3>
                </div>

                {/* Sizing Breakdown */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Total System Sizing:</span>
                    <span className="text-white font-bold">{effectiveCapacityKva} kVA ({redundancy})</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Target Backup Time:</span>
                    <span className="text-emerald-400 font-bold">{runtimeMins} Minutes full-load</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Energy Storage Chemistry:</span>
                    <span className="text-white font-bold">
                      {batteryType === 'lithium' ? 'LiFePO4 Lithium Battery' : 'High-Rate VRLA AGM'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Battery Lifespan:</span>
                    <span className="text-emerald-400 font-bold">{estimatedLifespan}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Footprint Efficiency:</span>
                    <span className="text-sky-400 font-bold">{footprintSavings}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Weight Reduction:</span>
                    <span className="text-sky-400 font-bold">{batteryWeightReduction}</span>
                  </div>
                </div>

                {/* Submit Specification Form */}
                {specSubmitted ? (
                  <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                    <h4 className="text-base font-bold text-white">Power Specification Logged!</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Thank you, <strong className="text-white">{contactName}</strong>. Our power systems engineer will review your {effectiveCapacityKva}kVA architecture and dispatch formal pricing within 24 hours.
                    </p>
                    <button
                      onClick={() => setSpecSubmitted(false)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                    >
                      Calculate Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSpecSubmit} className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-white">Request Quotation &amp; Technical Review:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your Name"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                      />
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="Work Email"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Phone (e.g. +855...)"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                      />
                      <input
                        type="text"
                        value={contactCompany}
                        onChange={(e) => setContactCompany(e.target.value)}
                        placeholder="Company / Facility"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={specSubmitting}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-600 hover:from-sky-400 hover:to-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {specSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Generating Specification...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Custom UPS Architecture</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. UPS SERVICE & MAINTENANCE SLA TIERS */}
      {/* ------------------------------------------------------------- */}
      <section id="service-plans" className="py-20 bg-slate-900/40 border-t border-slate-800 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-bold">
              <Wrench className="w-3.5 h-3.5" />
              LIFECYCLE SERVICE LEVEL AGREEMENTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              24/7/365 UPS Maintenance &amp; Emergency Dispatch
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unplanned power interruptions cost thousands of dollars per minute. Choose our proactive preventive maintenance SLA with certified Cambodian and regional electrical field engineers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {UPS_SERVICE_PLANS.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-8 border flex flex-col justify-between transition-all relative ${
                  plan.badge
                    ? 'bg-slate-900 border-sky-500/50 shadow-2xl shadow-sky-950/50'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-500 text-white shadow-md">
                    {plan.badge}
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <div className="text-xs font-mono text-sky-400 font-semibold mt-1">
                      {plan.responseTime}
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300 border-t border-b border-slate-800/80 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Inspections:</span>
                      <span className="font-semibold text-white">{plan.visitsPerYear}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Emergency Support:</span>
                      <span className="font-semibold text-white">{plan.emergencySupport}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Load Bank Testing:</span>
                      <span className="font-semibold text-white">
                        {plan.loadBankTesting ? 'Included' : 'Optional Add-on'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Infrared Thermography:</span>
                      <span className="font-semibold text-white">
                        {plan.thermalImaging ? 'Included (FLIR)' : 'Not Included'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Battery Diagnostics:</span>
                      <span className="font-semibold text-white text-right max-w-[55%]">
                        {plan.batteryInspection}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Parts &amp; Battery Discount:</span>
                      <span className="font-bold text-emerald-400">{plan.partsDiscount}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Ideal For:</strong> {plan.idealFor}
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href="/contact"
                    className={`w-full py-3 rounded-xl text-xs font-bold text-center block transition-all ${
                      plan.badge
                        ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    Select {plan.name} Agreement
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. FULL SPECIFICATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white text-lg font-bold"
            >
              &times;
            </button>

            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold block mb-1">
                  {selectedProduct.categoryLabel}
                </span>
                <h3 className="text-2xl font-bold text-white">{selectedProduct.model}</h3>
                <div className="text-sm font-mono text-emerald-400 font-bold mt-1">
                  {selectedProduct.capacityRange}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-2">
                  Key Technical Features:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedProduct.keyHighlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-3">
                  Comprehensive Specifications:
                </h4>
                <div className="divide-y divide-slate-800/80 rounded-xl bg-slate-950 p-4 border border-slate-800">
                  {selectedProduct.specs.map((s, i) => (
                    <div key={i} className="py-2 flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">{s.label}</span>
                      <span className="text-white font-mono font-semibold text-right max-w-[65%]">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Close
                </button>
                <Link
                  href="/contact"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"
                >
                  Request Formal RFP &amp; Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
