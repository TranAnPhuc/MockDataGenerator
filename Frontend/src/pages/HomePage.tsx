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
  <div className="container" style={{ textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <header style={{ marginBottom: '4rem' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.35rem 1rem', borderRadius: '20px',
        background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)',
        color: 'var(--accent-secondary)', fontSize: '0.78rem', fontWeight: 600,
        marginBottom: '1.5rem', letterSpacing: '0.05em',
      }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 8px var(--accent-primary)', display: 'inline-block' }} />
        MOCK DATA GENERATOR
      </div>

      <h1>
        Tạo dữ liệu mẫu<br />
        <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          chuyên nghiệp & hiệu quả
        </span>
      </h1>

      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
        Thiết kế schema linh hoạt, hỗ trợ hàng chục kiểu dữ liệu và tùy chỉnh danh sách riêng. 
        Mọi thứ hoàn toàn miễn phí và bảo mật.
      </p>

      <Link to="/generate" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
        🚀 Bắt đầu ngay
      </Link>
    </header>

    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      {FEATURES.map(f => (
        <div key={f.title} className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
          <h3 style={{ marginBottom: '0.5rem' }}>{f.title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{f.desc}</p>
        </div>
      ))}
    </div>
  </div>
)

export default HomePage

