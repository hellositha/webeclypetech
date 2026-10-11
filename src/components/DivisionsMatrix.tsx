'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Server,
  Cloud,
  LayoutGrid,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Table,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { DIVISIONS, CORE_SERVICES } from '@/data/companyData';

interface DivisionsMatrixProps {
  onOpenInquiry?: (serviceId?: string, divisionId?: string) => void;
}

export function DivisionsMatrix({ onOpenInquiry }: DivisionsMatrixProps) {
  const [activeTab, setActiveTab] = useState<'cards' | 'table'>('cards');
  const [selectedDivision, setSelectedDivision] = useState<string>('infrastructure');

  const getDivisionIcon = (id: string) => {
    switch (id) {
      case 'infrastructure':
        return <Server className="w-5 h-5 text-sky-400" />;
      case 'cloud':
        return <Cloud className="w-5 h-5 text-cyan-400" />;
      case 'software':
        return <LayoutGrid className="w-5 h-5 text-purple-400" />;
      case 'consulting':
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      default:
        return <Layers className="w-5 h-5 text-sky-400" />;
    }
  };

  const currentDiv = DIVISIONS.find((d) => d.id === selectedDivision) || DIVISIONS[0];
  const matchedServices = CORE_SERVICES.filter((s) => s.divisionId === currentDiv.id);

  return (
    <section id="divisions" className="py-20 bg-slate-900/50 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
              <Layers className="w-3.5 h-3.5" />
              Organizational Capability Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our 4 Core IT Divisions
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
              ECLYPE Technology unifies end-to-end technology into four specialized practice divisions designed to execute seamlessly as one integrated team.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('cards')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'cards'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Interactive Deep-Dive
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'table'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" /> Division Matrix Table
            </button>
          </div>
        </div>

        {/* View Mode 1: Interactive Cards & Explorer */}
        {activeTab === 'cards' && (
          <div className="space-y-8">
            {/* Division Switcher Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {DIVISIONS.map((division) => {
                const isSelected = division.id === selectedDivision;
                return (
                  <button
                    key={division.id}
                    onClick={() => setSelectedDivision(division.id)}
                    className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden group ${
                      isSelected
                        ? `${division.colorScheme.border} ${division.colorScheme.bg} shadow-lg shadow-sky-950/50 ring-1 ring-sky-500/50`
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        {getDivisionIcon(division.id)}
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        0{division.number}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                      {division.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                      {division.mainServices}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Division Expanded Deep Dive Card */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
              <div
                className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${currentDiv.colorScheme.gradient} blur-3xl pointer-events-none rounded-full`}
              />

              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
                      DIVISION 0{currentDiv.number}
                    </span>
                    <span className="text-xs text-sky-400 font-semibold uppercase tracking-wider">
                      {currentDiv.tagline}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {currentDiv.name}
                  </h3>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    <strong className="text-white">Scope &amp; Services:</strong>{' '}
                    {currentDiv.mainServices}.
                  </p>

                  <div className="pt-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                      Key Capabilities &amp; Engineering Disciplines:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentDiv.keyOfferings.map((offering, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{offering}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => onOpenInquiry && onOpenInquiry(undefined, currentDiv.id)}
                      className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-colors flex items-center gap-2"
                    >
                      <span>Inquire About Division 0{currentDiv.number}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <Link
                      href="/divisions"
                      className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-sm font-medium transition-colors"
                    >
                      Compare All Divisions
                    </Link>
                  </div>
                </div>

                {/* Mapped Services column */}
                <div className="lg:col-span-5 rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <span>Mapped Core Services ({matchedServices.length})</span>
                    <span className="text-sky-400 font-mono">PRACTICE SUITE</span>
                  </div>

                  <div className="space-y-2.5">
                    {matchedServices.map((svc) => (
                      <Link
                        key={svc.id}
                        href={`/services/${svc.slug}`}
                        className="group flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-sky-500/40 hover:bg-slate-900 transition-all"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                            <span className="text-xs text-slate-500 font-mono">#{svc.number}</span>
                            {svc.title}
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {svc.features[0]}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                      </Link>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-800/30 text-xs text-sky-300 flex items-center gap-2 mt-4">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-sky-400" />
                    <span>Every service is backed by enterprise SLAs &amp; certified engineers.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Division Matrix Table (Exact Match to Prompt) */}
        {activeTab === 'table' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-300">
                    <th className="py-4 px-6 w-1/3">Division</th>
                    <th className="py-4 px-6 w-1/2">Main Services</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-sm">
                  {DIVISIONS.map((division) => (
                    <tr
                      key={division.id}
                      className="hover:bg-slate-900/40 transition-colors group"
                    >
                      <td className="py-5 px-6 font-semibold text-white flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                          {getDivisionIcon(division.id)}
                        </div>
                        <div>
                          <div className="group-hover:text-sky-400 transition-colors font-bold">
                            {division.number}. {division.name}
                          </div>
                          <div className="text-xs text-slate-400 font-normal mt-0.5">
                            {division.tagline}
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-slate-300 leading-relaxed">
                        {division.mainServices}
                      </td>
                      <td className="py-5 px-6 text-right">
                        <button
                          onClick={() => onOpenInquiry && onOpenInquiry(undefined, division.id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-sky-600 text-slate-300 hover:text-white border border-slate-800 hover:border-sky-500 transition-colors"
                        >
                          Inquire
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-900/50 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span>All 4 divisions operate with integrated telemetry and unified technical support.</span>
              <Link
                href="/divisions"
                className="text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1"
              >
                Explore In-Depth Division Architecture <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
