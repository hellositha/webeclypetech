'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Server,
  Cloud,
  LayoutGrid,
  Cpu,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  CalendarCheck,
} from 'lucide-react';
import { DIVISIONS, CORE_SERVICES, COMPANY_INFO } from '@/data/companyData';
import { InquiryModal } from '@/components/InquiryModal';

export default function DivisionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDiv, setActiveDiv] = useState<string | undefined>();

  const getDivisionIcon = (id: string) => {
    switch (id) {
      case 'infrastructure':
        return <Server className="w-6 h-6 text-sky-400" />;
      case 'cloud':
        return <Cloud className="w-6 h-6 text-cyan-400" />;
      case 'software':
        return <LayoutGrid className="w-6 h-6 text-purple-400" />;
      case 'consulting':
        return <Cpu className="w-6 h-6 text-emerald-400" />;
      default:
        return <Layers className="w-6 h-6 text-sky-400" />;
    }
  };

  const handleInquire = (divisionId: string) => {
    setActiveDiv(divisionId);
    setModalOpen(true);
  };

  return (
    <div className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
            <Layers className="w-3.5 h-3.5" />
            Core Divisions Architecture
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Our 4 Core Practice Divisions
          </h1>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            ECLYPE Technology bridges the gap between hardware infrastructure, cloud orchestration, enterprise business software, and systems engineering into four synchronized divisions.
          </p>
        </div>

        {/* Division Matrix Table (Exact Match to Prompt) */}
        <div className="mb-20 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl">
          <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              Practice Division Overview &amp; Deliverables Matrix
            </h2>
            <span className="text-xs font-mono text-slate-400">ECLYPE Technology SPECIFICATION</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <th className="py-4 px-6 w-1/3">Division</th>
                  <th className="py-4 px-6 w-1/2">Main Services</th>
                  <th className="py-4 px-6 text-right">Inquire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {DIVISIONS.map((division) => (
                  <tr
                    key={division.id}
                    className="hover:bg-slate-900/40 transition-colors group"
                  >
                    <td className="py-5 px-6 font-semibold text-white">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                          {getDivisionIcon(division.id)}
                        </div>
                        <div>
                          <div className="group-hover:text-sky-400 transition-colors font-bold text-base">
                            {division.number}. {division.name}
                          </div>
                          <div className="text-xs text-slate-400 font-normal mt-0.5">
                            {division.tagline}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-slate-300 leading-relaxed font-medium">
                      {division.mainServices}
                    </td>
                    <td className="py-5 px-6 text-right">
                      <button
                        onClick={() => handleInquire(division.id)}
                        className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
                      >
                        Consult
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Breakdown for each Division */}
        <div className="space-y-16">
          {DIVISIONS.map((division) => {
            const mappedServices = CORE_SERVICES.filter((s) => s.divisionId === division.id);
            return (
              <div
                key={division.id}
                id={division.id}
                className="rounded-3xl bg-slate-900/40 border border-slate-800 p-8 sm:p-10 relative overflow-hidden backdrop-blur-sm"
              >
                <div
                  className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${division.colorScheme.gradient} blur-3xl pointer-events-none rounded-full`}
                />

                <div className="relative space-y-8">
                  {/* Division Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                        {getDivisionIcon(division.id)}
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold text-sky-400">
                          DIVISION 0{division.number}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                          {division.name}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => handleInquire(division.id)}
                      className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md self-start md:self-auto flex items-center gap-2"
                    >
                      <span>Inquire for Division 0{division.number}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Summary & Key Offerings */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-4">
                      <p className="text-slate-300 text-base leading-relaxed">
                        <strong className="text-white">Core Domain:</strong>{' '}
                        {division.mainServices}.
                      </p>

                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Engineering Capabilities &amp; Standards:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {division.keyOfferings.map((offering, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{offering}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mapped Services Cards */}
                    <div className="lg:col-span-5 rounded-2xl bg-slate-950 border border-slate-800/90 p-5 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <span>Associated Core Services</span>
                        <span className="text-sky-400 font-mono">CATALOG</span>
                      </div>

                      <div className="space-y-2">
                        {mappedServices.map((svc) => (
                          <Link
                            key={svc.id}
                            href={`/services/${svc.slug}`}
                            className="group p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/80 transition-all flex items-center justify-between"
                          >
                            <div>
                              <div className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
                                {svc.number}. {svc.title}
                              </div>
                              <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                                {svc.features[0]}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Unified Ecosystem Banner */}
        <div className="mt-20 rounded-3xl bg-gradient-to-r from-sky-950/40 via-blue-950/30 to-slate-950 border border-sky-800/30 p-8 sm:p-12 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mx-auto flex items-center justify-center">
            <Zap className="w-7 h-7" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Need Cross-Division Enterprise Architecture?
          </h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Our Principal Architects design end-to-end solutions that span all four divisions — configuring your server room cabling, connecting CCTV biometrics to HRM payroll, and hosting ERP in the secure cloud.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/consultation"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-sm shadow-xl shadow-sky-600/30 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" /> Schedule Unified Architecture Review
            </Link>
            <Link
              href="/calculator"
              className="px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Calculate Estimated Investment
            </Link>
          </div>
        </div>

        {/* Modal */}
        <InquiryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          preselectedDivision={activeDiv}
        />
      </div>
    </div>
  );
}
