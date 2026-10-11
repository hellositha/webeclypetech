'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Phone,
  PhoneForwarded,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Server,
  Headphones,
  Network,
  GitBranch,
  Users,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  CalendarCheck,
  Clock,
  Sliders,
  Activity,
  Layers,
  ChevronRight,
  FileText,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Radio,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Lock,
  Cpu,
  Globe,
  Hash,
  X,
} from 'lucide-react';
import {
  VOIP_SOLUTION_PILLARS,
  FEATURED_VOIP_HARDWARE,
  VOIP_PRICING_PLANS,
  VOIP_TELEPHONY_SPECS,
  VoipHardwareItem,
} from '@/data/voipData';
import { COMPANY_INFO } from '@/data/companyData';

export default function VoipPbxSolutionsPage() {
  // Navigation / Filter States
  const [activePillarId, setActivePillarId] = useState<string>('voip-pbx-systems');
  const [hardwareFilter, setHardwareFilter] = useState<string>('all');
  const [selectedHardware, setSelectedHardware] = useState<VoipHardwareItem | null>(null);

  // Interactive WebRTC Softphone Simulator State
  const [dialNumber, setDialNumber] = useState<string>('');
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callTimer, setCallTimer] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isOnHold, setIsOnHold] = useState<boolean>(false);
  const [callPrompt, setCallPrompt] = useState<string>('');
  const [ivrAudioStep, setIvrAudioStep] = useState<string>('');

  // Call timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  // Softphone keypad handler
  const handleKeypadPress = (val: string) => {
    if (callStatus === 'connected' && dialNumber === '888') {
      // Interactive IVR key selection simulation
      handleIvrDtmfInput(val);
      return;
    }
    if (callStatus === 'idle') {
      setDialNumber((prev) => prev + val);
    }
  };

  const handleStartCall = (targetNum?: string) => {
    const num = targetNum || dialNumber;
    if (!num.trim()) return;

    setCallStatus('calling');
    setCallPrompt(`Connecting to SIP Extension ${num}...`);

    setTimeout(() => {
      setCallStatus('connected');
      if (num === '888') {
        setCallPrompt('Connected to ECLYPE Intelligent IVR Auto-Attendant');
        setIvrAudioStep(
          '🔊 [Khmer & English IVR]: "Welcome to ECLYPE Technology. Press 1 for Enterprise Sales, Press 2 for 24/7 Support NOC, Press 3 for Billing, or dial any extension."'
        );
      } else if (num === '100') {
        setCallPrompt('Connected: Extension 100 (Enterprise Sales Desk)');
        setIvrAudioStep('🔊 Agent Connected: "ECLYPE Technology Sales Desk, how can we assist your business today?"');
      } else if (num === '200') {
        setCallPrompt('Connected: Extension 200 (24/7 Technical Support NOC)');
        setIvrAudioStep('🔊 NOC Engineer Connected: "ECLYPE 24/7 Technical Support NOC, please provide your service ID."');
      } else if (num === '300') {
        setCallPrompt('Connected: Extension 300 (IT Operations Desk)');
        setIvrAudioStep('🔊 Operator Connected: "ECLYPE Infrastructure Operations, transfer requested."');
      } else {
        setCallPrompt(`Connected to Extension ${num} • HD Opus Voice (Encrypted)`);
        setIvrAudioStep('🔊 Simulated Call Active: Ringing tone answered with crystal-clear Opus wideband audio.');
      }
    }, 1200);
  };

  const handleIvrDtmfInput = (digit: string) => {
    if (digit === '1') {
      setIvrAudioStep('🔊 [Menu 1 Selected]: Routing to Enterprise Sales Queue (Priority Skill-based ACD)... Agent ringing!');
    } else if (digit === '2') {
      setIvrAudioStep('🔊 [Menu 2 Selected]: Routing to 24/7 Technical Support NOC... Live call queue position #1.');
    } else if (digit === '3') {
      setIvrAudioStep('🔊 [Menu 3 Selected]: Routing to Accounting & Billing Team... Agent ringing!');
    } else {
      setIvrAudioStep(`🔊 [DTMF Key ${digit}]: Input registered. Routing to Operator Desk.`);
    }
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setCallPrompt('Call Terminated. Call Detail Record (CDR) & Recording Saved to Database.');
    setIvrAudioStep('');
    setIsMuted(false);
    setIsOnHold(false);
    setTimeout(() => {
      setCallStatus('idle');
      setCallPrompt('');
    }, 1600);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter hardware
  const filteredHardware =
    hardwareFilter === 'all'
      ? FEATURED_VOIP_HARDWARE
      : FEATURED_VOIP_HARDWARE.filter((h) => h.brand.toLowerCase() === hardwareFilter.toLowerCase());

  const activePillar =
    VOIP_SOLUTION_PILLARS.find((p) => p.id === activePillarId) || VOIP_SOLUTION_PILLARS[0];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:py-24 border-b border-slate-800/80 overflow-hidden bg-radial-[at_50%_0%] from-blue-950/40 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
              <PhoneCall className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>Enterprise Telephony &amp; Voice Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              VoIP PBX System &amp;{' '}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                Call Center Solutions
              </span>
            </h1>

            <p className="mt-5 text-lg text-slate-300 leading-relaxed max-w-2xl">
              Modernize your corporate communications with carrier-grade SIP trunking, intelligent dual-language IVR, omnichannel call center queues, and{' '}
              <span className="text-white font-semibold">unlimited extensions with zero per-seat licensing fees</span>.
            </p>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800/80">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xl sm:text-2xl font-black text-blue-400">99.999%</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Voice Carrier SLA</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xl sm:text-2xl font-black text-cyan-400">Unlimited</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Extensions Included</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">&lt; 15 ms</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Ultra-Low Jitter</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xl sm:text-2xl font-black text-purple-400">Khmer/ENG</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Bilingual IVR Prompts</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <a
                href="#interactive-softphone"
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-500 to-sky-600 text-white hover:from-blue-400 hover:to-sky-500 shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 hover:scale-[1.02]"
              >
                <Phone className="w-4 h-4" /> Try Softphone &amp; IVR Demo
              </a>
              <a
                href="#pricing-plans"
                className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
              >
                <span>View Solution Plans</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE WEBRTC SOFTPHONE & PBX DIALER DEMO */}
      <section id="interactive-softphone" className="py-16 md:py-24 border-b border-slate-800 bg-slate-900/30 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              Live Voice Interactive Sandbox
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Test Our PBX Dialpad &amp; Intelligent IVR Engine
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Experience the power of ECLYPE Technology WebRTC softphone. Dial any extension below or test our bilingual IVR menu in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Softphone Dialpad Hardware/UI */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/20 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      ECLYPE WebRTC Softphone
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      SIP Registered • 127.0.0.1:5060 OK
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Ext: 1001 (Demo)
                </span>
              </div>

              {/* Dialed Number Display */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-5 text-center min-h-[80px] flex flex-col justify-center">
                <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-widest">
                  {dialNumber || (callStatus === 'idle' ? 'Enter Extension...' : 'In Call')}
                </div>
                {callStatus === 'connected' && (
                  <div className="flex items-center justify-center gap-2 mt-1.5 text-xs text-emerald-400 font-mono font-semibold">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Duration: {formatTimer(callTimer)}</span>
                    <span className="text-slate-500">•</span>
                    <span>Opus HD 48kHz</span>
                  </div>
                )}
                {callStatus === 'calling' && (
                  <div className="text-xs text-blue-400 font-mono mt-1 animate-pulse">
                    Routing call over SIP Trunk...
                  </div>
                )}
                {callStatus === 'ended' && (
                  <div className="text-xs text-rose-400 font-mono mt-1">Call Disconnected</div>
                )}
              </div>

              {/* Keypad Grid */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {[
                  { key: '1', sub: '' },
                  { key: '2', sub: 'ABC' },
                  { key: '3', sub: 'DEF' },
                  { key: '4', sub: 'GHI' },
                  { key: '5', sub: 'JKL' },
                  { key: '6', sub: 'MNO' },
                  { key: '7', sub: 'PQRS' },
                  { key: '8', sub: 'TUV' },
                  { key: '9', sub: 'WXYZ' },
                  { key: '*', sub: '' },
                  { key: '0', sub: '+' },
                  { key: '#', sub: '' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleKeypadPress(item.key)}
                    className="p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 text-white transition-all active:scale-95 text-center group"
                  >
                    <span className="text-lg font-bold block group-hover:text-blue-400 transition-colors">
                      {item.key}
                    </span>
                    {item.sub && (
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block -mt-1">
                        {item.sub}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Softphone Action Controls */}
              <div className="flex items-center gap-3">
                {callStatus === 'idle' ? (
                  <>
                    <button
                      onClick={() => handleStartCall()}
                      disabled={!dialNumber}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                    >
                      <Phone className="w-4 h-4" /> Start Call
                    </button>
                    <button
                      onClick={() => setDialNumber('')}
                      disabled={!dialNumber}
                      className="py-3 px-4 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-3 rounded-xl border transition-colors ${
                        isMuted
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                      title={isMuted ? 'Unmute' : 'Mute Microphone'}
                    >
                      {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setIsOnHold(!isOnHold)}
                      className={`p-3 rounded-xl border transition-colors ${
                        isOnHold
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                      title={isOnHold ? 'Resume Call' : 'Hold Call'}
                    >
                      {isOnHold ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleEndCall}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30"
                    >
                      <PhoneCall className="w-4 h-4 rotate-[135deg]" /> Hang Up
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right: Quick Extensions Directory & Interactive IVR Audio Stream */}
            <div className="lg:col-span-7 space-y-5">
              {/* Call Status Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                    <Radio className="w-4 h-4 text-blue-400" />
                    Live Telemetry &amp; Voice Stream
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    SRTP Encrypted
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-slate-200">
                    {callPrompt || 'Select an extension below or dial on the keypad to begin.'}
                  </div>
                  {ivrAudioStep && (
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-mono leading-relaxed animate-in fade-in duration-300">
                      {ivrAudioStep}
                    </div>
                  )}
                  {callStatus === 'connected' && (
                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60">
                      <span>Stereo Call Recording: Active</span>
                      <span>Quality: MOS 4.45 (Optimal)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pre-configured Demo Extensions */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-3">
                  Click to Auto-Dial Test Extensions:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      ext: '888',
                      title: 'Intelligent Multi-Level IVR',
                      desc: 'Dual-language Khmer/English auto-attendant menu',
                      badge: 'IVR DEMO',
                      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
                    },
                    {
                      ext: '100',
                      title: 'Enterprise Sales ACD Queue',
                      desc: 'Skill-based queue with agent skill weighting',
                      badge: 'SALES DESK',
                      color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
                    },
                    {
                      ext: '200',
                      title: '24/7 Support NOC Helpdesk',
                      desc: 'Round-robin dispatch with supervisor monitoring',
                      badge: 'NOC SUPPORT',
                      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
                    },
                    {
                      ext: '300',
                      title: 'IT Operations & Infrastructure',
                      desc: 'Direct extension ring with voicemail-to-email backup',
                      badge: 'OPS EXTENSION',
                      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
                    },
                  ].map((item) => (
                    <button
                      key={item.ext}
                      onClick={() => {
                        setDialNumber(item.ext);
                        handleStartCall(item.ext);
                      }}
                      className="p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-left group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                          Ext: {item.ext}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${item.color}`}>
                          {item.badge}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200">{item.title}</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Architecture Highlight Box */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Zero Per-User Licensing Penalty:</span> Whether your company has 15 extensions or 1,500 extensions, ECLYPE Technology VoIP PBX is priced strictly by concurrent call channel capacity. You will never pay monthly seat licenses per employee!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 SOLUTION PILLARS DEEP-DIVE */}
      <section className="py-16 md:py-24 border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              Complete Solution Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Six Enterprise Telephony Pillars
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              From carrier interconnects to AI voice automation, discover how ECLYPE Technology transforms corporate voice communication.
            </p>
          </div>

          {/* Pillar Selector Buttons */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {VOIP_SOLUTION_PILLARS.map((pillar) => (
              <button
                key={pillar.id}
                onClick={() => setActivePillarId(pillar.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activePillarId === pillar.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{pillar.shortTitle}</span>
              </button>
            ))}
          </div>

          {/* Active Pillar Showcase Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                    {activePillar.category}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    {activePillar.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {activePillar.title}
                  </h3>
                  <p className="text-sm font-semibold text-blue-400 mt-1">
                    {activePillar.tagline}
                  </p>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {activePillar.description}
                </p>

                {/* Highlights List */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                    Core Technical Highlights
                  </h4>
                  <ul className="space-y-2.5">
                    {activePillar.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technical Specifications & Metrics Column */}
              <div className="lg:col-span-5 space-y-5">
                {/* Metric Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/20 text-center">
                  <div className="text-4xl font-black text-white">{activePillar.metric.value}</div>
                  <div className="text-xs text-blue-300 font-medium mt-1">
                    {activePillar.metric.label}
                  </div>
                </div>

                {/* Capabilities Box */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                    Enterprise Capabilities
                  </h4>
                  <div className="space-y-2">
                    {activePillar.capabilities.map((c, i) => (
                      <div key={i} className="text-xs text-slate-300 pl-3 border-l-2 border-blue-500/40">
                        {c}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Specs Table */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                    Engineering Parameters
                  </h4>
                  <div className="divide-y divide-slate-800/80 text-xs">
                    {activePillar.technicalSpecs.map((s, i) => (
                      <div key={i} className="py-2 flex items-center justify-between">
                        <span className="text-slate-400 font-mono">{s.label}:</span>
                        <span className="font-semibold text-slate-200 text-right">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HARDWARE & SOFTPHONE CATALOG */}
      <section className="py-16 md:py-24 border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              Endpoints &amp; Handsets
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Certified IP Phones &amp; Softphones
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              We provide turnkey provisioning for leading IP phones from Yealink, Fanvil, and Grandstream, alongside zero-cost WebRTC and mobile applications.
            </p>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {['all', 'Yealink', 'Fanvil', 'Grandstream', 'Softphone'].map((b) => (
                <button
                  key={b}
                  onClick={() => setHardwareFilter(b)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    hardwareFilter.toLowerCase() === b.toLowerCase()
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {b === 'all' ? 'All Hardware & Apps' : b}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHardware.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                      {item.brand}
                    </span>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {item.model}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5 mb-4">
                    {item.categoryLabel}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300 mb-4 pb-4 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-mono">Accounts:</span>
                      <span className="font-semibold text-slate-200">{item.sipAccounts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-mono">Screen:</span>
                      <span className="font-semibold text-slate-200 text-right truncate ml-2">
                        {item.display}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-mono">Network:</span>
                      <span className="font-semibold text-slate-200 text-right truncate ml-2">
                        {item.networkPorts}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {item.keyHighlights.slice(0, 3).map((h, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <p className="text-[11px] text-slate-400 italic">
                    Ideal for: {item.targetEnvironment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY UNLIMITED EXTENSIONS MATTERS (COMPARISON) */}
      <section className="py-16 md:py-24 border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              The Real Cost Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Why Pay Per User When You Can Have Unlimited Extensions?
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Traditional telecommunications providers penalize business growth by billing $25 to $45 per user each month. ECLYPE Technology replaces user taxes with flat concurrent trunk capacity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Traditional Telco Model */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-rose-500/20 text-slate-300 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                  Traditional Per-Seat Telecom
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold">
                  EXPENSIVE
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white">
                $1,500 - $2,500 <span className="text-xs font-normal text-slate-400">/ month (50 Users)</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Exorbitant $30 - $50 monthly license charge per employee extension</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Hidden extra charges for IVR levels, call recording, and queue analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Vendor lock-in with proprietary desk phone hardware</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Rigid multi-year contracts with steep cancellation penalties</span>
                </li>
              </ul>
            </div>

            {/* ECLYPE Technology Model */}
            <div className="p-8 rounded-3xl bg-blue-950/20 border-2 border-blue-500/40 text-slate-200 space-y-5 relative shadow-xl shadow-blue-950/30">
              <div className="flex items-center justify-between pb-4 border-b border-blue-500/20">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                  ECLYPE Technology VoIP PBX
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                  70%+ SAVINGS
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white">
                $150 <span className="text-xs font-normal text-slate-400">/ month (Unlimited Users)</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Zero per-extension fees:</strong> Add 20, 100, or 500 extensions at $0 extra cost</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>All enterprise features included: IVR, ACD queues, recordings, and supervisor tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Open SIP standard: Connect any Yealink, Fanvil, Grandstream, or softphone</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Free inter-office and multi-branch calling over secure private IP</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPARENT PRICING PLANS */}
      <section id="pricing-plans" className="py-16 md:py-24 border-b border-slate-800 bg-slate-900/40 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              Scalable Subscriptions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              VoIP PBX &amp; Call Center Service Plans
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Transparent monthly pricing with zero long-term lock-in. All plans include 24/7 technical monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VOIP_PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all ${
                  plan.isPopular
                    ? 'bg-slate-900 border-2 border-blue-500 shadow-2xl shadow-blue-950/40 relative'
                    : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {plan.name}
                    </span>
                    {plan.badge && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          plan.isPopular
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="text-4xl font-extrabold text-white">
                      ${plan.monthlyPrice}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{plan.billingPeriod}</div>
                    <div className="text-xs font-semibold text-blue-400 mt-1">
                      {plan.extensionsLabel}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-6 pb-6 border-b border-slate-800 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="space-y-2 mb-6 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-mono">Channels:</span>
                      <span className="font-semibold text-slate-200">{plan.concurrentCalls}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-mono">IVR Engine:</span>
                      <span className="font-semibold text-slate-200">{plan.ivrLevels}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-mono">Recording:</span>
                      <span className="font-semibold text-slate-200">{plan.recordingStorage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-mono">Support SLA:</span>
                      <span className="font-semibold text-emerald-400">{plan.supportSla}</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-8">
                    {plan.features.map((f, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/consultation?plan=${encodeURIComponent(plan.name)}`}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs text-center transition-all flex items-center justify-center gap-2 ${
                    plan.isPopular
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNICAL SPECIFICATIONS TABLE */}
      <section className="py-16 md:py-24 border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              Telecom Standard Alignment
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Carrier Telephony Specifications
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Built on battle-tested open standards and hardened SIP proxies for zero-jitter, carrier-grade voice stability.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="divide-y divide-slate-800 text-xs">
              {VOIP_TELEPHONY_SPECS.map((spec, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/40 transition-colors"
                >
                  <span className="font-mono text-slate-400 font-semibold sm:w-1/3">
                    {spec.label}
                  </span>
                  <span className="font-semibold text-slate-200 sm:w-2/3">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-16 md:py-20 bg-gradient-to-tr from-blue-950/80 via-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
            <PhoneCall className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Modernize Your Office Voice &amp; Call Center?
          </h2>

          <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
            Schedule a free VoIP telecom assessment in Phnom Penh. Our certified voice engineers will evaluate your network bandwidth, configure your custom IVR flow, and deploy proof-of-concept softphones for your team.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/consultation?interest=voip-pbx"
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-500 to-sky-600 text-white hover:from-blue-400 hover:to-sky-500 shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" /> Book Free Telephony Audit
            </Link>
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="px-8 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition-colors flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-blue-400" /> Call {COMPANY_INFO.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
