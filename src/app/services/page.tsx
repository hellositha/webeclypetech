'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Server,
  Layers,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { CORE_SERVICES, DIVISIONS, COMPANY_INFO } from '@/data/companyData';
import { ServiceIcon } from '@/components/ServiceIcon';
import { InquiryModal } from '@/components/InquiryModal';

export default function ServicesPage() {
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeService, setActiveService] = useState<string | undefined>();

  const filtered = CORE_SERVICES.filter((svc) => {
    const matchesDiv = selectedDivision === 'all' || svc.divisionId === selectedDivision;
    const matchesQuery =
      search.trim() === '' ||
      svc.title.toLowerCase().includes(search.toLowerCase()) ||
      svc.summary.toLowerCase().includes(search.toLowerCase()) ||
      svc.features.some((f) => f.toLowerCase().includes(search.toLowerCase())) ||
      svc.techStack.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    return matchesDiv && matchesQuery;
  });

  const handleInquire = (serviceId: string) => {
    setActiveService(serviceId);
    setModalOpen(true);
  };

  return (
    <div className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Complete Service Portfolio
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Our 10 Core IT Services
          </h1>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            From modern cloud environments and mission-critical server hardware to biometric workforce automation and enterprise ERP suites, explore our integrated service portfolio.
          </p>
        </div>

        {/* Filter bar */}
        <div className="mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setSelectedDivision('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedDivision === 'all'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All 10 Services
            </button>
            {DIVISIONS.map((div) => (
              <button
                key={div.id}
                onClick={() => setSelectedDivision(div.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDivision === div.id
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {div.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by service or keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-8">
          {/* Specialized UPS Solutions & Mission-Critical Infrastructure Suite */}
          {(selectedDivision === 'all' || selectedDivision === 'infrastructure') &&
            (search === '' ||
              'ups solutions battery replacement cooling data centers server rooms containerised liquid cooling'
                .toLowerCase()
                .includes(search.toLowerCase())) && (
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 border-2 border-amber-500/40 p-6 sm:p-8 hover:border-amber-500/70 transition-all hover:shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                  {/* Left Overview */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 text-amber-400">
                        <Zap className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            SPECIALIZED SUITE
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                            99.999% Uptime
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mt-0.5">
                          UPS Solutions &amp; Thermal Systems
                        </h2>
                      </div>
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Division: <span className="text-slate-200">Enterprise IT Infrastructure</span>
                    </p>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      Continuous power protection and precision thermal management. Featuring modular 3-phase online UPS (1kVA–800kVA), long-life LiFePO4 battery energy storage, in-row close-coupled cooling, 20ft containerised data centers, and 100kW+ direct-to-chip liquid cooling.
                    </p>

                    <div className="pt-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                        Critical Technologies:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Online Double Conversion',
                          'LiFePO4 Lithium Cabinets',
                          'In-Row Close-Coupled Cooling',
                          'Containerised Edge DC',
                          'Direct-to-Chip Liquid CDU',
                          'Smart iPDUs',
                          '24/7 Load Bank PM',
                        ].map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-amber-300/90"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      <Link
                        href="/services/ups-solutions"
                        className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-sm"
                      >
                        Explore Complete UPS Suite <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href="/services/ups-solutions#sizing-modeler"
                        className="px-4 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors inline-flex items-center gap-1.5"
                      >
                        Capacity &amp; Runtime Modeler <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Deliverables & Value */}
                  <div className="lg:col-span-7 rounded-xl bg-slate-950/80 border border-slate-800/90 p-6 space-y-5">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                        Included Power &amp; Thermal Offerings:
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          'UPS Systems (1kVA - 800kVA Modular 3-Phase)',
                          'Battery Replacement (VRLA & 15-Yr LiFePO4 Lithium)',
                          'Precision Cooling Solutions (In-Row PAC & Containment)',
                          'UPS Service & 24/7 Emergency Dispatch (< 2 Hr SLA)',
                          'Smart Solutions (iPDUs, Telemetry & Auto-Shutdown)',
                          'Data Centers & Server Rooms (Tier III/IV Turnkey)',
                          'Containerised Data Centers (20ft/40ft Plug & Play)',
                          'Liquid Cooling & CDUs (100kW+ Per Rack for AI & HPC)',
                        ].map((feat, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80"
                          >
                            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                          Operational Advantages:
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 font-bold">&bull;</span>
                            <span>Zero millisecond transfer time protecting sensitive IT loads</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 font-bold">&bull;</span>
                            <span>Up to 99.2% ECO electrical efficiency reducing facility OPEX</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                          Deployment Form Factors:
                        </span>
                        <div className="space-y-1.5 text-xs text-slate-300">
                          {['1U-4U Rackmount Edge', 'Modular 19" Power Cabinets', 'Prefabricated ISO Containers'].map(
                            (opt, i) => (
                              <div
                                key={i}
                                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-amber-300/80"
                              >
                                ✓ {opt}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {filtered.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 hover:border-slate-700 transition-all hover:shadow-xl backdrop-blur-sm relative overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Overview */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-sky-400">
                      <ServiceIcon name={service.iconName} className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-sky-400">
                          SERVICE 0{service.number < 10 ? service.number : service.number}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                          {service.badge}
                        </span>
                        {service.pricingHighlight && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                            {service.pricingHighlight}
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-white mt-0.5">{service.title}</h2>
                    </div>
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Division: <span className="text-slate-200">{service.divisionName}</span>
                  </p>

                  <p className="text-sm text-slate-300 leading-relaxed">{service.summary}</p>

                  <div className="pt-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                      Enterprise Technologies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {service.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleInquire(service.id)}
                      className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
                    >
                      Request Service Quote <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {service.id === 'it-infrastructure' && (
                      <Link
                        href="/calculator?service=it-infrastructure&users=5"
                        className="px-4 py-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Estimate 5 Users ($100/mo)</span>
                      </Link>
                    )}
                    <Link
                      href={`/services/${service.slug}`}
                      className="px-4 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors inline-flex items-center gap-1.5"
                    >
                      Deep Dive Specs <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Right Deliverables & Value */}
                <div className="lg:col-span-7 rounded-xl bg-slate-950/80 border border-slate-800/90 p-6 space-y-5">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                      Core Scope of Deliverables (From Technical Specification):
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {service.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                        Key Business Benefits:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {service.benefits.slice(0, 2).map((b, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-sky-400 font-bold">&bull;</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                        Supported Deployment Modes:
                      </span>
                      <div className="space-y-1.5 text-xs text-slate-300">
                        {service.deploymentOptions.map((opt, i) => (
                          <div
                            key={i}
                            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                          >
                            ✓ {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <InquiryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          preselectedService={activeService}
        />
      </div>
    </div>
  );
}
