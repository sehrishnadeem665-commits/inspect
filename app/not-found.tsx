export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>404</h1>
        <p style={{ fontSize: '24px', marginBottom: '20px' }}>Page Not Found</p>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>Go back home</a>
      </div>
    </div>
  )
}
