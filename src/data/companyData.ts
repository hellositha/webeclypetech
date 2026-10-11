export interface ServicePricingPlan {
  name: string;
  badge?: string;
  isPopular?: boolean;
  usersLabel: string;
  userCount: number;
  monthlyPrice: number;
  perUserPrice?: number;
  billingPeriod: string;
  description: string;
  features: string[];
  slaResponse: string;
  supportHours: string;
  ctaText?: string;
}

export interface CoreService {
  id: string;
  slug: string;
  number: number;
  title: string;
  divisionId: 'infrastructure' | 'cloud' | 'software' | 'consulting';
  divisionName: string;
  tagline: string;
  summary: string;
  iconName: string;
  badge: string;
  features: string[];
  techStack: string[];
  benefits: string[];
  idealFor: string[];
  deploymentOptions: string[];
  pricingHighlight?: string;
  pricingPlans?: ServicePricingPlan[];
}

export interface Division {
  id: 'infrastructure' | 'cloud' | 'software' | 'consulting';
  number: number;
  name: string;
  tagline: string;
  description: string;
  mainServices: string;
  iconName: string;
  colorScheme: {
    accent: string;
    border: string;
    bg: string;
    gradient: string;
  };
  keyOfferings: string[];
  serviceSlugs: string[];
}

export interface WhyChoosePillar {
  title: string;
  description: string;
  iconName: string;
  metric: string;
  metricLabel: string;
}

export interface CaseStudy {
  id: string;
  clientIndustry: string;
  clientTitle: string;
  challenge: string;
  solution: string;
  results: string[];
  divisionsInvolved: string[];
}

export const COMPANY_INFO = {
  name: 'ECLYPE Technology',
  legalName: 'ECLYPE Technology Solutions Ltd.',
  tagline: 'Integrated IT Solutions & Services Provider',
  mission:
    'Delivering reliable, secure, scalable, and cost-effective IT solutions tailored to your business needs.',
  visionStatement:
    'Your Trusted Partner in IT Solutions, Infrastructure, and Digital Transformation.',
  phone: '+855 (77) 882 285',
  email: 'contact@eclypetech.biz',
  supportEmail: 'support@eclypetech.biz',
  salesEmail: 'solutions@eclypetech.biz',
  address: '#25G, Chaomchao 3, Porsenchey, Phnom Penh, Cambodia',
  hours: '24/7/365 NOC & SOC Monitoring | Mon - Fri 8:00 AM - 6:00 PM ICT Onsite & Support',
  certifications: [
    'ISO 27001 Certified Standards',
    'SOC 2 Type II Compliant Architecture',
    'Microsoft Solutions Partner',
    'Cisco Premier Certified',
    'HIPAA & GDPR IT Governance Ready',
  ],
  stats: [
    { label: 'Uptime SLA Delivered', value: '99.99%', suffix: '' },
    { label: 'Enterprise Deployments', value: '350+', suffix: '' },
    { label: 'Rapid Response Average', value: '< 10', suffix: 'min' },
    { label: 'Managed Endpoints & Nodes', value: '25,000+', suffix: '' },
  ],
};

export const DIVISIONS: Division[] = [
  {
    id: 'infrastructure',
    number: 1,
    name: 'Enterprise IT Infrastructure',
    tagline: 'Mission-Critical Foundations, Networks & Physical Security',
    description:
      'Data centers, servers, storage, networking, cybersecurity, CCTV, and access control.',
    mainServices:
      'Data centers, servers, storage, networking, cybersecurity, CCTV, and access control',
    iconName: 'Server',
    colorScheme: {
      accent: '#0284C7',
      border: 'border-sky-500/30',
      bg: 'bg-sky-500/10',
      gradient: 'from-sky-500/20 to-blue-600/10',
    },
    keyOfferings: [
      'VoIP PBX Systems, SIP Trunking, Intelligent IVR & Call Center Infrastructure',
      'Mission-Critical UPS Systems, Battery Replacement & 24/7 PM',
      'Precision In-Row Cooling, Liquid Cooling & Containerised Data Centers',
      'Tier III/IV Architecture, Smart iPDUs & Turnkey Server Rooms',
      'Next-Gen Firewalls, Zero Trust Networks & Biometric Access Control',
    ],
    serviceSlugs: ['data-center', 'cctv-security', 'security-network', 'it-infrastructure'],
  },
  {
    id: 'cloud',
    number: 2,
    name: 'Cloud & Managed IT Services',
    tagline: 'Frictionless Hybrid Multi-Cloud & 24/7 Managed NOC/SOC',
    description:
      'SaaS, cloud solutions, IT maintenance, monitoring, backup, and disaster recovery.',
    mainServices:
      'SaaS, cloud solutions, IT maintenance, monitoring, backup, and disaster recovery',
    iconName: 'Cloud',
    colorScheme: {
      accent: '#06B6D4',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
      gradient: 'from-cyan-500/20 to-teal-600/10',
    },
    keyOfferings: [
      'Managed Cloud PBX Telephony with Unlimited Extensions & WebRTC Softphones',
      'Microsoft Azure & AWS Cloud Architecture & Modernization',
      'Microsoft 365 Enterprise Collaboration & Governance',
      'Proactive 24/7 Managed NOC Helpdesk & Device Telemetry',
      'Automated Immutable Backup & Multi-Region Disaster Recovery',
    ],
    serviceSlugs: ['saas-cloud', 'it-infrastructure'],
  },
  {
    id: 'software',
    number: 3,
    name: 'Business Management Software',
    tagline: 'Unified Enterprise Workflows, Payroll, Stock & ERP Intelligence',
    description:
      'HRM, ERP, CRM, stock management, payroll, and custom software.',
    mainServices:
      'HRM, ERP, CRM, stock management, payroll, and custom software',
    iconName: 'LayoutGrid',
    colorScheme: {
      accent: '#8B5CF6',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
      gradient: 'from-purple-500/20 to-indigo-600/10',
    },
    keyOfferings: [
      'Biometric-Linked HRM with Automated Payroll & Shifts',
      'Comprehensive ERP for General Ledger, Procurement & Sales',
      'Multi-Location Real-time Stock, Barcode & Warehouse Tracking',
      'Dynamic CRM Pipelines, Omnichannel Tickets & Automation',
    ],
    serviceSlugs: ['hrm-software', 'erp-software', 'stock-inventory', 'crm-software'],
  },
  {
    id: 'consulting',
    number: 4,
    name: 'IT Consulting & System Integration',
    tagline: 'Strategic Architecture, Enterprise APIs & Bespoke Engineering',
    description:
      'IT consulting, system implementation, API integration, migration, and technical support.',
    mainServices:
      'IT consulting, system implementation, API integration, migration, and technical support',
    iconName: 'Cpu',
    colorScheme: {
      accent: '#10B981',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      gradient: 'from-emerald-500/20 to-green-600/10',
    },
    keyOfferings: [
      'Digital Transformation Roadmaps & Tech Stack Auditing',
      'Custom Enterprise Web Portals & Microservices Architecture',
      'Secure Rest & GraphQL API Gateways & Middleware',
      'Legacy Database Migration & High-Throughput Automation',
    ],
    serviceSlugs: ['software-dev', 'it-infrastructure', 'saas-cloud'],
  },
];

export const CORE_SERVICES: CoreService[] = [
  {
    id: 'saas-cloud',
    slug: 'saas-and-cloud-solutions',
    number: 1,
    title: 'SaaS & Cloud Solutions',
    divisionId: 'cloud',
    divisionName: 'Cloud & Managed IT Services',
    tagline: 'Scalable cloud foundations, Microsoft 365, Azure, and automated disaster recovery.',
    summary:
      'Accelerate business velocity with modern cloud adoption, frictionless Microsoft 365 deployments, hybrid Azure infrastructure, enterprise SaaS applications, and continuous cloud backup.',
    iconName: 'Cloud',
    badge: 'High Availability',
    features: [
      'Software as a Service (SaaS) solutions',
      'Cloud infrastructure and migration',
      'Microsoft 365, Microsoft Azure, and cloud services',
      'Cloud-based business applications',
      'Cloud backup and disaster recovery',
    ],
    techStack: [
      'Microsoft Azure',
      'Microsoft 365 Modern Work',
      'AWS Cloud',
      'Veeam Cloud Connect',
      'Docker & Kubernetes',
      'Terraform',
    ],
    benefits: [
      'Reduce on-premise hardware capital expenditures by up to 45%',
      'Seamless remote and hybrid workforce productivity with zero friction',
      'Automated snapshots with 15-minute Recovery Point Objectives (RPO)',
      'Enterprise Identity & Access Management with Conditional Access',
    ],
    idealFor: [
      'Companies modernizing legacy file servers',
      'Remote and distributed teams needing centralized toolchains',
      'Regulated organizations requiring immutable offsite backups',
    ],
    deploymentOptions: ['Public Cloud', 'Private Cloud', 'Hybrid Multi-Cloud'],
  },
  {
    id: 'it-infrastructure',
    slug: 'it-infrastructure-maintenance',
    number: 2,
    title: 'IT Infrastructure & Maintenance Services',
    divisionId: 'infrastructure',
    divisionName: 'Enterprise IT Infrastructure',
    tagline: 'Reliable system configuration, proactive maintenance, and 24/7 technical helpdesk.',
    summary:
      'Keep your business running without interruption. We design, configure, monitor, and maintain enterprise servers, storage arrays, network switches, and provide responsive helpdesk support.',
    iconName: 'Wrench',
    badge: '24/7 Support',
    features: [
      'IT system installation, configuration, and maintenance',
      'Server, storage, and network infrastructure',
      'Hardware and software troubleshooting',
      'IT helpdesk and technical support',
      'Preventive maintenance and managed IT services',
      'IT infrastructure monitoring and optimization',
    ],
    techStack: [
      'Dell PowerEdge & HPE ProLiant',
      'Cisco Enterprise Networking',
      'Zabbix & Prometheus Telemetry',
      'ITIL Service Desk Framework',
      'SAN/NAS Storage Arrays',
    ],
    benefits: [
      'Guaranteed 10-minute first-response SLA for critical outages',
      'Proactive firmware patching and quarterly preventive audits',
      'Eliminate unexpected IT downtime and server hardware failures',
      'Dedicated technical account manager and certified engineers',
    ],
    idealFor: [
      'Enterprises requiring dedicated 24/7 IT operations without bloated headcount',
      'Branch offices needing uniform equipment standards and rapid dispatch',
      'Facilities with mission-critical server rooms',
    ],
    deploymentOptions: ['On-Premises Managed', 'Remote NOC Monitored', 'Hybrid SLA'],
    pricingHighlight: 'Starter Plan: 5 Users = $100 / month ($20/user)',
    pricingPlans: [
      {
        name: 'Starter Infrastructure Support',
        badge: 'POPULAR FOR SMALL TEAMS',
        isPopular: true,
        usersLabel: 'Up to 5 Users / Workstations',
        userCount: 5,
        monthlyPrice: 100,
        perUserPrice: 20,
        billingPeriod: 'per month',
        description: 'Designed specifically for startups, branch offices, and small business teams needing professional IT maintenance without bloated headcount.',
        features: [
          '5 Users / Workstations & Laptops fully covered',
          'Standard 8x5 Remote Helpdesk & Ticketing Support',
          'Proactive Windows & macOS Security Patch Automation',
          'Managed Antivirus & Endpoint Malware Protection',
          'Office Router, Wi-Fi & Internet Gateway Monitoring',
          'Quarterly IT Health & Preventive Maintenance Audit',
          'Software Installation, Email & Printer Troubleshooting',
        ],
        slaResponse: '< 1 Hour Critical Response SLA',
        supportHours: '8x5 Business Hours (Mon - Fri)',
        ctaText: 'Choose 5 Users Starter ($100/mo)',
      },
      {
        name: 'Professional Team Support',
        badge: 'SCALED TEAMS',
        isPopular: false,
        usersLabel: 'Up to 15 Users / Workstations',
        userCount: 15,
        monthlyPrice: 280,
        perUserPrice: 18.6,
        billingPeriod: 'per month',
        description: 'Comprehensive IT operations support for growing businesses with local network drives, servers, and multi-office requirements.',
        features: [
          'Up to 15 Workstations + 1 Local Office Server / NAS',
          'Priority 30-Minute Ticket First-Response SLA',
          'Automated Daily Local & Cloud Backup Verification',
          'Monthly Scheduled Preventive Maintenance & Cleaning',
          'Network Switch, VLAN, and Firewall Policy Management',
          'Printer, Scanner & Peripheral Fleet Management',
          'Microsoft 365 / Google Workspace Administration',
        ],
        slaResponse: '< 30 Min Priority Response',
        supportHours: 'Extended 12x6 Business Support',
        ctaText: 'Choose Professional (15 Users)',
      },
      {
        name: 'Enterprise Managed Operations',
        badge: '24/7 MISSION-CRITICAL',
        isPopular: false,
        usersLabel: '25 to 100+ Users & Server Pods',
        userCount: 25,
        monthlyPrice: 500,
        perUserPrice: 20,
        billingPeriod: 'per month (Custom Scaling)',
        description: 'Full-spectrum outsourced IT department with dedicated NOC telemetry, instant on-site dispatches, and virtual CIO consultation.',
        features: [
          '25 to 500+ Multi-Branch Users & Server Infrastructure',
          '24/7/365 Proactive NOC Monitoring & Incident Management',
          'Sub-15 Minute Emergency SLA Guarantee',
          'Unlimited Emergency On-Site Field Dispatches in Phnom Penh',
          'Dedicated Technical Account Manager & Certified Senior Engineer',
          'Disaster Recovery (DR) Drills & Annual Penetration Audits',
          'Quarterly IT Strategy & Capex/Opex Budget Alignment',
        ],
        slaResponse: '< 15 Min Emergency SLA',
        supportHours: '24/7/365 NOC & On-Call Engineers',
        ctaText: 'Request Enterprise Proposal',
      },
    ],
  },
  {
    id: 'data-center',
    slug: 'data-center-solutions',
    number: 3,
    title: 'Data Center Solutions',
    divisionId: 'infrastructure',
    divisionName: 'Enterprise IT Infrastructure',
    tagline: 'Tier III/IV turnkey data center engineering, virtualization clusters, and high-availability DR.',
    summary:
      'From custom server room architecture to multi-megawatt enterprise data centers, ECLYPE Technology delivers resilient power, precision cooling, structured cabling, virtualization, and real-time replication.',
    iconName: 'Server',
    badge: 'Tier III/IV Ready',
    features: [
      'Data center design, installation, and deployment',
      'Server, storage, and virtualization solutions',
      'Network infrastructure and structured cabling',
      'Data center migration and consolidation',
      'High availability (HA) and disaster recovery (DR)',
      'Data backup, replication, and business continuity',
    ],
    techStack: [
      'VMware vSphere & Proxmox VE',
      'Pure Storage & NetApp SAN',
      'Schneider Electric & Vertiv UPS',
      'Cat6A / OM4 Fiber Optic Cabling',
      'Active-Active Cluster Fabrics',
    ],
    benefits: [
      'Five-nines (99.999%) computational availability architecture',
      'High-density thermal management and energy-efficient PUE design',
      'Automated site-to-site hypervisor replication and testing',
      'Zero loss data recovery protocols for critical enterprise databases',
    ],
    idealFor: [
      'Financial institutions and banks with strict data sovereignty rules',
      'Healthcare campus centers managing massive imaging records',
      'Enterprises consolidating fragmented server closets into a secure core',
    ],
    deploymentOptions: ['Private On-Prem Data Center', 'Colocation Facility', 'Active-Active Dual DC'],
  },
  {
    id: 'cctv-security',
    slug: 'cctv-physical-security',
    number: 4,
    title: 'CCTV & Physical Security Solutions',
    divisionId: 'infrastructure',
    divisionName: 'Enterprise IT Infrastructure',
    tagline: 'Enterprise IP camera surveillance, AI video analytics, and biometric access control.',
    summary:
      'Protect your facilities, data centers, and personnel with state-of-the-art IP camera surveillance, Network Video Recorders, remote monitoring command centers, and biometric turnstiles.',
    iconName: 'ShieldCheck',
    badge: 'AI Telemetry',
    features: [
      'IP CCTV camera installation and configuration',
      'Network Video Recorder (NVR) and video management systems',
      'Remote video monitoring',
      'Access control and biometric attendance systems',
      'Security system integration',
      'Preventive maintenance and technical support',
    ],
    techStack: [
      'Hikvision & Dahua Enterprise AI Cameras',
      'Milestone & Synology VMS',
      'ZKTeco & Suprema Biometrics',
      'PoE+ Network Switching',
      'Encrypted NVR RAID Storage',
    ],
    benefits: [
      'Crystal-clear 4K visual coverage with thermal and night-vision capabilities',
      'Unified logs linking employee biometric badge-ins with video stamps',
      'Remote 24/7 mobile and central command monitoring with motion alerts',
      'Tamper-proof storage compliant with corporate physical security standards',
    ],
    idealFor: [
      'Corporate headquarters, corporate campuses, and tech parks',
      'Warehouses, distribution hubs, and high-value cargo staging',
      'Hospitals, schools, and secure government-compliant facilities',
    ],
    deploymentOptions: ['Edge NVR Appliance', 'Cloud-Managed VMS', 'Hybrid On-Prem & Cloud'],
  },
  {
    id: 'hrm-software',
    slug: 'human-resource-management-hrm',
    number: 5,
    title: 'Human Resource Management System (HRM)',
    divisionId: 'software',
    divisionName: 'Business Management Software',
    tagline: 'Modern workforce management, biometric attendance sync, automated payroll, and HR analytics.',
    summary:
      'Streamline every step of the employee lifecycle. ECLYPE Technology HRM integrates biometric clock-in devices, shift scheduling, automated tax/payroll calculations, leave workflows, and executive analytics.',
    iconName: 'Users',
    badge: 'Biometric Synced',
    features: [
      'Employee information and organizational management',
      'Time and attendance tracking',
      'Biometric device integration',
      'Leave and shift management',
      'Payroll and employee benefits management',
      'HR reports and workforce analytics',
    ],
    techStack: [
      'Real-time Biometric Device SDK Sync',
      'Automated Multi-Tier Tax Engine',
      'Self-Service Mobile Portal',
      'PostgreSQL Audit Ledger',
      'RESTful HR Open API',
    ],
    benefits: [
      'Eliminate 95% of manual payroll calculation errors and time fraud',
      'Seamless synchronization with biometric thumbprint and facial recognition readers',
      'Employee self-service mobile portal for leave requests and payslips',
      'Comprehensive reporting for compliance, overtime costs, and turnover trends',
    ],
    idealFor: [
      'Growing mid-market companies with complex hourly shift schedules',
      'Multi-branch retail and hotel operations with decentralized staff',
      'Enterprises needing strict statutory compliance and tax reporting',
    ],
    deploymentOptions: ['ECLYPE Cloud SaaS', 'Dedicated On-Premise Host', 'Private Virtual Cloud'],
  },
  {
    id: 'erp-software',
    slug: 'enterprise-resource-planning-erp',
    number: 6,
    title: 'Enterprise Resource Planning (ERP)',
    divisionId: 'software',
    divisionName: 'Business Management Software',
    tagline: 'End-to-end integration across finance, supply chain, procurement, sales, and operations.',
    summary:
      'Consolidate disjointed departments into a single source of truth. Our ERP connects finance, purchasing, inventory, sales order workflows, billing, and executive business analytics into one seamless platform.',
    iconName: 'Database',
    badge: 'Full Integration',
    features: [
      'Integrated business process management',
      'Finance and accounting',
      'Procurement and purchasing',
      'Inventory and warehouse management',
      'Sales and operational management',
      'Business reporting and analytics',
    ],
    techStack: [
      'Double-entry General Ledger Engine',
      'Multi-currency & Multi-entity Architecture',
      'Automated PO & Approval Workflows',
      'Interactive PowerBI / Metabase Dashboards',
      'PostgreSQL High-Volume Transactions',
    ],
    benefits: [
      'Real-time visibility into company cashflow, margins, and operating expenses',
      'Automate purchase orders, vendor invoices, and 3-way matching',
      'Connect sales pipelines directly with fulfillment and inventory reserves',
      'Multi-company and multi-currency consolidation with audit trails',
    ],
    idealFor: [
      'Manufacturers tracking raw materials, bill of materials, and finished goods',
      'Wholesale distributors coordinating high-volume order fulfillment',
      'Service corporations seeking auditable financial accounting',
    ],
    deploymentOptions: ['Modular Cloud ERP', 'Enterprise On-Premise Installation', 'Hybrid Sync'],
  },
  {
    id: 'stock-inventory',
    slug: 'stock-and-inventory-management',
    number: 7,
    title: 'Stock & Inventory Management',
    divisionId: 'software',
    divisionName: 'Business Management Software',
    tagline: 'Real-time multi-location warehouse control, barcode scanning, and low-stock intelligence.',
    summary:
      'Never lose track of a single SKU. ECLYPE Technology Stock Management delivers real-time stock levels, multi-bin warehouse tracking, barcode/RFID integration, batch/expiry dates, and automated reorder alerts.',
    iconName: 'PackageCheck',
    badge: 'Real-time Tracking',
    features: [
      'Real-time stock monitoring',
      'Warehouse and inventory control',
      'Product and item management',
      'Stock transfers and adjustments',
      'Purchase and sales tracking',
      'Low-stock alerts and inventory reporting',
    ],
    techStack: [
      'Barcode & QR Scanner SDK',
      'Automated FIFO/LIFO Valuation Engine',
      'Mobile Warehouse Worker App',
      'Multi-Warehouse Rebalance Engine',
      'Webhook Alert Notifications',
    ],
    benefits: [
      'Prevent stockouts and over-purchasing with automated threshold alerts',
      'Accelerate pick-pack-ship operations with handheld scanner integration',
      'Full traceability of item lot numbers, serials, and expiration timelines',
      'Accurate inventory valuation metrics synchronized directly with finance',
    ],
    idealFor: [
      'E-commerce fulfillment centers managing thousands of active SKUs',
      'Pharmaceutical & food distributors needing batch and expiry tracking',
      'Automotive and industrial spare parts wholesalers',
    ],
    deploymentOptions: ['Cloud SaaS with Mobile App', 'Local Warehouse Edge Server', 'ERP Native Addon'],
  },
  {
    id: 'crm-software',
    slug: 'customer-relationship-management-crm',
    number: 8,
    title: 'Customer Relationship Management (CRM)',
    divisionId: 'software',
    divisionName: 'Business Management Software',
    tagline: 'Holistic lead tracking, dynamic sales pipelines, automated outreach, and ticketing.',
    summary:
      'Turn leads into loyal customers. Our CRM provides complete customer histories, visual sales pipelines, deal forecasting, automated customer engagement sequences, and customer support ticket tracking.',
    iconName: 'Sparkles',
    badge: 'Sales Acceleration',
    features: [
      'Customer and contact management',
      'Sales pipeline management',
      'Lead and opportunity tracking',
      'Customer service management',
      'Sales performance reporting',
      'Customer engagement and follow-up automation',
    ],
    techStack: [
      'Interactive Kanban Deal Stages',
      'Email & WhatsApp API Messaging',
      'SLA-Backed Helpdesk Ticketing',
      'Lead Scoring & AI Follow-Up Triggers',
      'Customer 360 Timeline Log',
    ],
    benefits: [
      'Shorten sales cycles by up to 35% with systematic follow-up sequences',
      '360-degree timeline of client emails, quotes, support tickets, and payments',
      'Predictable revenue forecasting for sales directors and executives',
      'Customer service desk integration with resolution SLAs',
    ],
    idealFor: [
      'B2B sales organizations with high-touch consulting sales cycles',
      'Customer support organizations requiring multi-channel ticketing',
      'Professional services agencies managing multiple client projects',
    ],
    deploymentOptions: ['SaaS Cloud CRM', 'Private On-Prem Host', 'Integrated ERP-CRM Suite'],
  },
  {
    id: 'security-network',
    slug: 'it-security-network-solutions',
    number: 9,
    title: 'IT Security & Network Solutions',
    divisionId: 'infrastructure',
    divisionName: 'Enterprise IT Infrastructure',
    tagline: 'Zero-Trust network architecture, next-gen firewalls, SD-WAN, and endpoint cybersecurity.',
    summary:
      'Defend your perimeter and internal assets against modern cyber threats. We implement enterprise firewalls, Zero Trust VPNs, VLAN network segmentation, endpoint protection (EDR), and active intrusion detection.',
    iconName: 'Lock',
    badge: 'Zero-Trust Cyber',
    features: [
      'Enterprise network design and implementation',
      'Firewall and VPN configuration',
      'Network segmentation and VLAN implementation',
      'Endpoint security and cybersecurity solutions',
      'Wireless networking and connectivity',
      'Network monitoring and performance optimization',
    ],
    techStack: [
      'Fortinet & Sophos Next-Gen Firewalls',
      'Cisco Meraki & Aruba Enterprise Wi-Fi 6',
      'WireGuard & OpenVPN Zero Trust Tunnels',
      'CrowdStrike & SentinelOne EDR',
      'SIEM / Syslog Central Audit',
    ],
    benefits: [
      'Isolate sensitive accounting and server subnets from general guest networks',
      'Secure remote workers with MFA-protected encrypted VPN gateways',
      'Mitigate ransomware and zero-day malware before it spreads laterally',
      'Guaranteed high-bandwidth, jitter-free enterprise Wi-Fi coverage',
    ],
    idealFor: [
      'Financial services, law firms, and confidential IP companies',
      'Manufacturing plants segmenting SCADA/IoT devices from corporate networks',
      'Multi-branch retail networks needing unified SD-WAN connectivity',
    ],
    deploymentOptions: ['Managed Security Service (MSSP)', 'On-Premises Appliance', 'Cloud SD-WAN'],
  },
  {
    id: 'software-dev',
    slug: 'software-development-system-integration',
    number: 10,
    title: 'Software Development & System Integration',
    divisionId: 'consulting',
    divisionName: 'IT Consulting & System Integration',
    tagline: 'Custom business applications, high-throughput API integrations, and legacy modernization.',
    summary:
      'When off-the-shelf software falls short, ECLYPE Technology engineers bespoke web systems, secure API gateways, middleware connectors, and automated workflows that unify your existing software platforms.',
    iconName: 'Code',
    badge: 'Custom Engineering',
    features: [
      'Custom business application development',
      'Web-based management systems',
      'API development and third-party integration',
      'Business process automation',
      'Database design and management',
      'System integration and ongoing application support',
    ],
    techStack: [
      'Next.js & TypeScript Full-Stack',
      'PostgreSQL & Redis Caching',
      'REST & GraphQL Enterprise Gateways',
      'RabbitMQ / Apache Kafka Messaging',
      'CI/CD GitHub Actions & Docker',
    ],
    benefits: [
      'Customized workflows built specifically for your competitive advantage',
      'Unify separate third-party apps (ERP, CRM, Banking, Logistics) into one pane',
      'High-performance, secure databases optimized for petabyte scalability',
      'Dedicated SLA maintenance, continuous security patching, and bug fixes',
    ],
    idealFor: [
      'Companies with unique business logic not supported by generic software',
      'Enterprises needing seamless middleware to connect legacy systems with modern SaaS',
      'Organizations building customer-facing client portals or vendor portals',
    ],
    deploymentOptions: ['Cloud-Native Architecture', 'Private On-Prem Containerized', 'Serverless Hybrid'],
  },
];

export const WHY_CHOOSE_US: WhyChoosePillar[] = [
  {
    title: 'Cost-Effective Solutions',
    description:
      'Competitive pricing aligned directly with your business requirements. We eliminate unnecessary licensing bloat and optimize hardware architecture to deliver maximum ROI.',
    iconName: 'PiggyBank',
    metric: '35%+',
    metricLabel: 'Average Capex & Opex Savings',
  },
  {
    title: 'Tailored Services',
    description:
      'No one-size-fits-all packages. Every infrastructure design, ERP module, or network topology is engineered specifically around your company’s unique operational workflows.',
    iconName: 'Sliders',
    metric: '100%',
    metricLabel: 'Custom Configuration Fit',
  },
  {
    title: 'Enterprise Expertise',
    description:
      'Infrastructure and systems battle-tested for business-critical operations. Our engineers hold top industry certifications across Cisco, Microsoft, VMware, and cybersecurity.',
    iconName: 'Award',
    metric: '15+ Yrs',
    metricLabel: 'Senior Engineering Experience',
  },
  {
    title: 'Reliable Support',
    description:
      'Professional installation, continuous preventive maintenance, and 24/7/365 technical assistance. Rapid dispatch teams and dedicated technical account leads.',
    iconName: 'Headphones',
    metric: '< 10 min',
    metricLabel: 'Emergency Outage Response',
  },
  {
    title: 'Integrated Technology',
    description:
      'Connecting physical infrastructure, cloud computing, cybersecurity, and business management software into one cohesive, frictionless ecosystem.',
    iconName: 'Network',
    metric: 'Single',
    metricLabel: 'Integrated Vendor Partner',
  },
  {
    title: 'Scalable Architecture',
    description:
      'Technology that expands smoothly as your business scales. From 10 employees to 10,000 users across global locations without architectural bottlenecks.',
    iconName: 'TrendingUp',
    metric: '10x',
    metricLabel: 'Effortless Workload Scalability',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'apex-logistics',
    clientIndustry: 'Global Logistics & Freight',
    clientTitle: 'Unified Multi-Warehouse ERP & Real-time Telemetry',
    challenge:
      'Apex Logistics operated 8 regional fulfillment centers with detached spreadsheet records, resulting in 18% inventory discrepancies and delayed order dispatches.',
    solution:
      'Deployed ECLYPE Technology ERP & Stock Management integrated with barcode scanner terminals, real-time fleet dispatching, and high-availability cloud database replication.',
    results: [
      'Reduced inventory reconciliation errors by 98.4%',
      'Accelerated order picking speed from 42 mins to under 9 mins',
      'Saved over $280,000 in annual administrative and stockout overhead',
    ],
    divisionsInvolved: ['Business Management Software', 'Cloud & Managed IT Services'],
  },
  {
    id: 'vanguard-financial',
    clientIndustry: 'Financial Advisory & Banking',
    clientTitle: 'Zero-Trust Network, Private Cloud & Next-Gen Firewall',
    challenge:
      'Strict regulatory compliance demanded isolated financial data repositories, immutable audit trails, and multi-factor VPN tunnels for 220 hybrid wealth managers.',
    solution:
      'Engineered an isolated hybrid cloud environment with Fortinet next-generation firewalls, automated 15-minute immutable offsite backups, and strict 802.1X network access control.',
    results: [
      'Achieved 100% compliance during annual SOC 2 Type II audit',
      'Zero downtime or security breaches across 3 consecutive years',
      'Decreased latency across distributed branch VPN tunnels by 60%',
    ],
    divisionsInvolved: ['Enterprise IT Infrastructure', 'Cloud & Managed IT Services'],
  },
  {
    id: 'metro-health',
    clientIndustry: 'Hospitality & Healthcare Network',
    clientTitle: 'Biometric HRM & 4K CCTV Physical Security Consolidation',
    challenge:
      'A hospital network spanning 4 campuses suffered from manual shift disputes, buddy punching, and disjointed analog video security systems.',
    solution:
      'Implemented ECLYPE Technology Biometric HRM synchronized with optical turnstiles and deployed 180+ AI IP CCTV cameras with centralized NVR storage and automated payroll generation.',
    results: [
      'Eliminated monthly payroll calculation disputes down to 0 incidents',
      '100% video coverage of sensitive pharmaceuticals storage and ICU zones',
      'Shift handover verification time cut from 45 minutes to 5 minutes',
    ],
    divisionsInvolved: ['Enterprise IT Infrastructure', 'Business Management Software'],
  },
];

export const FAQS = [
  {
    question: 'How does ECLYPE Technology integrate both physical infrastructure and software?',
    answer:
      'Unlike single-discipline IT vendors, ECLYPE Technology operates 4 specialized divisions under one roof: Enterprise IT Infrastructure, Cloud & Managed Services, Business Management Software, and IT Consulting. This means your biometric hardware links directly to your HRM software, your data center servers host your ERP database, and your cybersecurity firewalls protect your cloud SaaS seamlessly.',
  },
  {
    question: 'What is your typical deployment timeline for enterprise solutions?',
    answer:
      'Turnaround times depend on scope: Standard Cloud & Microsoft 365 migrations take 1 to 2 weeks; IT Infrastructure, network cabling, and CCTV installations take 2 to 4 weeks; while comprehensive ERP or HRM software deployments typically span 4 to 8 weeks including staff training and data migration.',
  },
  {
    question: 'What are your support SLAs and response guarantees?',
    answer:
      'We provide tiered Service Level Agreements (SLAs). For Priority 1 critical infrastructure or server downtime, our Managed IT NOC responds in under 10 minutes with 24/7/365 active dispatch. Standard support inquiries are addressed within 1 hour.',
  },
  {
    question: 'Can ECLYPE Technology customize the HRM, ERP, or CRM software for our workflow?',
    answer:
      'Yes. Our Business Management Software division and Software Engineering division customize workflows, approval hierarchies, custom reports, API integrations with your local banks, and legacy database migrations to match your exact business model.',
  },
  {
    question: 'Do you offer on-premise, cloud, or hybrid deployments?',
    answer:
      'All three. We understand that compliance, sovereignty, or bandwidth constraints require diverse deployment strategies. We support 100% on-premises dedicated hardware, sovereign private cloud, public cloud (Azure/AWS), or active-active hybrid configurations.',
  },
];
