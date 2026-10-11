import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import nodemailer from 'nodemailer';
import { simpleParser } from 'mailparser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool } from './db';

const JWT_SECRET =
  process.env.JWT_SECRET || 'eclype_tech_enterprise_jwt_secret_key_2026_secured_98f12a';

export const MAIL_AUTH_COOKIE_NAME = 'eclype_webmail_token';

export interface MailAccount {
  id: number;
  domain_id: number;
  email: string;
  name: string;
  maildir: string;
  quota_bytes: number;
  active: boolean;
  created_at: string;
}

export interface MailMessage {
  id: number;
  account_id: number;
  folder: 'INBOX' | 'Sent' | 'Drafts' | 'Trash' | 'Archive' | 'Spam';
  message_id: string;
  from_address: string;
  from_name: string;
  to_address: string;
  cc_address?: string;
  bcc_address?: string;
  reply_to?: string;
  subject: string;
  body_text: string;
  body_html: string;
  snippet: string;
  is_read: boolean;
  is_starred: boolean;
  is_draft: boolean;
  has_attachments: boolean;
  attachments: any[];
  size_bytes: number;
  received_at: string;
  created_at: string;
}

const VMAIL_BASE_DIR = '/var/mail/vhosts';

/**
 * Find mail account by email
 */
export async function getMailAccountByEmail(email: string): Promise<MailAccount | null> {
  const pool = getPool();
  const res = await pool.query<MailAccount>(
    'SELECT id, domain_id, email, name, maildir, quota_bytes, active, created_at FROM mail_users WHERE LOWER(email) = LOWER($1) AND active = true',
    [email]
  );
  return res.rows[0] || null;
}

/**
 * Verify mail account password against PostgreSQL stored hash
 */
export async function verifyMailPassword(email: string, plainPassword: string): Promise<MailAccount | null> {
  const pool = getPool();
  const res = await pool.query(
    'SELECT id, domain_id, email, password_hash, name, maildir, quota_bytes, active, created_at FROM mail_users WHERE LOWER(email) = LOWER($1) AND active = true',
    [email]
  );
  if (res.rows.length === 0) return null;
  const user = res.rows[0];

  let rawHash = user.password_hash;
  // Strip {BLF-CRYPT} or {SHA512-CRYPT} prefix if present
  if (rawHash.startsWith('{BLF-CRYPT}')) {
    rawHash = rawHash.replace('{BLF-CRYPT}', '');
  }

  // If plain bcrypt hash ($2y$ or $2a$ or $2b$)
  if (rawHash.startsWith('$2')) {
    const valid = bcrypt.compareSync(plainPassword, rawHash);
    if (valid) {
      const { password_hash, ...account } = user;
      return account as MailAccount;
    }
  }

  // Fallback check: test using doveadm pw if SHA512-CRYPT
  if (user.password_hash.startsWith('{SHA512-CRYPT}') || user.password_hash.startsWith('$6$')) {
    try {
      const doveCheck = execSync(`doveadm auth test "${email}" "${plainPassword.replace(/"/g, '\\"')}"`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      if (doveCheck.includes('passdb: test succeeds')) {
        const { password_hash, ...account } = user;
        return account as MailAccount;
      }
    } catch {
      // Auth test failed
    }
  }

  return null;
}

/**
 * Sync Maildir files with PostgreSQL mail_messages table
 */
export async function syncMaildirToDb(accountEmail: string): Promise<number> {
  const account = await getMailAccountByEmail(accountEmail);
  if (!account) return 0;

  const [username, domain] = account.email.split('@');
  const maildirPath = path.join(VMAIL_BASE_DIR, domain, username, 'Maildir');
  const newDirPath = path.join(maildirPath, 'new');
  const curDirPath = path.join(maildirPath, 'cur');

  if (!fs.existsSync(maildirPath)) {
    return 0;
  }

  const pool = getPool();
  let syncedCount = 0;

  // Process files in new/ directory
  if (fs.existsSync(newDirPath)) {
    const files = fs.readdirSync(newDirPath);
    for (const file of files) {
      if (file.startsWith('.')) continue;
      const fullPath = path.join(newDirPath, file);

      try {
        const stat = fs.statSync(fullPath);
        if (!stat.isFile()) continue;

        const buffer = fs.readFileSync(fullPath);
        const parsed = await simpleParser(buffer);

        const messageId = parsed.messageId || `${Date.now()}-${Math.random()}@eclypetech.biz`;
        const fromAddress = parsed.from?.value[0]?.address || 'unknown@domain.com';
        const fromName = parsed.from?.value[0]?.name || parsed.from?.text || fromAddress;
        const toAddress = parsed.to ? (Array.isArray(parsed.to) ? parsed.to.map((t) => t.text).join(', ') : parsed.to.text) : account.email;
        const subject = parsed.subject || '(No Subject)';
        const bodyText = parsed.text || '';
        const bodyHtml = (parsed.html as string) || '';
        const snippet = (bodyText || subject).replace(/\s+/g, ' ').slice(0, 150);
        const receivedAt = parsed.date ? parsed.date.toISOString() : new Date().toISOString();

        // Check if message already exists
        const existsCheck = await pool.query(
          'SELECT id FROM mail_messages WHERE account_id = $1 AND (message_id = $2 OR (subject = $3 AND from_address = $4 AND received_at = $5))',
          [account.id, messageId, subject, fromAddress, receivedAt]
        );

        if (existsCheck.rows.length === 0) {
          await pool.query(
            `INSERT INTO mail_messages 
              (account_id, folder, message_id, from_address, from_name, to_address, subject, body_text, body_html, snippet, is_read, size_bytes, received_at)
             VALUES ($1, 'INBOX', $2, $3, $4, $5, $6, $7, $8, $9, false, $10, $11)`,
            [
              account.id,
              messageId,
              fromAddress,
              fromName,
              toAddress,
              subject,
              bodyText,
              bodyHtml,
              snippet,
              stat.size,
              receivedAt,
            ]
          );
          syncedCount++;
        }

        // Move to cur/ with seen/read flag
        const destPath = path.join(curDirPath, `${file}:2,S`);
        if (!fs.existsSync(curDirPath)) {
          fs.mkdirSync(curDirPath, { recursive: true });
        }
        fs.renameSync(fullPath, destPath);
      } catch (err) {
        console.error(`Error parsing mail file ${fullPath}:`, err);
      }
    }
  }

  return syncedCount;
}

/**
 * Send an email via Postfix SMTP and record in PostgreSQL Sent folder
 */
export async function sendOutgoingMail({
  senderEmail,
  senderName,
  to,
  cc,
  bcc,
  subject,
  bodyText,
  bodyHtml,
}: {
  senderEmail: string;
  senderName?: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
}) {
  const account = await getMailAccountByEmail(senderEmail);
  if (!account) {
    throw new Error(`Sender account ${senderEmail} not found`);
  }

  // Create transporter pointing to local Postfix MTA
  const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 25,
    secure: false,
    tls: { rejectUnauthorized: false },
  });

  const fromFormatted = senderName ? `"${senderName}" <${senderEmail}>` : senderEmail;

  const info = await transporter.sendMail({
    from: fromFormatted,
    to,
    cc,
    bcc,
    subject,
    text: bodyText,
    html: bodyHtml || `<div style="font-family: sans-serif; line-height: 1.6;">${bodyText.replace(/\n/g, '<br/>')}</div>`,
  });

  // Record sent copy in mail_messages table under 'Sent' folder
  const pool = getPool();
  const snippet = bodyText.replace(/\s+/g, ' ').slice(0, 150);

  const insertRes = await pool.query(
    `INSERT INTO mail_messages 
      (account_id, folder, message_id, from_address, from_name, to_address, cc_address, bcc_address, subject, body_text, body_html, snippet, is_read, received_at)
     VALUES ($1, 'Sent', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, CURRENT_TIMESTAMP)
     RETURNING *`,
    [
      account.id,
      info.messageId || `<${Date.now()}@eclypetech.biz>`,
      senderEmail,
      senderName || senderEmail,
      to,
      cc || null,
      bcc || null,
      subject,
      bodyText,
      bodyHtml || bodyText,
      snippet,
    ]
  );

  // If the recipient is on eclypetech.biz, trigger a sync for that recipient so it appears instantly in their webmail
  const recipients = `${to}, ${cc || ''}`.split(',').map((r) => r.trim());
  for (const recipient of recipients) {
    if (recipient.endsWith('@eclypetech.biz')) {
      try {
        await syncMaildirToDb(recipient);
      } catch {
        // Non-blocking
      }
    }
  }

  return insertRes.rows[0];
}

/**
 * Create a new virtual mailbox in PostgreSQL and initialize Maildir
 */
export async function createVirtualMailAccount({
  email,
  plainPassword,
  name,
  quotaBytes = 5368709120, // 5GB
}: {
  email: string;
  plainPassword: string;
  name: string;
  quotaBytes?: number;
}) {
  const [username, domain] = email.split('@');
  if (!username || !domain) {
    throw new Error('Invalid email address format');
  }

  const pool = getPool();

  // Find or insert domain
  let domainId = 1;
  const domRes = await pool.query('SELECT id FROM mail_domains WHERE name = $1', [domain]);
  if (domRes.rows.length > 0) {
    domainId = domRes.rows[0].id;
  } else {
    const newDom = await pool.query(
      'INSERT INTO mail_domains (name, active) VALUES ($1, true) RETURNING id',
      [domain]
    );
    domainId = newDom.rows[0].id;
  }

  // Generate {BLF-CRYPT} hash using bcrypt
  const salt = bcrypt.genSaltSync(5);
  const hash = bcrypt.hashSync(plainPassword, salt);
  const dovecotHash = `{BLF-CRYPT}${hash}`;

  const maildirRel = `${domain}/${username}/Maildir/`;

  const insertRes = await pool.query(
    `INSERT INTO mail_users (domain_id, email, password_hash, name, maildir, quota_bytes, active)
     VALUES ($1, $2, $3, $4, $5, $6, true)
     RETURNING id, email, name, maildir, quota_bytes, active, created_at`,
    [domainId, email, dovecotHash, name, maildirRel, quotaBytes]
  );

  // Initialize directory on disk
  const maildirFull = path.join(VMAIL_BASE_DIR, domain, username, 'Maildir');
  for (const sub of ['new', 'cur', 'tmp']) {
    const p = path.join(maildirFull, sub);
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true });
    }
  }

  try {
    execSync(`chown -R vmail:vmail "${path.join(VMAIL_BASE_DIR, domain, username)}" && chmod -R 700 "${path.join(VMAIL_BASE_DIR, domain, username)}"`);
  } catch (err) {
    console.error('Error fixing maildir permissions:', err);
  }

  return insertRes.rows[0];
}

/**
 * Get Mail Server Health Status
 */
export async function getMailServerStatus() {
  const pool = getPool();

  let postfixRunning = false;
  let dovecotRunning = false;
  let queueSize = 0;

  try {
    const pf = execSync('systemctl is-active postfix', { encoding: 'utf-8' }).trim();
    postfixRunning = pf === 'active';
  } catch {
    postfixRunning = false;
  }

  try {
    const dc = execSync('systemctl is-active dovecot', { encoding: 'utf-8' }).trim();
    dovecotRunning = dc === 'active';
  } catch {
    dovecotRunning = false;
  }

  try {
    const qOutput = execSync('mailq 2>&1', { encoding: 'utf-8' }).trim();
    if (qOutput.includes('Mail queue is empty')) {
      queueSize = 0;
    } else {
      const match = qOutput.match(/-- \d+ Kbytes in (\d+) Request/);
      queueSize = match ? parseInt(match[1], 10) : 0;
    }
  } catch {
    queueSize = 0;
  }

  const accountsCount = await pool.query('SELECT COUNT(*) FROM mail_users');
  const domainsCount = await pool.query('SELECT COUNT(*) FROM mail_domains');
  const aliasesCount = await pool.query('SELECT COUNT(*) FROM mail_aliases');
  const messagesCount = await pool.query('SELECT COUNT(*) FROM mail_messages');

  return {
    postfix: {
      running: postfixRunning,
      version: '3.10.6',
      ports: [25, 465, 587],
      queueSize,
    },
    dovecot: {
      running: dovecotRunning,
      version: '2.4.2',
      protocols: ['IMAP', 'POP3', 'LMTP'],
      ports: [110, 143, 993, 995],
    },
    database: {
      connected: true,
      totalAccounts: parseInt(accountsCount.rows[0].count, 10),
      totalDomains: parseInt(domainsCount.rows[0].count, 10),
      totalAliases: parseInt(aliasesCount.rows[0].count, 10),
      totalIndexedMessages: parseInt(messagesCount.rows[0].count, 10),
    },
  };
}

export interface MailJWTPayload {
  accountId: number;
  email: string;
  name: string;
}

export function signMailToken(payload: MailJWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyMailToken(token: string): MailJWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as MailJWTPayload;
  } catch {
    return null;
  }
}

export function parseCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function getAuthenticatedMailUser(request: Request): Promise<MailAccount | null> {
  let token: string | null = null;
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }
  if (!token) {
    const cookieHeader = request.headers.get('cookie');
    token = parseCookie(cookieHeader, MAIL_AUTH_COOKIE_NAME);
  }
  if (!token) return null;
  const payload = verifyMailToken(token);
  if (!payload) return null;
  return getMailAccountByEmail(payload.email);
}

