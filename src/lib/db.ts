import { Pool, QueryResult, QueryResultRow } from 'pg';
import bcrypt from 'bcryptjs';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://internova:internova123@localhost:5432/eclypetech';

    pool = new Pool({
      connectionString,
      max: 15,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err);
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const p = getPool();
  return p.query<T>(text, params);
}

export async function initDb(): Promise<void> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');

    // 1. Inquiries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        company VARCHAR(255),
        service_id VARCHAR(100),
        division_id VARCHAR(100),
        budget VARCHAR(100),
        urgency VARCHAR(50) DEFAULT 'Normal',
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Consultations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS consultations (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        business_size VARCHAR(100),
        division VARCHAR(100),
        preferred_date VARCHAR(50),
        preferred_time VARCHAR(50),
        notes TEXT,
        status VARCHAR(50) DEFAULT 'Scheduled',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Quote Requests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quote_requests (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        company VARCHAR(255) NOT NULL,
        selected_services JSONB NOT NULL DEFAULT '[]'::jsonb,
        deployment_type VARCHAR(100),
        user_count INT DEFAULT 10,
        estimated_monthly NUMERIC(10, 2),
        estimated_onetime NUMERIC(10, 2),
        timeline VARCHAR(100),
        requirements TEXT,
        status VARCHAR(50) DEFAULT 'Reviewing',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Newsletter table
    await client.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Activity logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(255) NOT NULL,
        details TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Admin Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'Admin',
        status VARCHAR(50) DEFAULT 'Active',
        avatar_color VARCHAR(50) DEFAULT 'emerald',
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if initial admin users seed is needed
    const adminCheck = await client.query('SELECT COUNT(*) FROM admin_users');
    if (parseInt(adminCheck.rows[0].count, 10) === 0) {
      const superAdminHash = bcrypt.hashSync('Admin@EclypeTech2026!', 10);
      const opsAdminHash = bcrypt.hashSync('Staff@EclypeTech2026!', 10);
      const supportLeadHash = bcrypt.hashSync('Support@EclypeTech2026!', 10);

      await client.query(
        `INSERT INTO admin_users (name, email, password_hash, role, status, avatar_color)
         VALUES 
           ('System Administrator', 'admin@eclypetech.biz', $1, 'Super Admin', 'Active', 'sky'),
           ('Sarah Jenkins', 'sarah.ops@eclypetech.biz', $2, 'Admin', 'Active', 'emerald'),
           ('David Support', 'support@eclypetech.biz', $3, 'Support Lead', 'Active', 'indigo');`,
        [superAdminHash, opsAdminHash, supportLeadHash]
      );

      await client.query(`
        INSERT INTO activity_logs (action, details)
        VALUES ('ADMIN_INIT', 'Seeded initial enterprise administrator accounts (Super Admin, Admin, Support Lead).');
      `);
    }

    // Check if initial seed is needed
    const countCheck = await client.query('SELECT COUNT(*) FROM inquiries');
    if (parseInt(countCheck.rows[0].count, 10) === 0) {
      // Seed initial inquiries
      await client.query(`
        INSERT INTO inquiries (name, email, phone, company, service_id, division_id, budget, urgency, message, status)
        VALUES 
          ('Sarah Jenkins', 'sjenkins@meditechsystems.org', '+855 77 882 285', 'MediTech Systems', 'cctv-security', 'infrastructure', '$25,000 - $50,000', 'Normal', 'Looking to upgrade IP CCTV across 4 hospital wings with biometric access control integration.', 'Pending'),
          ('Robert Thorne', 'robert@apexlogistics.io', '+1 555-038-9120', 'Apex Global Logistics', 'erp', 'software', '$100,000+', 'High', 'Evaluating enterprise ERP system for multi-warehouse inventory, procurement and real-time fleet dispatching.', 'Pending'),
          ('Elena Rostova', 'elena@finvanguard.ch', '+1 555-047-3312', 'Vanguard Wealth Advisory', 'security-network', 'infrastructure', '$50,000 - $100,000', 'Urgent', 'Require enterprise next-gen firewall deployment, zero-trust VPN, and compliance network segmentation.', 'Completed'),
          ('Marcus Vance', 'mvance@creativestudios.co', '+1 555-061-4478', 'Vance Digital Media', 'saas-cloud', 'cloud', '$10,000 - $25,000', 'Normal', 'Migrating on-prem file servers to Microsoft Azure and Microsoft 365 Enterprise for 180 hybrid staff.', 'Pending');
      `);

      // Seed initial consultations
      await client.query(`
        INSERT INTO consultations (full_name, email, phone, company_name, business_size, division, preferred_date, preferred_time, notes, status)
        VALUES
          ('Alexander Wright', 'awright@quantumfin.com', '+1 555-718-2930', 'Quantum Financial Labs', '250-1000 employees', 'Cloud & Managed IT Services', '2026-10-18', '10:00 AM EST', 'Discuss multi-region Azure failover architecture and compliance audits.', 'Confirmed'),
          ('Patricia Alvarez', 'palvarez@solarfusion.net', '+1 555-829-1049', 'SolarFusion Energy', '50-249 employees', 'Business Management Software', '2026-10-20', '02:30 PM EST', 'Demonstration of HRM and biometric attendance integration.', 'Scheduled'),
          ('Jonathan Cole', 'jcole@titanind.com', '+1 555-938-4102', 'Titan Manufacturing Industries', '1000+ employees', 'Enterprise IT Infrastructure', '2026-10-22', '11:15 AM EST', 'Structured fiber cabling and redundant core switches upgrade for plant floor.', 'Scheduled');
      `);

      // Seed initial quote requests
      await client.query(`
        INSERT INTO quote_requests (client_name, email, phone, company, selected_services, deployment_type, user_count, estimated_monthly, estimated_onetime, timeline, requirements, status)
        VALUES
          ('Linda Chen', 'lchen@biopharmaresearch.org', '+1 555-442-9901', 'BioPharma Dynamics', 
           '["SaaS & Cloud Solutions", "IT Security & Network Solutions", "HRM"]'::jsonb, 
           'Hybrid Cloud', 150, 4200.00, 18500.00, 'Within 3 months', 'Need HIPAA-compliant private cloud storage, enterprise endpoint detection, and biometric HRM system.', 'Reviewing'),
          ('Gregory Stone', 'gstone@beaconretail.com', '+1 555-331-8842', 'Beacon Retail Chain', 
           '["Stock & Inventory Management", "CCTV & Physical Security Solutions", "IT Infrastructure & Maintenance Services"]'::jsonb, 
           'Multi-Site On-Prem & Cloud Sync', 320, 7800.00, 34000.00, 'Immediate (within 30 days)', 'Connecting 14 retail branches with live barcode inventory tracking and 4K NVR CCTV surveillance.', 'Proposal Sent');
      `);

      // Seed initial newsletter subscribers
      await client.query(`
        INSERT INTO newsletter_subscribers (email)
        VALUES 
          ('techleads@enterpriseitnews.com'),
          ('cio-digest@datacenterinsider.org'),
          ('devops@cloudscale.net'),
          ('infrastructure@globalitforum.org')
        ON CONFLICT (email) DO NOTHING;
      `);

      // Seed log
      await client.query(`
        INSERT INTO activity_logs (action, details)
        VALUES ('SYSTEM_INIT', 'ECLYPE Technology PostgreSQL database initialized with initial schema and enterprise seed data.');
      `);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during initDb:', error);
    throw error;
  } finally {
    client.release();
  }
}
