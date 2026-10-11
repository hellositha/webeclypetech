--
-- PostgreSQL database dump
--


-- Dumped from database version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)
-- Dumped by pg_dump version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.mail_users DROP CONSTRAINT IF EXISTS mail_users_domain_id_fkey;
ALTER TABLE IF EXISTS ONLY public.mail_messages DROP CONSTRAINT IF EXISTS mail_messages_account_id_fkey;
ALTER TABLE IF EXISTS ONLY public.mail_aliases DROP CONSTRAINT IF EXISTS mail_aliases_domain_id_fkey;
DROP INDEX IF EXISTS public.idx_mail_messages_received_at;
DROP INDEX IF EXISTS public.idx_mail_messages_account_folder;
ALTER TABLE IF EXISTS ONLY public.quote_requests DROP CONSTRAINT IF EXISTS quote_requests_pkey;
ALTER TABLE IF EXISTS ONLY public.newsletter_subscribers DROP CONSTRAINT IF EXISTS newsletter_subscribers_pkey;
ALTER TABLE IF EXISTS ONLY public.newsletter_subscribers DROP CONSTRAINT IF EXISTS newsletter_subscribers_email_key;
ALTER TABLE IF EXISTS ONLY public.mail_users DROP CONSTRAINT IF EXISTS mail_users_pkey;
ALTER TABLE IF EXISTS ONLY public.mail_users DROP CONSTRAINT IF EXISTS mail_users_email_key;
ALTER TABLE IF EXISTS ONLY public.mail_messages DROP CONSTRAINT IF EXISTS mail_messages_pkey;
ALTER TABLE IF EXISTS ONLY public.mail_domains DROP CONSTRAINT IF EXISTS mail_domains_pkey;
ALTER TABLE IF EXISTS ONLY public.mail_domains DROP CONSTRAINT IF EXISTS mail_domains_name_key;
ALTER TABLE IF EXISTS ONLY public.mail_aliases DROP CONSTRAINT IF EXISTS mail_aliases_pkey;
ALTER TABLE IF EXISTS ONLY public.inquiries DROP CONSTRAINT IF EXISTS inquiries_pkey;
ALTER TABLE IF EXISTS ONLY public.consultations DROP CONSTRAINT IF EXISTS consultations_pkey;
ALTER TABLE IF EXISTS ONLY public.admin_users DROP CONSTRAINT IF EXISTS admin_users_pkey;
ALTER TABLE IF EXISTS ONLY public.admin_users DROP CONSTRAINT IF EXISTS admin_users_email_key;
ALTER TABLE IF EXISTS ONLY public.activity_logs DROP CONSTRAINT IF EXISTS activity_logs_pkey;
ALTER TABLE IF EXISTS public.quote_requests ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.newsletter_subscribers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.mail_users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.mail_messages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.mail_domains ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.mail_aliases ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.inquiries ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.consultations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.admin_users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.activity_logs ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.quote_requests_id_seq;
DROP TABLE IF EXISTS public.quote_requests;
DROP SEQUENCE IF EXISTS public.newsletter_subscribers_id_seq;
DROP TABLE IF EXISTS public.newsletter_subscribers;
DROP SEQUENCE IF EXISTS public.mail_users_id_seq;
DROP TABLE IF EXISTS public.mail_users;
DROP SEQUENCE IF EXISTS public.mail_messages_id_seq;
DROP TABLE IF EXISTS public.mail_messages;
DROP SEQUENCE IF EXISTS public.mail_domains_id_seq;
DROP TABLE IF EXISTS public.mail_domains;
DROP SEQUENCE IF EXISTS public.mail_aliases_id_seq;
DROP TABLE IF EXISTS public.mail_aliases;
DROP SEQUENCE IF EXISTS public.inquiries_id_seq;
DROP TABLE IF EXISTS public.inquiries;
DROP SEQUENCE IF EXISTS public.consultations_id_seq;
DROP TABLE IF EXISTS public.consultations;
DROP SEQUENCE IF EXISTS public.admin_users_id_seq;
DROP TABLE IF EXISTS public.admin_users;
DROP SEQUENCE IF EXISTS public.activity_logs_id_seq;
DROP TABLE IF EXISTS public.activity_logs;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    action character varying(255) NOT NULL,
    details text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'Admin'::character varying,
    status character varying(50) DEFAULT 'Active'::character varying,
    avatar_color character varying(50) DEFAULT 'emerald'::character varying,
    last_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- Name: consultations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.consultations (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(100) NOT NULL,
    company_name character varying(255) NOT NULL,
    business_size character varying(100),
    division character varying(100),
    preferred_date character varying(50),
    preferred_time character varying(50),
    notes text,
    status character varying(50) DEFAULT 'Scheduled'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: consultations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.consultations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: consultations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.consultations_id_seq OWNED BY public.consultations.id;


--
-- Name: inquiries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inquiries (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(100),
    company character varying(255),
    service_id character varying(100),
    division_id character varying(100),
    budget character varying(100),
    urgency character varying(50) DEFAULT 'Normal'::character varying,
    message text NOT NULL,
    status character varying(50) DEFAULT 'Pending'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: inquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inquiries_id_seq OWNED BY public.inquiries.id;


--
-- Name: mail_aliases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mail_aliases (
    id integer NOT NULL,
    domain_id integer,
    source character varying(255) NOT NULL,
    destination text NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: mail_aliases_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mail_aliases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mail_aliases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mail_aliases_id_seq OWNED BY public.mail_aliases.id;


--
-- Name: mail_domains; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mail_domains (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: mail_domains_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mail_domains_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mail_domains_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mail_domains_id_seq OWNED BY public.mail_domains.id;


--
-- Name: mail_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mail_messages (
    id integer NOT NULL,
    account_id integer,
    folder character varying(50) DEFAULT 'INBOX'::character varying,
    message_id character varying(255),
    from_address character varying(255) NOT NULL,
    from_name character varying(255),
    to_address text NOT NULL,
    cc_address text,
    bcc_address text,
    reply_to character varying(255),
    subject text NOT NULL,
    body_text text,
    body_html text,
    snippet text,
    is_read boolean DEFAULT false,
    is_starred boolean DEFAULT false,
    is_draft boolean DEFAULT false,
    has_attachments boolean DEFAULT false,
    attachments jsonb DEFAULT '[]'::jsonb,
    size_bytes integer DEFAULT 0,
    received_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: mail_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mail_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mail_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mail_messages_id_seq OWNED BY public.mail_messages.id;


--
-- Name: mail_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mail_users (
    id integer NOT NULL,
    domain_id integer,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    name character varying(255),
    maildir character varying(255) NOT NULL,
    quota_bytes bigint DEFAULT '5368709120'::bigint,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: mail_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mail_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mail_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mail_users_id_seq OWNED BY public.mail_users.id;


--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscribers (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    status character varying(50) DEFAULT 'Active'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.newsletter_subscribers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.newsletter_subscribers_id_seq OWNED BY public.newsletter_subscribers.id;


--
-- Name: quote_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quote_requests (
    id integer NOT NULL,
    client_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(100),
    company character varying(255) NOT NULL,
    selected_services jsonb DEFAULT '[]'::jsonb NOT NULL,
    deployment_type character varying(100),
    user_count integer DEFAULT 10,
    estimated_monthly numeric(10,2),
    estimated_onetime numeric(10,2),
    timeline character varying(100),
    requirements text,
    status character varying(50) DEFAULT 'Reviewing'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: quote_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quote_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quote_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quote_requests_id_seq OWNED BY public.quote_requests.id;


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- Name: consultations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consultations ALTER COLUMN id SET DEFAULT nextval('public.consultations_id_seq'::regclass);


--
-- Name: inquiries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inquiries ALTER COLUMN id SET DEFAULT nextval('public.inquiries_id_seq'::regclass);


--
-- Name: mail_aliases id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mail_aliases ALTER COLUMN id SET DEFAULT nextval('public.mail_aliases_id_seq'::regclass);


--
-- Name: mail_domains id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mail_domains ALTER COLUMN id SET DEFAULT nextval('public.mail_domains_id_seq'::regclass);


--
-- Name: mail_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mail_messages ALTER COLUMN id SET DEFAULT nextval('public.mail_messages_id_seq'::regclass);


--
-- Name: mail_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mail_users ALTER COLUMN id SET DEFAULT nextval('public.mail_users_id_seq'::regclass);


--
-- Name: newsletter_subscribers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers ALTER COLUMN id SET DEFAULT nextval('public.newsletter_subscribers_id_seq'::regclass);


--
-- Name: quote_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quote_requests ALTER COLUMN id SET DEFAULT nextval('public.quote_requests_id_seq'::regclass);


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activity_logs (id, action, details, created_at) FROM stdin;
1	SYSTEM_INIT	Internovatech PostgreSQL database initialized with initial schema and enterprise seed data.	2026-10-10 04:59:50.004066+00
2	NEW_INQUIRY	New service inquiry from Chief Technology Officer (Global FinTech Ltd) for service: security-network	2026-10-10 05:10:14.173662+00
3	STATUS_UPDATE	Updated record #6 in inquiries to status: In Progress	2026-10-10 05:10:20.758651+00
4	NEW_QUOTE_REQUEST	Quote estimator submission from Marcus Vance (Vance Digital Media) with est. monthly: $3450	2026-10-10 05:10:34.864737+00
5	ADMIN_INIT	Seeded initial enterprise administrator accounts (Super Admin, Admin, Support Lead).	2026-10-10 06:15:28.643984+00
6	AUTH_LOGIN	Admin System Administrator (admin@eclypetech.biz) logged in successfully as Super Admin.	2026-10-10 06:20:45.412193+00
7	AUTH_LOGIN	Admin System Administrator (admin@eclypetech.biz) logged in successfully as Super Admin.	2026-10-10 06:20:49.991762+00
8	USER_CREATE	Admin System Administrator (admin@eclypetech.biz) created account for Alex Rivera (alex.devops@eclypetech.biz) with role 'Admin'.	2026-10-10 06:20:55.489463+00
9	USER_UPDATE	Admin System Administrator (admin@eclypetech.biz) updated user profile for Alex Rivera (DevOps Lead) (#4, role: Admin, status: Disabled).	2026-10-10 06:21:06.873142+00
10	USER_DELETE	Super Admin System Administrator deleted admin account Alex Rivera (DevOps Lead) (alex.devops@eclypetech.biz).	2026-10-10 06:21:16.797783+00
11	AUTH_LOGOUT	Admin System Administrator (admin@eclypetech.biz) logged out.	2026-10-10 06:21:20.656679+00
12	AUTH_LOGIN	Admin System Administrator (admin@eclypetech.biz) logged in successfully as Super Admin.	2026-10-10 06:27:22.379597+00
13	AUTH_LOGIN	Admin System Administrator (admin@eclypetech.biz) logged in successfully as Super Admin.	2026-10-10 10:35:04.744406+00
\.


--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_users (id, name, email, password_hash, role, status, avatar_color, last_login, created_at) FROM stdin;
2	Sarah Jenkins	sarah.ops@eclypetech.biz	$2b$10$cIpFc5Gvv2V.LV7oeKqbQ.jT9FhSCLdCDfAB/2P2gtiYJHfAzkbne	Admin	Active	emerald	\N	2026-10-10 06:15:28.643984+00
3	David Support	support@eclypetech.biz	$2b$10$99Uy5ftFCRU673j.7JPQ..RajwAOZlIypJiG0x3btnk76Ix2MzBTW	Support Lead	Active	indigo	\N	2026-10-10 06:15:28.643984+00
1	System Administrator	admin@eclypetech.biz	$2b$10$tCMrXKyAkQbSCb2VdScUyOFBQZC/5Wezd11OZXqWNmhI/wQt49Ke6	Super Admin	Active	sky	2026-10-10 10:35:04.743151+00	2026-10-10 06:15:28.643984+00
\.


--
-- Data for Name: consultations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.consultations (id, full_name, email, phone, company_name, business_size, division, preferred_date, preferred_time, notes, status, created_at) FROM stdin;
1	Alexander Wright	awright@quantumfin.com	+1 555-718-2930	Quantum Financial Labs	250-1000 employees	Cloud & Managed IT Services	2026-10-18	10:00 AM EST	Discuss multi-region Azure failover architecture and compliance audits.	Confirmed	2026-10-10 04:59:50.004066+00
2	Patricia Alvarez	palvarez@solarfusion.net	+1 555-829-1049	SolarFusion Energy	50-249 employees	Business Management Software	2026-10-20	02:30 PM EST	Demonstration of HRM and biometric attendance integration.	Scheduled	2026-10-10 04:59:50.004066+00
3	Jonathan Cole	jcole@titanind.com	+1 555-938-4102	Titan Manufacturing Industries	1000+ employees	Enterprise IT Infrastructure	2026-10-22	11:15 AM EST	Structured fiber cabling and redundant core switches upgrade for plant floor.	Scheduled	2026-10-10 04:59:50.004066+00
\.


--
-- Data for Name: inquiries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inquiries (id, name, email, phone, company, service_id, division_id, budget, urgency, message, status, created_at) FROM stdin;
2	Sarah Jenkins	sjenkins@meditechsystems.org	+1 555-024-8841	MediTech Systems	cctv-security	infrastructure	$25,000 - $50,000	Normal	Looking to upgrade IP CCTV across 4 hospital wings with biometric access control integration.	Pending	2026-10-10 04:59:50.004066+00
3	Robert Thorne	robert@apexlogistics.io	+1 555-038-9120	Apex Global Logistics	erp	software	$100,000+	High	Evaluating enterprise ERP system for multi-warehouse inventory, procurement and real-time fleet dispatching.	Pending	2026-10-10 04:59:50.004066+00
4	Elena Rostova	elena@finvanguard.ch	+1 555-047-3312	Vanguard Wealth Advisory	security-network	infrastructure	$50,000 - $100,000	Urgent	Require enterprise next-gen firewall deployment, zero-trust VPN, and compliance network segmentation.	Completed	2026-10-10 04:59:50.004066+00
5	Marcus Vance	mvance@creativestudios.co	+1 555-061-4478	Vance Digital Media	saas-cloud	cloud	$10,000 - $25,000	Normal	Migrating on-prem file servers to Microsoft Azure and Microsoft 365 Enterprise for 180 hybrid staff.	Pending	2026-10-10 04:59:50.004066+00
6	Chief Technology Officer	cto@globalfintech.com	+1 800-555-0199	Global FinTech Ltd	security-network	infrastructure	$100,000+	High	Need complete zero-trust firewall overhaul and ISO 27001 data center audit.	In Progress	2026-10-10 05:10:14.172202+00
\.


--
-- Data for Name: mail_aliases; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mail_aliases (id, domain_id, source, destination, active, created_at) FROM stdin;
1	1	info@eclypetech.biz	contact@eclypetech.biz	t	2026-10-10 10:54:33.502856+00
2	1	help@eclypetech.biz	support@eclypetech.biz	t	2026-10-10 10:54:33.502856+00
3	1	sales@eclypetech.biz	contact@eclypetech.biz	t	2026-10-10 10:54:33.502856+00
\.


--
-- Data for Name: mail_domains; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mail_domains (id, name, active, created_at) FROM stdin;
1	eclypetech.biz	t	2026-10-10 10:54:33.501498+00
\.


--
-- Data for Name: mail_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mail_messages (id, account_id, folder, message_id, from_address, from_name, to_address, cc_address, bcc_address, reply_to, subject, body_text, body_html, snippet, is_read, is_starred, is_draft, has_attachments, attachments, size_bytes, received_at, created_at) FROM stdin;
1	1	INBOX	sys-001@eclypetech.biz	noc-telemetry@eclypetech.biz	ECLYPE NOC Monitor	admin@eclypetech.biz	\N	\N	\N	NOC Alert: Mail Server Stack (Postfix, Dovecot, PostgreSQL) Operational	All mail transport daemons, IMAP/POP3 services, and PostgreSQL virtual maps have passed automated health checks with 0 error rate. TLS 1.3 is enabled on ports 25, 465, 587, 143, and 993.	<h3>Mail Services Operational</h3><p>All mail transport daemons, IMAP/POP3 services, and PostgreSQL virtual maps have passed automated health checks with <strong>0% error rate</strong>.</p><p>TLS 1.3 encryption is active on submission and IMAPS ports.</p>	All mail transport daemons, IMAP/POP3 services, and PostgreSQL virtual maps have passed automated health checks...	t	t	f	f	[]	0	2026-10-10 09:01:56.238636+00	2026-10-10 11:01:56.238636+00
2	1	INBOX	sys-002@eclypetech.biz	sarah.ops@eclypetech.biz	Sarah Operations	admin@eclypetech.biz	\N	\N	\N	Weekly IT Operations & Phnom Penh Server Maintenance Schedule	Hi Admin, please find attached the upcoming preventive maintenance schedule for our data center clients in Phnom Penh. Server clustering, backup verification, and UPS battery load tests are planned for this weekend.	<h3>Weekly Operations Report</h3><p>Hi Admin,</p><p>Please find attached the upcoming preventive maintenance schedule for our data center clients in Phnom Penh.</p><p>Server clustering, backup verification, and UPS battery load tests are planned for this weekend.</p><p>Best regards,<br/>Sarah (Ops Lead)</p>	Hi Admin, please find attached the upcoming preventive maintenance schedule for our data center clients...	f	t	f	f	[]	0	2026-10-10 10:26:56.238636+00	2026-10-10 11:01:56.238636+00
3	1	Sent	sys-003@eclypetech.biz	admin@eclypetech.biz	System Administrator	sarah.ops@eclypetech.biz	\N	\N	\N	Re: Weekly IT Operations & Phnom Penh Server Maintenance Schedule	Thanks Sarah. I have confirmed the maintenance window with the NOC on-call engineer. The 24/7 telemetry dashboards will be monitoring active load.	<p>Thanks Sarah.</p><p>I have confirmed the maintenance window with the NOC on-call engineer. The 24/7 telemetry dashboards will be monitoring active load.</p>	Thanks Sarah. I have confirmed the maintenance window with the NOC on-call engineer...	t	f	f	f	[]	0	2026-10-10 10:46:56.238636+00	2026-10-10 11:01:56.238636+00
4	1	INBOX	<e99bcc12-1667-bdc8-117a-1d55ddc348f1@eclypetech.biz>	contact@eclypetech.biz	ECLYPE Postmaster	admin@eclypetech.biz	\N	\N	\N	Welcome to ECLYPE Technology Mail Server	Your Postfix, Dovecot, and PostgreSQL mail server is fully operational!	<h3>Welcome to ECLYPE Technology Mail</h3><p>Your Postfix, Dovecot, and PostgreSQL mail server is fully operational!</p>	Your Postfix, Dovecot, and PostgreSQL mail server is fully operational!	f	f	f	f	[]	1214	2026-10-10 10:59:22+00	2026-10-10 11:01:56.267333+00
5	3	INBOX	<be55a267-a47f-d21a-8b7c-a5105b88dff1@eclypetech.biz>	admin@eclypetech.biz	Admin ECLYPE	support@eclypetech.biz	\N	\N	\N	Port 587 Submission Auth Test	Testing authenticated submission on port 587 with Postfix Dovecot SASL.	<p>Testing authenticated submission on port 587 with Postfix Dovecot SASL.</p>	Testing authenticated submission on port 587 with Postfix Dovecot SASL.	f	f	f	f	[]	1159	2026-10-10 11:00:35+00	2026-10-10 11:01:56.27649+00
6	1	Sent	<fed08635-9308-827e-adae-43ef357b9c62@eclypetech.biz>	admin@eclypetech.biz	System Administrator	sarah.ops@eclypetech.biz	\N	\N	\N	Next.js Webmail Dispatch Test	Hello Sarah,\n\nTesting the Next.js Webmail dispatch through local Postfix MTA.\nEverything is running perfectly!\n\nBest regards,\nAdmin	Hello Sarah,\n\nTesting the Next.js Webmail dispatch through local Postfix MTA.\nEverything is running perfectly!\n\nBest regards,\nAdmin	Hello Sarah, Testing the Next.js Webmail dispatch through local Postfix MTA. Everything is running perfectly! Best regards, Admin	t	f	f	f	[]	0	2026-10-10 11:08:07.877557+00	2026-10-10 11:08:07.877557+00
7	4	Trash	<fed08635-9308-827e-adae-43ef357b9c62@eclypetech.biz>	admin@eclypetech.biz	System Administrator	sarah.ops@eclypetech.biz	\N	\N	\N	Next.js Webmail Dispatch Test	Hello Sarah,\n\nTesting the Next.js Webmail dispatch through local Postfix MTA.\nEverything is running perfectly!\n\nBest regards,\nAdmin	<div style="font-family: sans-serif; line-height: 1.6;">Hello Sarah,<br/><br/>Testing the Next.js Webmail dispatch through local Postfix MTA.<br/>Everything is running perfectly!<br/><br/>Best regards,<br/>Admin</div>	Hello Sarah, Testing the Next.js Webmail dispatch through local Postfix MTA. Everything is running perfectly! Best regards, Admin	t	t	f	f	[]	1379	2026-10-10 11:08:07+00	2026-10-10 11:08:11.159398+00
\.


--
-- Data for Name: mail_users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mail_users (id, domain_id, email, password_hash, name, maildir, quota_bytes, active, created_at) FROM stdin;
1	1	admin@eclypetech.biz	{BLF-CRYPT}$2y$05$nkvvfLOzoVNd21s4DpPzye7xKMBnnPZuW4yn28SZPGrYsNSZFuQAa	System Administrator	eclypetech.biz/admin/Maildir/	5368709120	t	2026-10-10 10:54:33.502856+00
2	1	contact@eclypetech.biz	{BLF-CRYPT}$2y$05$nkvvfLOzoVNd21s4DpPzye7xKMBnnPZuW4yn28SZPGrYsNSZFuQAa	ECLYPE Customer Desk	eclypetech.biz/contact/Maildir/	5368709120	t	2026-10-10 10:54:33.502856+00
3	1	support@eclypetech.biz	{BLF-CRYPT}$2y$05$nkvvfLOzoVNd21s4DpPzye7xKMBnnPZuW4yn28SZPGrYsNSZFuQAa	24/7 Technical Support	eclypetech.biz/support/Maildir/	5368709120	t	2026-10-10 10:54:33.502856+00
4	1	sarah.ops@eclypetech.biz	{BLF-CRYPT}$2y$05$nkvvfLOzoVNd21s4DpPzye7xKMBnnPZuW4yn28SZPGrYsNSZFuQAa	Sarah Operations	eclypetech.biz/sarah.ops/Maildir/	5368709120	t	2026-10-10 10:54:33.502856+00
\.


--
-- Data for Name: newsletter_subscribers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.newsletter_subscribers (id, email, status, created_at) FROM stdin;
1	techleads@enterpriseitnews.com	Active	2026-10-10 04:59:50.004066+00
2	cio-digest@datacenterinsider.org	Active	2026-10-10 04:59:50.004066+00
3	devops@cloudscale.net	Active	2026-10-10 04:59:50.004066+00
4	infrastructure@globalitforum.org	Active	2026-10-10 04:59:50.004066+00
5	director@cybersecuritydaily.com	Active	2026-10-10 05:10:31.005068+00
\.


--
-- Data for Name: quote_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.quote_requests (id, client_name, email, phone, company, selected_services, deployment_type, user_count, estimated_monthly, estimated_onetime, timeline, requirements, status, created_at) FROM stdin;
1	Linda Chen	lchen@biopharmaresearch.org	+1 555-442-9901	BioPharma Dynamics	["SaaS & Cloud Solutions", "IT Security & Network Solutions", "HRM"]	Hybrid Cloud	150	4200.00	18500.00	Within 3 months	Need HIPAA-compliant private cloud storage, enterprise endpoint detection, and biometric HRM system.	Reviewing	2026-10-10 04:59:50.004066+00
2	Gregory Stone	gstone@beaconretail.com	+1 555-331-8842	Beacon Retail Chain	["Stock & Inventory Management", "CCTV & Physical Security Solutions", "IT Infrastructure & Maintenance Services"]	Multi-Site On-Prem & Cloud Sync	320	7800.00	34000.00	Immediate (within 30 days)	Connecting 14 retail branches with live barcode inventory tracking and 4K NVR CCTV surveillance.	Proposal Sent	2026-10-10 04:59:50.004066+00
3	Marcus Vance	mvance@creativestudios.co	+1 555-061-4478	Vance Digital Media	["SaaS & Cloud Solutions", "IT Security & Network Solutions"]	Hybrid Multi-Cloud	65	3450.00	12800.00	Within 60 Days	Need Azure migration for 65 video editors and zero trust firewall.	Reviewing	2026-10-10 05:10:34.863399+00
\.


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 13, true);


--
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 4, true);


--
-- Name: consultations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.consultations_id_seq', 3, true);


--
-- Name: inquiries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inquiries_id_seq', 6, true);


--
-- Name: mail_aliases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mail_aliases_id_seq', 3, true);


--
-- Name: mail_domains_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mail_domains_id_seq', 1, true);


--
-- Name: mail_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mail_messages_id_seq', 7, true);


--
-- Name: mail_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mail_users_id_seq', 4, true);


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.newsletter_subscribers_id_seq', 5, true);


--
-- Name: quote_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.quote_requests_id_seq', 3, true);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_email_key UNIQUE (email);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: consultations consultations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consultations
    ADD CONSTRAINT consultations_pkey PRIMARY KEY (id);


--
-- Name: inquiries inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inquiries
    ADD CONSTRAINT inquiries_pkey PRIMARY KEY (id);


--
-- Name: mail_aliases mail_aliases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mail_aliases
    ADD CONSTRAINT mail_aliases_pkey PRIMARY KEY (id);


--
-- Name: mail_domains mail_domains_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mail_domains
    ADD CONSTRAINT mail_domains_name_key UNIQUE (name);


--
-- Name: mail_domains mail_domains_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mail_domains
    ADD CONSTRAINT mail_domains_pkey PRIMARY KEY (id);


--
-- Name: mail_messages mail_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mail_messages
    ADD CONSTRAINT mail_messages_pkey PRIMARY KEY (id);


--
-- Name: mail_users mail_users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mail_users
    ADD CONSTRAINT mail_users_email_key UNIQUE (email);


--
-- Name: mail_users mail_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mail_users
    ADD CONSTRAINT mail_users_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: quote_requests quote_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quote_requests
    ADD CONSTRAINT quote_requests_pkey PRIMARY KEY (id);


--
-- Name: idx_mail_messages_account_folder; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mail_messages_account_folder ON public.mail_messages USING btree (account_id, folder);


--
-- Name: idx_mail_messages_received_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mail_messages_received_at ON public.mail_messages USING btree (received_at DESC);


--
-- Name: mail_aliases mail_aliases_domain_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mail_aliases
    ADD CONSTRAINT mail_aliases_domain_id_fkey FOREIGN KEY (domain_id) REFERENCES public.mail_domains(id) ON DELETE CASCADE;


--
-- Name: mail_messages mail_messages_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mail_messages
    ADD CONSTRAINT mail_messages_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.mail_users(id) ON DELETE CASCADE;


--
-- Name: mail_users mail_users_domain_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mail_users
    ADD CONSTRAINT mail_users_domain_id_fkey FOREIGN KEY (domain_id) REFERENCES public.mail_domains(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


