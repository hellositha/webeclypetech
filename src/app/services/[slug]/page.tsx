import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  CalendarCheck,
  Zap,
  Server,
  Building,
  Check,
  Lock,
  Sparkles,
  Calculator,
} from 'lucide-react';
import { CORE_SERVICES, COMPANY_INFO } from '@/data/companyData';
import { ServiceIcon } from '@/components/ServiceIcon';
import { ServiceDetailClient } from './ServiceDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CORE_SERVICES.map((s) => ({
    slug: s.slug,
  }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = CORE_SERVICES.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  // Find related services from same division
  const relatedServices = CORE_SERVICES.filter(
    (s) => s.divisionId === service.divisionId && s.id !== service.id
  );

  return (
    <div className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back breadcrumb */}
        <div className="mb-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All 10 Services
          </Link>
        </div>

        {/* Hero header */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 sm:p-12 relative overflow-hidden backdrop-blur-md mb-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 blur-3xl pointer-events-none rounded-full" />

          <div className="relative max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sky-400 text-xs font-mono font-bold">
                CORE SERVICE 0{service.number}
              </span>
              <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-medium">
                {service.divisionName}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {service.badge}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {service.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
              {service.tagline}
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">{service.summary}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Details */}
          <div className="lg:col-span-8 space-y-10">
            {/* 1. Core Scope of Deliverables */}
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
                <h2 className="text-xl font-bold text-white">
                  Scope of Deliverables &amp; Core Capabilities
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Standard technical deliverables included under this service engagement:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {service.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-200 font-medium leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Pricing & SLA Plans */}
            {service.pricingPlans && service.pricingPlans.length > 0 && (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      <h2 className="text-xl font-bold text-white">
                        Service Plans &amp; Transparent SLA Pricing
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Predictable monthly maintenance SLA agreements with guaranteed response times and no hidden user fees.
                    </p>
                  </div>
                  {service.pricingHighlight && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold shrink-0">
                      {service.pricingHighlight}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {service.pricingPlans.map((plan, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                        plan.isPopular
                          ? 'bg-slate-950 border-emerald-500/60 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500/30'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-3">
                        {plan.badge && (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block ${
                              plan.isPopular
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {plan.badge}
                          </span>
                        )}

                        <h3 className="text-base font-bold text-white">{plan.name}</h3>

                        <div className="pb-3 border-b border-slate-800/80">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold text-white font-mono">
                              ${plan.monthlyPrice}
                            </span>
                            <span className="text-xs text-slate-400">/{plan.billingPeriod}</span>
                          </div>
                          <div className="text-xs text-emerald-400 font-mono mt-1 font-semibold">
                            {plan.usersLabel} {plan.perUserPrice ? `($${plan.perUserPrice}/user)` : ''}
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">
                          {plan.description}
                        </p>

                        <div className="space-y-1.5 pt-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                            Key Inclusions:
                          </span>
                          {plan.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-slate-800/60 space-y-1 text-[11px] text-slate-400">
                          <div className="flex justify-between">
                            <span>SLA Response:</span>
                            <span className="text-white font-mono font-semibold">{plan.slaResponse}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Coverage:</span>
                            <span className="text-white font-mono">{plan.supportHours}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-5 mt-4 border-t border-slate-800/80 flex flex-col gap-2">
                        <Link
                          href={`/calculator?service=${service.slug}&users=${plan.userCount}`}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 ${
                            plan.isPopular
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
                          }`}
                        >
                          <Calculator className="w-3.5 h-3.5" />
                          <span>Model in Cost Estimator</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Key Business Benefits */}
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Enterprise Benefits &amp; Strategic Impact
              </h2>
              <div className="space-y-3 pt-2">
                {service.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                      0{idx + 1}
                    </div>
                    <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Ideal For & Target Workloads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Building className="w-4 h-4 text-sky-400" />
                  Ideal Organization Profile
                </h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  {service.idealFor.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-400" />
                  Deployment Options
                </h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  {service.deploymentOptions.map((opt, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-sky-400" />
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4. Tech Stack */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Supported Technology Platforms &amp; Standards:
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sticky Client Interactive Inquiry Form */}
          <div className="lg:col-span-4 sticky top-24">
            <ServiceDetailClient service={service} />
          </div>
        </div>

        {/* Related Services in Division */}
        {relatedServices.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white mb-6">
              Complementary Services in {service.divisionName}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedServices.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/services/${rel.slug}`}
                  className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-sky-500/40 transition-all hover:bg-slate-900 group"
                >
                  <div className="text-xs text-sky-400 font-mono mb-1">
                    SERVICE 0{rel.number}
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    {rel.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">{rel.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
