export interface VoipSpecification {
  label: string;
  value: string;
}

export interface VoipSolutionPillar {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  tagline: string;
  description: string;
  iconName: string;
  badge: string;
  metric: { value: string; label: string };
  highlights: string[];
  capabilities: string[];
  technicalSpecs: VoipSpecification[];
}

export interface VoipHardwareItem {
  id: string;
  model: string;
  brand: 'Yealink' | 'Fanvil' | 'Grandstream' | 'Softphone';
  categoryLabel: string;
  sipAccounts: string;
  display: string;
  audioCodec: string;
  networkPorts: string;
  targetEnvironment: string;
  keyHighlights: string[];
  badge?: string;
}

export interface VoipPricingPlan {
  name: string;
  badge?: string;
  isPopular?: boolean;
  extensionsLabel: string;
  monthlyPrice: number;
  billingPeriod: string;
  concurrentCalls: string;
  description: string;
  features: string[];
  ivrLevels: string;
  recordingStorage: string;
  supportSla: string;
  ctaText: string;
}

export const VOIP_SOLUTION_PILLARS: VoipSolutionPillar[] = [
  {
    id: 'voip-pbx-systems',
    title: 'Cloud & On-Premise VoIP PBX Systems',
    shortTitle: 'VoIP PBX Systems',
    category: 'Enterprise Telephony',
    tagline: 'High-Availability IP-PBX, Zero Single Points of Failure & Cloud Agility',
    description:
      'Replace aging legacy copper phone lines and expensive proprietary PBX hardware with ECLYPE Technology modern IP-PBX architecture. Deploy seamlessly on our high-speed cloud infrastructure, private virtual servers, or robust on-premises appliances with active-passive high availability (HA) clustering.',
    iconName: 'Server',
    badge: '99.999% Voice Uptime',
    metric: { value: '0ms', label: 'Failover Disruption' },
    highlights: [
      'Flexible deployment: Managed Cloud PBX, On-Premise Dedicated Appliance, or Hybrid Bridge',
      'Dual active-standby PBX clustering with automatic SIP trunk failover',
      'Unified enterprise dial plan connecting multiple branches, remote workers, and headquarters',
      'TLS signaling and SRTP media stream encryption for military-grade call privacy',
      'Centralized web management portal with live diagnostic telemetry and SIP debug traces',
    ],
    capabilities: [
      'SIP RFC 3261 compliance supporting all major IP phone vendors and softphone clients',
      'Automated nightly cloud backups of PBX configuration, call detail records (CDR), and voicemail',
      'Advanced call routing by caller ID (CLI), time conditions, day/night mode, and DID patterns',
      'Integrated WebRTC media gateway enabling instant browser-based calling without plugins',
    ],
    technicalSpecs: [
      { label: 'Protocols', value: 'SIP (UDP/TCP/TLS), WebRTC (WSS), IAX2' },
      { label: 'Media Encryption', value: 'SRTP (AES-128/256), TLS 1.3' },
      { label: 'High Availability', value: 'Heartbeat VRRP / Pacemaker Cluster Active-Passive' },
      { label: 'Audio Codecs', value: 'Opus, G.722 (HD Voice), G.711u/a, G.729AB' },
      { label: 'Concurrent Capacity', value: 'Up to 2,000+ simultaneous audio channels' },
    ],
  },
  {
    id: 'call-center-suite',
    title: 'Omnichannel Call Center & ACD Queues',
    shortTitle: 'Call Center Suite',
    category: 'Contact Center',
    tagline: 'Intelligent Call Distribution, Live Supervisor Coaching & Real-Time Wallboards',
    description:
      'Empower your customer support and sales teams with an enterprise-grade contact center suite. Benefit from intelligent Automatic Call Distribution (ACD), skill-based routing, priority VIP tiers, live supervisor whisper/barge-in tools, 100% encrypted call recordings, and customizable real-time operational wallboards.',
    iconName: 'Headphones',
    badge: 'Real-Time Telemetry',
    metric: { value: '< 15s', label: 'Average Queue Wait' },
    highlights: [
      'Intelligent ACD queues: Round-robin, least-recent, few-calls, random, and skill-weighted',
      'Real-time supervisor tools: Silent monitor, whisper (coach agent), and barge-in (join call)',
      'Automated stereo dual-channel call recording with PCI-DSS compliance pause/resume',
      'Dynamic wallboards: Live active calls, queue wait times, abandonment rate, and agent status',
      'Customer callback queue: Callers can request an automatic callback without losing queue spot',
    ],
    capabilities: [
      'Post-call customer satisfaction (CSAT) automated interactive surveys',
      'Custom wrap-up dispositions and call reason tags for CRM analytics',
      'Agent performance reporting: Average Handle Time (AHT), First Call Resolution (FCR), and idle time',
      'Music on hold (MOH) with position announcements and estimated wait time notifications',
    ],
    technicalSpecs: [
      { label: 'Routing Algorithms', value: 'Skill-based, Weighted Round-Robin, Least Recent, Ring All' },
      { label: 'Recording Storage', value: 'Encrypted MP3/WAV with AWS S3 / Local NAS replication' },
      { label: 'Supervisor Tools', value: 'Spy / Silent Listen, Whisper Coaching, Full Barge-in' },
      { label: 'Reporting Metrics', value: 'SLA%, Abandonment%, AHT, FCR, Agent Occupancy' },
      { label: 'CRM CTI Protocol', value: 'REST Webhooks, WebSocket Event Stream, AMI / ARI' },
    ],
  },
  {
    id: 'sip-trunking',
    title: 'Carrier-Grade SIP Trunking & DIDs',
    shortTitle: 'SIP Trunking',
    category: 'Carrier Connectivity',
    tagline: 'Crystal-Clear Voice Routing, Local Cambodia Numbers & Global DID Interconnects',
    description:
      'Connect your IP-PBX directly to the public switched telephone network (PSTN) with high-capacity SIP trunking from ECLYPE Technology. We deliver local Cambodia DID geographic numbers (Phnom Penh 023, mobile trunks 077/012), toll-free 1800 lines, international termination, and multi-carrier failover routing.',
    iconName: 'Network',
    badge: 'Carrier Redundant',
    metric: { value: '99.999%', label: 'Trunk Availability' },
    highlights: [
      'Local Cambodia landline DIDs (023) and mobile network SIP interconnects',
      'Global direct inward dialing (DID) numbers across 60+ countries for multinational presence',
      'Dynamic multi-carrier least-cost routing (LCR) with automatic secondary carrier failover',
      'Flexible channels: Scale from 4 to 500+ concurrent channels on demand without hardware changes',
      'Fraud protection with automated credit threshold limits and suspicious destination blocking',
    ],
    capabilities: [
      'Emergency calling routing with geographic address registration',
      'RFC 2833 and SIP INFO out-of-band DTMF signaling for reliable touch-tone IVR interaction',
      'T.38 Fax-over-IP gateway protocol for error-free virtual faxing over digital trunks',
      'Real-time jitter, packet loss, and Mean Opinion Score (MOS > 4.3) quality monitoring',
    ],
    technicalSpecs: [
      { label: 'Signaling', value: 'SIP 2.0 (RFC 3261) over UDP, TCP, or TLS' },
      { label: 'Media Quality', value: 'G.711 A-law / U-law, G.729, Opus HD (MOS 4.4+)' },
      { label: 'DTMF Relaying', value: 'RFC 2833, RFC 4733, SIP INFO, In-band' },
      { label: 'Fax Support', value: 'T.38 Real-time FoIP & G.711 Pass-Through' },
      { label: 'SLA Guarantee', value: '99.999% uptime with multi-homed BGP IP gateways' },
    ],
  },
  {
    id: 'intelligent-ivr',
    title: 'Multi-Level Intelligent IVR & Auto-Attendant',
    shortTitle: 'Intelligent IVR',
    category: 'Call Automation',
    tagline: 'Dual-Language (Khmer/English) Voice Menus, Time Conditions & Visual Call Flow',
    description:
      'Deliver professional first impressions and eliminate caller hold times with our intelligent interactive voice response (IVR) engine. Configure multi-level visual menus, dual-language prompts (Khmer & English), holiday calendars, after-hours voicemail dispatch, and database-driven dynamic routing.',
    iconName: 'GitBranch',
    badge: 'Dual-Language IVR',
    metric: { value: '100%', label: 'Automated Routing' },
    highlights: [
      'Intuitive multi-level tree menus: "Press 1 for Sales, 2 for Support, 3 for Billing..."',
      'Bilingual voice recordings: Professional studio-recorded prompts in Khmer and English',
      'Smart time-condition routing: Seamless automatic switching between Day, Lunch, Night, and Holiday modes',
      'Direct dial extension: Callers can enter any 3 or 4-digit extension at any time during menu',
      'Self-service database lookup: Verify account balances, ticket status, or order tracking via DTMF/API',
    ],
    capabilities: [
      'Visual drag-and-drop call flow builder for effortless branch adjustments',
      'Voicemail-to-email: Automatically sends audio recordings with transcription straight to inbox',
      'Customizable timeout and invalid key handling to ensure callers never get stranded',
      'VIP Caller bypass: Route high-priority clients directly to their dedicated account manager',
    ],
    technicalSpecs: [
      { label: 'Menu Depth', value: 'Unlimited nested IVR branch levels' },
      { label: 'Prompt Languages', value: 'Khmer, English, Chinese, French supported' },
      { label: 'Scheduling', value: 'Per-minute Time Conditions, Weekly Templates & Custom Holidays' },
      { label: 'Audio Formats', value: 'WAV 16-bit 8kHz/16kHz Mono, MP3, GSM' },
      { label: 'API Webhooks', value: 'Real-time JSON REST hook on DTMF input' },
    ],
  },
  {
    id: 'unlimited-extensions',
    title: 'Unlimited Extensions & Device Mobility',
    shortTitle: 'Unlimited Extensions',
    category: 'Scalability & Mobility',
    tagline: 'Zero Per-User Licensing Penalties, Softphones, WebRTC & Desktop Apps',
    description:
      'Unlike legacy telecommunication vendors who charge exorbitant monthly fees per user, ECLYPE Technology VoIP PBX includes unlimited extensions. Add 10, 100, or 1,000+ extensions without paying a single cent more in software licenses. Connect physical desk phones, smartphones, and laptops under one unified extension.',
    iconName: 'Users',
    badge: 'Zero Per-Seat Fees',
    metric: { value: 'Unlimited', label: 'Extensions Included' },
    highlights: [
      'Zero per-extension license fees: Scale your organization freely without software penalty',
      'Multi-device extension ringing: Incoming calls ring your desk phone, laptop, and mobile simultaneously',
      'Cross-platform mobility: Dedicated softphone apps for iOS, Android, Windows, and macOS',
      'WebRTC in-browser softphone: Agents can take and make HD calls directly inside the web browser',
      'Remote worker transparency: Employees make and receive calls showing the corporate office caller ID',
    ],
    capabilities: [
      'Free inter-branch and extension-to-extension calling worldwide over secure IP',
      'Presence status indicators: See whether colleagues are Available, Busy, On a Call, or Away in real time',
      'Instant conference bridge rooms with PIN protection for scheduled team standups',
      'Hot-desking support: Log into any physical IP phone in the office with personal PIN and load your extension',
    ],
    technicalSpecs: [
      { label: 'Extension Limit', value: 'Unlimited (constrained only by compute hardware capacity)' },
      { label: 'Softphone Apps', value: 'iOS, Android, Windows 11/10, macOS, Linux' },
      { label: 'WebRTC Support', value: 'Chrome, Edge, Firefox, Safari (zero plugin required)' },
      { label: 'Simultaneous Devices', value: 'Up to 5 devices registered per single extension' },
      { label: 'BLF Presence', value: 'Busy Lamp Field (RFC 4235) visual keys on desk phones' },
    ],
  },
  {
    id: 'unified-communications-crm',
    title: 'Unified Communications & CRM Integration',
    shortTitle: 'CRM Integration',
    category: 'Productivity & APIs',
    tagline: 'Click-to-Call, Caller Popups, Automated Call Logs & WhatsApp/Omnichannel',
    description:
      'Connect voice seamlessly with your business applications. When a client calls, their CRM profile pops up instantly on the agent’s screen. Integrate with ECLYPE Technology CRM, ERP, HubSpot, Salesforce, Zoho, Microsoft Teams, and custom web portals via rich REST APIs and webhooks.',
    iconName: 'Zap',
    badge: 'CTI Screen Pop',
    metric: { value: '1-Click', label: 'Dial From CRM' },
    highlights: [
      'Click-to-Call: Dial any phone number directly from your browser, CRM, or ERP with a single click',
      'Inbound caller screen popup: Agent instantly sees caller history, open tickets, and deal stages',
      'Automatic call logging: Every inbound, outbound, and missed call is logged to the client contact card',
      'Call recording attachments: Synchronize call audio recordings directly into CRM client timelines',
      'Microsoft Teams Direct Routing: Make and receive external phone calls natively inside Teams',
    ],
    capabilities: [
      'Automated WhatsApp/SMS followup sent when an agent finishes an inquiry call',
      'Full REST API and WebSocket events for custom enterprise integrations',
      'Call analytics dashboard with heatmaps showing peak calling hours and customer wait trends',
      'Voicemail transcription converting voice messages into readable text sent via email or Slack',
    ],
    technicalSpecs: [
      { label: 'CRM Connectors', value: 'ECLYPE CRM/ERP, Salesforce, HubSpot, Zoho, Odoo, Zendesk' },
      { label: 'API Architecture', value: 'RESTful API, Webhooks, WebSocket Event Push, AMI/ARI' },
      { label: 'Teams Integration', value: 'Certified Direct Routing SBC / Microsoft Graph' },
      { label: 'Click-to-Call', value: 'Chrome Extension, Web tel: protocol, WebRTC API' },
      { label: 'CDR Logging', value: 'Real-time PostgreSQL database with automated export' },
    ],
  },
];

export const FEATURED_VOIP_HARDWARE: VoipHardwareItem[] = [
  {
    id: 'yealink-t46u',
    model: 'Yealink SIP-T46U',
    brand: 'Yealink',
    categoryLabel: 'Executive IP Phone',
    sipAccounts: '16 SIP Accounts',
    display: '4.3" 480x272-pixel Color Display with Backlight',
    audioCodec: 'Optima HD Voice, Opus, G.722, Acoustic Shield',
    networkPorts: 'Dual Gigabit Ethernet, PoE, Dual USB 2.0',
    targetEnvironment: 'Executives, managers, and busy receptionists needing high call visibility',
    keyHighlights: [
      '16 SIP accounts with 10 line keys and 27 DSS memory keys',
      'Dual USB ports supporting Bluetooth dongle, Wi-Fi dongle, and USB call recording',
      'Yealink Acoustic Shield technology eliminating background ambient office noise',
      'Hall switch handset for quieter desk operation and extended mechanical life',
    ],
    badge: 'TOP SELLER',
  },
  {
    id: 'yealink-t54w',
    model: 'Yealink SIP-T54W',
    brand: 'Yealink',
    categoryLabel: 'Wireless Executive Phone',
    sipAccounts: '16 SIP Accounts',
    display: '4.3" Color Screen (Adjustable Viewing Angle)',
    audioCodec: 'Optima HD Voice, Opus Codec, Noise Filtering',
    networkPorts: 'Dual Gigabit Ethernet, Built-in Wi-Fi & Bluetooth',
    targetEnvironment: 'Modern wireless offices and corporate executives seeking cable-free desks',
    keyHighlights: [
      'Built-in dual-band 2.4G/5G Wi-Fi (802.11a/b/g/n/ac) and Bluetooth 4.2',
      'Adjustable multi-angle screen for ergonomic viewing in any office lighting',
      'Cordless expansion: Pair up to 4 DECT handsets via DD10K dongle as a master base',
      'USB 2.0 port for headset integration or flash drive call recording',
    ],
    badge: 'BUILT-IN WI-FI',
  },
  {
    id: 'fanvil-x7c',
    model: 'Fanvil X7C Enterprise',
    brand: 'Fanvil',
    categoryLabel: 'High-Density DSS Console',
    sipAccounts: '20 SIP Accounts',
    display: '5.0" High-Resolution Color Display',
    audioCodec: 'Harman Speaker, Opus, G.722 HD Audio',
    networkPorts: 'Dual Gigabit Ethernet, PoE, Bluetooth & Wi-Fi Ready',
    targetEnvironment: 'Call center supervisors, dispatchers, and administrative receptionists',
    keyHighlights: [
      'Up to 60 DSS key entries (12 physical keys across 5 pages) for BLF speed dial',
      'Premium Harman Kardon tuned speaker for crystal-clear hands-free speakerphone calls',
      'Video call preview support: View IP camera or video door phone streams on screen',
      'Hotspot function: Share one phone number across multiple desktop extension devices',
    ],
    badge: '60 DSS KEYS',
  },
  {
    id: 'grandstream-grp2615',
    model: 'Grandstream GRP2615',
    brand: 'Grandstream',
    categoryLabel: 'Carrier-Grade Phone',
    sipAccounts: '16 SIP Accounts',
    display: '4.3" Color TFT LCD Display',
    audioCodec: 'Opus, G.722, Noise Shield Technology',
    networkPorts: 'Dual Gigabit Ethernet, PoE, Integrated Wi-Fi & Bluetooth',
    targetEnvironment: 'High-volume enterprise deployments requiring centralized cloud zero-touch provisioning',
    keyHighlights: [
      'Carrier-grade security featuring dual-firmware images, encrypted data storage, and secure boot',
      'Integrated dual-band Wi-Fi and Bluetooth for wireless headsets',
      'Supported by Grandstream Device Management System (GDMS) for cloud zero-touch setup',
      'Swappable faceplates for custom corporate brand logo placement',
    ],
  },
  {
    id: 'yealink-cp965',
    model: 'Yealink CP965 Touch Conference',
    brand: 'Yealink',
    categoryLabel: 'Boardroom Conference Phone',
    sipAccounts: '1 SIP Account / 12-Way Hybrid UC Meeting',
    display: '5.0" 720x1280 Capacitive Touchscreen',
    audioCodec: 'Optima HD Voice, Full-Duplex, Noise Proof',
    networkPorts: 'Gigabit Ethernet, Built-in Wi-Fi & Bluetooth, PoE',
    targetEnvironment: 'Executive boardrooms, medium-to-large meeting halls (up to 20 people)',
    keyHighlights: [
      '13-microphone array (12 perimeter pickup mics + 1 central noise-canceling mic)',
      '6-meter (20-foot) 360-degree voice pickup radius with zero dead angles',
      'Acoustic fabric surface resistant to water and oil spills in boardroom environments',
      '12-party conference call capability combining SIP, Bluetooth, and USB UC meetings',
    ],
    badge: 'BOARDROOM GRADE',
  },
  {
    id: 'webrtc-softphone',
    model: 'ECLYPE WebRTC & Mobile Softphone',
    brand: 'Softphone',
    categoryLabel: 'Software & Mobile Client',
    sipAccounts: 'Unlimited Extensions',
    display: 'Responsive Web Dialer, iOS, Android, macOS & Windows Apps',
    audioCodec: 'Adaptive Opus HD (16kHz - 48kHz), Noise Cancellation',
    networkPorts: 'Zero Hardware Required (Runs over Wi-Fi / 4G / 5G / Ethernet)',
    targetEnvironment: 'Remote workers, hybrid staff, field sales reps, and customer service teams',
    keyHighlights: [
      'No physical desk phone needed: Make and answer calls directly inside Chrome/Edge or smartphone',
      'Push notification engine waking app on incoming calls with zero battery drain on iOS & Android',
      'Integrated visual voicemail, call history, corporate directory, and real-time coworker BLF presence',
      'Seamless in-call transfer, hold, mute, 3-way conference, and call recording trigger',
    ],
    badge: 'FREE WITH PBX',
  },
];

export const VOIP_PRICING_PLANS: VoipPricingPlan[] = [
  {
    name: 'Business PBX Starter',
    badge: 'SMALL BUSINESS',
    isPopular: false,
    extensionsLabel: 'Up to 20 Extensions (Free)',
    monthlyPrice: 65,
    billingPeriod: 'per month',
    concurrentCalls: 'Up to 8 Concurrent Calls',
    description:
      'Perfect for startups, professional offices, and single-location businesses modernizing from analog telephone lines.',
    features: [
      'Unlimited internal extension calling',
      'Dual-Language Auto-Attendant (Khmer & English IVR)',
      '1 Local Cambodia DID Trunk Integration (023 / Mobile)',
      'Voicemail-to-Email audio delivery',
      'Free WebRTC In-Browser Softphone & Mobile Apps',
      'Time-based Day/Night automatic call routing',
      'Standard 8x5 technical helpdesk & remote setup',
    ],
    ivrLevels: '1 Level (Up to 9 menu choices)',
    recordingStorage: '7 Days Cloud Retention (10 GB)',
    supportSla: '< 1 Hour SLA Response',
    ctaText: 'Deploy Business Starter ($65/mo)',
  },
  {
    name: 'Growth Call Center Pro',
    badge: 'MOST POPULAR',
    isPopular: true,
    extensionsLabel: 'Unlimited Extensions (0 Per-Seat Fees)',
    monthlyPrice: 150,
    billingPeriod: 'per month',
    concurrentCalls: 'Up to 30 Concurrent Calls',
    description:
      'Engineered for growing customer support teams, sales departments, and multi-branch companies needing ACD queues and live coaching.',
    features: [
      'Unlimited Extensions with zero per-seat licensing penalties',
      'Advanced Call Center ACD queues & skill-based routing',
      'Supervisor Console: Live listen, whisper coaching & call barge-in',
      'Multi-Level Nested IVR trees with holiday scheduling',
      '100% Automatic dual-channel call recording & audit trail',
      'Real-time wallboard dashboard showing queue stats & agent status',
      'CRM & ERP CTI Integration (Click-to-Call & Screen Popups)',
      'Customer callback in queue (no hold-time penalty)',
      'Priority 12x6 support with certified telecom engineers',
    ],
    ivrLevels: 'Multi-Level Unlimited Nested IVRs',
    recordingStorage: '90 Days High-Definition Audio (100 GB)',
    supportSla: '< 30 Min Priority Response',
    ctaText: 'Deploy Call Center Pro ($150/mo)',
  },
  {
    name: 'Enterprise Omni-Contact Center',
    badge: 'MISSION-CRITICAL',
    isPopular: false,
    extensionsLabel: 'Unlimited Multi-Branch & Multi-Tenant',
    monthlyPrice: 290,
    billingPeriod: 'per month (Custom Scaling)',
    concurrentCalls: '100+ Concurrent Channels (Scalable)',
    description:
      'High-capacity voice architecture for financial institutions, large customer contact centers, hotels, and multinational operations.',
    features: [
      'Unlimited Extensions across unlimited global branches',
      'Active-Active High Availability (HA) Cluster with 99.999% SLA',
      'Multi-carrier redundant SIP trunks with automatic failover',
      'Comprehensive REST APIs & WebSocket real-time event streaming',
      'AI Voicebot & Speech-to-Text integration ready',
      'Unlimited Call Recording Retention with automated S3 sync',
      'Dedicated Technical Account Manager & VoIP Network Engineer',
      'On-site field deployment and IP phone autoprovisioning in Phnom Penh',
      '24/7/365 Proactive NOC voice telemetry monitoring',
    ],
    ivrLevels: 'Dynamic Database / API-Driven IVRs',
    recordingStorage: 'Unlimited S3 / NAS Cold Storage Sync',
    supportSla: '< 15 Min Emergency SLA Guarantee',
    ctaText: 'Request Enterprise Architecture',
  },
];

export const VOIP_TELEPHONY_SPECS: VoipSpecification[] = [
  { label: 'Protocols Supported', value: 'SIP 2.0 (RFC 3261), WebRTC (WSS), IAX2, RTP/RTCP, T.38 FoIP' },
  { label: 'Voice Encryption', value: 'TLS 1.3 / 1.2 Signaling Encryption & SRTP (AES-128/256) Media Stream' },
  { label: 'Audio Codecs', value: 'Opus (6-510 kbps HD), G.722 Wideband, G.711u (PCMU), G.711a (PCMA), G.729AB' },
  { label: 'Network Resilience', value: 'Dynamic Jitter Buffer, Packet Loss Concealment (PLC), QoS DiffServ/ToS Tagging' },
  { label: 'Trunk Interconnects', value: 'E1/T1 PRI Gateways, FXO/FXS Analog Gateways, Pure IP SIP Trunks, Cambodia DIDs' },
  { label: 'Hardware Compatibility', value: 'Yealink, Fanvil, Grandstream, Cisco, Polycom, Snom, Flyingvoice' },
  { label: 'Softphone Platforms', value: 'Apple iOS, Android, Windows 11/10, macOS, Linux, Chrome/Edge WebRTC' },
  { label: 'High Availability', value: 'Pacemaker/Corosync active-passive clustering with virtual IP failover (< 1 sec)' },
  { label: 'Service SLA', value: '99.999% Carrier Voice Availability SLA backed by 24/7 NOC Monitoring' },
];
