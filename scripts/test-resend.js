const fs = require('fs');
// use global fetch (Node 18+ has fetch available)

async function main() {
  const envPath = './.env.local';
  let env = {};
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf8');
    raw.split(/\r?\n/).forEach(line => {
      const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/);
      if (m) {
        env[m[1]] = m[2].replace(/^"|"$/g, '');
      }
    });
  }

  const key = env.RESEND_API_KEY;
  const admin = env.ADMIN_EMAIL || 'sehrishnadeem39@gmail.com';
  const from = env.EMAIL_FROM || 'Vehicle Reports <noreply@yourdomain.com>'
  if (!key) {
    console.error('No RESEND_API_KEY found in .env.local');
    process.exit(1);
  }

  console.log('Using RESEND_API_KEY (masked):', key.replace(/.(?=.{4})/g, '*'));
  console.log('Sending test email to', admin, 'from', from);

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        from,
        to: [admin],
        subject: 'Resend API Test',
        html: '<p>This is a test email sent via Resend API from the local test script.</p>',
      }),
    });

    const text = await res.text();
    console.log('Resend status:', res.status);
    console.log('Resend response:', text.slice(0, 1000));
  } catch (err) {
    console.error('Error sending via Resend:', err);
    process.exit(1);
  }
}

main();
