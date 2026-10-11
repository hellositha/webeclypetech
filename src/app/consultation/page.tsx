'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  User,
  Mail,
  Phone,
  Send,
  AlertCircle,
} from 'lucide-react';
import { DIVISIONS, COMPANY_INFO } from '@/data/companyData';

export default function ConsultationPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    business_size: '50-249 employees',
    division: 'Enterprise IT Infrastructure',
    preferred_date: '',
    preferred_time: '10:00 AM EST',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to schedule consultation.');
      }
    } catch {
      setError('Network communication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
            <CalendarCheck className="w-3.5 h-3.5" />
            1-on-1 Technical Consultation
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Schedule an IT Architecture Review
          </h1>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            Meet with an ECLYPE Technology Senior Systems Architect to review your existing data center, network security posture, cloud roadmap, or business ERP requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto items-start">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
                What to Expect During the Session:
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Comprehensive Gap Analysis:</strong> We inspect current bottlenecks across compute, network, surveillance, and software workflows.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Architecture Blueprint:</strong> Receive preliminary topology recommendations and BOM hardware estimates.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>No Sales Pressure:</strong> Purely technical discussion led by certified solutions engineers.
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Direct Emergency Contact
              </h4>
              <p className="text-xs text-slate-300">
                For urgent server room outages or active security incidents, call our 24/7 Managed NOC dispatch immediately:
              </p>
              <div className="pt-2 text-sky-400 font-mono font-bold text-base">
                {COMPANY_INFO.phone}
              </div>
            </div>
          </div>

          {/* Right Booking Form */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Consultation Confirmed in PostgreSQL!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.full_name}</strong>. Your session request has been booked for <strong className="text-sky-400">{formData.preferred_date || 'your preferred date'}</strong> at <strong className="text-sky-400">{formData.preferred_time}</strong>. An email calendar invitation with video bridge will follow shortly.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setFormData({
                      full_name: '',
                      email: '',
                      phone: '',
                      company_name: '',
                      business_size: '50-249 employees',
                      division: 'Enterprise IT Infrastructure',
                      preferred_date: '',
                      preferred_time: '10:00 AM EST',
                      notes: '',
                    });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors"
                >
                  Schedule Another Meeting
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-2">
                  Reserve Your Architecture Session
                </h3>

                {error && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Enterprise Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="work@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Company Name"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number (e.g. +855 77 882 285)"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Organization Size
                    </label>
                    <select
                      value={formData.business_size}
                      onChange={(e) => setFormData({ ...formData, business_size: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="1-19 employees">1-19 employees</option>
                      <option value="20-49 employees">20-49 employees</option>
                      <option value="50-249 employees">50-249 employees (Mid-Market)</option>
                      <option value="250-999 employees">250-999 employees</option>
                      <option value="1000+ employees">1000+ employees (Enterprise)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Primary Division Focus
                    </label>
                    <select
                      value={formData.division}
                      onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                    >
                      {DIVISIONS.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.number}. {d.name}
                        </option>
                      ))}
                      <option value="Cross-Division Full Solution">
                        Cross-Division Full Solution
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Target Meeting Date
                    </label>
                    <input
                      type="date"
                      value={formData.preferred_date}
                      onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Preferred Time Slot
                    </label>
                    <select
                      value={formData.preferred_time}
                      onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="09:00 AM EST">09:00 AM EST</option>
                      <option value="10:00 AM EST">10:00 AM EST</option>
                      <option value="11:30 AM EST">11:30 AM EST</option>
                      <option value="02:00 PM EST">02:00 PM EST</option>
                      <option value="03:30 PM EST">03:30 PM EST</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Preliminary Architecture Notes or Questions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your current IT infrastructure, pain points, or project goals..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    'Recording to PostgreSQL...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Confirm &amp; Book Consultation
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
