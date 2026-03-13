import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '⚡',
    title: 'Tạo dữ liệu tức thì',
    desc: 'Sinh hàng nghìn dòng dữ liệu giả thực tế chỉ trong vài giây.',
  },
  {
    icon: '🎛️',
    title: 'Tuỳ chỉnh linh hoạt',
    desc: 'Tự do cấu hình tên cột và loại dữ liệu theo nhu cầu của bạn.',
  },
  {
    icon: '📥',
    title: 'Tải xuống JSON',
    desc: 'Xuất kết quả thành file JSON sẵn sàng sử dụng trong dự án.',
  },
]

const HomePage = () => (
  <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: "'Inter', system-ui, sans-serif" }}>
    {/* Hero */}
    <div style={{
      background: 'linear-gradient(135deg, #1a1d27 0%, #12141e 100%)',
      borderBottom: '1px solid var(--color-border)',
      padding: '5rem 1.5rem 4rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 80% at 50% 60%, rgba(108,99,255,0.14) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.35rem 1rem', borderRadius: '20px',
          background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)',
          color: '#a29bff', fontSize: '0.78rem', fontWeight: 600,
          marginBottom: '1.5rem', letterSpacing: '0.05em',
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6c63ff', boxShadow: '0 0 8px #6c63ff', display: 'inline-block' }} />
          MOCK DATA GENERATOR
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900,
          color: 'var(--color-text)', lineHeight: 1.2,
          letterSpacing: '-0.03em', marginBottom: '1rem',
        }}>
          Tạo dữ liệu mẫu<br />
          <span style={{ background: 'linear-gradient(90deg, #6c63ff, #9b5de5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            nhanh & dễ dàng
          </span>
        </h1>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Thiết kế schema, chọn loại dữ liệu và tải xuống JSON ngay lập tức.<br />
          Không cần cài đặt, không cần đăng ký.
        </p>

        <Link
          to="/generate"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.85rem 2.2rem',
            background: 'linear-gradient(135deg, #6c63ff 0%, #9b5de5 100%)',
            color: '#fff', borderRadius: '12px',
            fontWeight: 700, fontSize: '1rem',
            textDecoration: 'none',
            boxShadow: '0 6px 28px rgba(108,99,255,0.45)',
            transition: 'transform 0.15s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 10px 36px rgba(108,99,255,0.6)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(108,99,255,0.45)'
          }}
        >
          ⚡ Bắt đầu tạo dữ liệu
        </Link>
      </div>
    </div>

    {/* Feature cards */}
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {FEATURES.map(f => (
          <div key={f.title} style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '14px', padding: '1.5rem',
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{f.icon}</div>
            <h3 style={{ color: 'var(--color-text)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem' }}>{f.title}</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default HomePage

