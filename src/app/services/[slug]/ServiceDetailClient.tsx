'use client';

import React, { useState } from 'react';
import { CoreService } from '@/data/companyData';
import { Send, CheckCircle2, ShieldCheck, PhoneCall, CalendarCheck } from 'lucide-react';
import Link from 'next/link';

interface Props {
  service: CoreService;
}

export function ServiceDetailClient({ service }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget:
      service.id === 'it-infrastructure'
        ? '$100/mo (Starter Plan - 5 Users)'
        : '$25,000 - $50,000',
    urgency: 'Normal',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service_id: service.id,
          division_id: service.divisionId,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to submit inquiry.');
      }
    } catch {
      setError('Network communication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Inquire About This Service</h3>
          <p className="text-xs text-slate-400">Direct response from practice lead</p>
        </div>
      </div>

      {success ? (
        <div className="py-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-white">Inquiry Saved to PostgreSQL!</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Thank you, <strong className="text-white">{formData.name}</strong>. Our lead architect for <strong className="text-sky-400">{service.title}</strong> will reach out shortly.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                budget: '$25,000 - $50,000',
                urgency: 'Normal',
                message: '',
              });
            }}
            className="text-xs text-sky-400 hover:underline pt-2 block mx-auto"
          >
            Submit another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <p className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {error}
            </p>
          )}

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Work Email *
            </label>
            <input
              type="email"
              required
              placeholder="work@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Company *
              </label>
              <input
                type="text"
                required
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Phone
              </label>
              <input
                type="tel"
                placeholder="Phone Number (e.g. +855 77 882 285)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Budget Range
            </label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
            >
              <option value="$100/mo (Starter Plan - 5 Users)">$100/mo (Starter Plan - 5 Users)</option>
              <option value="$280/mo (Professional Plan - 15 Users)">$280/mo (Professional Plan - 15 Users)</option>
              <option value="$500+/mo (Enterprise SLA - 25+ Users)">$500+/mo (Enterprise SLA - 25+ Users)</option>
              <option value="Under $10,000">Under $10,000</option>
              <option value="$10,000 - $25,000">$10,000 - $25,000</option>
              <option value="$25,000 - $50,000">$25,000 - $50,000</option>
              <option value="$50,000 - $100,000">$50,000 - $100,000</option>
              <option value="$100,000+">$100,000+ (Enterprise)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Message / Specific Requirements *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Outline your requirements, timeline, or current environment..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Submit Inquiry
              </>
            )}
          </button>
        </form>
      )}

      {/* Quick alternative CTA */}
      <div className="pt-3 border-t border-slate-800 space-y-2">
        <Link
          href="/consultation"
          className="w-full py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
        >
          <CalendarCheck className="w-3.5 h-3.5 text-sky-400" />
          Or Book a Free 1-on-1 Consultation
        </Link>
      </div>
    </div>
  );
}
