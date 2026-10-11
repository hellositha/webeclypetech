import React from 'react';
import { CostEstimatorWidget } from '@/components/CostEstimatorWidget';
import { ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-react';
import { COMPANY_INFO } from '@/data/companyData';

export const metadata = {
  title: 'IT Project Cost & Scope Estimator | ECLYPE Technology',
  description:
    'Calculate preliminary budget requirements for enterprise IT infrastructure, managed cloud services, biometric HRM, and ERP deployments.',
};

export default function CalculatorPage() {
  return (
    <div className="py-12 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CostEstimatorWidget />

        {/* Pricing Transparency FAQ */}
        <div className="mt-16 max-w-4xl mx-auto rounded-2xl bg-slate-900/50 border border-slate-800 p-8 space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-sky-400" />
            <h3 className="text-xl font-bold text-white">
              Pricing Transparency &amp; SLA Commitment
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
              <span className="font-bold text-emerald-400 block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Starter SLA (5 Users = $100/mo):
              </span>
              <p className="text-slate-400 leading-relaxed">
                Our IT Infrastructure &amp; Maintenance service begins at just $100/month for up to 5 workstations ($20/user), providing routine maintenance, patch management, and responsive 8x5 helpdesk ticketing.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-white block">No Hidden Licensing Fees:</span>
              <p className="text-slate-400 leading-relaxed">
                All monthly managed services include our standard telemetry monitoring, patch automation, and technical helpdesk ticketing without hidden user penalties.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-white block">Enterprise SLA Backing:</span>
              <p className="text-slate-400 leading-relaxed">
                Our enterprise agreements carry financial credit guarantees for high-availability uptime and sub-10 minute emergency response times.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
