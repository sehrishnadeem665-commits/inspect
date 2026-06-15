import pool from '@/lib/mysql'
import bcrypt from 'bcryptjs'

export interface AdminCredentials {
  email: string;
  password: string;
}

export async function createAdminUser(email: string, password: string) {
  const hash = bcrypt.hashSync(password, 10)
  await pool.execute('INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, ?, NOW())', [email, hash, 'admin'])
}

export async function validateAdminCredentials(email: string, password: string): Promise<boolean> {
  try {
    console.log('🔍 Checking database for user:', email);
    const [rows]: any = await pool.execute('SELECT * FROM users WHERE email = ? AND role = ?', [email, 'admin'])
    const user = rows[0]
    if (!user) {
      console.log('❌ No admin user found with email:', email);
      return false
    }
    console.log('✓ Admin user found, comparing passwords');
    const isValid = bcrypt.compareSync(password, user.password_hash)
    console.log(isValid ? '✅ Password matches' : '❌ Password does not match');
    return isValid
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('❌ Database error:', msg);
    return false;
  }
}

export function generateToken(email: string): string {
  return Buffer.from(`${email}:${Date.now()}`).toString('base64');
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email] = decoded.split(':');
    console.log('[AUTH] Validating token for email:', email)
    
    // First, check if this is an admin token based on environment variables
    const testAdminEmail = process.env.TEST_ADMIN_EMAIL;
    const envAdminEmail = process.env.ADMIN_EMAIL;
    if ((testAdminEmail && email === testAdminEmail) || (envAdminEmail && email === envAdminEmail)) {
      console.log('[AUTH] Token validated via env var')
      return true;
    }
    
    // Otherwise, check the database
    console.log('[AUTH] Checking database for admin user')
    const [rows]: any = await pool.execute('SELECT * FROM users WHERE email = ? AND role = ?', [email, 'admin'])
    const isValid = rows.length > 0
    console.log('[AUTH] Database check result:', isValid)
    return isValid
  } catch (error) {
    console.error('[AUTH] Token validation error:', error instanceof Error ? error.message : String(error))
    return false;
  }
}

export function getEmailFromToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email] = decoded.split(':');
    return email || null;
  } catch {
    return null;
  }
}

export async function changeAdminPassword(email: string, currentPassword: string, newPassword: string): Promise<boolean> {
  const [rows]: any = await pool.execute('SELECT * FROM users WHERE email = ? AND role = ?', [email, 'admin'])
  const user = rows[0];
  if (!user) return false;
  if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
    return false;
  }
  const hash = bcrypt.hashSync(newPassword, 10);
  await pool.execute('UPDATE users SET password_hash = ? WHERE email = ? AND role = ?', [hash, email, 'admin']);
  return true;
}
