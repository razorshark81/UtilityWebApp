import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container" style={{ padding: '90px 0', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>🧭</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Tool not found</h1>
      <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>That page doesn’t exist. Let’s get you back to the tools.</p>
      <Link className="btn btn-primary" href="/">Browse all tools</Link>
    </main>
  );
}
