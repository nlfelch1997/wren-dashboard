import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const theme = {
  sidebar: '#070D1A',
  accent: '#2563EB',
  accentDark: '#1D4ED8',
  accentPurple: '#7C3AED',
  accentGlow: 'rgba(37,99,235,0.25)',
  green: '#10B981',
  greenDark: '#059669',
  greenLight: '#ECFDF5',
  greenBorder: '#A7F3D0',
  red: '#EF4444',
  redLight: '#FEF2F2',
  redBorder: '#FECACA',
  amber: '#F59E0B',
  amberLight: '#FFFBEB',
  amberBorder: '#FDE68A',
  purple: '#8B5CF6',
  bg: '#EEF1F6',
  surface: '#FFFFFF',
  surfaceElevated: '#FAFBFC',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  .card { transition: box-shadow 0.2s ease; }
  .card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.07) !important; }
  .metric-card { transition: all 0.2s ease; cursor: pointer; }
  .metric-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important; }
  .prop-card { transition: all 0.22s ease; }
  .prop-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.1) !important; }
  .proposal-card { transition: all 0.2s ease; }
  .proposal-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.08) !important; }
  .nav-item { transition: all 0.15s ease; border-radius: 12px; }
  .nav-item:hover { background: rgba(255,255,255,0.08) !important; }
  .table-row:hover { background: #F8FAFC !important; }
  @keyframes pulse-green {
    0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
    50% { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInLeft {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
  .page { animation: fadeSlideIn 0.25s ease forwards; }
  .drawer { animation: slideInLeft 0.25s ease forwards; }
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 40; backdrop-filter: blur(3px); }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
`

function Badge({ type }) {
  const map = {
    pending:  { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A', dot: '#F59E0B', label: 'Pending' },
    approved: { bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7', dot: '#10B981', label: 'Approved' },
    denied:   { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA', dot: '#EF4444', label: 'Denied' },
    income:   { bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7', dot: '#10B981', label: 'Income' },
    expense:  { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA', dot: '#EF4444', label: 'Expense' },
    STR:      { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE', dot: '#2563EB', label: 'STR' },
    LTR:      { bg: '#F8FAFC', color: '#475569', border: '#E2E8F0', dot: '#94A3B8', label: 'LTR' },
  }
  const s = map[type] || map.STR
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0 }}></span>
      {s.label}
    </span>
  )
}

function MetricCard({ label, value, sub, color, icon, onClick }) {
  return (
    <div className="metric-card card" onClick={onClick} style={{
      background: theme.surface, borderRadius: 16, padding: '16px 18px',
      border: `1px solid ${theme.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, borderRadius: '0 16px 0 70px', background: color + '08' }}></div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', lineHeight: 1.4, paddingRight: 8 }}>{label}</div>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{icon}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: color || theme.text, letterSpacing: -1, lineHeight: 1 }}>{value}</div>
      {sub && (
        <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>{sub}</span>
          {onClick && <span style={{ color: theme.accent, fontSize: 10, fontWeight: 600 }}>View →</span>}
        </div>
      )}
    </div>
  )
}

function SectionCard({ title, icon, children, right, noPadding }) {
  return (
    <div className="card" style={{ background: theme.surface, borderRadius: 18, border: `1px solid ${theme.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${theme.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: theme.surfaceElevated }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, border: `1px solid ${theme.border}` }}>{icon}</div>
          <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{title}</span>
        </div>
        {right}
      </div>
      <div style={noPadding ? {} : { padding: '4px 18px 14px' }}>{children}</div>
    </div>
  )
}

function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', color: theme.textMuted }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: theme.textSecondary, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, lineHeight: 1.7, maxWidth: 260, margin: '0 auto' }}>{sub}</div>
    </div>
  )
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#EEF1F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>🦅</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', letterSpacing: -0.5 }}>Wren</div>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Sign in to your account</div>
        </div>
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#EF4444' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>EMAIL</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="you@email.com"
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, color: '#0F172A', background: '#F8FAFC', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>PASSWORD</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, color: '#0F172A', background: '#F8FAFC', outline: 'none' }}
            />
          </div>
          <button
            type="submit" disabled={loading}
            style={{ background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}
          >
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>
      </div>
    </div>
  )
}
export default function App() {
  const [properties, setProperties] = useState([])
  const [proposals, setProposals] = useState([])
  const [transactions, setTransactions] = useState([])
  const [maintenance, setMaintenance] = useState([])
  const [showTxForm, setShowTxForm] = useState(false)
  const [txForm, setTxForm] = useState({ type: 'expense', amount: '', description: '', category: 'other', transaction_date: new Date().toISOString().split('T')[0], property_id: '' })
const [txSaving, setTxSaving] = useState(false)
  const [activePage, setActivePage] = useState('dashboard')
  const [session, setSession] = useState(null)
const [userRole, setUserRole] = useState(null)
const [selectedClient, setSelectedClient] = useState(null)
const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchUserRole(session.user.id)
        fetchAll()
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchUserRole(session.user.id)
        fetchAll()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchAll() {
    setLoading(true)
    const [p, pr, tx, mx] = await Promise.all([
      supabase.from('properties').select('*'),
      supabase.from('pricing_proposals').select('*'),
      supabase.from('transactions').select('*'),
    supabase.from('maintenance_requests').select('*').order('created_at', { ascending: false }
    ),
    ])
    setProperties(p.data || [])
    setProposals(pr.data || [])
    setTransactions(tx.data || [])
    setMaintenance(mx.data || [])
    setLoading(false)
  }
  async function fetchUserRole(userId) {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()
    setUserRole(data?.role || 'client')
    
    if (data?.role === 'admin') {
      const { data: clientData } = await supabase
        .from('tenants')
        .select('*')
      setClients(clientData || [])
    }
  }

  const addTransaction = async () => {
  const propertyId = txForm.property_id || properties[0]?.id
  if (!txForm.amount || !txForm.description) return
  setTxSaving(true)
  const { error } = await supabase.from('transactions').insert([{
    ...txForm,
    property_id: propertyId,
    amount: parseFloat(txForm.amount),
    deductible: txForm.type === 'expense'
  }])
  if (error) {
    alert('Error saving: ' + error.message)
  }
  setShowTxForm(false)
  setTxSaving(false)
  setTxForm({ type: 'expense', amount: '', description: '', category: 'other', transaction_date: new Date().toISOString().split('T')[0], property_id: '' })
  fetchAll()
}

  async function handleProposal(id, status) {
    const { error } = await supabase
      .from('pricing_proposals')
      .update({ status })
      .eq('id', id)
    if (!error) {
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    }
  }

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0)
  const expenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0))
  const net = income - Math.abs(expenses)
  const pending = proposals.filter(p => p.status === 'pending')
  const approved = proposals.filter(p => p.status === 'approved')
  const strProps = properties.filter(p => p.type === 'STR')
  const ltrProps = properties.filter(p => p.type === 'LTR')
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞', desc: 'Overview' },
    { id: 'properties', label: 'Properties', icon: '🏠', desc: `${properties.length} active` },
    { id: 'income', label: 'Income & Tax', icon: '💰', desc: income > 0 ? `$${income.toLocaleString()}` : 'No data yet' },
    { id: 'proposals', label: 'Proposals', icon: '📈', desc: `${pending.length} pending` },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧', desc: `${maintenance.filter(m => m.status === 'open').length} open` },
  ]

  function navigate(id) {
    setActivePage(id)
    setDrawerOpen(false)
  }

  if (!session) {
    return <LoginPage />
  }

  return (
    <>
      <style>{css}</style>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: theme.bg, color: theme.text, fontFamily: "'Inter', system-ui, sans-serif" }}>

        {/* ── TOP NAV BAR ── */}
        <div style={{ background: theme.sidebar, padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, height: 60, boxShadow: '0 2px 16px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 10 }}>

          {/* Hamburger */}
          <button onClick={() => setDrawerOpen(true)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: 18, cursor: 'pointer', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            ☰
          </button>

          {/* Center Logo */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('dashboard')}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 14px rgba(37,99,235,0.5)' }}>🦅</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: -0.8, lineHeight: 1 }}>Wren</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Property AI</div>
            </div>
          </div>

          {/* Right — pending + add */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {userRole === 'admin' && clients.length > 0 && (
              <select
                value={selectedClient || ''}
                onChange={e => setSelectedClient(e.target.value || null)}
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: 12, cursor: 'pointer', borderRadius: 10, height: 40, padding: '0 10px' }}
              >
                <option value="">All Clients</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
            {pending.length > 0 && (
              <div onClick={() => navigate('proposals')} style={{ background: theme.amberLight, border: `1px solid ${theme.amberBorder}`, color: '#92400E', fontSize: 11, padding: '5px 10px', borderRadius: 20, cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                ⏳ {pending.length}
              </div>
            )}
            <button onClick={fetchAll} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 16, cursor: 'pointer', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↻</button>
            <button onClick={() => supabase.auth.signOut()} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 11, cursor: 'pointer', borderRadius: 10, padding: '0 12px', height: 40, fontWeight: 600 }}>
              Sign out
            </button>
          </div>
        </div>
        {/* ── DRAWER OVERLAY ── */}
        {drawerOpen && (
          <>
            <div className="overlay" onClick={() => setDrawerOpen(false)} />
            <div className="drawer" style={{ position: 'fixed', top: 0, left: 0, height: '100%', width: 280, background: theme.sidebar, zIndex: 50, display: 'flex', flexDirection: 'column', boxShadow: '4px 0 32px rgba(0,0,0,0.3)' }}>

              {/* Drawer header */}
              <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🦅</div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>Wren</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Property AI</div>
                  </div>
                </div>
                <button onClick={() => setDrawerOpen(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 18, cursor: 'pointer', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>

              {/* Nav items */}
              <div style={{ padding: '12px 12px', flex: 1, overflowY: 'auto' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0 10px 10px' }}>Navigation</div>
                {nav.map(item => {
                  const isActive = activePage === item.id
                  return (
                    <div key={item.id} className="nav-item"
                      onClick={() => navigate(item.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 13, padding: '12px 14px',
                        cursor: 'pointer', marginBottom: 4,
                        background: isActive ? 'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(124,58,237,0.15))' : 'transparent',
                        border: isActive ? '1px solid rgba(37,99,235,0.25)' : '1px solid transparent',
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                      }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: isActive ? 'rgba(37,99,235,0.3)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{item.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: isActive ? 700 : 500 }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: isActive ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)', marginTop: 1 }}>{item.desc}</div>
                      </div>
                      {pending.length > 0 && item.id === 'proposals' && (
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: theme.amber, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>{pending.length}</div>
                      )}
                    </div>
                  )
                })}

                {/* Quick stats in drawer */}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '12px 8px' }}></div>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0 10px 10px' }}>Quick Stats</div>
                {[
                  { label: 'Properties', value: properties.length, icon: '🏠' },
                  { label: 'Total Income', value: `$${income.toLocaleString()}`, icon: '💰' },
                  { label: 'Proposals', value: proposals.length, icon: '📈' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderRadius: 8, marginBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ fontSize: 14 }}>{s.icon}</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Status */}
              <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 11, padding: '11px 14px', marginBottom: pending.length > 0 ? 8 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: theme.green, animation: 'pulse-green 2s infinite' }}></div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>All systems live</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', paddingLeft: 15 }}>Pricing · Concierge · Tax AI</div>
                </div>
                {pending.length > 0 && (
                  <div onClick={() => navigate('proposals')} style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 11, padding: '10px 14px', cursor: 'pointer' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#FCD34D', marginBottom: 1 }}>⏳ {pending.length} awaiting approval</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>Tap to review →</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── PAGE HEADER ── */}
        <div style={{ background: 'rgba(255,255,255,0.95)', borderBottom: `1px solid ${theme.border}`, padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: theme.text, letterSpacing: -0.5, display: 'flex', alignItems: 'center', gap: 8 }}>
              {nav.find(n => n.id === activePage)?.icon} {nav.find(n => n.id === activePage)?.label}
            </div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{today}</div>
          </div>
          <button style={{ fontSize: 12, padding: '8px 16px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentPurple})`, cursor: 'pointer', color: '#fff', fontWeight: 700, boxShadow: `0 4px 14px ${theme.accentGlow}`, whiteSpace: 'nowrap' }}>
            + Add Property
          </button>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ flex: 1, overflow: 'auto', padding: '18px' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 52, animation: 'pulse-green 1.5s infinite' }}>🦅</div>
              <div style={{ color: theme.textMuted, fontSize: 14, fontWeight: 600 }}>Loading Wren...</div>
            </div>
          ) : (
            <div className="page">

              {/* DASHBOARD */}
              {activePage === 'dashboard' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                    <MetricCard label="Total Properties" value={properties.length} sub={`${strProps.length} STR · ${ltrProps.length} LTR`} color={theme.accent} icon="🏠" onClick={() => navigate('properties')} />
                    <MetricCard label="Gross Income" value={`$${income.toLocaleString()}`} sub="All recorded" color={theme.green} icon="💰" onClick={() => navigate('income')} />
                    <MetricCard label="Total Expenses" value={`$${expenses.toLocaleString()}`} sub="All recorded" color={theme.red} icon="📊" onClick={() => navigate('income')} />
                    <MetricCard label="Pending Approvals" value={pending.length} sub="Awaiting reply" color={theme.amber} icon="⏳" onClick={() => navigate('proposals')} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                    <SectionCard title="Properties" icon="🏠" right={<span onClick={() => navigate('properties')} style={{ fontSize: 12, color: theme.accent, fontWeight: 600, cursor: 'pointer' }}>View all →</span>}>
                      {properties.length === 0 ? (
                        <EmptyState icon="🏠" title="No properties yet" sub="Add your first property in Supabase" />
                      ) : properties.map((p, i) => (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < properties.length - 1 ? `1px solid ${theme.borderLight}` : 'none', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1E3A5F, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>🏠</div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                              <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 1 }}>{p.address}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            <Badge type={p.type} />
                            <div style={{ fontSize: 14, fontWeight: 800, color: theme.accent, whiteSpace: 'nowrap' }}>{p.type === 'LTR' ? '-' : `$${p.base_nightly_rate}`}<span style={{ fontSize: 10, color: theme.textMuted, fontWeight: 400 }}>{p.type === 'LTR' ? '' : '/nt'}</span></div>
                          </div>
                        </div>
                      ))}
                    </SectionCard>

                    <SectionCard title="Recent Proposals" icon="📈" right={<span onClick={() => navigate('proposals')} style={{ fontSize: 12, color: theme.accent, fontWeight: 600, cursor: 'pointer' }}>View all →</span>}>
                      {proposals.length === 0 ? (
                        <EmptyState icon="📈" title="No proposals yet" sub="Pricing agent generates these every 6 hours" />
                      ) : proposals.slice(0, 3).map((p, i) => (
                        <div key={p.id} style={{ padding: '10px 0', borderBottom: i < 2 ? `1px solid ${theme.borderLight}` : 'none' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, gap: 8 }}>
                            <div style={{ fontSize: 14, fontWeight: 900, color: theme.text, whiteSpace: 'nowrap' }}>
                              ${p.current_rate}→${p.proposed_rate}
                              <span style={{ fontSize: 10, color: p.proposed_rate > p.current_rate ? theme.green : theme.red, fontWeight: 700, marginLeft: 5, background: p.proposed_rate > p.current_rate ? theme.greenLight : theme.redLight, padding: '1px 6px', borderRadius: 20 }}>
                                {p.proposed_rate > p.current_rate ? '↑' : '↓'}{Math.abs(((p.proposed_rate - p.current_rate) / p.current_rate) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <Badge type={p.status} />
                          </div>
                          <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.5 }}>{p.reason?.substring(0, 80)}...</div>
                        </div>
                      ))}
                    </SectionCard>
                  </div>

                 <SectionCard title="Maintenance Requests" icon="🔧" right={<span onClick={() => setActivePage('maintenance')} style={{ fontSize: 12, color: theme.accent, fontWeight: 600, cursor: 'pointer' }}>View all →</span>}>
  {maintenance.filter(m => m.status !== 'resolved').length === 0 ? (
    <EmptyState icon="🔧" title="No open requests" sub="Tenant maintenance requests will appear here automatically" />
  ) : maintenance.filter(m => m.status !== 'resolved').slice(0, 3).map((m, i) => (
    <div key={m.id} onClick={() => setActivePage('maintenance')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < 2 ? `1px solid ${theme.borderLight}` : 'none', cursor: 'pointer', gap: 10 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.issue}</div>
        <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{new Date(m.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0, background: m.priority === 'urgent' ? theme.redLight : m.status === 'in_progress' ? '#EFF6FF' : theme.amberLight, color: m.priority === 'urgent' ? theme.red : m.status === 'in_progress' ? theme.accent : theme.amber }}>
        {m.priority === 'urgent' ? '🚨 Urgent' : m.status === 'in_progress' ? '↻ In Progress' : '⏳ Open'}
      </span>
    </div>
  ))}
</SectionCard>
                  <SectionCard title="Financial Snapshot" icon="💎">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, paddingTop: 4 }}>
                      {[
                        { label: 'Gross Income', value: `$${income.toLocaleString()}`, color: theme.green, bg: theme.greenLight, border: theme.greenBorder, icon: '📈' },
                        { label: 'Total Expenses', value: `$${expenses.toLocaleString()}`, color: theme.red, bg: theme.redLight, border: theme.redBorder, icon: '📉' },
                        { label: 'Net Income', value: `$${net.toLocaleString()}`, color: net >= 0 ? theme.accent : theme.red, bg: net >= 0 ? '#EFF6FF' : theme.redLight, border: net >= 0 ? '#BFDBFE' : theme.redBorder, icon: '💎' },
                      ].map(item => (
                        <div key={item.label} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{item.label}</div>
                            <div style={{ fontSize: 20, fontWeight: 900, color: item.color, letterSpacing: -0.5 }}>{item.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              )}

              {/* PROPERTIES */}
              {activePage === 'properties' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                    {[
                      { label: 'Total', value: properties.length, color: theme.accent },
                      { label: 'Short-term', value: strProps.length, color: theme.green },
                      { label: 'Long-term', value: ltrProps.length, color: theme.purple },
                    ].map(s => (
                      <div key={s.label} style={{ background: theme.surface, borderRadius: 12, padding: '14px 16px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                    {properties.map(p => (
                      <div key={p.id} className="prop-card card" style={{ background: theme.surface, borderRadius: 16, border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
                        <div style={{ background: 'linear-gradient(135deg, #060D1B 0%, #0F2340 50%, #1E3A6E 100%)', padding: '18px 16px', position: 'relative', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', top: -15, right: -15, width: 80, height: 80, borderRadius: '50%', background: 'rgba(37,99,235,0.12)' }}></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, position: 'relative' }}>
                            <div style={{ minWidth: 0, paddingRight: 8 }}>
                              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>📍 {p.address}</div>
                            </div>
                            <Badge type={p.type} />
                          </div>
                          <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>
                            {p.type === 'LTR' ? 'Long-term Rental' : `$${p.base_nightly_rate}`}<span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>{p.type === 'LTR' ? '' : '/night'}</span>
                          </div>
                        </div>
                        <div style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                             { label: 'Min', value: p.type === 'LTR' ? 'N/A' : `$${p.min_rate}/nt`, icon: '⬇️' },
{ label: 'Max', value: p.type === 'LTR' ? 'N/A' : `$${p.max_rate}/nt`, icon: '⬆️' },
                              { label: 'Cleaner', value: p.cleaner_name || 'Not set', icon: '🧹' },
                              { label: 'Type', value: p.management_type || 'Own', icon: '🏷️' },
                            ].map(item => (
                              <div key={item.label} style={{ background: theme.bg, borderRadius: 9, padding: '9px 10px', border: `1px solid ${theme.borderLight}` }}>
                                <div style={{ fontSize: 9, color: theme.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{item.icon} {item.label}</div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="card" style={{ background: theme.surface, borderRadius: 16, border: `2px dashed ${theme.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', minHeight: 160, padding: 20 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: `1px solid ${theme.border}` }}>+</div>
                      <div style={{ fontSize: 13, color: theme.textSecondary, fontWeight: 600 }}>Add property</div>
                      <div style={{ fontSize: 11, color: theme.textMuted }}>via Supabase</div>
                    </div>
                  </div>
                </div>
              )}

              {/* INCOME & TAX */}
              {activePage === 'income' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
  <button onClick={() => setShowTxForm(true)} style={{ background: theme.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
    + Add Transaction
  </button>
</div>

{showTxForm && (
  <div style={{ background: theme.surface, borderRadius: 16, border: `1px solid ${theme.border}`, padding: '20px 20px' }}>
    <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 16 }}>Add Transaction</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div>
        <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4, fontWeight: 600 }}>TYPE</div>
        <select value={txForm.type} onChange={e => setTxForm({...txForm, type: e.target.value})} style={{ width: '100%', padding: '9px 10px', borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, fontSize: 13 }}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div>
        <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4, fontWeight: 600 }}>AMOUNT</div>
        <input type="number" placeholder="0.00" value={txForm.amount} onChange={e => setTxForm({...txForm, amount: e.target.value})} style={{ width: '100%', padding: '9px 10px', borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, fontSize: 13 }} />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4, fontWeight: 600 }}>DESCRIPTION</div>
        <input type="text" placeholder="e.g. Cleaning fee - Rosa M." value={txForm.description} onChange={e => setTxForm({...txForm, description: e.target.value})} style={{ width: '100%', padding: '9px 10px', borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, fontSize: 13 }} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4, fontWeight: 600 }}>CATEGORY</div>
        <select value={txForm.category} onChange={e => setTxForm({...txForm, category: e.target.value})} style={{ width: '100%', padding: '9px 10px', borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, fontSize: 13 }}>
          <option value="rental_income">Rental Income</option>
          <option value="cleaning">Cleaning</option>
          <option value="supplies">Supplies</option>
          <option value="maintenance">Maintenance</option>
          <option value="insurance">Insurance</option>
          <option value="platform_fees">Platform Fees</option>
          <option value="utilities">Utilities</option>
          <option value="repairs">Repairs</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4, fontWeight: 600 }}>DATE</div>
        <input type="date" value={txForm.transaction_date} onChange={e => setTxForm({...txForm, transaction_date: e.target.value})} style={{ width: '100%', padding: '9px 10px', borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, fontSize: 13 }} />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4, fontWeight: 600 }}>PROPERTY</div>
        <select value={txForm.property_id} onChange={e => setTxForm({...txForm, property_id: e.target.value})} style={{ width: '100%', padding: '9px 10px', borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, fontSize: 13 }}>
          {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
      <button onClick={() => setShowTxForm(false)} style={{ background: theme.surface, color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        Cancel
      </button>
      <button onClick={addTransaction} disabled={txSaving} style={{ background: theme.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
        {txSaving ? 'Saving...' : 'Save Transaction'}
      </button>
    </div>
  </div>
)}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                    <MetricCard label="Gross Income" value={`$${income.toLocaleString()}`} sub="Total recorded" color={theme.green} icon="📈" />
                    <MetricCard label="Total Expenses" value={`$${expenses.toLocaleString()}`} sub="Total recorded" color={theme.red} icon="📉" />
                    <MetricCard label="Net Income" value={`$${net.toLocaleString()}`} sub="After expenses" color={net >= 0 ? theme.accent : theme.red} icon="💎" />
                  </div>
                  <SectionCard title="All Transactions" icon="💰" noPadding>
                    {transactions.length === 0 ? (
                      <EmptyState icon="💰" title="No transactions yet" sub="Income and expenses appear here automatically as they are logged" />
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 480 }}>
                          <thead>
                            <tr style={{ background: theme.surfaceElevated }}>
                              {['Date', 'Description', 'Category', 'Type', 'Amount'].map(h => (
                                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 700, borderBottom: `1px solid ${theme.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map((t, i) => (
                              <tr key={t.id} className="table-row" style={{ borderBottom: i < transactions.length - 1 ? `1px solid ${theme.borderLight}` : 'none' }}>
                                <td style={{ padding: '12px 16px', color: theme.textMuted, fontSize: 12, whiteSpace: 'nowrap' }}>{t.transaction_date || '—'}</td>
                                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{t.description || '—'}</td>
                                <td style={{ padding: '12px 16px', color: theme.textSecondary, fontSize: 12 }}>{t.category || '—'}</td>
                                <td style={{ padding: '12px 16px' }}><Badge type={t.type} /></td>
                                <td style={{ padding: '12px 16px', fontWeight: 900, color: t.type === 'income' ? theme.green : theme.red, fontSize: 14, whiteSpace: 'nowrap' }}>
                                  {t.type === 'income' ? '+' : '-'}${t.amount?.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </SectionCard>
                </div>
              )}

              {/* PROPOSALS */}
              {activePage === 'proposals' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)', borderRadius: 14, padding: '14px 18px', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ fontSize: 20, flexShrink: 0 }}>💡</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1E40AF', marginBottom: 4 }}>How approvals work</div>
                      <div style={{ fontSize: 12, color: '#3B82F6', lineHeight: 1.7 }}>
                        Reply <strong>APPROVE</strong> or <strong>DENY</strong> on Telegram — or use the buttons below directly from the dashboard.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
                    {[
                      { label: 'Total', value: proposals.length, color: theme.text, bg: theme.surface },
                      { label: 'Approved', value: approved.length, color: theme.green, bg: theme.greenLight },
                      { label: 'Pending', value: pending.length, color: theme.amber, bg: theme.amberLight },
                      { label: 'Denied', value: proposals.filter(p => p.status === 'denied').length, color: theme.red, bg: theme.redLight },
                    ].map(s => (
                      <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '14px 16px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>{s.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {proposals.length === 0 ? (
                    <div style={{ background: theme.surface, borderRadius: 16, border: `1px solid ${theme.border}` }}>
                      <EmptyState icon="📈" title="No proposals yet" sub="The pricing agent generates proposals automatically every 6 hours" />
                    </div>
                  ) : proposals.map(p => (
                    <div key={p.id} className="proposal-card card" style={{ background: theme.surface, borderRadius: 16, padding: '18px 20px', border: `1px solid ${theme.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 10 }}>
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: theme.text, letterSpacing: -0.8, whiteSpace: 'nowrap' }}>
                            ${p.current_rate}
                            <span style={{ color: theme.textMuted, fontWeight: 300, margin: '0 8px', fontSize: 16 }}>→</span>
                            ${p.proposed_rate}
                            <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 400 }}>/nt</span>
                          </div>
                          <div style={{ marginTop: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: p.proposed_rate > p.current_rate ? theme.green : theme.red, background: p.proposed_rate > p.current_rate ? theme.greenLight : theme.redLight, border: `1px solid ${p.proposed_rate > p.current_rate ? theme.greenBorder : theme.redBorder}`, padding: '2px 10px', borderRadius: 20 }}>
                              {p.proposed_rate > p.current_rate ? '↑' : '↓'} {Math.abs(((p.proposed_rate - p.current_rate) / p.current_rate) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <Badge type={p.status} />
                      </div>

                      <div style={{ background: theme.bg, borderRadius: 10, padding: '12px 14px', marginBottom: 14, fontSize: 13, color: theme.textSecondary, lineHeight: 1.7, border: `1px solid ${theme.borderLight}` }}>
                        {p.reason}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                        <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 500 }}>
                          🕐 {new Date(p.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          <span style={{ marginLeft: 6, color: p.status === 'pending' ? theme.amber : p.status === 'approved' ? theme.green : theme.red, fontWeight: 600, textTransform: 'capitalize' }}>· {p.status}</span>
                        </div>
                        {p.status === 'pending' && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => handleProposal(p.id, 'denied')}
                              style={{ fontSize: 12, padding: '8px 16px', borderRadius: 9, border: `1px solid ${theme.redBorder}`, background: theme.redLight, color: theme.red, cursor: 'pointer', fontWeight: 700, transition: 'all 0.15s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                              onMouseLeave={e => { e.currentTarget.style.background = theme.redLight; e.currentTarget.style.transform = 'translateY(0)' }}
                            >
                              ✗ Deny
                            </button>
                            <button
                              onClick={() => handleProposal(p.id, 'approved')}
                              style={{ fontSize: 12, padding: '8px 16px', borderRadius: 9, border: 'none', background: `linear-gradient(135deg, ${theme.green}, ${theme.greenDark})`, color: '#fff', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 12px rgba(16,185,129,0.3)', transition: 'all 0.15s' }}
                              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
                              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                            >
                              ✓ Approve
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
{/* MAINTENANCE */}
{activePage === 'maintenance' && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
      {[
        { label: 'Open', value: maintenance.filter(m => m.status === 'open').length, color: theme.red },
        { label: 'In Progress', value: maintenance.filter(m => m.status === 'in_progress').length, color: theme.amber },
        { label: 'Resolved', value: maintenance.filter(m => m.status === 'resolved').length, color: theme.green },
        { label: 'Total', value: maintenance.length, color: theme.accent },
      ].map(card => (
        <div key={card.label} style={{ background: theme.surface, borderRadius: 16, padding: '16px 18px', border: `1px solid ${theme.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 12 }}>{card.label}</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: card.color }}>{card.value}</div>
        </div>
      ))}
    </div>

    {maintenance.length === 0 ? (
      <div style={{ background: theme.surface, borderRadius: 18, border: `1px solid ${theme.border}` }}>
        <div style={{ padding: '40px 20px', textAlign: 'center', color: theme.textMuted }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔧</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.textSecondary, marginBottom: 6 }}>No maintenance requests</div>
          <div style={{ fontSize: 12, lineHeight: 1.7 }}>Requests will appear here when tenants text the Wren SMS number</div>
        </div>
      </div>
    ) : maintenance.map(m => {
      const isUrgent = m.priority === 'urgent';
      const isOpen = m.status === 'open';
      const isInProgress = m.status === 'in_progress';
      const isResolved = m.status === 'resolved';
      const borderColor = isUrgent ? theme.red : isOpen ? theme.amber : isInProgress ? theme.accent : theme.green;
      const statusBg = isResolved ? theme.greenLight : isInProgress ? '#EFF6FF' : isUrgent ? theme.redLight : theme.amberLight;
      const statusColor = isResolved ? theme.green : isInProgress ? theme.accent : isUrgent ? theme.red : theme.amber;
      const statusLabel = isResolved ? '✓ Resolved' : isInProgress ? '↻ In Progress' : isUrgent ? '🚨 Urgent' : '⏳ Open';

      return (
        <div key={m.id} style={{ background: theme.surface, borderRadius: 16, border: `1px solid ${theme.border}`, borderLeft: `4px solid ${borderColor}`, padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 4 }}>{m.issue}</div>
              <div style={{ fontSize: 11, color: theme.textMuted }}>
                {new Date(m.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: statusBg, color: statusColor, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {statusLabel}
            </span>
          </div>
          {m.thread && (
            <div style={{ background: theme.bg, borderRadius: 10, padding: '10px 14px', fontSize: 12, color: theme.textSecondary, lineHeight: 1.6, border: `1px solid ${theme.borderLight}` }}>
              {m.thread}
            </div>
          )}
        </div>
      );
    })}
  </div>
)}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
