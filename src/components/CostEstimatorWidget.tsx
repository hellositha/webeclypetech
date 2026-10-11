'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calculator,
  CheckCircle2,
  DollarSign,
  Send,
  Sparkles,
  ShieldCheck,
  Server,
  Cloud,
  Layers,
  Zap,
} from 'lucide-react';
import { CORE_SERVICES } from '@/data/companyData';

// Baseline per-user monthly rates per service
export const SERVICE_USER_RATES: Record<string, number> = {
  'IT Infrastructure & Maintenance Services': 20, // 5 users = $100 / month
  'SaaS & Cloud Solutions': 25,
  'Human Resource Management System (HRM)': 15,
  'Customer Relationship Management (CRM)': 15,
  'Stock & Inventory Management': 15,
  'IT Security & Network Solutions': 20,
  'Enterprise Resource Planning (ERP)': 35,
  'Data Center Solutions': 30,
  'CCTV & Physical Security Solutions': 18,
  'Software Development & System Integration': 30,
};

export function CostEstimatorWidget() {
  const [userCount, setUserCount] = useState<number>(5);
  const [deploymentType, setDeploymentType] = useState<string>('Hybrid Cloud');
  const [slaTier, setSlaTier] = useState<'standard' | 'enterprise'>('standard');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'IT Infrastructure & Maintenance Services',
  ]);

  // Read URL query parameters on client mount if provided (e.g. ?service=it-infrastructure&users=5)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sParam = params.get('service');
      const uParam = params.get('users');
      if (sParam) {
        if (sParam.includes('infrastructure') || sParam.includes('it-infra')) {
          setSelectedServices(['IT Infrastructure & Maintenance Services']);
        }
      }
      if (uParam) {
        const u = parseInt(uParam, 10);
        if (!isNaN(u) && u >= 5 && u <= 500) {
          setUserCount(u);
        }
      }
    }
  }, []);

  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    timeline: 'Within 30-60 Days',
    requirements: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick Preset Handlers
  const applyPreset = (preset: 'starter-infra' | 'cloud-office' | 'enterprise') => {
    if (preset === 'starter-infra') {
      setSelectedServices(['IT Infrastructure & Maintenance Services']);
      setUserCount(5);
      setSlaTier('standard');
      setDeploymentType('Hybrid Cloud');
    } else if (preset === 'cloud-office') {
      setSelectedServices([
        'SaaS & Cloud Solutions',
        'IT Infrastructure & Maintenance Services',
        'Human Resource Management System (HRM)',
      ]);
      setUserCount(25);
      setSlaTier('standard');
      setDeploymentType('Hybrid Cloud');
    } else if (preset === 'enterprise') {
      setSelectedServices([
        'IT Infrastructure & Maintenance Services',
        'IT Security & Network Solutions',
        'Data Center Solutions',
        'Enterprise Resource Planning (ERP)',
      ]);
      setUserCount(50);
      setSlaTier('enterprise');
      setDeploymentType('Hybrid Cloud');
    }
  };

  // Toggle service selection
  const toggleService = (title: string) => {
    if (selectedServices.includes(title)) {
      if (selectedServices.length === 1) return; // Keep at least one
      setSelectedServices(selectedServices.filter((s) => s !== title));
    } else {
      setSelectedServices([...selectedServices, title]);
    }
  };

  // Cost calculation engine
  // Check if specifically IT Infrastructure & Maintenance Services alone
  const isOnlyItInfra =
    selectedServices.length === 1 &&
    selectedServices[0] === 'IT Infrastructure & Maintenance Services';

  // Per-user aggregate rate for selected services
  const aggregateRate = selectedServices.reduce(
    (acc, s) => acc + (SERVICE_USER_RATES[s] || 20),
    0
  );

  // Multi-service volume discount
  const bundleDiscount =
    selectedServices.length >= 4 ? 0.85 : selectedServices.length >= 2 ? 0.90 : 1.0;

  const slaMultiplier = slaTier === 'enterprise' ? 1.35 : 1.0;
  const deploymentFactor = deploymentType === 'On-Premises Dedicated' ? 1.25 : 1.0;

  // Monthly computation:
  // For IT Infrastructure alone @ 5 users standard SLA: exactly $100/mo ($20/user)
  let estimatedMonthly = 0;
  if (isOnlyItInfra && userCount === 5 && slaTier === 'standard' && deploymentType !== 'On-Premises Dedicated') {
    estimatedMonthly = 100;
  } else {
    estimatedMonthly = Math.round(
      userCount * aggregateRate * bundleDiscount * slaMultiplier * deploymentFactor
    );
  }

  // Implementation / One-time setup
  let estimatedOneTime = 0;
  if (isOnlyItInfra && userCount <= 5) {
    estimatedOneTime = 150; // Affordable starter onboarding setup
  } else {
    estimatedOneTime = Math.round(
      (selectedServices.length * 800 + userCount * 30) * deploymentFactor
    );
  }

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.company) {
      setError('Please provide your name, email, and company.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          company: contactData.company,
          selected_services: selectedServices,
          deployment_type: deploymentType,
          user_count: userCount,
          estimated_monthly: estimatedMonthly,
          estimated_onetime: estimatedOneTime,
          timeline: contactData.timeline,
          requirements: contactData.requirements,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit quote request. Please try again.');
      }
    } catch {
      setError('Network communication error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="calculator" className="py-20 bg-slate-900/40 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            Interactive Scope &amp; Budget Modeler
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            IT Project Cost &amp; Scope Estimator
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Model your infrastructure parameters, selected software modules, and SLA requirements to compute preliminary monthly and implementation budgets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Configurator Column */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6">
            {/* Quick Model Presets */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Quick Model Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('starter-infra')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isOnlyItInfra && userCount === 5
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>IT Infrastructure Starter (5 Users = $100/mo)</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('cloud-office')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                >
                  Cloud + Helpdesk (25 Users)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('enterprise')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                >
                  Enterprise 24/7 Stack (50 Users)
                </button>
              </div>
            </div>

            {/* 1. User Count Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <span>1. User &amp; Workstation Count:</span>
                </label>
                <span className="px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono font-bold text-base">
                  {userCount} Users
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={500}
                step={5}
                value={userCount}
                onChange={(e) => setUserCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>5 Users</span>
                <span>100</span>
                <span>250</span>
                <span>500+ Enterprise</span>
              </div>

              {isOnlyItInfra && userCount === 5 && (
                <div className="mt-2.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Starter Plan Active: 5 Users = $100 / month ($20/user)
                  </span>
                  <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20">
                    Standard 8x5 Helpdesk Included
                  </span>
                </div>
              )}
            </div>

            {/* 2. Select Services */}
            <div>
              <label className="text-sm font-bold text-white block mb-3">
                2. Select Required Services ({selectedServices.length} Selected):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {CORE_SERVICES.map((s) => {
                  const isChecked = selectedServices.includes(s.title);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleService(s.title)}
                      className={`text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-sky-500/10 border-sky-500/60 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-medium truncate pr-2">
                        {s.number}. {s.title}
                      </span>
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-700 shrink-0 inline-block" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specialized UPS & Mission-Critical Power Callout */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-300">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Need dedicated UPS, LiFePO4 battery sizing, or in-row cooling?</span>
              </div>
              <Link
                href="/ups-solutions#sizing-modeler"
                className="text-amber-400 hover:text-amber-300 font-bold underline shrink-0 flex items-center gap-1"
              >
                <span>UPS Sizing Modeler</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* 3. Deployment Type & SLA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                  3. Deployment Architecture:
                </label>
                <select
                  value={deploymentType}
                  onChange={(e) => setDeploymentType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="Hybrid Cloud">Hybrid Multi-Cloud</option>
                  <option value="Pure Cloud SaaS">100% Pure Cloud SaaS</option>
                  <option value="On-Premises Dedicated">On-Premises Dedicated Hardware</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                  4. Support &amp; SLA Tier:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSlaTier('standard')}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                      slaTier === 'standard'
                        ? 'bg-sky-500/20 border-sky-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    8x5 Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlaTier('enterprise')}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                      slaTier === 'enterprise'
                        ? 'bg-sky-500/20 border-sky-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    24/7/365 NOC/SOC
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary & Submission Form */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Estimated Project Investment
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-500 block">Estimated Monthly SLA</span>
                  <div className="text-2xl sm:text-3xl font-black text-sky-400 font-mono flex items-baseline">
                    ${estimatedMonthly.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 block">Implementation &amp; Setup</span>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono flex items-baseline">
                    ${estimatedOneTime.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400 ml-1">one-time</span>
                  </div>
                </div>
              </div>

              {isOnlyItInfra && userCount === 5 && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between font-mono">
                  <span>Starter SLA Plan:</span>
                  <span className="font-bold">5 Users &times; $20/user = $100/mo</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Includes {userCount} Users &bull; {selectedServices.length} Core Services</span>
                <span className="text-emerald-400 font-mono">SOC 2 Compliant</span>
              </div>
            </div>

            {/* Submission Form */}
            {submitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Quote Request Saved in PostgreSQL!</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thank you, <strong className="text-white">{contactData.name}</strong>. An ECLYPE Technology senior estimator has received your parameter model and will deliver a formal bill of materials within 1 business day.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs text-sky-400 hover:underline"
                >
                  Adjust parameters &amp; recalculate
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-white">
                  Lock In Estimate &amp; Request Official Proposal:
                </div>

                {error && (
                  <p className="text-rose-400 text-xs p-2 rounded bg-rose-500/10 border border-rose-500/20">
                    {error}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Work Email *"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Company Name *"
                    value={contactData.company}
                    onChange={(e) => setContactData({ ...contactData, company: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Special Requirements or Existing Software Stack"
                  value={contactData.requirements}
                  onChange={(e) =>
                    setContactData({ ...contactData, requirements: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? (
                    'Saving to Database...'
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Submit For Formal Bill of Materials
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
