'use client';

import React from 'react';
import {
  Server,
  Cloud,
  Wrench,
  ShieldCheck,
  Users,
  Database,
  PackageCheck,
  Sparkles,
  Lock,
  Code,
  Cpu,
  LayoutGrid,
  PiggyBank,
  Sliders,
  Award,
  Headphones,
  Network,
  TrendingUp,
  HardDrive,
  BarChart3,
  HelpCircle,
} from 'lucide-react';

interface ServiceIconProps {
  name: string;
  className?: string;
}

export function ServiceIcon({ name, className = 'w-6 h-6' }: ServiceIconProps) {
  switch (name.toLowerCase()) {
    case 'server':
      return <Server className={className} />;
    case 'cloud':
      return <Cloud className={className} />;
    case 'wrench':
      return <Wrench className={className} />;
    case 'shieldcheck':
    case 'shield':
      return <ShieldCheck className={className} />;
    case 'users':
    case 'user':
      return <Users className={className} />;
    case 'database':
      return <Database className={className} />;
    case 'packagecheck':
    case 'package':
      return <PackageCheck className={className} />;
    case 'sparkles':
    case 'sparkle':
      return <Sparkles className={className} />;
    case 'lock':
      return <Lock className={className} />;
    case 'code':
      return <Code className={className} />;
    case 'cpu':
      return <Cpu className={className} />;
    case 'layoutgrid':
      return <LayoutGrid className={className} />;
    case 'piggybank':
      return <PiggyBank className={className} />;
    case 'sliders':
      return <Sliders className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'headphones':
      return <Headphones className={className} />;
    case 'network':
      return <Network className={className} />;
    case 'trendingup':
      return <TrendingUp className={className} />;
    case 'harddrive':
      return <HardDrive className={className} />;
    case 'barchart3':
      return <BarChart3 className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
}
