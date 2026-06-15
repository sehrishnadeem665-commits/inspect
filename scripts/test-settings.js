/*
Simple test script to verify admin settings API.
Usage:
  TEST_ADMIN_EMAIL=you@example.com TEST_ADMIN_PASS=yourpass node scripts/test-settings.js
  or set BASE_URL if your dev server runs somewhere else
*/

const fetch = require('node-fetch')

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const email = process.env.TEST_ADMIN_EMAIL
const pass = process.env.TEST_ADMIN_PASS

if (!email || !pass) {
  console.error('Please set TEST_ADMIN_EMAIL and TEST_ADMIN_PASS env vars to log in as admin')
  process.exit(1)
}

async function run() {
  try {
    const loginRes = await fetch(`${BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password: pass }),
    })
    const loginJson = await loginRes.json()
    if (!loginRes.ok || !loginJson.token) {
      console.error('Login failed', loginJson)
      process.exit(2)
    }

    const token = loginJson.token
    console.log('Logged in, token length:', token.length)

    // Try to write a review setting
    const key = 'admin_reviews'
    const value = { autoApproveReviews: false, minRatingToFeature: 4 }
    const res = await fetch(`${BASE}/api/admin/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ key, value }),
    })
    const j = await res.json()
    console.log('Write result:', res.status, j)
    if (!res.ok) process.exit(3)

    // Read it back
    const getRes = await fetch(`${BASE}/api/admin/settings?key=${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${token}` } })
    const getJson = await getRes.json()
    console.log('Read result:', getRes.status, getJson)
    if (!getRes.ok) process.exit(4)

    if (getJson && getJson.value && getJson.value.minRatingToFeature === 4) {
      console.log('Settings saved and verified ✅')
      process.exit(0)
    } else {
      console.error('Saved value mismatch', getJson)
      process.exit(5)
    }
  } catch (err) {
    console.error('Test failed', err)
    process.exit(1)
  }
}

run()
