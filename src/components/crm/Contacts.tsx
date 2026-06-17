'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────
type OwnerId = 'zhang' | 'chen' | 'lin'
type CoId    = 'tsmc' | 'fox' | 'mtk' | 'wis' | 'delta' | 'asus'
type ActType = 'call' | 'mail' | 'meet' | 'note'

interface OppLink { nm: string; stage: string; stageL: string; amt: string }
interface Activity { t: ActType; ti: string; d: string; m: string }
interface Contact {
  av: string; g: string; nm: string; title: string
  role: string; co: CoId; pri: boolean; owner: OwnerId
  email: string; phone: string; mobile: string
  last: string; ago: string
  opps: OppLink[]; acts: Activity[]
}

// ── Static data ───────────────────────────────────────────────────────────────
const ASSIGNEES: Record<OwnerId, { nm: string; av: string; g: string }> = {
  zhang: { nm: '張志豪', av: '張', g: 'linear-gradient(135deg,#60a5fa,#2563eb)' },
  chen:  { nm: '陳美華', av: '陳', g: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
  lin:   { nm: '林俊傑', av: '林', g: 'linear-gradient(135deg,#fbbf24,#f59e0b)' },
}

const CO: Record<CoId, { nm: string; logo: string; g: string; ind: string }> = {
  tsmc:  { nm: '台積電',   logo: '台', g: 'linear-gradient(135deg,#2563eb,#1e3a5f)', ind: '半導體' },
  fox:   { nm: '鴻海精密', logo: '鴻', g: 'linear-gradient(135deg,#1e3a5f,#122440)', ind: '電子製造' },
  mtk:   { nm: '聯發科技', logo: '聯', g: 'linear-gradient(135deg,#7c3aed,#5b21b6)', ind: 'IC 設計' },
  wis:   { nm: '緯創資通', logo: '緯', g: 'linear-gradient(135deg,#0ea5e9,#0369a1)', ind: '電子製造' },
  delta: { nm: '台達電子', logo: '台', g: 'linear-gradient(135deg,#dc2626,#991b1b)', ind: '電源管理' },
  asus:  { nm: '華碩電腦', logo: '華', g: 'linear-gradient(135deg,#0891b2,#0e7490)', ind: '消費電子' },
}

const CONTACTS: Contact[] = [
  { av: '王', g: 'linear-gradient(135deg,#60a5fa,#2563eb)', nm: '王俊傑', title: '採購部協理', role: '決策者', co: 'tsmc', pri: true,  owner: 'zhang', email: 'jj.wang@tsmc.com',       phone: '03-5636688 #2201', mobile: '0912-345-678', last: '電話會議',  ago: '2 小時前',
    opps: [{ nm: '2026 智慧製造平台導入', stage: 'negotiate', stageL: '議約談判', amt: 'NT$ 2.4M' }, { nm: '年度技術支援續約', stage: 'need', stageL: '需求分析', amt: 'NT$ 0.6M' }],
    acts: [{ t: 'call', ti: '電話會議', d: '確認智慧製造平台導入時程，對方希望 Q3 完成 POC。', m: '張志豪 · 2 小時前' }, { t: 'mail', ti: '寄送會議紀要', d: '整理上週技術討論重點與待辦清單。', m: '張志豪 · 3 天前' }] },
  { av: '李', g: 'linear-gradient(135deg,#34D399,#10b981)', nm: '李欣怡', title: '資訊處經理',   role: '技術窗口', co: 'tsmc', pri: false, owner: 'zhang', email: 'hy.lee@tsmc.com',        phone: '03-5636688 #3310', mobile: '0922-118-220', last: 'Email 往來', ago: '昨天',
    opps: [{ nm: '資安監控系統擴充', stage: 'proposal', stageL: '提案報價', amt: 'NT$ 1.2M' }],
    acts: [{ t: 'mail', ti: '技術規格確認', d: '回覆資安監控系統的整合介面問題。', m: '張志豪 · 昨天' }] },
  { av: '陳', g: 'linear-gradient(135deg,#fbbf24,#f59e0b)', nm: '陳冠宇', title: '營運副總',     role: '決策者', co: 'fox',  pri: true,  owner: 'lin',   email: 'gy.chen@foxconn.com',    phone: '02-22683466 #1100', mobile: '0918-660-330', last: '季度會議',  ago: '1 天前',
    opps: [{ nm: '供應鏈管理系統升級', stage: 'proposal', stageL: '提案報價', amt: 'NT$ 2.0M' }],
    acts: [{ t: 'meet', ti: '季度業務檢視會議', d: '回顧上半年導入進度，確認下半年擴點計畫。', m: '林俊傑 · 1 天前' }] },
  { av: '吳', g: 'linear-gradient(135deg,#60a5fa,#2563eb)', nm: '吳孟潔', title: '採購經理',     role: '採購窗口', co: 'fox',  pri: false, owner: 'lin',   email: 'mj.wu@foxconn.com',      phone: '02-22683466 #1180', mobile: '0935-221-447', last: '報價討論',  ago: '4 天前',
    opps: [{ nm: '倉儲自動化整合案', stage: 'need', stageL: '需求分析', amt: 'NT$ 1.1M' }],
    acts: [{ t: 'note', ti: '新增備註', d: '採購流程需經三層審核，預留兩週緩衝。', m: '林俊傑 · 4 天前' }] },
  { av: '林', g: 'linear-gradient(135deg,#a78bfa,#7c3aed)', nm: '林佳蓉', title: '技術採購總監', role: '決策者', co: 'mtk',  pri: true,  owner: 'chen',  email: 'jr.lin@mediatek.com',    phone: '03-5670766 #4400', mobile: '0910-882-156', last: '合約協商',  ago: '5 小時前',
    opps: [{ nm: '雲端研發環境建置', stage: 'negotiate', stageL: '議約談判', amt: 'NT$ 1.8M' }],
    acts: [{ t: 'call', ti: '合約條款協商', d: '對方要求 SLA 提升至 99.9%，已回報主管評估。', m: '陳美華 · 5 小時前' }] },
  { av: '黃', g: 'linear-gradient(135deg,#34D399,#10b981)', nm: '黃信宏', title: 'IT 基礎架構經理', role: '技術窗口', co: 'mtk', pri: false, owner: 'chen', email: 'sh.huang@mediatek.com', phone: '03-5670766 #4520', mobile: '0978-330-661', last: 'POC 回報', ago: '2 天前',
    opps: [{ nm: '資料分析平台導入', stage: 'proposal', stageL: '提案報價', amt: 'NT$ 1.0M' }],
    acts: [{ t: 'mail', ti: '寄送 POC 結果', d: '資料分析平台查詢效能提升 40%。', m: '陳美華 · 2 天前' }] },
  { av: '黃', g: 'linear-gradient(135deg,#34D399,#10b981)', nm: '黃柏翰', title: '數位轉型處長',  role: '決策者', co: 'delta', pri: true,  owner: 'chen',  email: 'ph.huang@deltaww.com',   phone: '03-3626301 #500',  mobile: '0926-771-308', last: 'Demo 簡報', ago: '6 小時前',
    opps: [{ nm: '能源管理儀表板專案', stage: 'proposal', stageL: '提案報價', amt: 'NT$ 0.9M' }],
    acts: [{ t: 'mail', ti: '寄送能源儀表板 Demo', d: '處長對即時能耗視覺化反應正面。', m: '陳美華 · 6 小時前' }] },
  { av: '劉', g: 'linear-gradient(135deg,#22d3ee,#0891b2)', nm: '劉雅琪', title: '採購中心總監', role: '決策者', co: 'asus', pri: true,  owner: 'zhang', email: 'yc.liu@asus.com',          phone: '02-28943447 #700',  mobile: '0913-558-902', last: '成交慶功',  ago: '4 小時前',
    opps: [{ nm: '全球客服系統整合', stage: 'won', stageL: '已成交', amt: 'NT$ 1.5M' }, { nm: 'AI 客服機器人擴充', stage: 'proposal', stageL: '提案報價', amt: 'NT$ 0.6M' }],
    acts: [{ t: 'meet', ti: '成交慶功與後續規劃', d: '全球客服系統正式上線，討論 AI 客服第二期合作。', m: '張志豪 · 4 小時前' }] },
]

const ROLE_TAG: Record<string, string> = { '決策者': '決策者', '採購窗口': '採購', '技術窗口': '技術', '使用者': '使用者' }

// ── SVG icons ─────────────────────────────────────────────────────────────────
const IcPlus   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14"/></svg>
const IcExport = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 21h14"/></svg>
const IcList   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
const IcGrid   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
const IcMail   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 6.5 9 6 9-6"/></svg>
const IcPhone  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg>
const IcCal    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>
const IcNote   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
const IcOpp    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17l5-5 4 3 8-8"/><path d="M16 7h4v4"/></svg>
const IcChevL  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
const IcChevR  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
const IcX      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
const IcChk    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
const IcPeople = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.5a3.2 3.2 0 0 1 0 6"/><path d="M17.5 14.5a5.5 5.5 0 0 1 3 5"/></svg>
const IcShield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5Z"/></svg>
const IcAdd    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
const IcClock  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg>
const IcMobile = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>
const IcBldg   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16"/><path d="M15 9h3a1 1 0 0 1 1 1v11"/><path d="M3 21h18"/></svg>
const IcUser   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/></svg>

// ── Activity icon map ─────────────────────────────────────────────────────────
function ActIcon({ t }: { t: ActType }) {
  const cls = { call: 'cx-ti-call', mail: 'cx-ti-mail', meet: 'cx-ti-meet', note: 'cx-ti-note' }[t]
  return (
    <div className={`cx-tl-item .ti ${cls}`} style={{ width: 32, height: 32, borderRadius: 9, display: 'grid', placeItems: 'center', flexShrink: 0, zIndex: 1 }}>
      {t === 'call' && <IcPhone />}
      {t === 'mail' && <IcMail />}
      {t === 'meet' && <IcCal />}
      {t === 'note' && <IcNote />}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Contacts({ showToast }: { showToast: (msg: string) => void }) {
  const [view, setView]         = useState<'list' | 'grid'>('list')
  const [selRows, setSelRows]   = useState<Set<number>>(new Set())
  const [selCards, setSelCards] = useState<Set<number>>(new Set())
  const [drawerIdx, setDrawerIdx] = useState<number | null>(null)
  const [activePg, setActivePg]   = useState(1)
  const drawerBodyRef = useRef<HTMLDivElement>(null)

  const allChecked = selRows.size === CONTACTS.length

  const toggleRow = (i: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelRows(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s })
  }
  const toggleAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelRows(allChecked ? new Set() : new Set(CONTACTS.map((_, i) => i)))
  }
  const toggleCard = (i: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelCards(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s })
  }

  const openDrawer  = (i: number) => setDrawerIdx(i)
  const closeDrawer = useCallback(() => setDrawerIdx(null), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeDrawer])

  useEffect(() => {
    if (drawerIdx !== null && drawerBodyRef.current) drawerBodyRef.current.scrollTop = 0
  }, [drawerIdx])

  const prevContact = () => setDrawerIdx(i => i !== null ? (i - 1 + CONTACTS.length) % CONTACTS.length : null)
  const nextContact = () => setDrawerIdx(i => i !== null ? (i + 1) % CONTACTS.length : null)

  const contact = drawerIdx !== null ? CONTACTS[drawerIdx] : null
  const co      = contact ? CO[contact.co] : null
  const own     = contact ? ASSIGNEES[contact.owner] : null

  return (
    <>
      {/* ── Page header ── */}
      <div className="cx-pg-head">
        <div>
          <h1>聯絡人</h1>
          <div className="sub">所有客戶窗口的單一名冊 — 每位聯絡人都連結到所屬公司、負責業務與互動紀錄。</div>
        </div>
        <div className="actions">
          <button className="cx-btn-outline" onClick={() => showToast('已匯出聯絡人清單 CSV')}>
            <IcExport />匯出
          </button>
          <button className="cx-btn-navy" onClick={() => showToast('已開啟「新增聯絡人」面板')}>
            <IcPlus />新增聯絡人
          </button>
        </div>
      </div>

      {/* ── Stat bar ── */}
      <div className="cx-stat-bar">
        <div className="cx-stat">
          <div className="cx-sic blue"><IcPeople /></div>
          <div><div className="cx-snum">126</div><div className="cx-slbl">全部聯絡人</div></div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic violet"><IcShield /></div>
          <div><div className="cx-snum violet">42</div><div className="cx-slbl">主要窗口</div></div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic green"><IcAdd /></div>
          <div><div className="cx-snum green">9</div><div className="cx-slbl">本月新增</div></div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic orange"><IcClock /></div>
          <div><div className="cx-snum orange">11</div><div className="cx-slbl">逾 30 天未互動</div></div>
        </div>
      </div>

      {/* ── Filter row ── */}
      <div className="cx-filter-row">
        <div className="cx-seg">
          <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}><IcList />列表</button>
          <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')}><IcGrid />卡片</button>
        </div>
        {(['公司', '職務', '負責業務'] as const).map(label => (
          <div key={label} className="cx-fpill">
            <span className="fl">{label}</span>
            <select onChange={e => showToast(`已套用篩選 · ${label}：${e.target.value}`)}>
              {label === '公司' && <><option>全部</option><option>台積電</option><option>鴻海精密</option><option>聯發科技</option><option>台達電子</option><option>華碩電腦</option></>}
              {label === '職務' && <><option>全部</option><option>決策者</option><option>採購窗口</option><option>技術窗口</option><option>使用者</option></>}
              {label === '負責業務' && <><option>全部業務</option><option>張志豪</option><option>陳美華</option><option>林俊傑</option></>}
            </select>
          </div>
        ))}
        <div className="cx-filter-count">共 <b>126</b> 人</div>
      </div>

      {/* ── List view ── */}
      {view === 'list' && (
        <div className="cx-ct-card">
          <table className="cx-ct-tbl">
            <colgroup>
              <col style={{ width: 42 }} /><col style={{ width: 240 }} /><col style={{ width: 170 }} />
              <col /><col style={{ width: 88 }} /><col style={{ width: 118 }} /><col style={{ width: 128 }} />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <div className={`cx-chk${allChecked ? ' on' : ''}`} onClick={toggleAll}>
                    <IcChk />
                  </div>
                </th>
                <th>姓名 / 職稱</th><th>所屬公司</th><th>Email</th>
                <th>聯絡</th><th>負責業務</th><th>最近互動</th>
              </tr>
            </thead>
            <tbody>
              {CONTACTS.map((c, i) => {
                const company = CO[c.co]
                const assignee = ASSIGNEES[c.owner]
                return (
                  <tr
                    key={i}
                    className={selRows.has(i) ? 'sel' : ''}
                    onClick={() => openDrawer(i)}
                  >
                    <td>
                      <div className={`cx-chk${selRows.has(i) ? ' on' : ''}`} onClick={e => toggleRow(i, e)}>
                        <IcChk />
                      </div>
                    </td>
                    <td>
                      <div className="cx-person-id">
                        <div className="cx-av-cir" style={{ background: c.g }}>{c.av}</div>
                        <div className="txt">
                          <div className="nm">
                            {c.nm}
                            {c.pri && <span className="pri-tag">主要</span>}
                          </div>
                          <div className="tt">{c.title}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="cx-co-link">
                        <span className="cx-co-logo" style={{ background: company.g }}>{company.logo}</span>
                        <span className="cn">{company.nm}</span>
                      </span>
                    </td>
                    <td><span className="cx-email-txt">{c.email}</span></td>
                    <td>
                      <div className="cx-ct-ic">
                        <span title="Email" onClick={e => { e.stopPropagation(); showToast('已開啟「撰寫郵件」面板') }}><IcMail /></span>
                        <span title="電話" onClick={e => { e.stopPropagation(); showToast('已撥號並開啟通話紀錄') }}><IcPhone /></span>
                      </div>
                    </td>
                    <td>
                      <div className="cx-assignee">
                        <div className="av" style={{ background: assignee.g }}>{assignee.av}</div>
                        <span className="nm">{assignee.nm}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cx-last-act">
                        {c.last}
                        <span className="ago">{c.ago}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="cx-pager">
            <div className="info">顯示第 <b>1–8</b> 人，共 <b>126</b> 人</div>
            <div className="cx-pages">
              <button className="cx-pg nav" disabled><IcChevL /></button>
              {[1, 2, 3].map(p => (
                <button key={p} className={`cx-pg${activePg === p ? ' active' : ''}`} onClick={() => setActivePg(p)}>{p}</button>
              ))}
              <span className="cx-pg-dots">…</span>
              <button className={`cx-pg${activePg === 16 ? ' active' : ''}`} onClick={() => setActivePg(16)}>16</button>
              <button className="cx-pg nav"><IcChevR /></button>
            </div>
          </div>
        </div>
      )}

      {/* ── Card grid ── */}
      {view === 'grid' && (
        <div className="cx-ct-grid">
          {CONTACTS.map((c, i) => {
            const company  = CO[c.co]
            const assignee = ASSIGNEES[c.owner]
            return (
              <div key={i} className="cx-pcard" onClick={() => openDrawer(i)}>
                {c.pri && <span className="cx-pri-flag">主要窗口</span>}
                <div className="pc-chk">
                  <div className={`cx-chk${selCards.has(i) ? ' on' : ''}`} onClick={e => toggleCard(i, e)}>
                    <IcChk />
                  </div>
                </div>
                <div className="pc-top">
                  <div className="pc-av" style={{ background: c.g }}>{c.av}</div>
                  <div>
                    <div className="pc-nm">{c.nm}</div>
                    <div className="pc-tt">{c.title}</div>
                  </div>
                </div>
                <div className="pc-co">
                  <span className="cx-co-logo" style={{ background: company.g }}>{company.logo}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--cx-accent)', fontWeight: 500 }}>{company.nm}</span>
                  <span className="cx-tag ind" style={{ marginLeft: 'auto' }}>{company.ind}</span>
                </div>
                <div className="pc-meta">
                  <IcMail />
                  <span className="ml">{c.email}</span>
                </div>
                <div className="pc-foot">
                  <div className="pc-owner">
                    <div className="av" style={{ background: assignee.g }}>{assignee.av}</div>
                    {assignee.nm}
                  </div>
                  <div className="ml" style={{ fontSize: 11.5, color: 'var(--cx-text-faint)' }}>{c.ago}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Detail drawer ── */}
      <div className={`cx-drawer-scrim${drawerIdx !== null ? ' open' : ''}`} onClick={closeDrawer} />
      <aside className={`cx-drawer cx-ct-drawer${drawerIdx !== null ? ' open' : ''}`}>
        {contact && co && own && (
          <>
            <div className="cx-ct-dw-top">
              {/* Breadcrumb + nav */}
              <div className="cx-dw-bar">
                <span className="crumb"><b>聯絡人</b> ／ {contact.nm}</span>
                <div className="sp" style={{ flex: 1 }} />
                <button className="cx-dw-iconbtn" title="上一筆" onClick={prevContact}><IcChevL /></button>
                <button className="cx-dw-iconbtn" title="下一筆" onClick={nextContact}><IcChevR /></button>
                <button className="cx-dw-iconbtn" title="關閉"   onClick={closeDrawer}><IcX /></button>
              </div>

              {/* Hero */}
              <div className="cx-ct-dw-hero">
                <div className="logo" style={{ background: contact.g }}>{contact.av}</div>
                <div className="h-main">
                  <h2>{contact.nm}</h2>
                  <div className="h-sub">{contact.title} · {co.nm}</div>
                  <div className="h-meta">
                    <span className="cx-tag ind">{ROLE_TAG[contact.role] ?? contact.role}</span>
                    {contact.pri && <span className="cx-tag pri">主要窗口</span>}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="cx-dw-cta">
                <button className="cx-btn-sm pri" onClick={() => showToast('已開啟「撰寫郵件」面板')}>
                  <IcMail />寄信
                </button>
                <button className="cx-btn-sm" onClick={() => showToast('已撥號並開啟通話紀錄')}>
                  <IcPhone />致電
                </button>
                <button className="cx-btn-sm" onClick={() => showToast('已開啟「記錄活動」面板')}>
                  <IcCal />記錄
                </button>
              </div>
            </div>

            <div className="cx-dw-body" ref={drawerBodyRef}>
              {/* Contact info */}
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3 style={{ fontWeight: 500 }}>聯絡資訊</h3>
                </div>
                <div className="cx-info-grid">
                  <div className="cell full">
                    <div className="cl">EMAIL</div>
                    <div className="cv"><IcMail /><a href="#">{contact.email}</a></div>
                  </div>
                  <div className="cell">
                    <div className="cl">公司分機</div>
                    <div className="cv"><IcPhone />{contact.phone}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">行動電話</div>
                    <div className="cv"><IcMobile />{contact.mobile}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">所屬公司</div>
                    <div className="cv"><IcBldg /><a href="#">{co.nm}</a></div>
                  </div>
                  <div className="cell">
                    <div className="cl">負責業務</div>
                    <div className="cv"><IcUser />{own.nm}</div>
                  </div>
                </div>
              </div>

              {/* Related opps */}
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3 style={{ fontWeight: 500 }}>相關商機</h3>
                  <span className="sh-n">{contact.opps.length}</span>
                </div>
                {contact.opps.length > 0 ? contact.opps.map((o, i) => (
                  <div key={i} className="cx-dw-opp-row">
                    <div className="oi"><IcOpp /></div>
                    <div className="om">
                      <div className="on">{o.nm}</div>
                      <div className="od"><span className={`cx-dw-stage ${o.stage}`}>{o.stageL}</span></div>
                    </div>
                    <div className="oamt">{o.amt}</div>
                  </div>
                )) : (
                  <div className="cx-dw-empty">尚無相關商機</div>
                )}
              </div>

              {/* Activity timeline */}
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3 style={{ fontWeight: 500 }}>互動紀錄</h3>
                </div>
                <div className="cx-ct-tl cx-tl" style={{ padding: '4px 16px' }}>
                  {contact.acts.map((ac, i) => {
                    const tiCls = { call: 'cx-ti-call', mail: 'cx-ti-mail', meet: 'cx-ti-meet', note: 'cx-ti-note' }[ac.t]
                    return (
                      <div key={i} className="cx-tl-item">
                        <div className={`ti ${tiCls}`}>
                          {ac.t === 'call' && <IcPhone />}
                          {ac.t === 'mail' && <IcMail />}
                          {ac.t === 'meet' && <IcCal />}
                          {ac.t === 'note' && <IcNote />}
                        </div>
                        <div className="tc">
                          <div className="tt" style={{ fontWeight: 500 }}>{ac.ti}</div>
                          <div className="td">{ac.d}</div>
                          <div className="tm">{ac.m}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
