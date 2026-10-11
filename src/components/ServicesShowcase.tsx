'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CORE_SERVICES, DIVISIONS } from '@/data/companyData';
import { ServiceIcon } from '@/components/ServiceIcon';

interface ServicesShowcaseProps {
  onOpenInquiry: (serviceId?: string) => void;
}

export function ServicesShowcase({ onOpenInquiry }: ServicesShowcaseProps) {
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = CORE_SERVICES.filter((service) => {
    const matchesDivision =
      selectedDivisionFilter === 'all' || service.divisionId === selectedDivisionFilter;
    const matchesQuery =
      searchQuery.trim() === '' ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      service.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDivision && matchesQuery;
  });

  return (
    <section id="services" className="py-24 bg-slate-950 relative">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-sky-500/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Full-Spectrum Technology Catalog
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Our 10 Core Services
          </h2>
          <p className="mt-3 text-slate-400 text-base sm:text-lg">
            Battle-tested enterprise services spanning cloud infrastructure, server hardware, security surveillance, and mission-critical business software.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="mb-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Division Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setSelectedDivisionFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedDivisionFilter === 'all'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All 10 Services
            </button>
            {DIVISIONS.map((div) => (
              <button
                key={div.id}
                onClick={() => setSelectedDivisionFilter(div.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDivisionFilter === div.id
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {div.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services or features..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/40 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-950/40 relative overflow-hidden backdrop-blur-sm"
            >
              {/* Subtle top border line accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky-500/20 to-transparent group-hover:via-sky-400 transition-all" />

              <div>
                {/* Header row: Icon & Number Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-sky-500/50 group-hover:text-sky-400 text-slate-300 transition-colors">
                    <ServiceIcon name={service.iconName} className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      #{service.number < 10 ? `0${service.number}` : service.number}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                      {service.badge}
                    </span>
                  </div>
                </div>

                {/* Division pill */}
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  {service.divisionName}
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                  {service.number}. {service.title}
                </h3>

                {/* Summary */}
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {service.summary}
                </p>

                {/* Core Items from Prompt */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Scope of Deliverables:
                  </div>
                  <ul className="space-y-1.5">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-300 leading-snug"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech stack tags */}
                <div className="mt-4 pt-3 flex flex-wrap gap-1.5">
                  {service.techStack.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400"
                    >
                      {tech}
                    </span>
                  ))}
                  {service.techStack.length > 3 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-500">
                      +{service.techStack.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-xs font-semibold text-slate-300 hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  Technical Details <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => onOpenInquiry(service.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-sky-600/90 hover:bg-sky-500 text-white text-xs font-medium transition-all inline-flex items-center gap-1 shadow-sm"
                >
                  Request Quote <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="py-16 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-base font-medium">No services found matching your search term.</p>
            <button
              onClick={() => {
                setSelectedDivisionFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-sky-400 hover:underline"
            >
              Reset filters &amp; view all 10 services
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
