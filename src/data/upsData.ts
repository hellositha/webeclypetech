export interface UPSSpecification {
  label: string;
  value: string;
}

export interface FeaturedProduct {
  id: string;
  model: string;
  category: 'rackmount' | 'modular-3phase' | 'facility' | 'battery' | 'container' | 'liquid-cooling';
  categoryLabel: string;
  capacityRange: string;
  powerFactor: string;
  topology: string;
  efficiency: string;
  batteryTech: string;
  formFactor: string;
  targetEnvironment: string;
  keyHighlights: string[];
  specs: UPSSpecification[];
  badge?: string;
}

export interface UPSSolutionSection {
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
  technicalSpecs: UPSSpecification[];
}

export interface UPSServicePlan {
  name: string;
  badge?: string;
  responseTime: string;
  visitsPerYear: string;
  loadBankTesting: boolean;
  thermalImaging: boolean;
  batteryInspection: string;
  emergencySupport: string;
  partsDiscount: string;
  idealFor: string;
}

export const UPS_SOLUTION_SECTIONS: UPSSolutionSection[] = [
  {
    id: 'ups-systems',
    title: 'UPS Systems',
    shortTitle: 'UPS Systems',
    category: 'Power Protection',
    tagline: 'True Online Double-Conversion & Modular 3-Phase Power Architectures',
    description:
      'Continuous, clean, uninterrupted power for mission-critical IT workloads. From compact 1kVA rackmount edge nodes to scalable 800kVA modular facility UPS systems, ECLYPE Technology ensures zero transfer time (VFI) and up to 99% ECO-mode electrical efficiency.',
    iconName: 'Zap',
    badge: '0ms Transfer Time',
    metric: { value: '99.2%', label: 'ECO-Mode Efficiency' },
    highlights: [
      'Modular 3-Phase Online Double-Conversion (10kVA - 800kVA)',
      'High-Density 1U/2U/3U Rackmount UPS (1kVA - 10kVA) with Unity Power Factor (kVA = kW)',
      'Hot-swappable power modules with N+1, N+X, and 2N parallel redundancy',
      'Wide input voltage window (110V - 300V) extending battery operational lifecycle',
      'Dual utility input feeds and built-in automatic static bypass switchgear',
    ],
    capabilities: [
      'Industrial-grade IGBT rectifier and inverter design with low harmonic distortion (THDi < 3%)',
      'Cold-start capability allowing UPS startup purely on battery during total blackout',
      'Generator compatibility with soft-walk-in power ramping to prevent generator stalling',
      'Intelligent battery management (ABM) with three-stage temperature-compensated charging',
    ],
    technicalSpecs: [
      { label: 'Topology', value: 'VFI-SS-111 Online Double Conversion' },
      { label: 'Capacity Range', value: '1 kVA to 800 kVA (Parallelable to 4.8 MVA)' },
      { label: 'Output Power Factor', value: '1.0 (Unity kW = kVA) on enterprise models' },
      { label: 'Transfer Time', value: '0 ms (Zero interruption on utility failure)' },
      { label: 'Online Efficiency', value: '96.5% Normal / 99.2% ECO-Mode' },
    ],
  },
  {
    id: 'battery-replacement',
    title: 'Battery Replacement & Energy Storage',
    shortTitle: 'Battery Replacement',
    category: 'Energy Storage',
    tagline: 'High-Discharge VRLA and Advanced Lithium-Ion (LiFePO4) Battery Cabinets',
    description:
      'Batteries are the beating heart of your emergency power supply. We provide turnkey battery string audits, conductance testing, replacement, eco-certified recycling, and modernization to long-life Lithium-Ion (LiFePO4) battery cabinets that cut footprint by 60% and triple operational lifespans.',
    iconName: 'BatteryCharging',
    badge: '10+ Year LiFePO4 Life',
    metric: { value: '60%', label: 'Footprint Reduction' },
    highlights: [
      'Valve Regulated Lead Acid (VRLA / AGM) high-rate discharge replacement strings',
      'Next-generation Lithium-Ion (LiFePO4) battery cabinets with integrated BMS',
      'Individual cell internal impedance, conductance, and voltage load testing',
      'Comprehensive on-site string replacement with zero downtime (hot-swap / bypass)',
      'Turnkey hazardous waste removal and certified environmentally safe battery recycling',
    ],
    capabilities: [
      'Midtronics and Megger battery impedance diagnostic reporting per IEEE 1188 / 450 standards',
      'Real-Time Battery Monitoring System (BMS) with thermal runaway early detection',
      '3x faster recharge times with Lithium-Ion, restoring full backup within 90 minutes',
      'T-rated seismic and industrial battery racks with breaker disconnect enclosures',
    ],
    technicalSpecs: [
      { label: 'Chemistry Options', value: 'LiFePO4 (Lithium Iron Phosphate) & VRLA / AGM' },
      { label: 'Design Lifespan', value: '12-15 Years (Lithium) / 5-8 Years (High-Rate VRLA)' },
      { label: 'Cycle Life', value: '3,000+ Cycles (Lithium) vs 250 Cycles (Lead Acid)' },
      { label: 'Weight Reduction', value: 'Up to 70% lighter floor loading than lead-acid' },
      { label: 'Operating Temp Range', value: '0°C to 45°C without severe degradation' },
    ],
  },
  {
    id: 'cooling-solutions',
    title: 'Precision Cooling Solutions',
    shortTitle: 'Cooling Solutions',
    category: 'Thermal Management',
    tagline: 'Close-Coupled In-Row Cooling & Aisle Containment Architectures',
    description:
      'Modern high-density compute racks generate immense thermal energy. ECLYPE Technology designs and installs Precision Air Conditioning (PAC), close-coupled in-row cooling units, and Hot/Cold Aisle Containment systems to eliminate hotspots, lower PUE, and maximize equipment longevity.',
    iconName: 'Snowflake',
    badge: 'PUE Optimization',
    metric: { value: '< 1.25', label: 'Target Datacenter PUE' },
    highlights: [
      'In-Row Precision Cooling units (10kW - 60kW capacity) placed directly next to heat loads',
      'Computer Room Air Handlers (CRAH) & DX Perimeter Precision Air Conditioners (PAC)',
      'Cold Aisle Containment (CAC) and Hot Aisle Containment (HAC) modular panel systems',
      'Electronically Commutated (EC) variable-speed fan arrays and modulating inverter compressors',
      'Dual-circuit DX and chilled water (CW) redundancy configurations',
    ],
    capabilities: [
      'Computational Fluid Dynamics (CFD) airflow simulation to eliminate recirculating hot air',
      'Microprocessor climate controllers with automatic dehumidification and humidification',
      'Free-cooling economizer integration utilizing ambient outdoor air when temperature permits',
      'Smart sensor feedback loops dynamically throttling cooling based on real-time server exhaust',
    ],
    technicalSpecs: [
      { label: 'Cooling Capacity', value: '10 kW to 120 kW per individual unit' },
      { label: 'Compressor Tech', value: 'Variable Speed DC Inverter Scroll Compressor' },
      { label: 'Fan Technology', value: 'High-Efficiency EC Centrifugal Backward-Curved' },
      { label: 'Refrigerants', value: 'Eco-Friendly R410A / Low-GWP R32 & R454B' },
      { label: 'Containment Types', value: 'Roof & Door Cold/Hot Aisle Hard Panels' },
    ],
  },
  {
    id: 'ups-service-maintenance',
    title: 'UPS Service & 24/7 Maintenance',
    shortTitle: 'Service & Maintenance',
    category: 'Lifecycle Services',
    tagline: 'Guaranteed 2-Hour SLA Dispatch, Load Bank Testing & Preventive Overhauls',
    description:
      'Prevent catastrophic power outages before they occur. Our certified power engineers deliver 24/7 emergency dispatch, rigorous quarterly preventive maintenance, thermal infrared thermography hot-spot scans, full-load bank testing, and capacitor/fan lifecycle refurbishments.',
    iconName: 'Wrench',
    badge: '2-Hour Emergency SLA',
    metric: { value: '24/7/365', label: 'Certified NOC Dispatch' },
    highlights: [
      'Guaranteed 2-hour or 4-hour on-site emergency dispatch SLA in Cambodia & SE Asia',
      'Full load bank testing with resistive/reactive load trailers (up to 1,000kW)',
      'FLIR infrared thermal imaging of all busbars, breakers, terminals, and power modules',
      'Capacitor bank (DC bus & AC filter) and cooling fan proactive lifecycle replacement',
      'Comprehensive IEEE & OEM-compliant maintenance certification and diagnostic reports',
    ],
    capabilities: [
      'Firmware upgrades and calibration of voltage, current, and phase metering transducers',
      'Internal static bypass switch testing and emergency power-off (EPO) verification',
      'Original OEM factory replacement parts stocked locally in Phnom Penh for zero waiting',
      'Custom Service Level Agreements (SLAs) tailored to financial, telecom, and healthcare compliance',
    ],
    technicalSpecs: [
      { label: 'SLA Options', value: '2-Hour Critical / 4-Hour Standard / Next Business Day' },
      { label: 'Load Bank Capacity', value: 'Up to 1.2 MW step-load testing capability' },
      { label: 'Thermography', value: 'High-Resolution FLIR calibrated thermographic audit' },
      { label: 'Parts Guarantee', value: '100% genuine OEM factory parts warranty' },
      { label: 'Coverage Hours', value: '24 hours / 7 days / 365 days rapid response' },
    ],
  },
  {
    id: 'smart-solutions',
    title: 'Smart Solutions & Remote Telemetry',
    shortTitle: 'Smart Solutions',
    category: 'Intelligent Management',
    tagline: 'Intelligent iPDUs, Environmental Sensors & Automated Server Graceful Shutdown',
    description:
      'Gain granular visibility and remote command over your critical power ecosystem. We integrate intelligent rack power distribution units (iPDU) with per-outlet switching, micro-climate environmental probes, automated VM/OS shutdown agents, and centralized cloud DCIM monitoring.',
    iconName: 'Cpu',
    badge: 'Billing-Grade Metering',
    metric: { value: '±1%', label: 'Metering Accuracy' },
    highlights: [
      'Intelligent Power Distribution Units (iPDU) with per-outlet metering, remote switching & rebooting',
      'Micro-climate sensors: multi-point temperature, humidity, airflow, smoke, and water leak ropes',
      'Automated Graceful Server Shutdown scripts via SNMP for VMware ESXi, Hyper-V, and Linux',
      'Cloud DCIM (Data Center Infrastructure Management) single-pane dashboard and alerts',
      'Dual Gigabit Network Management Cards (NMC) with SNMPv3, Modbus TCP, and BACnet IP',
    ],
    capabilities: [
      'Live power consumption tracking and carbon footprint greenhouse gas analytics',
      'Automated SMS, Telegram, and Email alerts on threshold breaches or power anomalies',
      'Branch circuit monitoring (BCM) tracking power distribution from subpanel to server plug',
      'Role-based access control with LDAP / Active Directory and multi-factor authentication (MFA)',
    ],
    technicalSpecs: [
      { label: 'iPDU Form Factors', value: '0U Vertical / 1U Horizontal (Up to 48 outlets)' },
      { label: 'Outlet Types', value: 'Locking IEC C13 / C19 and Universal Combo Outlets' },
      { label: 'Sensor Types', value: 'Temp, Humidity, Spot Leak, Rope Leak, Door Contact' },
      { label: 'Network Protocols', value: 'SNMPv1/v2c/v3, Modbus TCP/RTU, RESTful API, MQTT' },
      { label: 'Virtualization Agents', value: 'VMware vCenter, Microsoft Hyper-V, Proxmox, KVM' },
    ],
  },
  {
    id: 'data-centers-server-rooms',
    title: 'Data Centers & Server Rooms',
    shortTitle: 'Data Centers & Server Rooms',
    category: 'Facility Engineering',
    tagline: 'Turnkey Enterprise Server Room Design, Redundant Busways & Tier III Infrastructure',
    description:
      'From greenfield data center builds to enterprise server room retrofits, ECLYPE Technology engineers turnkey high-availability compute environments. We integrate utility switchboards, automatic transfer switches (ATS), power busways, clean agent fire suppression, and precision environmental control.',
    iconName: 'Server',
    badge: 'Tier III / IV Ready',
    metric: { value: '99.999%', label: 'Five-Nines Availability' },
    highlights: [
      'Full turnkey server room and data center design & construction (Tier I - Tier IV specs)',
      'Dual utility power distribution with Automatic Transfer Switches (ATS) and Static Transfer (STS)',
      'Overhead power busway distribution systems (Track Busway) for rapid, flexible rack additions',
      'Clean agent fire suppression (Novec 1230 / FM-200 / Inergen) with early warning VESDA smoke detection',
      'Seismic-rated enterprise server racks with smart biometric lock handles and cable organizers',
    ],
    capabilities: [
      'Architectural raised access floor (RAF) and slab-on-grade cold aisle designs',
      'Generator integration with automated fuel polishing and synchronization switchboards',
      'Earthing and transient voltage surge suppression (TVSS) per IEEE 1100 standards',
      'Comprehensive commissioning tests (Level 1 to Level 5 integrated systems testing)',
    ],
    technicalSpecs: [
      { label: 'Redundancy Levels', value: 'N, N+1, 2N, 2(N+1) Concurrent Maintainability' },
      { label: 'Busway Ratings', value: '160A to 800A 3-Phase Overhead Track Busway' },
      { label: 'STS Transfer Speed', value: '< 4 ms (Sub-quarter cycle seamless phase transfer)' },
      { label: 'Fire Suppression', value: 'NFPA 2001 Clean Agent / VESDA Laser Smoke Detection' },
      { label: 'Standards Compliance', value: 'TIA-942, BICSI 002, ISO 27001, ASHRAE TC 9.9' },
    ],
  },
  {
    id: 'containerised-data-centers',
    title: 'Containerised & Modular Data Centers',
    shortTitle: 'Containerised Data Centers',
    category: 'Prefabricated Edge',
    tagline: 'All-in-One 20ft & 40ft Prefabricated ISO Plug-and-Play Edge Computing Pods',
    description:
      'Deploy full-scale enterprise data center capacity anywhere in weeks rather than years. Our prefabricated containerised data centers integrate server racks, modular UPS systems, close-coupled in-row cooling, gas fire suppression, and DCIM inside weather-sealed, ruggedized ISO shipping containers.',
    iconName: 'Box',
    badge: '4-Week Rapid Deployment',
    metric: { value: 'IP55/IP66', label: 'Ruggedized Weatherproof' },
    highlights: [
      'Prefabricated 20ft and 40ft high-cube ISO shipping container architectures',
      'Factory pre-assembled and 100% pre-tested before shipping: Plug, Power & Compute',
      'Integrated modular UPS, lithium-ion battery cabinet, and generator automatic transfer switch',
      'In-row precision air conditioning maintaining ASHRAE conditions even in 50°C tropical heat',
      'Thermal insulation, anti-corrosion marine-grade coating, and multi-sensor fire suppression',
    ],
    capabilities: [
      'Ideal for remote industrial mining, telecom towers, oil & gas fields, and disaster recovery hubs',
      'Modular expandable capacity: interconnect multiple containers to scale compute linearly',
      'Edge computing micro-pods: 2-rack to 4-rack rapid deployment cabinets for branch offices',
      'Built-in security: IP CCTV surveillance, biometric access control, and remote satellite/LTE telemetry',
    ],
    technicalSpecs: [
      { label: 'Dimensions', value: '20ft (6.06m) or 40ft (12.2m) ISO High-Cube Shell' },
      { label: 'Rack Capacity', value: '6 to 8 Racks (20ft) / Up to 18 Racks (40ft)' },
      { label: 'IT Load Supported', value: '40 kW to 250 kW per individual container' },
      { label: 'Cooling Redundancy', value: 'In-Row Precision DX / CW with N+1 backup fans' },
      { label: 'External Rating', value: 'IP55/IP66 Weatherproof, Corrosive-Resistant Marine Grade' },
    ],
  },
  {
    id: 'liquid-cooling',
    title: 'Liquid Cooling & High-Density Thermal Systems',
    shortTitle: 'Liquid Cooling',
    category: 'High-Density Compute',
    tagline: 'Direct-to-Chip Cold Plates, CDUs & Rear-Door Heat Exchangers for AI & HPC',
    description:
      'Traditional air cooling hits a hard physical wall at 30kW per rack. For modern AI workloads, GPU clusters (NVIDIA H100, H200, B200), and high-performance computing, ECLYPE Technology installs Direct-to-Chip (D2C) cold plates, Liquid-to-Liquid Cooling Distribution Units (CDU), and Rear-Door Heat Exchangers.',
    iconName: 'Droplets',
    badge: '100kW+ Per Rack',
    metric: { value: '100 kW+', label: 'Per Rack Heat Rejection' },
    highlights: [
      'Direct-to-Chip (D2C) cold plate liquid loops cooling high-wattage CPUs and GPUs directly',
      'Cooling Distribution Units (CDU) with redundant variable-frequency pumps and smart flow metering',
      'Rear-Door Heat Exchangers (RDHx) cooling up to 50kW racks with zero modification to room airflow',
      'Single-phase and two-phase dielectric fluid immersion cooling tanks for extreme compute density',
      'Negative-pressure liquid loop engineering preventing leaks even in the event of pipe puncture',
    ],
    capabilities: [
      'Enables deployment of next-gen high-density AI clusters with PUE as low as 1.08',
      'Recovers rejected high-temperature liquid heat for industrial facility reuse or hot water heating',
      'Propylene glycol and deionized treated cooling fluid testing with automated anti-corrosion dosing',
      'Complete safety manifold with automated shut-off isolation valves and optical leak detection sensors',
    ],
    technicalSpecs: [
      { label: 'Max Heat Density', value: 'Up to 120 kW per 42U/48U compute rack' },
      { label: 'CDU Capacity', value: '100 kW to 500 kW Liquid-to-Liquid & Liquid-to-Air' },
      { label: 'Coolant Types', value: 'Engineered PG25 Coolant / Dielectric Synthetic Fluids' },
      { label: 'Pump Redundancy', value: 'Dual N+1 Canned Motor / Magnetically Coupled Pumps' },
      { label: 'Operating PUE', value: '1.05 to 1.15 in full liquid loop topologies' },
    ],
  },
];

export const FEATURED_UPS_PRODUCTS: FeaturedProduct[] = [
  {
    id: 'edgeprotect-rt-3k',
    model: 'ECLYPE EdgeProtect RT 1kVA - 3kVA',
    category: 'rackmount',
    categoryLabel: 'Rackmount Edge UPS',
    capacityRange: '1,000 VA / 1,000 W to 3,000 VA / 3,000 W',
    powerFactor: '1.0 Unity Power Factor',
    topology: 'Online Double Conversion (VFI)',
    efficiency: '95% Online / 98.5% ECO Mode',
    batteryTech: 'Hot-Swappable VRLA or LiFePO4',
    formFactor: '2U Convertible Rack / Tower',
    targetEnvironment: 'Edge Micro-Datacenters, Network Closets, Telecommunication Racks, Medical Clinics',
    keyHighlights: [
      'Unity power factor delivers equal real power (kW = kVA)',
      'Convertible 2U chassis fits standard 19-inch IT racks or tower placement',
      'External battery modules (EBM) daisy-chainable for hours of extended runtime',
      'Gigabit network management card with remote outlet rebooting',
      'Zero millisecond transfer time to battery during utility failure',
    ],
    specs: [
      { label: 'Input Voltage', value: '160 - 300 VAC (Full Load)' },
      { label: 'Output Waveform', value: 'Pure Sine Wave (THDv < 2%)' },
      { label: 'Transfer Time', value: '0 ms (Online to Battery)' },
      { label: 'Outlets', value: '8x IEC C13 + 1x IEC C19 with programmable load banks' },
      { label: 'Communication', value: 'USB, RS232, SNMP Slot, EPO Dry Contacts' },
    ],
    badge: 'Best for Edge Racks',
  },
  {
    id: 'powertower-pro-10k',
    model: 'ECLYPE PowerTower Pro 6kVA - 10kVA',
    category: 'rackmount',
    categoryLabel: 'Heavy Rack / Tower UPS',
    capacityRange: '6,000 VA / 6,000 W to 10,000 VA / 10,000 W',
    powerFactor: '1.0 Unity Power Factor',
    topology: 'Online Double Conversion (VFI)',
    efficiency: '96% Online / 99% ECO Mode',
    batteryTech: 'High-Rate VRLA or High-Density Lithium-Ion',
    formFactor: '3U/4U Rack / Tower or Standalone Enclosure',
    targetEnvironment: 'Branch Server Rooms, Hospital Imaging, Industrial Control Labs, Broadcast Studios',
    keyHighlights: [
      'Single-phase input & output with optional 3:1 phase conversion module',
      'N+1 parallel redundancy capability (up to 4 units in parallel)',
      'Built-in manual maintenance bypass switch for non-disruptive service',
      'Color touch LCD display with real-time waveform and load analytics',
      'Cold-start capability and generator soft-start ramp control',
    ],
    specs: [
      { label: 'Input Voltage', value: '110 - 288 VAC (50/60 Hz Auto-sensing)' },
      { label: 'Parallel Capability', value: 'Up to 4 units (40kVA total capacity)' },
      { label: 'Overload Capacity', value: '125% for 10 min / 150% for 1 min' },
      { label: 'Display', value: '4.3-inch Multi-language Color Graphic LCD' },
      { label: 'Bypass', value: 'Automatic Static Bypass + Internal Manual Maintenance Bypass' },
    ],
    badge: 'High Density 10kVA',
  },
  {
    id: 'modupower-3phase-120k',
    model: 'ECLYPE ModuPower 3-Phase 20kVA - 120kVA',
    category: 'modular-3phase',
    categoryLabel: 'Modular 3-Phase UPS',
    capacityRange: '20 kVA to 120 kVA (20kVA / 25kVA Hot-Swap Modules)',
    powerFactor: '1.0 (kVA = kW)',
    topology: 'Modular Online Double Conversion',
    efficiency: '96.8% Online / 99.2% Active ECO',
    batteryTech: 'Flexible Battery String (30-46 Blocks) / Lithium-Ready',
    formFactor: 'Single 19-inch Enterprise Cabinet',
    targetEnvironment: 'Enterprise Data Centers, Financial Trading Rooms, Tier III Server Rooms, Telecomm Hubs',
    keyHighlights: [
      'Decentralized independent controller for every single power module (zero single point of failure)',
      'True hot-swappable power modules, bypass module, and monitoring display',
      'Pay-as-you-grow modular scalability from 20kVA up to 120kVA in a single footprint',
      'Advanced THDi < 2.5% and input PF > 0.99 for maximum generator compatibility',
      'Smart sleep function dynamically turning off redundant modules during low load to maximize efficiency',
    ],
    specs: [
      { label: 'Input / Output', value: '380 / 400 / 415 VAC 3-Phase 4-Wire + PE' },
      { label: 'Module Capacity', value: '20 kVA / 20 kW or 25 kVA / 25 kW hot-swappable' },
      { label: 'THDi', value: '< 2.5% at 100% linear load' },
      { label: 'Redundancy', value: 'N+1, N+X modular internal redundancy' },
      { label: 'Dimensions (WxDxH)', value: '600 x 900 x 2000 mm (Standard Datacenter Rack Size)' },
    ],
    badge: 'Enterprise Flagship',
  },
  {
    id: 'megagrid-facility-800k',
    model: 'ECLYPE MegaGrid Facility 200kVA - 800kVA',
    category: 'facility',
    categoryLabel: 'Mega Facility UPS',
    capacityRange: '200 kVA to 800 kVA (Parallelable to 4,800 kVA)',
    powerFactor: '1.0 Unity Power Factor',
    topology: 'Industrial 3-Phase Transformerless / Dual Input',
    efficiency: '97.2% Online Mode / 99.4% Ultra-Eco Mode',
    batteryTech: 'High-Capacity Lithium-Ion (LiFePO4) or 2V Industrial VRLA Cells',
    formFactor: 'Heavy-Duty Freestanding Power Facility Enclosure',
    targetEnvironment: 'Hyperscale Data Centers, Cloud Hosting Facilities, Semi-Conductor Cleanrooms, Mega Hospitals',
    keyHighlights: [
      'Massive power density saving up to 40% valuable white-space floor area',
      'Full compatibility with megawatt-scale lithium-ion battery storage cabinets',
      'Advanced dual-feed inputs with independent A/B static switch paths',
      'Internal self-aging load test mode testing full capacity without needing external load banks',
      'Seismic zone 4 structural certification and conformal-coated printed circuit boards',
    ],
    specs: [
      { label: 'Voltage Range', value: '380/400/415 VAC (228V - 478V input window)' },
      { label: 'Parallel Scalability', value: 'Up to 8 units in parallel (6.4 MVA maximum system)' },
      { label: 'Short Circuit Rating', value: 'Up to 100 kA withstand capability' },
      { label: 'Thermal Loss', value: 'Industry lowest operating heat generation' },
      { label: 'Communication', value: 'Modbus TCP, BACnet, Dual SNMPv3, Dry Relay Contacts' },
    ],
    badge: '800kVA Hyperscale',
  },
  {
    id: 'li-cube-battery-cabinet',
    model: 'ECLYPE Li-Cube Modular Lithium Battery System',
    category: 'battery',
    categoryLabel: 'Lithium-Ion Storage',
    capacityRange: '50 kWh to 300 kWh per cabinet string',
    powerFactor: 'Optimized for High-Rate Discharge',
    topology: 'LiFePO4 with 3-Tier Multi-Core BMS',
    efficiency: '98.5% Round-Trip Coulombic Efficiency',
    batteryTech: 'Lithium Iron Phosphate (LiFePO4) Safe Chemistry',
    formFactor: 'Standard 19-inch Heavy-Duty Enclosure',
    targetEnvironment: 'Modern Tier III/IV Data Centers, UPS Battery Upgrades, Renewable Microgrids',
    keyHighlights: [
      'Inherently safe Lithium Iron Phosphate chemistry with zero thermal runaway risk',
      'Triple-layer Battery Management System (BMS): Cell -> Module -> Cabinet controller',
      '60% footprint reduction and 70% weight reduction compared to legacy lead-acid strings',
      '15-year design lifespan with 3,500+ deep discharge cycles at 80% DOD',
      'Integrated internal automatic DC breaker and aerosol fire suppression module',
    ],
    specs: [
      { label: 'Nominal Voltage', value: '384V to 576V DC (Compatible with major 3-Phase UPS)' },
      { label: 'Recharge Time', value: '0% to 90% in under 90 minutes' },
      { label: 'BMS Telemetry', value: 'Voltage, Current, Internal Resistance, Temp per Cell' },
      { label: 'Safety Protections', value: 'Over-voltage, Under-voltage, Short Circuit, Thermal Interlock' },
      { label: 'Certifications', value: 'UL 1973, UL 9540A, IEC 62619, CE, UN 38.3' },
    ],
    badge: '15-Year Lifespan',
  },
  {
    id: 'ecocontainer-edge-dc-20ft',
    model: 'ECLYPE EcoContainer Edge Data Center 20ft',
    category: 'container',
    categoryLabel: 'Prefabricated Container DC',
    capacityRange: '40 kW to 120 kW IT Compute Load (Up to 8 Server Racks)',
    powerFactor: 'N+1 Redundant Integrated Power',
    topology: 'All-in-One Turnkey ISO Container Architecture',
    efficiency: 'Design PUE 1.22 in 38°C Tropical Ambient Climate',
    batteryTech: 'Integrated LiFePO4 Lithium Battery Storage',
    formFactor: '20ft High-Cube Standard ISO Shipping Container',
    targetEnvironment: 'Remote Mining Sites, 5G Telco Base Stations, Ports, Industrial Plants, Disaster Recovery',
    keyHighlights: [
      'Complete data center in a box: Racks, N+1 Modular UPS, In-Row Cooling, Fire Gas & DCIM',
      'Factory engineered, integrated, and 100% burn-in tested before site delivery',
      'Rapid 4-week field setup: simply hook up utility power, backup generator, and fiber lines',
      'IP55 weather-sealed enclosure with anti-corrosion marine-grade polyurethane coating',
      'Comprehensive fire safety: VESDA smoke detection and automated clean agent gas suppression',
    ],
    specs: [
      { label: 'Dimensions (LxWxH)', value: '6,058 x 2,438 x 2,896 mm (20ft High-Cube)' },
      { label: 'Rack Count', value: 'Up to 8 standard 42U/48U 19-inch Server Racks' },
      { label: 'Cooling System', value: 'Dual In-Row Precision DX Air Conditioners (N+1)' },
      { label: 'Integrated UPS', value: '100kVA Modular 3-Phase Online UPS + LiFePO4 Battery' },
      { label: 'Security & Access', value: 'Biometric fingerprint + Card reader + 4K CCTV' },
    ],
    badge: 'Turnkey Edge Pod',
  },
  {
    id: 'hydrocore-d2c-cdu',
    model: 'ECLYPE HydroCore Direct-to-Chip CDU (100kW+)',
    category: 'liquid-cooling',
    categoryLabel: 'High-Density Liquid CDU',
    capacityRange: '100 kW to 300 kW Liquid Heat Rejection Capacity',
    powerFactor: 'Integrated Redundant VFD Pump Drives',
    topology: 'Liquid-to-Liquid / Liquid-to-Air Coolant Distribution',
    efficiency: 'Enables System PUE of < 1.10 for AI Clusters',
    batteryTech: 'Dedicated UPS Power Backed Pump Controller',
    formFactor: 'Close-Coupled In-Row CDU Cabinet or Rackmount',
    targetEnvironment: 'NVIDIA H100/H200/B200 AI Compute Racks, High-Performance Computing (HPC), LLM Training Labs',
    keyHighlights: [
      'Cools up to 100kW+ per rack, unlocking full non-throttled GPU AI computing performance',
      'Redundant N+1 stainless steel variable-frequency pumps with intelligent flow regulation',
      'Negative pressure safety design: prevents fluid escape in the event of minor loop damage',
      'Precision filtration down to 50 microns with dual automatic switchover strainers',
      'Real-time viscosity, pressure differential, temperature, and fluid conductivity telemetry',
    ],
    specs: [
      { label: 'Heat Rejection', value: '100 kW to 300 kW continuous capacity' },
      { label: 'Secondary Flow Rate', value: 'Up to 300 Liters / Minute with dynamic throttling' },
      { label: 'Pumps', value: 'Dual N+1 Stainless Steel Canned Motor Pumps' },
      { label: 'Coolant Compatibility', value: 'Treated Water / Propylene Glycol 25% (PG25)' },
      { label: 'Leak Safety', value: 'Multi-zone optical rope sensors with fast auto-isolation valves' },
    ],
    badge: 'AI & HPC Ready',
  },
];

export const UPS_SERVICE_PLANS: UPSServicePlan[] = [
  {
    name: 'Silver Essential',
    responseTime: '8-Hour Next Business Day',
    visitsPerYear: '1 Comprehensive Inspection / Year',
    loadBankTesting: false,
    thermalImaging: true,
    batteryInspection: 'Visual & String Voltage Test',
    emergencySupport: 'Business Hours (8am - 6pm)',
    partsDiscount: '10% Discount on OEM Spares',
    idealFor: 'Small server closets, branch offices, non-critical IT edge closets',
  },
  {
    name: 'Gold Enterprise',
    badge: 'Most Popular',
    responseTime: '4-Hour Guaranteed Onsite SLA',
    visitsPerYear: '2 Inspections (Semi-Annual PM)',
    loadBankTesting: true,
    thermalImaging: true,
    batteryInspection: 'Cell-Level Impedance & Conductance Testing',
    emergencySupport: '24/7/365 Dedicated NOC Dispatch',
    partsDiscount: '20% Discount on OEM Spares & Batteries',
    idealFor: 'Enterprise server rooms, medium data centers, financial & healthcare facilities',
  },
  {
    name: 'Platinum Mission-Critical',
    badge: 'Maximum Uptime',
    responseTime: '2-Hour Rapid Emergency SLA',
    visitsPerYear: '4 Inspections (Quarterly PM)',
    loadBankTesting: true,
    thermalImaging: true,
    batteryInspection: 'Comprehensive BMS Calibration & Full String Impedance',
    emergencySupport: '24/7/365 Priority Engineering Team + Dedicated Spares Kit',
    partsDiscount: '30% Discount + Free Annual Air Filter & Fan Replacement',
    idealFor: 'Tier III/IV Data Centers, telecommunications switches, banking core networks',
  },
];
