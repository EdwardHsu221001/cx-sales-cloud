'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import Leads from './Leads'
import Opportunities from './Opportunities'

// ─── Types ──────────────────────────────────────────────────────────────────
type NavView =
  | 'home'
  | 'leads'
  | 'accounts'
  | 'contacts'
  | 'opps'
  | 'activities'
  | 'reports'
  | 'settings'

// ─── Static data ────────────────────────────────────────────────────────────
const FUNNEL_STAGES = [
  { label: '資格確認', width: '100%', color: '#93C5FD', deals: 8,  amount: '$2.1M' },
  { label: '需求分析', width: '75%',  color: '#60A5FA', deals: 6,  amount: '$4.2M' },
  { label: '提案報價', width: '62.5%',color: '#3B82F6', deals: 5,  amount: '$3.8M' },
  { label: '議約談判', width: '37.5%',color: '#2563EB', deals: 3,  amount: '$1.9M' },
  { label: '成交',     width: '12.5%',color: '#1E40AF', deals: 1,  amount: '$0.4M' },
]

const ACTIVITIES = [
  {
    type: 'over' as const,
    title: '逾期：跟進中信 KYC 報價',
    showNow: true,
    desc: '報價單已送出 4 天未回覆，需電話確認決策時程。',
    ts: '應於 06-13',
    overdue: true,
  },
  {
    type: 'call' as const,
    title: '電話 · 台積電採購部',
    desc: '確認供應鏈專案規格與第二輪簡報時間，對方傾向 7 月底決標。',
    ts: '2 小時前',
    overdue: false,
  },
  {
    type: 'email' as const,
    title: 'Email · 富邦金控提案',
    desc: '寄出導入時程與報價 V2，CC 採購與 IT 主管。',
    ts: '昨 14:30',
    overdue: false,
  },
  {
    type: 'meet' as const,
    title: '會議 · 廣達電腦訪談',
    desc: '需求訪談完成，確認 3 個核心痛點，下一步排定 POC。',
    ts: '昨 10:00',
    overdue: false,
  },
]

const OPPS = [
  {
    name: '鴻海精密 — ERP 整合案',
    sub: '既有客戶擴充',
    amount: '$3.4M',
    stageClass: 'cx-stage-nego',
    stageLabel: '議約談判',
    probClass: 'hi' as const,
    prob: 80,
    dateClass: 'late' as const,
    date: '06-30',
    ownerBg: 'linear-gradient(135deg,#34D399,#10b981)',
    ownerInitial: '陳',
    ownerName: '陳小明',
  },
  {
    name: '中信金控 — KYC 平台',
    sub: '新客戶導入',
    amount: '$2.1M',
    stageClass: 'cx-stage-prop',
    stageLabel: '提案報價',
    probClass: 'mid' as const,
    prob: 60,
    dateClass: 'late' as const,
    date: '06-28',
    ownerBg: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
    ownerInitial: '陳',
    ownerName: '陳怡君',
  },
  {
    name: '台積電 — 供應鏈系統',
    sub: '新客戶導入',
    amount: '$1.2M',
    stageClass: 'cx-stage-need',
    stageLabel: '需求分析',
    probClass: 'lo' as const,
    prob: 40,
    dateClass: '' as const,
    date: '07-20',
    ownerBg: 'linear-gradient(135deg,#34D399,#10b981)',
    ownerInitial: '陳',
    ownerName: '陳小明',
  },
]

const EMPTY_META: Record<Exclude<NavView, 'home'>, { t: string; d: string; i: string }> = {
  leads: {
    t: '潛在客戶 · Leads',
    d: '列表視圖、Hot/Warm/Cold 評分與一鍵 Convert 動作，設計中。',
    i: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  },
  accounts: {
    t: '客戶帳號 · Accounts',
    d: '列表視圖與帳號詳情側抽屜（公司資訊、聯絡人、商機、活動歷程），設計中。',
    i: '<path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16"/><path d="M15 9h3a1 1 0 0 1 1 1v11"/><path d="M3 21h18"/>',
  },
  contacts: {
    t: '聯絡人 · Contacts',
    d: '聯絡人列表與卡片（頭像縮寫、所屬公司連結、外部連結圖示），設計中。',
    i: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.5a3.2 3.2 0 0 1 0 6"/>',
  },
  opps: {
    t: '商機 · Opportunities',
    d: 'Kanban 看板與列表雙視圖切換、商機卡片與階段欄位，設計中。',
    i: '<path d="M3 17l5-5 4 3 8-8"/><path d="M16 7h4v4"/>',
  },
  activities: {
    t: '活動與任務 · Activities',
    d: '統一活動列表（通話 / Email / 會議 / 任務）依日期分組與快速記錄列，設計中。',
    i: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/>',
  },
  reports: {
    t: '報表 · Reports',
    d: '業績達成、漏斗轉換與活動量分析報表，設計中。',
    i: '<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="13" y="7" width="3" height="10"/>',
  },
  settings: {
    t: '設定 · Settings',
    d: '團隊、欄位、自動化與整合設定，設計中。',
    i: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M5 5l2 2M17 17l2 2M2 12h3M19 12h3M5 19l2-2M17 7l2-2"/>',
  },
}

// ─── SVG Icons ──────────────────────────────────────────────────────────────
function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" />
    </svg>
  )
}
function IconLeads() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  )
}
function IconAccounts() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
      <path d="M15 9h3a1 1 0 0 1 1 1v11" />
      <path d="M3 21h18" />
      <path d="M8 8h2M8 12h2M8 16h2" />
    </svg>
  )
}
function IconContacts() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.5a3.2 3.2 0 0 1 0 6" />
      <path d="M17.5 14.5a5.5 5.5 0 0 1 3 5" />
    </svg>
  )
}
function IconOpps() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 17l5-5 4 3 8-8" />
      <path d="M16 7h4v4" />
    </svg>
  )
}
function IconActivities() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  )
}
function IconReports() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 3v18h18" />
      <rect x="7" y="11" width="3" height="6" />
      <rect x="13" y="7" width="3" height="10" />
    </svg>
  )
}
function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M5 5l2 2M17 17l2 2M2 12h3M19 12h3M5 19l2-2M17 7l2-2" />
    </svg>
  )
}
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
function IconChevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
function IconHelp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  )
}
function IconBell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}
function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
function IconWarn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  )
}
function IconArrowUp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}
function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  )
}
function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="m3 6.5 9 6 9-6" />
    </svg>
  )
}
function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </svg>
  )
}
function IconTask() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  )
}

// ─── Activity icon helper ────────────────────────────────────────────────────
function ActivityIcon({ type }: { type: 'call' | 'email' | 'meet' | 'over' }) {
  if (type === 'call')  return <div className="cx-act-ic call"><IconPhone /></div>
  if (type === 'email') return <div className="cx-act-ic email"><IconEmail /></div>
  if (type === 'meet')  return <div className="cx-act-ic meet"><IconCalendar /></div>
  return <div className="cx-act-ic over"><IconWarn /></div>
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeView, setActiveView] = useState<NavView>('home')
  const [quickMenuOpen, setQuickMenuOpen] = useState(false)
  const [toast, setToast] = useState({ visible: false, msg: '' })
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const quickMenuRef = useRef<HTMLDivElement>(null)

  const showToast = useCallback((msg: string) => {
    setToast({ visible: true, msg })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      2200,
    )
  }, [])

  // Close quick-menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (quickMenuOpen && !quickMenuRef.current?.contains(e.target as Node)) {
        setQuickMenuOpen(false)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [quickMenuOpen])

  const handleNavClick = (view: NavView) => {
    setActiveView(view)
  }

  return (
    <div className="cx-app">
      {/* ── Navbar ── */}
      <header className="cx-nav">
        <div className="cx-brand">
          <div className="cx-brand-mark">C</div>
          <div className="cx-brand-name">CX <b>CRM</b></div>
        </div>
        <div className="cx-app-switch">
          Sales Cloud
          <IconChevron />
        </div>
        <div className="cx-search">
          <IconSearch />
          <input type="text" placeholder="搜尋客戶、聯絡人、商機…" />
        </div>
        <div className="cx-nav-right">
          <button className="cx-icon-btn" title="說明"><IconHelp /></button>
          <button className="cx-icon-btn" title="通知">
            <span className="cx-notif-dot" />
            <IconBell />
          </button>
          <div className="cx-nav-avatar" title="陳小明">陳</div>
        </div>
      </header>

      {/* ── Sidebar ── */}
      <aside className="cx-sidebar">
        <div className="cx-nav-label">銷售</div>
        {[
          { view: 'home' as NavView,       label: '首頁',     Icon: IconHome },
          { view: 'leads' as NavView,      label: '潛在客戶', Icon: IconLeads,      badge: '32' },
          { view: 'accounts' as NavView,   label: '客戶帳號', Icon: IconAccounts },
          { view: 'contacts' as NavView,   label: '聯絡人',   Icon: IconContacts },
          { view: 'opps' as NavView,       label: '商機',     Icon: IconOpps,       fav: true },
          { view: 'activities' as NavView, label: '活動任務', Icon: IconActivities, badge: '7' },
          { view: 'reports' as NavView,    label: '報表',     Icon: IconReports },
        ].map(({ view, label, Icon, badge, fav }) => (
          <div
            key={view}
            className={`cx-nav-item ${activeView === view ? 'active' : ''}`}
            onClick={() => handleNavClick(view)}
          >
            <Icon />
            {label}
            {badge && <span className="cx-nav-badge">{badge}</span>}
            {fav   && <span className="cx-nav-fav">✦</span>}
          </div>
        ))}
        <div className="cx-nav-divider" />
        <div
          className={`cx-nav-item ${activeView === 'settings' ? 'active' : ''}`}
          onClick={() => handleNavClick('settings')}
        >
          <IconSettings />
          設定
        </div>
        <div className="cx-sidebar-spacer" />
        <div className="cx-user-card">
          <div className="cx-user-av">陳</div>
          <div className="cx-user-meta">
            <div className="cx-user-name">陳小明</div>
            <div className="cx-user-role">資深業務經理</div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="cx-main">
        <div className="cx-main-inner">
          {activeView === 'home' ? (
            <HomeDashboard
              showToast={showToast}
              quickMenuOpen={quickMenuOpen}
              setQuickMenuOpen={setQuickMenuOpen}
              quickMenuRef={quickMenuRef}
            />
          ) : activeView === 'leads' ? (
            <Leads showToast={showToast} />
          ) : activeView === 'opps' ? (
            <Opportunities showToast={showToast} />
          ) : (
            <EmptyState view={activeView} />
          )}
        </div>
      </main>

      {/* ── Toast ── */}
      <div className={`cx-toast ${toast.visible ? 'show' : ''}`}>
        <IconCheck />
        <span>{toast.msg}</span>
      </div>
    </div>
  )
}

// ─── Home Dashboard ──────────────────────────────────────────────────────────
function HomeDashboard({
  showToast,
  quickMenuOpen,
  setQuickMenuOpen,
  quickMenuRef,
}: {
  showToast: (msg: string) => void
  quickMenuOpen: boolean
  setQuickMenuOpen: (v: boolean) => void
  quickMenuRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <>
      {/* Greeting */}
      <div className="cx-greet">
        <div>
          <h1><span style={{ fontWeight: 400 }}>早安，</span>陳小明 👋</h1>
          <div className="cx-greet-sub">
            2026 年 6 月 15 日 · 星期日
            <span className="cx-qtag">Q2 · 第 11 週</span>
          </div>
        </div>
        <div className="cx-greet-actions">
          <div
            className="cx-overdue-badge"
            onClick={() => showToast('篩選：顯示 2 件逾期任務')}
          >
            <IconWarn />
            <b>2</b>&nbsp;件逾期任務
          </div>
          <div className="cx-quick-add-wrap" ref={quickMenuRef}>
            <button
              className="cx-btn-primary"
              onClick={(e) => {
                e.stopPropagation()
                setQuickMenuOpen(!quickMenuOpen)
              }}
            >
              <IconPlus />
              快速新增
            </button>
            <div className={`cx-quick-menu ${quickMenuOpen ? 'open' : ''}`}>
              {[
                { label: '記錄通話', bg: 'var(--cx-accent-soft)', color: 'var(--cx-accent)', Icon: IconPhone },
                { label: '新增任務', bg: 'var(--cx-success-soft)', color: '#0f9b6c', Icon: IconTask },
                { label: '安排會議', bg: '#FEF6E0', color: '#D9A406', Icon: IconCalendar },
              ].map(({ label, bg, color, Icon }) => (
                <div
                  key={label}
                  className="cx-qm-item"
                  onClick={() => {
                    setQuickMenuOpen(false)
                    showToast(`已開啟「${label}」面板`)
                  }}
                >
                  <span className="cx-qm-icon" style={{ background: bg, color }}>
                    <Icon />
                  </span>
                  {label}
                </div>
              ))}
              <hr />
              {[
                { label: '新增商機', bg: '#EDE9FE', color: '#6d28d9', Icon: IconOpps },
                { label: '新增潛客', bg: '#FFF4EA', color: '#c2691e', Icon: IconLeads },
              ].map(({ label, bg, color, Icon }) => (
                <div
                  key={label}
                  className="cx-qm-item"
                  onClick={() => {
                    setQuickMenuOpen(false)
                    showToast(`已開啟「${label}」面板`)
                  }}
                >
                  <span className="cx-qm-icon" style={{ background: bg, color }}>
                    <Icon />
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="cx-kpi-row">
        {/* 本月達成率 */}
        <div className="cx-kpi">
          <div className="cx-kpi-title">本月達成率</div>
          <div className="cx-kpi-ring">
            <div className="cx-ring">
              <svg width="78" height="78" viewBox="0 0 78 78">
                <circle cx="39" cy="39" r="32" fill="none" stroke="#EFF1F5" strokeWidth="8" />
                <circle
                  cx="39" cy="39" r="32"
                  fill="none"
                  stroke="url(#rg)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="201.06"
                  strokeDashoffset="54.29"
                />
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#60A5FA" />
                    <stop offset="1" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="cx-ring-pct">73%</div>
            </div>
            <div className="cx-ring-det">
              <div className="big">$3.65M</div>
              <div className="small">目標 $5.0M</div>
              <div className="bar"><i /></div>
            </div>
          </div>
        </div>

        {/* 商機總值 */}
        <div className="cx-kpi">
          <div className="cx-kpi-title">商機總值</div>
          <div className="cx-kpi-num">$12.4M</div>
          <div className="cx-kpi-row2">
            <span className="cx-chip up"><IconArrowUp />+18%</span>
            <span className="cx-kpi-sub">vs 上季</span>
          </div>
          <div className="cx-kpi-foot"><b>23</b> 筆進行中商機</div>
        </div>

        {/* 新增潛客 */}
        <div className="cx-kpi">
          <div className="cx-kpi-title">新增潛客</div>
          <div className="cx-kpi-num">18</div>
          <div className="cx-kpi-row2">
            <span className="cx-chip up"><IconArrowUp />+3</span>
            <span className="cx-kpi-sub">vs 上月</span>
          </div>
          <div className="cx-kpi-foot"><b>6</b> 筆評分為 Hot 🔥</div>
        </div>

        {/* 待辦任務 */}
        <div className="cx-kpi danger">
          <div className="cx-kpi-title">待辦任務</div>
          <div className="cx-kpi-num">7</div>
          <div className="cx-kpi-row2">
            <span className="cx-chip warn"><IconClock />2 件逾期</span>
          </div>
          <div className="cx-kpi-foot">今日到期 <b>3</b> 件 · 本週 <b>4</b> 件</div>
        </div>
      </div>

      {/* Mid grid: funnel + activity */}
      <div className="cx-mid-grid">
        {/* Pipeline Funnel */}
        <div className="cx-panel">
          <div className="cx-panel-head">
            <div className="h">
              商機漏斗
              <span className="s">本季 Pipeline · 23 筆 · $12.4M</span>
            </div>
            <div className="lnk">查看全部</div>
          </div>
          <div className="cx-funnel">
            {FUNNEL_STAGES.map((stage, i) => (
              <div key={stage.label} className="cx-fstage">
                <div className="lbl">{stage.label}</div>
                <div className="track">
                  <motion.div
                    className="fill"
                    style={{ background: stage.color }}
                    initial={{ width: '0%' }}
                    animate={{ width: stage.width }}
                    transition={{
                      duration: 0.8,
                      delay: 0.12 + i * 0.09,
                      ease: [0.2, 0.8, 0.2, 1],
                    }}
                  />
                </div>
                <div className="val"><b>{stage.deals}</b> 筆 · {stage.amount}</div>
              </div>
            ))}
            <div className="cx-funnel-foot">
              <div className="t">本季 Lead → 成交 轉換率</div>
              <div className="v">12.5%</div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="cx-panel">
          <div className="cx-panel-head">
            <div className="h">
              近期活動
              <span className="s">通話 · Email · 會議 · 任務</span>
            </div>
            <div className="lnk">活動串流</div>
          </div>
          <div className="cx-feed">
            {ACTIVITIES.map((act, i) => (
              <div key={i} className={`cx-act ${act.overdue ? 'overdue' : ''}`}>
                <ActivityIcon type={act.type} />
                <div className="cx-act-body">
                  <div className="cx-act-title">
                    {act.title}
                    {act.showNow && <span className="cx-tag-now">立即處理</span>}
                  </div>
                  <div className="cx-act-desc">{act.desc}</div>
                </div>
                <div className="cx-act-ts">{act.ts}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming close table */}
      <div className="cx-panel">
        <div className="cx-panel-head">
          <div className="h">
            即將關閉商機
            <span className="s">未來 30 天內預計關閉</span>
          </div>
          <div className="lnk">前往商機看板</div>
        </div>
        <div className="cx-tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>商機名稱</th>
                <th className="r">金額</th>
                <th>階段</th>
                <th>勝算</th>
                <th>關閉日</th>
                <th>負責人</th>
              </tr>
            </thead>
            <tbody>
              {OPPS.map((opp) => (
                <tr key={opp.name}>
                  <td>
                    <div className="cx-opp-name">{opp.name}</div>
                    <div className="cx-opp-sub">{opp.sub}</div>
                  </td>
                  <td className="r"><span className="cx-amt">{opp.amount}</span></td>
                  <td>
                    <span className={`cx-stage-pill ${opp.stageClass}`}>
                      {opp.stageLabel}
                    </span>
                  </td>
                  <td>
                    <div className={`cx-prob ${opp.probClass}`}>
                      <div className="pbar">
                        <i style={{ width: `${opp.prob}%` }} />
                      </div>
                      <span className="pv">{opp.prob}%</span>
                    </div>
                  </td>
                  <td>
                    {opp.dateClass === 'late' ? (
                      <span className="cx-close-date late">
                        <IconWarn />
                        {opp.date}
                      </span>
                    ) : (
                      <span className="cx-close-date">{opp.date}</span>
                    )}
                  </td>
                  <td>
                    <div className="cx-owner">
                      <div
                        className="cx-owner-av"
                        style={{ background: opp.ownerBg }}
                      >
                        {opp.ownerInitial}
                      </div>
                      <span className="cx-owner-nm">{opp.ownerName}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState({ view }: { view: Exclude<NavView, 'home'> }) {
  const meta = EMPTY_META[view]
  return (
    <div className="cx-empty">
      <div className="cx-empty-ic">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          dangerouslySetInnerHTML={{ __html: meta.i }}
        />
      </div>
      <h2>{meta.t}</h2>
      <p>{meta.d}</p>
      <div className="cx-empty-tag">即將推出</div>
    </div>
  )
}
