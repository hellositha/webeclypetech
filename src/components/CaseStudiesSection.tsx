'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, ArrowRight, Building, Award } from 'lucide-react';
import { CASE_STUDIES } from '@/data/companyData';

export function CaseStudiesSection() {
  return (
    <section className="py-24 bg-slate-900/30 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <Award className="w-3.5 h-3.5" />
              Proven Enterprise Track Record
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Enterprise Deployments &amp; Case Studies
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
              See how ECLYPE Technology integrates hardware, physical security, cloud, and business ERP software to solve business-critical challenges.
            </p>
          </div>

          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 self-start md:self-auto"
          >
            Schedule a confidential case review <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="rounded-2xl bg-slate-950 border border-slate-800/90 p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-slate-950"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" /> {study.clientIndustry}
                  </span>
                  <div className="flex gap-1">
                    {study.divisionsInvolved.map((div, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono"
                      >
                        {div}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white leading-snug">
                  {study.clientTitle}
                </h3>

                <div className="space-y-2 text-xs text-slate-400">
                  <p>
                    <strong className="text-slate-200">The Challenge:</strong> {study.challenge}
                  </p>
                  <p>
                    <strong className="text-slate-200">ECLYPE Technology Solution:</strong>{' '}
                    {study.solution}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                    Measurable Outcomes:
                  </span>
                  {study.results.map((res, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-emerald-400 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Verified Client Deployment</span>
                <span className="text-sky-400 font-mono">100% SLA UP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
