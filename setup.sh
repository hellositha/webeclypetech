#!/usr/bin/env bash
# ==============================================================================
# ECLYPE Technology - Production Server Setup & Deployment Script
# Supports: Ubuntu 22.04, 24.04, 26.04 LTS
# Services: Next.js (App Router), PostgreSQL, Postfix, Dovecot, Nginx, UFW, Fail2ban
# ==============================================================================

set -e

# --- Visual Styling ---
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn()    { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }
log_step()    { echo -e "\n${BOLD}${CYAN}===> $1${NC}"; }

# --- Default Configuration Variables ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${SCRIPT_DIR}"
DOMAIN="${DOMAIN:-eclypetech.biz}"
WWW_DOMAIN="${WWW_DOMAIN:-www.eclypetech.biz}"
DB_NAME="${DB_NAME:-eclypetech}"
DB_USER="${DB_USER:-internova}"
DB_PASS="${DB_PASS:-internova123}"
APP_PORT="${APP_PORT:-3000}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@${DOMAIN}}"
SKIP_SSL=false
SKIP_FIREWALL=false

# Parse command line flags
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --skip-ssl) SKIP_SSL=true ;;
        --skip-firewall) SKIP_FIREWALL=true ;;
        --domain) DOMAIN="$2"; WWW_DOMAIN="www.$2"; shift ;;
        --db-pass) DB_PASS="$2"; shift ;;
        --help)
            echo "Usage: sudo bash setup.sh [OPTIONS]"
            echo "Options:"
            echo "  --domain <domain>    Set primary domain (default: eclypetech.biz)"
            echo "  --db-pass <password> Set database password (default: internova123)"
            echo "  --skip-ssl           Skip Let's Encrypt SSL issuance"
            echo "  --skip-firewall      Skip UFW and Fail2ban configuration"
            exit 0
            ;;
        *) log_warn "Unknown parameter: $1" ;;
    esac
    shift
done

# --- Root Check ---
if [ "$(id -u)" -ne 0 ]; then
    log_error "This script must be run as root (or with sudo)."
    exit 1
fi

echo -e "${BOLD}${CYAN}"
cat << "EOF"
  ______ _____ _  __     ______  ______   _______ ______ _____ _    _ 
 |  ____/ ____| | \ \   / /  _ \|  ____| |__   __|  ____/ ____| |  | |
 | |__ | |    | |  \ \_/ /| |_) | |__       | |  | |__ | |    | |__| |
 |  __|| |    | |   \   / |  _ <|  __|      | |  |  __|| |    |  __  |
 | |___| |____| |____| |  | |_) | |____     | |  | |___| |____| |  | |
 |______\_____|______|_|  |____/|______|    |_|  |______\_____|_|  |_|
EOF
echo -e "${NC}"
log_info "Initializing ECLYPE Technology Enterprise Stack Setup..."
log_info "Target Directory: ${APP_DIR}"
log_info "Domain: ${DOMAIN} (${WWW_DOMAIN})"
log_info "Database: ${DB_NAME} (User: ${DB_USER})"

# ==============================================================================
# STEP 1: System Update & Core Packages Installation
# ==============================================================================
log_step "Step 1: Updating System Repositories and Installing Core Packages"

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y --no-install-recommends \
    curl \
    wget \
    git \
    build-essential \
    unzip \
    software-properties-common \
    ca-certificates \
    gnupg \
    lsb-release \
    cron

# Install Node.js if not present or version < 18
NODE_NEED_INSTALL=true
if command -v node >/dev/null 2>&1; then
    NODE_MAJOR=$(node -v | cut -d'.' -f1 | tr -d 'v')
    if [ "$NODE_MAJOR" -ge 18 ]; then
        NODE_NEED_INSTALL=false
        log_info "Node.js $(node -v) is already installed."
    fi
fi

if [ "$NODE_NEED_INSTALL" = true ]; then
    log_info "Installing Node.js 20.x LTS from NodeSource..."
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg --yes
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
    apt-get update -y
    apt-get install -y nodejs
fi
log_success "Node.js $(node -v) and npm $(npm -v) confirmed."

# Install PostgreSQL, Nginx, Mail Daemons, and Security Tools
log_info "Installing PostgreSQL, Nginx, Postfix, Dovecot, UFW, and Fail2ban..."
apt-get install -y \
    postgresql \
    postgresql-contrib \
    nginx \
    postfix \
    postfix-pgsql \
    dovecot-core \
    dovecot-imapd \
    dovecot-pop3d \
    dovecot-lmtpd \
    dovecot-pgsql \
    mailutils \
    ufw \
    fail2ban \
    python3-systemd \
    certbot \
    python3-certbot-nginx

log_success "All system packages installed successfully."

# ==============================================================================
# STEP 2: PostgreSQL Database & Schema Initialization
# ==============================================================================
log_step "Step 2: Configuring PostgreSQL Database"

systemctl enable postgresql
systemctl start postgresql

log_info "Setting up database user and permissions..."
su - postgres -c "psql -tc \"SELECT 1 FROM pg_roles WHERE rolname = '${DB_USER}'\" | grep -q 1 || psql -c \"CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';\""
su - postgres -c "psql -c \"ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASS}';\""
su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'\" | grep -q 1 || psql -c \"CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};\""
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};\""

log_info "Executing database schema & seed scripts..."
if [ -f "${APP_DIR}/database/schema.sql" ]; then
    log_info "Loading schema from ${APP_DIR}/database/schema.sql..."
    su - postgres -c "psql -d ${DB_NAME} -f \"${APP_DIR}/database/schema.sql\""
else
    log_warn "${APP_DIR}/database/schema.sql not found. Creating baseline tables directly..."
    su - postgres -c "psql -d ${DB_NAME}" << 'EOSQL'
CREATE TABLE IF NOT EXISTS public.admin_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Admin',
    status VARCHAR(50) DEFAULT 'Active',
    avatar_color VARCHAR(50) DEFAULT 'bg-sky-500',
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    company VARCHAR(255),
    service_interest VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'New',
    priority VARCHAR(50) DEFAULT 'Normal',
    source VARCHAR(100) DEFAULT 'Website Contact Form',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.quote_requests (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    company VARCHAR(255) NOT NULL,
    selected_services JSONB DEFAULT '[]'::jsonb NOT NULL,
    deployment_type VARCHAR(100),
    user_count INTEGER DEFAULT 10,
    estimated_monthly NUMERIC(10,2),
    estimated_onetime NUMERIC(10,2),
    timeline VARCHAR(100),
    requirements TEXT,
    status VARCHAR(50) DEFAULT 'Reviewing',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.consultations (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    company VARCHAR(255) NOT NULL,
    interest VARCHAR(255) NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(100) NOT NULL,
    format VARCHAR(100) DEFAULT 'Video Call (Teams/Meet)',
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.mail_domains (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.mail_users (
    id SERIAL PRIMARY KEY,
    domain_id INTEGER REFERENCES public.mail_domains(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    maildir VARCHAR(255) NOT NULL,
    quota_bytes BIGINT DEFAULT 5368709120,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.mail_aliases (
    id SERIAL PRIMARY KEY,
    domain_id INTEGER REFERENCES public.mail_domains(id) ON DELETE CASCADE,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.mail_messages (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES public.mail_users(id) ON DELETE CASCADE,
    folder VARCHAR(50) DEFAULT 'INBOX',
    message_id VARCHAR(255),
    from_address VARCHAR(255) NOT NULL,
    from_name VARCHAR(255),
    to_address TEXT NOT NULL,
    cc_address TEXT,
    bcc_address TEXT,
    reply_to VARCHAR(255),
    subject TEXT NOT NULL,
    body_text TEXT,
    body_html TEXT,
    snippet TEXT,
    is_read BOOLEAN DEFAULT false,
    is_starred BOOLEAN DEFAULT false,
    is_draft BOOLEAN DEFAULT false,
    has_attachments BOOLEAN DEFAULT false,
    attachments JSONB DEFAULT '[]'::jsonb,
    size_bytes INTEGER DEFAULT 0,
    received_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mail_messages_account_folder ON public.mail_messages (account_id, folder);
CREATE INDEX IF NOT EXISTS idx_mail_messages_received_at ON public.mail_messages (received_at DESC);

-- Seed Initial Superadmin (password: EclypeAdmin2026!)
INSERT INTO public.admin_users (id, name, email, password_hash, role, status)
VALUES (1, 'System Administrator', 'admin@eclypetech.biz', '$2b$10$tCMrXKyAkQbSCb2VdScUyOFBQZC/5Wezd11OZXqWNmhI/wQt49Ke6', 'Super Admin', 'Active')
ON CONFLICT (email) DO NOTHING;

-- Seed Virtual Domains & Accounts
INSERT INTO public.mail_domains (id, name, active)
VALUES (1, 'eclypetech.biz', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.mail_users (id, domain_id, email, password_hash, name, maildir, quota_bytes, active)
VALUES 
(1, 1, 'admin@eclypetech.biz', '{BLF-CRYPT}$2y$05$nkvvfLOzoVNd21s4DpPzye7xKMBnnPZuW4yn28SZPGrYsNSZFuQAa', 'System Administrator', 'eclypetech.biz/admin/Maildir/', 5368709120, true),
(2, 1, 'contact@eclypetech.biz', '{BLF-CRYPT}$2y$05$nkvvfLOzoVNd21s4DpPzye7xKMBnnPZuW4yn28SZPGrYsNSZFuQAa', 'ECLYPE Customer Desk', 'eclypetech.biz/contact/Maildir/', 5368709120, true),
(3, 1, 'support@eclypetech.biz', '{BLF-CRYPT}$2y$05$nkvvfLOzoVNd21s4DpPzye7xKMBnnPZuW4yn28SZPGrYsNSZFuQAa', '24/7 Technical Support', 'eclypetech.biz/support/Maildir/', 5368709120, true),
(4, 1, 'sarah.ops@eclypetech.biz', '{BLF-CRYPT}$2y$05$nkvvfLOzoVNd21s4DpPzye7xKMBnnPZuW4yn28SZPGrYsNSZFuQAa', 'Sarah Operations', 'eclypetech.biz/sarah.ops/Maildir/', 5368709120, true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.mail_aliases (id, domain_id, source, destination, active)
VALUES
(1, 1, 'info@eclypetech.biz', 'contact@eclypetech.biz', true),
(2, 1, 'help@eclypetech.biz', 'support@eclypetech.biz', true),
(3, 1, 'sales@eclypetech.biz', 'contact@eclypetech.biz', true)
ON CONFLICT DO NOTHING;
EOSQL
fi

# Ensure user permissions
su - postgres -c "psql -d ${DB_NAME} -c \"GRANT ALL ON ALL TABLES IN SCHEMA public TO ${DB_USER}; GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO ${DB_USER};\""
log_success "PostgreSQL database and schema configured successfully."

# ==============================================================================
# STEP 3: Project Configuration, Dependencies & Build
# ==============================================================================
log_step "Step 3: Building Next.js Application"

cd "${APP_DIR}"

# Create or verify .env
if [ ! -f "${APP_DIR}/.env" ]; then
    log_info "Creating .env configuration file..."
    cat > "${APP_DIR}/.env" << EOF
DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}
NEXT_PUBLIC_APP_NAME="ECLYPE Technology"
NEXT_PUBLIC_APP_TAGLINE="Integrated IT Solutions & Services Provider"
NEXT_PUBLIC_SUPPORT_EMAIL="contact@${DOMAIN}"
NEXT_PUBLIC_SUPPORT_PHONE="+855 (77) 882 285"
NEXT_PUBLIC_COMPANY_ADDRESS="#25G, Chaomchao 3, Porsenchey, Phnom Penh, Cambodia"
JWT_SECRET="eclype_tech_enterprise_jwt_secret_key_2026_secured_98f12a"
EOF
    cp "${APP_DIR}/.env" "${APP_DIR}/.env.local"
fi

log_info "Installing npm dependencies..."
npm install

log_info "Compiling optimized Next.js production build..."
npm run build
log_success "Next.js application built cleanly."

# ==============================================================================
# STEP 4: Systemd Service Configuration
# ==============================================================================
log_step "Step 4: Configuring Systemd Service (eclypetech.service)"

cat > /etc/systemd/system/eclypetech.service << EOF
[Unit]
Description=ECLYPE Technology Next.js Production Service
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=${APP_DIR}
Environment=NODE_ENV=production
Environment=PORT=${APP_PORT}
Environment=DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}
ExecStart=$(which npm) run start -- -p ${APP_PORT}
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable eclypetech.service
systemctl restart eclypetech.service
log_success "eclypetech.service enabled and started on port ${APP_PORT}."

# ==============================================================================
# STEP 5: Postfix & Dovecot Mail Server Setup
# ==============================================================================
log_step "Step 5: Configuring Postfix MTA & Dovecot IMAP/LMTP"

# Create system vmail user/group if not exists
if ! getent group vmail >/dev/null; then
    groupadd -g 5000 vmail
fi
if ! getent passwd vmail >/dev/null; then
    useradd -u 5000 -g vmail -s /usr/sbin/nologin -d /var/mail/vhosts -m vmail
fi

mkdir -p /var/mail/vhosts/${DOMAIN}
chown -R vmail:vmail /var/mail/vhosts
chmod -R 770 /var/mail/vhosts

# Postfix PostgreSQL Maps
mkdir -p /etc/postfix/pgsql

cat > /etc/postfix/pgsql/virtual_domains.cf << EOF
hosts = 127.0.0.1
user = ${DB_USER}
password = ${DB_PASS}
dbname = ${DB_NAME}
query = SELECT name FROM mail_domains WHERE name='%s' AND active=true
EOF

cat > /etc/postfix/pgsql/virtual_mailboxes.cf << EOF
hosts = 127.0.0.1
user = ${DB_USER}
password = ${DB_PASS}
dbname = ${DB_NAME}
query = SELECT maildir FROM mail_users WHERE email='%s' AND active=true
EOF

cat > /etc/postfix/pgsql/virtual_aliases.cf << EOF
hosts = 127.0.0.1
user = ${DB_USER}
password = ${DB_PASS}
dbname = ${DB_NAME}
query = SELECT destination FROM mail_aliases WHERE source='%s' AND active=true
EOF

cat > /etc/postfix/pgsql/virtual_email2email.cf << EOF
hosts = 127.0.0.1
user = ${DB_USER}
password = ${DB_PASS}
dbname = ${DB_NAME}
query = SELECT email FROM mail_users WHERE email='%s' AND active=true
EOF

chmod 640 /etc/postfix/pgsql/*.cf
chgrp postfix /etc/postfix/pgsql/*.cf

# Fallback SSL Cert for Mail Daemons
SSL_CERT_PATH="/etc/ssl/certs/ssl-cert-snakeoil.pem"
SSL_KEY_PATH="/etc/ssl/private/ssl-cert-snakeoil.key"
if [ -f "/etc/letsencrypt/live/${WWW_DOMAIN}/fullchain.pem" ]; then
    SSL_CERT_PATH="/etc/letsencrypt/live/${WWW_DOMAIN}/fullchain.pem"
    SSL_KEY_PATH="/etc/letsencrypt/live/${WWW_DOMAIN}/privkey.pem"
elif [ ! -f "${SSL_CERT_PATH}" ]; then
    log_info "Generating fallback self-signed SSL certificate for mail..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "${SSL_KEY_PATH}" \
        -out "${SSL_CERT_PATH}" \
        -subj "/CN=${WWW_DOMAIN}" >/dev/null 2>&1
fi

# Configure Postfix main.cf
postconf -e "myhostname = mail.${DOMAIN}"
postconf -e "mydomain = ${DOMAIN}"
postconf -e "myorigin = \$mydomain"
postconf -e "mydestination = \$myhostname, localhost.\$mydomain, localhost"
postconf -e "mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128"
postconf -e "mailbox_size_limit = 0"
postconf -e "message_size_limit = 52428800"
postconf -e "recipient_delimiter = +"
postconf -e "inet_interfaces = all"
postconf -e "inet_protocols = all"

# Postfix virtual delivery via Dovecot LMTP
postconf -e "virtual_transport = lmtp:unix:private/dovecot-lmtp"
postconf -e "virtual_mailbox_domains = pgsql:/etc/postfix/pgsql/virtual_domains.cf"
postconf -e "virtual_mailbox_maps = pgsql:/etc/postfix/pgsql/virtual_mailboxes.cf"
postconf -e "virtual_alias_maps = pgsql:/etc/postfix/pgsql/virtual_aliases.cf"

# Dovecot SASL Auth for Postfix
postconf -e "smtpd_sasl_type = dovecot"
postconf -e "smtpd_sasl_path = private/auth"
postconf -e "smtpd_sasl_auth_enable = yes"
postconf -e "smtpd_sasl_security_options = noanonymous"
postconf -e "smtpd_sasl_local_domain = \$mydomain"
postconf -e "smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination"
postconf -e "smtpd_relay_restrictions = permit_mynetworks, permit_sasl_authenticated, defer_unauth_destination"

# Postfix TLS
postconf -e "smtpd_tls_security_level = may"
postconf -e "smtpd_tls_cert_file = ${SSL_CERT_PATH}"
postconf -e "smtpd_tls_key_file = ${SSL_KEY_PATH}"

# Enable submission (587) and smtps (465) in /etc/postfix/master.cf
sed -i 's/^#submission/submission/' /etc/postfix/master.cf
sed -i 's/^#submissions/submissions/' /etc/postfix/master.cf

# Configure Dovecot local.conf
DOVECOT_VER=$(dovecot --version 2>/dev/null | cut -d'.' -f1,2 || echo "2.4")

if [[ "${DOVECOT_VER}" =~ ^2\.[4-9] ]]; then
    # Dovecot 2.4+ Syntax
    cat > /etc/dovecot/local.conf << EOF
protocols {
  imap = yes
  pop3 = yes
  lmtp = yes
}

auth_allow_cleartext = yes

mail_driver = maildir
mail_path = /var/mail/vhosts/%{user | domain}/%{user | username}/Maildir
mail_home = /var/mail/vhosts/%{user | domain}/%{user | username}
mail_uid = 5000
mail_gid = 5000
first_valid_uid = 5000
last_valid_uid = 5000

sql_driver = pgsql

pgsql 127.0.0.1 {
  pgsql_parameters {
    dbname = ${DB_NAME}
    user = ${DB_USER}
    password = ${DB_PASS}
  }
}

passdb sql {
  passdb_default_password_scheme = BLF-CRYPT
  passdb_sql_query = SELECT email as user, password_hash as password FROM mail_users WHERE (email = '%{user}' OR email LIKE '%{user}@%') AND active = true
}

userdb sql {
  userdb_sql_query = SELECT '/var/mail/vhosts/' || maildir as home, 5000 as uid, 5000 as gid, 'maildir' as mail_driver, '/var/mail/vhosts/' || maildir as mail_path FROM mail_users WHERE (email = '%{user}' OR email LIKE '%{user}@%') AND active = true
}

service lmtp {
  unix_listener /var/spool/postfix/private/dovecot-lmtp {
    mode = 0600
    user = postfix
    group = postfix
  }
}

service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0666
    user = postfix
    group = postfix
  }
}

ssl_server {
  cert_file = ${SSL_CERT_PATH}
  key_file = ${SSL_KEY_PATH}
}

protocol lmtp {
  auth_username_format = %{user | lower}
}
mail_inbox_path = /var/mail/vhosts/%{user | domain}/%{user | username}/Maildir
EOF
else
    # Dovecot 2.3 Legacy Syntax
    cat > /etc/dovecot/dovecot-sql.conf.ext << EOF
driver = pgsql
connect = host=127.0.0.1 dbname=${DB_NAME} user=${DB_USER} password=${DB_PASS}
default_pass_scheme = BLF-CRYPT
password_query = SELECT email as user, password_hash as password FROM mail_users WHERE (email = '%u' OR email LIKE '%u@%') AND active = true
user_query = SELECT '/var/mail/vhosts/' || maildir as home, 5000 as uid, 5000 as gid, 'maildir' as mail_driver, '/var/mail/vhosts/' || maildir as mail_path FROM mail_users WHERE (email = '%u' OR email LIKE '%u@%') AND active = true
EOF
    cat > /etc/dovecot/local.conf << EOF
protocols = imap pop3 lmtp
disable_plaintext_auth = no
mail_location = maildir:/var/mail/vhosts/%d/%n/Maildir
mail_uid = 5000
mail_gid = 5000
first_valid_uid = 5000
last_valid_uid = 5000

passdb {
  driver = sql
  args = /etc/dovecot/dovecot-sql.conf.ext
}
userdb {
  driver = sql
  args = /etc/dovecot/dovecot-sql.conf.ext
}

service lmtp {
  unix_listener /var/spool/postfix/private/dovecot-lmtp {
    mode = 0600
    user = postfix
    group = postfix
  }
}

service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0666
    user = postfix
    group = postfix
  }
}

ssl = yes
ssl_cert = <${SSL_CERT_PATH}
ssl_key = <${SSL_KEY_PATH}
EOF
fi

usermod -aG ssl-cert postfix || true
usermod -aG ssl-cert dovecot || true

systemctl enable postfix dovecot
systemctl restart postfix dovecot
log_success "Postfix and Dovecot configured and running."

# ==============================================================================
# STEP 6: Nginx Reverse Proxy Configuration & SSL
# ==============================================================================
log_step "Step 6: Configuring Nginx Reverse Proxy"

mkdir -p /var/www/html/.well-known/acme-challenge
chown -R www-data:www-data /var/www/html

# Prepare SSL certificate files
NGINX_CERT="${SSL_CERT_PATH}"
NGINX_KEY="${SSL_KEY_PATH}"

# Write Nginx configuration
cat > /etc/nginx/sites-available/default << EOF
# HTTP server block: redirect all HTTP traffic to HTTPS (preserving ACME challenge path)
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name ${WWW_DOMAIN} ${DOMAIN} localhost _;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://${WWW_DOMAIN}\$request_uri;
    }
}

# HTTPS server block
server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    http2 on;

    server_name ${WWW_DOMAIN} localhost _;

    # SSL Certificates
    ssl_certificate ${NGINX_CERT};
    ssl_certificate_key ${NGINX_KEY};

    # Modern TLS Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;

    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-XSS-Protection "1; mode=block" always;

    client_max_body_size 50M;

    gzip on;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    gzip_vary on;

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Ssl on;
    }
}
EOF

nginx -t
systemctl enable nginx
systemctl reload nginx || systemctl restart nginx
log_success "Nginx reverse proxy active."

# Attempt Let's Encrypt SSL issuance if enabled and not already active
if [ "$SKIP_SSL" = false ] && [ ! -f "/etc/letsencrypt/live/${WWW_DOMAIN}/fullchain.pem" ]; then
    log_info "Checking if ${WWW_DOMAIN} resolves to this server before requesting Let's Encrypt..."
    SERVER_IP=$(curl -s https://ifconfig.me || curl -s https://api.ipify.org || echo "")
    DOMAIN_IP=$(python3 -c "import socket; print(socket.gethostbyname('${WWW_DOMAIN}'))" 2>/dev/null || echo "")

    if [ -n "$SERVER_IP" ] && [ "$SERVER_IP" = "$DOMAIN_IP" ]; then
        log_info "DNS matched! Issuing Let's Encrypt certificate for ${WWW_DOMAIN}..."
        certbot certonly --nginx -d "${WWW_DOMAIN}" --agree-tos -m "${ADMIN_EMAIL}" --no-eff-email --non-interactive || true
        
        if [ -f "/etc/letsencrypt/live/${WWW_DOMAIN}/fullchain.pem" ]; then
            log_success "Let's Encrypt SSL certificate obtained successfully!"
            sed -i "s|ssl_certificate .*|ssl_certificate /etc/letsencrypt/live/${WWW_DOMAIN}/fullchain.pem;|" /etc/nginx/sites-available/default
            sed -i "s|ssl_certificate_key .*|ssl_certificate_key /etc/letsencrypt/live/${WWW_DOMAIN}/privkey.pem;|" /etc/nginx/sites-available/default
            systemctl reload nginx

            # Update Postfix & Dovecot to use Let's Encrypt
            postconf -e "smtpd_tls_cert_file = /etc/letsencrypt/live/${WWW_DOMAIN}/fullchain.pem"
            postconf -e "smtpd_tls_key_file = /etc/letsencrypt/live/${WWW_DOMAIN}/privkey.pem"
            systemctl restart postfix dovecot
        fi
    else
        log_warn "DNS for ${WWW_DOMAIN} (${DOMAIN_IP}) does not match this server's public IP (${SERVER_IP})."
        log_warn "Nginx is running with self-signed SSL. Run 'certbot --nginx -d ${WWW_DOMAIN}' once DNS points here."
    fi
fi

# ==============================================================================
# STEP 7: Security Hardening (UFW Firewall & Fail2ban)
# ==============================================================================
if [ "$SKIP_FIREWALL" = false ]; then
    log_step "Step 7: Configuring UFW Firewall and Fail2ban"

    # Configure UFW
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow in on lo comment 'Allow Loopback (Gemini/Antigravity/Internal Services)'
    ufw allow out on lo comment 'Allow Loopback Outbound'
    ufw allow 22/tcp comment 'SSH'
    ufw allow 443/tcp comment 'HTTPS - ECLYPE Platform'
    ufw --force enable

    systemctl enable ufw
    systemctl restart ufw
    log_success "UFW firewall active (Ports 22 & 443 allowed, Loopback allowed, others blocked)."

    # Configure Fail2ban
    cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
ignoreip = 127.0.0.1/8 ::1 172.217.0.0/16 142.250.0.0/15 34.0.0.0/8 8.8.8.8 8.8.4.4
bantime  = 1h
findtime = 10m
maxretry = 5
banaction = ufw
banaction_allports = ufw
backend = systemd

[sshd]
enabled = true
port = 22
backend = systemd
maxretry = 4
findtime = 10m
bantime = 1h

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-botsearch]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 2
bantime = 2h
EOF

    systemctl enable fail2ban
    systemctl restart fail2ban
    log_success "Fail2ban configured with Gemini/Antigravity whitelist and UFW integration."
fi

# ==============================================================================
# STEP 8: Final Verification & Service Status Report
# ==============================================================================
log_step "Step 8: Verifying System Health & Active Daemons"

SERVICES=("eclypetech" "postgresql" "nginx" "postfix" "dovecot")
if [ "$SKIP_FIREWALL" = false ]; then
    SERVICES+=("ufw" "fail2ban")
fi

ALL_HEALTHY=true
for SVC in "${SERVICES[@]}"; do
    if systemctl is-active --quiet "$SVC"; then
        echo -e "  [${GREEN}ONLINE${NC}]  $SVC"
    else
        echo -e "  [${RED}OFFLINE${NC}] $SVC"
        ALL_HEALTHY=false
    fi
done

echo ""
if [ "$ALL_HEALTHY" = true ]; then
    echo -e "${BOLD}${GREEN}==============================================================================${NC}"
    echo -e "${BOLD}${GREEN}        ECLYPE TECHNOLOGY PLATFORM DEPLOYED SUCCESSFULLY!                     ${NC}"
    echo -e "${BOLD}${GREEN}==============================================================================${NC}"
else
    echo -e "${BOLD}${YELLOW}Deployment completed with service warnings. Check systemctl status.${NC}"
fi

cat << EOF
ACCESS INFORMATION:
- Public Website & Services:   https://${WWW_DOMAIN}
- Enterprise Webmail:          https://${WWW_DOMAIN}/webmail
- Admin Operations Portal:     https://${WWW_DOMAIN}/admin
- Telemetry Status API:        https://${WWW_DOMAIN}/api/mail/status

PRE-CONFIGURED SYSTEM ACCOUNTS:
1. Admin Portal Superadmin:    admin@${DOMAIN}
2. Webmail System Account:     admin@${DOMAIN}
3. Webmail Customer Desk:      contact@${DOMAIN}
4. Webmail 24/7 Tech Support:  support@${DOMAIN}
5. Webmail Infrastructure Ops: sarah.ops@${DOMAIN}

MANAGEMENT COMMANDS:
- Restart Next.js App:         sudo systemctl restart eclypetech
- View App Logs:               sudo journalctl -u eclypetech -f
- Check Firewall:              sudo ufw status numbered
- Check Fail2ban Bans:         sudo fail2ban-client status sshd
- Re-issue SSL Cert:           sudo certbot --nginx -d ${WWW_DOMAIN}
EOF
