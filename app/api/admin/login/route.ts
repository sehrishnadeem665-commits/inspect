import { NextResponse } from 'next/server';
import { validateAdminCredentials, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Missing username or password' },
        { status: 400 }
      );
    }

    console.log('\n🔐 Login attempt with username:', username);

    // PRIMARY: Use environment variables for admin credentials (works immediately on Hostinger)
    const envAdminEmail = process.env.ADMIN_EMAIL || 'admin@trueinspectify.com';
    const envAdminPass = process.env.ADMIN_PASSWORD || process.env.TEST_ADMIN_PASS || 'Admin123@Secure';

    console.log('✓ Checking against env credentials');

    // Match with environment-based credentials
    if ((username === envAdminEmail || username === 'admin@trueinspectify.com') && password === envAdminPass) {
      console.log('✅ SUCCESS: Environment credentials matched!');
      const token = generateToken(username)
      return NextResponse.json({ token, success: true })
    }

    // FALLBACK: Try database if configured
    console.log('ℹ️ Environment credentials did not match, attempting database validation...');
    
    try {
      const isValid = await validateAdminCredentials(username, password)
      if (isValid) {
        console.log('✅ SUCCESS: Database credentials valid!');
        const token = generateToken(username)
        return NextResponse.json({ token, success: true })
      }
    } catch (dbError) {
      console.log('⚠️ Database validation skipped:', dbError instanceof Error ? dbError.message : 'Unknown error');
    }

    console.log('❌ FAILED: Invalid credentials');
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ Login error:', errorMsg);
    return NextResponse.json(
      { error: 'Login failed', details: errorMsg },
      { status: 500 }
    );
  }
}
