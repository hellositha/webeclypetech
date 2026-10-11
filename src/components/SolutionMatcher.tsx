'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
  Zap,
  Layers,
  Server,
  Cloud,
  LayoutGrid,
} from 'lucide-react';

interface SolutionMatcherProps {
  onOpenInquiry: (serviceId?: string) => void;
}

export function SolutionMatcher({ onOpenInquiry }: SolutionMatcherProps) {
  const [size, setSize] = useState<'smb' | 'mid' | 'enterprise' | 'multisite'>('mid');
  const [need, setNeed] = useState<
    'cloud' | 'datacenter' | 'software' | 'cctv' | 'security' | 'custom'
  >('software');
  const [deployment, setDeployment] = useState<'cloud' | 'onprem' | 'hybrid'>('hybrid');

  const [savingLead, setSavingLead] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const [quickContact, setQuickContact] = useState({ name: '', email: '', company: '' });

  // Compute matched bundle
  const getBundleRecommendation = () => {
    switch (need) {
      case 'cloud':
        return {
          title: 'Hybrid Cloud Modernization & M365 Suite',
          services: [
            '1. SaaS & Cloud Solutions (Azure / AWS / M365)',
            '2. IT Infrastructure & Maintenance Services (24/7 NOC)',
            '9. IT Security & Network Solutions (Zero-Trust VPN)',
          ],
          timeline: '2 - 3 Weeks',
          slaTier: '24/7 Managed NOC & 15-min Backup RPO',
          description:
            'Engineered for organizations transitioning workloads off legacy on-prem boxes into scalable, redundant Azure cloud with modern Microsoft 365 identity governance.',
        };
      case 'datacenter':
        return {
          title: 'Enterprise Data Center & Structured Fabric',
          services: [
            '3. Data Center Solutions (Virtualization & HA Clustering)',
            '2. IT Infrastructure & Maintenance Services',
            '9. IT Security & Network Solutions (Core Switches & Firewalls)',
          ],
          timeline: '4 - 6 Weeks',
          slaTier: '99.999% High Availability Active-Active SLA',
          description:
            'Turnkey server room and data center design with precision cooling, OM4 fiber cabling, enterprise SAN storage, and zero-data-loss DR failover.',
        };
      case 'software':
        return {
          title: 'Integrated Enterprise ERP + Biometric HRM + Stock System',
          services: [
            '5. Human Resource Management System (HRM + Biometric Clock-in)',
            '6. Enterprise Resource Planning (ERP - General Ledger & POs)',
            '7. Stock & Inventory Management (Multi-Warehouse & Barcodes)',
            '8. Customer Relationship Management (CRM Sales Pipeline)',
          ],
          timeline: '4 - 8 Weeks (Modular Deployment)',
          slaTier: 'Continuous Database Auditing & Dedicated Account Lead',
          description:
            'Unifies your entire workforce and supply chain. Connects biometric turnstiles directly with automated payroll, while syncing real-time stock levels with accounting.',
        };
      case 'cctv':
        return {
          title: 'IP CCTV Video Surveillance & Biometric Turnstile Access',
          services: [
            '4. CCTV & Physical Security Solutions (4K IP Cameras & AI NVR)',
            '9. IT Security & Network Solutions (Dedicated PoE+ VLANs)',
            '2. IT Infrastructure & Maintenance Services',
          ],
          timeline: '2 - 4 Weeks',
          slaTier: '30-Day Encrypted Storage & Rapid Dispatch SLA',
          description:
            'Perimeter-to-rack protection with high-resolution IP cameras, remote smartphone monitoring command centers, and biometric entrance turnstiles.',
        };
      case 'security':
        return {
          title: 'Zero-Trust Enterprise Network & Cybersecurity Hardening',
          services: [
            '9. IT Security & Network Solutions (Next-Gen Firewalls & VPN)',
            '2. IT Infrastructure & Maintenance Services (SOC Telemetry)',
            '1. SaaS & Cloud Solutions (Encrypted Cloud Backup)',
          ],
          timeline: '1 - 3 Weeks',
          slaTier: 'Under 10-Minute Active Threat Containment',
          description:
            'Full network segmentation isolating accounting and servers into secure VLANs, encrypted multi-site SD-WAN, and enterprise endpoint malware isolation.',
        };
      case 'custom':
        return {
          title: 'Bespoke Application Development & Enterprise API Gateways',
          services: [
            '10. Software Development & System Integration',
            '1. SaaS & Cloud Solutions (Containerized Microservices)',
            '6. Enterprise Resource Planning (ERP Bridges & Webhooks)',
          ],
          timeline: '6 - 12 Weeks (Agile Sprints)',
          slaTier: 'Full Source Code Escrow & Post-Launch SLA Support',
          description:
            'Tailored full-stack business applications, enterprise middleware connecting legacy SQL databases to modern SaaS, and custom customer self-service portals.',
        };
    }
  };

  const bundle = getBundleRecommendation();

  const handleQuickLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickContact.email || !quickContact.name) return;
    setSavingLead(true);

    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: quickContact.name,
          email: quickContact.email,
          company: quickContact.company || 'Not Specified',
          service_id: need,
          division_id: 'solution-configurator',
          budget: size === 'enterprise' ? '$100,000+' : '$25,000 - $50,000',
          urgency: 'Normal',
          message: `Configured Bundle: ${bundle.title} | Size: ${size} | Deployment: ${deployment} | Recommended Services: ${bundle.services.join(', ')}`,
        }),
      });
      setLeadSaved(true);
    } catch {
      // ignore
    } finally {
      setSavingLead(false);
    }
  };

  return (
    <section id="solution-matcher" className="py-20 bg-slate-900/60 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Zap className="w-3.5 h-3.5" />
            Interactive IT Architecture Configurator
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Find Your Ideal Solution Architecture
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Select your operational scale, core operational challenge, and deployment preference to generate a customized ECLYPE Technology service bundle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Selectors */}
          <div className="lg:col-span-6 space-y-6">
            {/* Step 1: Scale */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Step 1: Organization Scale &amp; Headcount
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'smb', label: 'Startup / SMB', desc: '1-25 Staff' },
                  { id: 'mid', label: 'Mid-Market', desc: '25-150 Staff' },
                  { id: 'enterprise', label: 'Enterprise', desc: '150-1,000+' },
                  { id: 'multisite', label: 'Multi-Branch', desc: 'Campus Sites' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      size === s.id
                        ? 'border-sky-500 bg-sky-500/10 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight">{s.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Primary Challenge */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Step 2: Primary Objective or Need
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'software',
                    title: 'Business Software Suite',
                    desc: 'HRM, Biometric Payroll, ERP & Stock',
                  },
                  {
                    id: 'cloud',
                    title: 'Cloud & Managed IT',
                    desc: 'Azure, M365, Migration & NOC',
                  },
                  {
                    id: 'datacenter',
                    title: 'Data Center & Hardware',
                    desc: 'Servers, Storage & Structured Cabling',
                  },
                  {
                    id: 'security',
                    title: 'Cybersecurity & Networks',
                    desc: 'Zero-Trust Firewalls, VPN & VLANs',
                  },
                  {
                    id: 'cctv',
                    title: 'CCTV & Physical Security',
                    desc: '4K IP Cameras, NVR & Turnstiles',
                  },
                  {
                    id: 'custom',
                    title: 'Custom Dev & Integrations',
                    desc: 'Bespoke Software & API Gateways',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setNeed(item.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      need === item.id
                        ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-md'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight">{item.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Deployment Preference */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Step 3: Preferred Infrastructure Model
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hybrid', label: 'Hybrid Multi-Cloud', desc: 'Best of both' },
                  { id: 'cloud', label: '100% Pure Cloud', desc: 'Zero local servers' },
                  { id: 'onprem', label: 'On-Prem Dedicated', desc: 'Strict sovereignty' },
                ].map((dep) => (
                  <button
                    key={dep.id}
                    onClick={() => setDeployment(dep.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      deployment === dep.id
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{dep.label}</div>
                    <div className="text-[10px] text-slate-500">{dep.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Tailored Bundle Output */}
          <div className="lg:col-span-6 rounded-2xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Recommended Architecture Blueprint
                </span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {bundle.slaTier}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white leading-tight">
                {bundle.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {bundle.description}
              </p>
            </div>

            {/* Services in this bundle */}
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Included ECLYPE Technology Services:
              </div>
              <div className="space-y-2">
                {bundle.services.map((svc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{svc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/80 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Est. Rollout Horizon</span>
                <span className="text-white font-bold text-sm mt-0.5 block">{bundle.timeline}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Architecture Model</span>
                <span className="text-cyan-400 font-bold text-sm mt-0.5 block capitalize">
                  {deployment} Model
                </span>
              </div>
            </div>

            {/* Quick lead capture box */}
            <div className="pt-4 border-t border-slate-800">
              {leadSaved ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  <span>
                    Your customized bundle was successfully saved to ECLYPE Technology PostgreSQL! Our engineers will prepare the blueprint proposal.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleQuickLeadSubmit} className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Save or Request This Configured Bundle:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={quickContact.name}
                      onChange={(e) => setQuickContact({ ...quickContact, name: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Enterprise Email"
                      value={quickContact.email}
                      onChange={(e) => setQuickContact({ ...quickContact, email: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Company Name (Optional)"
                      value={quickContact.company}
                      onChange={(e) => setQuickContact({ ...quickContact, company: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      disabled={savingLead}
                      className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {savingLead ? 'Saving...' : <>Request Proposal <Send className="w-3.5 h-3.5" /></>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
