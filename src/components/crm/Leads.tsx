'use client';

import { useState, useRef, useEffect } from 'react';
import { filterLeads, type Lead, type Status } from './leads.utils';

// ─── Static data ────────────────────────────────────────────────────────────
const LEADS: Lead[] = [
  {
    id: 1,
    name: '陳雅婷',
    initial: '陳',
    company: '緯創資通',
    contacts: ['email', 'phone'],
    score: 'hot',
    status: 'followed',
    source: '展覽活動',
    assigneeBg: 'linear-gradient(135deg,#60a5fa,#2563eb)',
    assigneeInitial: '張',
    assigneeName: '張志豪',
    canConvert: true,
    convertTitle: '採購經理',
  },
  {
    id: 2,
    name: '林志明',
    initial: '林',
    company: '研華科技',
    contacts: ['email', 'phone'],
    score: 'hot',
    status: 'toconvert',
    source: '業務介紹',
    assigneeBg: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
    assigneeInitial: '林',
    assigneeName: '林俊傑',
    canConvert: true,
    convertTitle: '資訊部協理',
  },
  {
    id: 3,
    name: '黃柏翰',
    initial: '黃',
    company: '台達電子',
    contacts: ['email'],
    score: 'warm',
    status: 'contacted',
    source: '官網表單',
    assigneeBg: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
    assigneeInitial: '陳',
    assigneeName: '陳美華',
    canConvert: false,
  },
  {
    id: 4,
    name: '王俊凱',
    initial: '王',
    company: '聯發科技',
    contacts: ['email', 'phone'],
    score: 'warm',
    status: 'overdue',
    source: '廣告投放',
    assigneeBg: 'linear-gradient(135deg,#60a5fa,#2563eb)',
    assigneeInitial: '張',
    assigneeName: '張志豪',
    canConvert: false,
  },
  {
    id: 5,
    name: '吳雅文',
    initial: '吳',
    company: '英業達',
    contacts: ['email'],
    score: 'cold',
    status: 'new',
    source: '官網表單',
    assigneeBg: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
    assigneeInitial: '陳',
    assigneeName: '陳美華',
    canConvert: false,
  },
  {
    id: 6,
    name: '蔡宗翰',
    initial: '蔡',
    company: '仁寶電腦',
    contacts: ['email', 'phone'],
    score: 'cold',
    status: 'new',
    source: '展覽活動',
    assigneeBg: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
    assigneeInitial: '林',
    assigneeName: '林俊傑',
    canConvert: false,
  },
];

const STATUS_LABEL: Record<Status, string> = {
  new: '新進名單',
  contacted: '已聯繫',
  followed: '已跟進',
  toconvert: '待轉換',
  overdue: '逾期未聯',
};

// ─── Icons ──────────────────────────────────────────────────────────────────
function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconPersonAdd() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}
function IconCardScan() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8" cy="11" r="2" />
      <path d="M14 10h4M14 14h4" />
    </svg>
  );
}
function IconFileCsv() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
    </svg>
  );
}
function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}
function IconClockCircle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
function IconCheckFat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 7 10 17l-5-5" />
    </svg>
  );
}
function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="m3 6.5 9 6 9-6" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}
function IconArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
function IconDots() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <circle cx="5" cy="12" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="19" cy="12" r="1.2" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function IconBuilding() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
      <path d="M15 9h3a1 1 0 0 1 1 1v11" />
      <path d="M3 21h18M8 8h2M8 12h2M8 16h2" />
    </svg>
  );
}
function IconPerson() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}
function IconTrendUp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 17l5-5 4 3 8-8" />
      <path d="M16 7h4v4" />
    </svg>
  );
}
function IconArrowDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
}
function IconChevLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}
function IconChevRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function Leads({ showToast }: { showToast: (msg: string) => void }) {
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [allSelected, setAllSelected] = useState(false);
  const [modal, setModal] = useState<null | { name: string; company: string; title: string }>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const addMenuRef = useRef<HTMLDivElement>(null);

  const filtered = filterLeads(LEADS, query);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (addMenuOpen && !addMenuRef.current?.contains(e.target as Node)) {
        setAddMenuOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [addMenuOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModal(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const toggleRow = (id: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setAllSelected(next.size === LEADS.length);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedRows(new Set());
      setAllSelected(false);
    } else {
      setSelectedRows(new Set(LEADS.map((l) => l.id)));
      setAllSelected(true);
    }
  };

  const openConvert = (lead: Lead) => {
    setModal({ name: lead.name, company: lead.company, title: lead.convertTitle ?? '' });
  };

  const confirmConvert = () => {
    const name = modal?.name;
    setModal(null);
    setTimeout(() => showToast(`已轉換 ${name} → 帳號 + 聯絡人 + 商機`), 180);
  };

  return (
    <>
      {/* ── Page header ── */}
      <div className="cx-lead-head">
        <div>
          <h1>潛在客戶</h1>
          <div className="sub">
            管理尚未轉換的名單 — 依評分判斷優先順序，跟進後一鍵轉換為客戶、聯絡人與商機。
          </div>
        </div>
        <div className="actions">
          <button className="cx-btn-outline" onClick={() => showToast('已開啟「匯入名單」面板')}>
            <IconDownload />
            匯入名單
          </button>
          <div className="cx-quick-add-wrap" ref={addMenuRef}>
            <button
              className="cx-btn-navy"
              onClick={(e) => {
                e.stopPropagation();
                setAddMenuOpen((v) => !v);
              }}
            >
              <IconPlus />
              新增潛客
            </button>
            <div className={`cx-quick-menu${addMenuOpen ? ' open' : ''}`}>
              {[
                {
                  label: '手動新增',
                  Icon: IconPersonAdd,
                  bg: 'var(--cx-accent-soft)',
                  color: 'var(--cx-accent)',
                },
                {
                  label: '名片掃描',
                  Icon: IconCardScan,
                  bg: 'var(--cx-success-soft)',
                  color: '#0f9b6c',
                },
              ].map(({ label, Icon, bg, color }) => (
                <div
                  key={label}
                  className="cx-qm-item"
                  onClick={() => {
                    setAddMenuOpen(false);
                    showToast(`已開啟「${label}」`);
                  }}
                >
                  <span className="cx-qm-icon" style={{ background: bg, color }}>
                    <Icon />
                  </span>
                  {label}
                </div>
              ))}
              <hr />
              <div
                className="cx-qm-item"
                onClick={() => {
                  setAddMenuOpen(false);
                  showToast('已開啟「CSV 匯入」');
                }}
              >
                <span className="cx-qm-icon" style={{ background: '#FFF4EA', color: '#c2691e' }}>
                  <IconFileCsv />
                </span>
                CSV 匯入
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat bar ── */}
      <div className="cx-stat-bar">
        <div className="cx-stat">
          <div className="cx-sic blue">
            <IconTarget />
          </div>
          <div>
            <div className="cx-snum">32</div>
            <div className="cx-slbl">全部潛客</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic red">🔥</div>
          <div>
            <div className="cx-snum red">8</div>
            <div className="cx-slbl">Hot 高潛力</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic orange">
            <IconClockCircle />
          </div>
          <div>
            <div className="cx-snum orange">5</div>
            <div className="cx-slbl">待跟進 &gt; 7 天</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic green">
            <IconCheckFat />
          </div>
          <div>
            <div className="cx-snum green">6</div>
            <div className="cx-slbl">本月已轉換</div>
          </div>
        </div>
      </div>

      {/* ── Filter row ── */}
      <div className="cx-filter-row">
        <div className="cx-fpill cx-lead-search">
          <input
            type="search"
            aria-label="搜尋潛客"
            placeholder="搜尋姓名或公司"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="cx-fpill">
          <span className="fl">評分</span>
          <select onChange={(e) => showToast(`已套用篩選 · 評分：${e.target.value}`)}>
            <option>全部</option>
            <option>Hot 高潛力</option>
            <option>Warm 中潛力</option>
            <option>Cold 低潛力</option>
          </select>
        </div>
        <div className="cx-fpill">
          <span className="fl">狀態</span>
          <select onChange={(e) => showToast(`已套用篩選 · 狀態：${e.target.value}`)}>
            <option>全部</option>
            <option>新進名單</option>
            <option>已聯繫</option>
            <option>已跟進</option>
            <option>待轉換</option>
          </select>
        </div>
        <div className="cx-fpill">
          <span className="fl">來源</span>
          <select onChange={(e) => showToast(`已套用篩選 · 來源：${e.target.value}`)}>
            <option>全部</option>
            <option>官網表單</option>
            <option>業務介紹</option>
            <option>廣告投放</option>
            <option>展覽活動</option>
          </select>
        </div>
        <div className="cx-fpill">
          <span className="fl">指派</span>
          <select onChange={(e) => showToast(`已套用篩選 · 指派：${e.target.value}`)}>
            <option>全部業務</option>
            <option>張志豪</option>
            <option>陳美華</option>
            <option>林俊傑</option>
          </select>
        </div>
        <div className="cx-filter-count">
          共 <b>{filtered.length}</b> 筆
        </div>
      </div>

      {/* ── Table ── */}
      <div className="cx-lead-card">
        <table className="cx-lead-tbl">
          <colgroup>
            <col style={{ width: 42 }} />
            <col />
            <col style={{ width: 78 }} />
            <col style={{ width: 96 }} />
            <col style={{ width: 128 }} />
            <col style={{ width: 104 }} />
            <col style={{ width: 118 }} />
            <col style={{ width: 104 }} />
          </colgroup>
          <thead>
            <tr>
              <th>
                <div className={`cx-chk${allSelected ? ' on' : ''}`} onClick={toggleAll}>
                  <IconCheck />
                </div>
              </th>
              <th>姓名 / 公司</th>
              <th>聯絡</th>
              <th>評分</th>
              <th>狀態</th>
              <th>來源</th>
              <th>指派人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="cx-empty-row">
                  找不到符合『{query}』的潛客
                </td>
              </tr>
            )}
            {filtered.map((lead) => (
              <tr key={lead.id} className={selectedRows.has(lead.id) ? 'sel' : ''}>
                <td>
                  <div
                    className={`cx-chk${selectedRows.has(lead.id) ? ' on' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRow(lead.id);
                    }}
                  >
                    <IconCheck />
                  </div>
                </td>
                <td>
                  <div className="cx-lead-id">
                    <div className={`av ${lead.score}`}>{lead.initial}</div>
                    <div className="txt">
                      <div className="nm">{lead.name}</div>
                      <div className="co">{lead.company}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="cx-contact-ic">
                    {lead.contacts.includes('email') && (
                      <span title="Email">
                        <IconEmail />
                      </span>
                    )}
                    {lead.contacts.includes('phone') && (
                      <span title="電話">
                        <IconPhone />
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`cx-score ${lead.score}`}>
                    {lead.score === 'hot' ? '🔥 Hot' : lead.score === 'warm' ? 'Warm' : 'Cold'}
                  </span>
                </td>
                <td>
                  <span className={`cx-lead-status ${lead.status}`}>
                    {lead.status === 'overdue' && <IconClockCircle />}
                    {STATUS_LABEL[lead.status]}
                  </span>
                </td>
                <td>
                  <span className="cx-lead-src">{lead.source}</span>
                </td>
                <td>
                  <div className="cx-lead-assignee">
                    <div className="av" style={{ background: lead.assigneeBg }}>
                      {lead.assigneeInitial}
                    </div>
                    <span className="nm">{lead.assigneeName}</span>
                  </div>
                </td>
                <td>
                  <div className="cx-lead-ops">
                    {lead.canConvert ? (
                      <button className="cx-btn-convert" onClick={() => openConvert(lead)}>
                        <IconArrowUpRight />
                        轉換
                      </button>
                    ) : (
                      <>
                        <button
                          className="cx-op-ic"
                          title="編輯"
                          onClick={() => showToast('「編輯」· 功能設計中')}
                        >
                          <IconEdit />
                        </button>
                        <button
                          className="cx-op-ic"
                          title="更多"
                          onClick={() => showToast('「更多」· 功能設計中')}
                        >
                          <IconDots />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="cx-pager">
          <div className="info">
            顯示第 <b>1–6</b> 筆，共 <b>{filtered.length}</b> 筆
          </div>
          <div className="cx-pages">
            <button
              className="cx-pg nav"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <IconChevLeft />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`cx-pg${currentPage === p ? ' active' : ''}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
            <span className="cx-pg-dots">…</span>
            <button
              className={`cx-pg${currentPage === 6 ? ' active' : ''}`}
              onClick={() => setCurrentPage(6)}
            >
              6
            </button>
            <button
              className="cx-pg nav"
              disabled={currentPage === 6}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <IconChevRight />
            </button>
          </div>
        </div>
      </div>

      {/* ── Convert modal ── */}
      <div
        className={`cx-modal-overlay${modal ? ' open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModal(null);
        }}
      >
        <div className="cx-modal">
          <div className="cx-modal-head">
            <div>
              <h2>轉換潛客 · {modal?.name}</h2>
              <div className="ms">
                系統將以此潛客建立三筆關聯紀錄，並把原潛客標記為「已轉換」。轉換後可在帳號詳情頁追蹤後續。
              </div>
            </div>
            <button className="x" onClick={() => setModal(null)}>
              <IconX />
            </button>
          </div>
          <div className="cx-modal-body">
            <div className="cx-conv-flow">
              {/* Account */}
              <div className="cx-conv-card">
                <div
                  className="cic"
                  style={{ background: 'var(--cx-accent-soft)', color: 'var(--cx-accent)' }}
                >
                  <IconBuilding />
                </div>
                <div>
                  <div className="ct">客戶帳號 Account</div>
                  <div className="cv">{modal?.company}</div>
                  <div className="cf">產業：電子製造　·　規模：1000+ 人　·　地區：台北</div>
                </div>
                <span className="badge-new">新建</span>
              </div>
              <div className="cx-conv-arrow">
                <IconArrowDown />
              </div>
              {/* Contact */}
              <div className="cx-conv-card">
                <div className="cic" style={{ background: '#EDE9FE', color: '#6d28d9' }}>
                  <IconPerson />
                </div>
                <div>
                  <div className="ct">聯絡人 Contact</div>
                  <div className="cv">{modal?.name}</div>
                  <div className="cf">職稱：{modal?.title || '—'}　·　Email 與電話將一併帶入</div>
                </div>
                <span className="badge-new">新建</span>
              </div>
              <div className="cx-conv-arrow">
                <IconArrowDown />
              </div>
              {/* Opportunity */}
              <div className="cx-conv-card">
                <div
                  className="cic"
                  style={{ background: 'var(--cx-success-soft)', color: '#059669' }}
                >
                  <IconTrendUp />
                </div>
                <div>
                  <div className="ct">商機 Opportunity</div>
                  <div className="cv">{modal?.company} — 新商機</div>
                  <div className="cf">階段：資格確認　·　預計金額：待填　·　關閉日：+30 天</div>
                </div>
                <span className="badge-new">新建</span>
              </div>
            </div>
          </div>
          <div className="cx-modal-foot">
            <span className="hint">負責人：陳小明</span>
            <div className="grp">
              <button className="cx-btn-ghost" onClick={() => setModal(null)}>
                取消
              </button>
              <button className="cx-btn-confirm" onClick={confirmConvert}>
                <IconCheckFat />
                確認轉換
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
