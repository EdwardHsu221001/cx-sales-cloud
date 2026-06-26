'use client';

import { useState, useRef, useEffect } from 'react';
import {
  filterLeads,
  filterLeadsByStatus,
  validateLeadDraft,
  addLead,
  editLead,
  deleteLead,
  convertLead,
  OWNERS,
  WORKING_STATUSES,
  type Lead,
  type LeadDraft,
  type Status,
  type Score,
  type ContactMethod,
  type OwnerId,
} from './leads.utils';
import ConfirmModal from './ConfirmModal';
import SearchPill from './SearchPill';
import { useRowSelection } from './useRowSelection';
import {
  IconDownload,
  IconPlus,
  IconPersonAdd,
  IconCardScan,
  IconFileCsv,
  IconTarget,
  IconClockCircle,
  IconCheckFat,
  IconEmail,
  IconPhone,
  IconArrowUpRight,
  IconEdit,
  IconTrash,
  IconDotsV,
  IconCheck,
  IconClose,
  IconBuilding,
  IconPerson,
  IconTrendUp,
  IconArrowDown,
  IconChevron,
} from './icons';

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
  converted: '已轉化',
};

const SCORE_LABEL: Record<Score, string> = {
  hot: 'Hot 高潛力',
  warm: 'Warm 中潛力',
  cold: 'Cold 低潛力',
};

const SOURCE_OPTIONS = ['官網表單', '業務介紹', '廣告投放', '展覽活動'];

// 空白草稿（新增用）
const EMPTY_DRAFT: LeadDraft = {
  name: '',
  company: '',
  convertTitle: '',
  source: SOURCE_OPTIONS[0],
  score: 'warm',
  status: 'new',
  contacts: [],
  assignee: 'zhang',
};

/** 由完整 Lead 還原成可編輯草稿（負責人名字反查 OwnerId）。 */
function leadToDraft(lead: Lead): LeadDraft {
  const assignee =
    (Object.keys(OWNERS) as OwnerId[]).find((k) => OWNERS[k].name === lead.assigneeName) ?? 'zhang';
  return {
    id: lead.id,
    name: lead.name,
    company: lead.company,
    convertTitle: lead.convertTitle ?? '',
    source: lead.source,
    score: lead.score,
    status: lead.status,
    contacts: lead.contacts,
    assignee,
  };
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function Leads({ showToast }: { showToast: (msg: string) => void }) {
  const [leads, setLeads] = useState<Lead[]>(LEADS);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const { isSelected, allSelected, toggle: toggleRow, toggleAll } = useRowSelection(
    leads.map((l) => l.id),
  );
  const [modal, setModal] = useState<null | {
    id: number;
    name: string;
    company: string;
    title: string;
  }>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [drawer, setDrawer] = useState<LeadDraft | null>(null);
  const [drawerTried, setDrawerTried] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [rowMenuId, setRowMenuId] = useState<number | null>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);

  const filtered = filterLeadsByStatus(filterLeads(leads, query), statusFilter);
  const drawerErrors = drawer ? validateLeadDraft(drawer) : null;

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
      if (e.key === 'Escape') {
        setModal(null);
        setDrawer(null);
        setDeleteId(null);
        setRowMenuId(null);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // 列操作選單：點任意處關閉（觸發鈕已 stopPropagation，不會立即關回）
  useEffect(() => {
    if (rowMenuId == null) return;
    const handler = () => setRowMenuId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [rowMenuId]);

  // ── CRUD 抽屜 ──
  const openCreate = () => {
    setDrawerTried(false);
    setDrawer({ ...EMPTY_DRAFT });
  };
  const openEdit = (lead: Lead) => {
    setDrawerTried(false);
    setDrawer(leadToDraft(lead));
  };
  const setField = (patch: Partial<LeadDraft>) => setDrawer((d) => (d ? { ...d, ...patch } : d));
  const saveDraft = () => {
    if (!drawer) return;
    if (!validateLeadDraft(drawer).ok) {
      setDrawerTried(true);
      return;
    }
    const isEdit = drawer.id != null;
    setLeads((list) => (isEdit ? editLead(list, drawer) : addLead(list, drawer, Date.now())));
    setDrawer(null);
    showToast(isEdit ? `已更新 ${drawer.name}` : `已新增 ${drawer.name}`);
  };

  // ── 刪除 ──
  const confirmDelete = () => {
    if (deleteId == null) return;
    const target = leads.find((l) => l.id === deleteId);
    setLeads((list) => deleteLead(list, deleteId));
    setDeleteId(null);
    if (target) showToast(`已刪除 ${target.name}`);
  };

  const openConvert = (lead: Lead) => {
    setModal({
      id: lead.id,
      name: lead.name,
      company: lead.company,
      title: lead.convertTitle ?? '',
    });
  };

  const confirmConvert = () => {
    const m = modal;
    setModal(null);
    if (!m) return;
    setLeads((list) => convertLead(list, m.id));
    setTimeout(() => showToast(`已轉換 ${m.name} → 帳號 + 聯絡人 + 商機`), 180);
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
                    if (label === '手動新增') openCreate();
                    else showToast(`已開啟「${label}」`);
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
        <SearchPill
          value={query}
          onChange={setQuery}
          label="搜尋潛客"
          placeholder="搜尋姓名或公司"
        />
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
          <select
            aria-label="依狀態篩選"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
          >
            <option value="all">全部</option>
            {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
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
            <col style={{ width: 100 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 100 }} />
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
              <th>擁有者</th>
              <th>轉換</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="cx-empty-row">
                  找不到符合『{query}』的潛客
                </td>
              </tr>
            )}
            {filtered.map((lead) => (
              <tr key={lead.id} className={isSelected(lead.id) ? 'sel' : ''}>
                <td>
                  <div
                    className={`cx-chk${isSelected(lead.id) ? ' on' : ''}`}
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
                    {lead.status === 'converted' ? (
                      <span className="cx-op-dash">-</span>
                    ) : (
                      <>
                        {lead.canConvert ? (
                          <button className="cx-btn-convert" onClick={() => openConvert(lead)}>
                            <IconArrowUpRight />
                            轉換
                          </button>
                        ) : (
                          <span className="cx-op-dash">-</span>
                        )}
                      </>
                    )}
                  </div>
                </td>
                <td className="cx-op-cell">
                  {lead.status === 'converted' ? (
                    <span className="cx-op-dash">-</span>
                  ) : (
                    <div className="cx-op-menu-wrap">
                      <button
                        className="cx-op-ic"
                        title="更多操作"
                        aria-label="更多操作"
                        aria-haspopup="menu"
                        aria-expanded={rowMenuId === lead.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setRowMenuId((id) => (id === lead.id ? null : lead.id));
                        }}
                      >
                        <IconDotsV />
                      </button>
                      <div
                        className={`cx-quick-menu${rowMenuId === lead.id ? ' open' : ''}`}
                        role="menu"
                      >
                        <div
                          className="cx-qm-item"
                          role="menuitem"
                          onClick={() => {
                            setRowMenuId(null);
                            openEdit(lead);
                          }}
                        >
                          <span
                            className="cx-qm-icon"
                            style={{
                              background: 'var(--cx-accent-soft)',
                              color: 'var(--cx-accent)',
                            }}
                          >
                            <IconEdit />
                          </span>
                          編輯
                        </div>
                        <div
                          className="cx-qm-item"
                          role="menuitem"
                          onClick={() => {
                            setRowMenuId(null);
                            setDeleteId(lead.id);
                          }}
                        >
                          <span
                            className="cx-qm-icon"
                            style={{ background: '#FEE2E2', color: '#dc2626' }}
                          >
                            <IconTrash />
                          </span>
                          刪除
                        </div>
                      </div>
                    </div>
                  )}
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
              <IconChevron dir="left" />
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
              <IconChevron dir="right" />
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
              <IconClose />
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

      {/* ── Delete confirm modal ── */}
      <ConfirmModal
        open={deleteId != null}
        title="刪除潛客"
        message="確定要刪除這筆潛客嗎？此動作無法復原。"
        confirmLabel="確定刪除"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* ── Create / Edit drawer ── */}
      {drawer && (
        <>
          <div className="cx-drawer-scrim open" onClick={() => setDrawer(null)} />
          <aside
            className="cx-drawer open"
            aria-label={drawer.id != null ? '編輯潛客' : '新增潛客'}
          >
            <div className="cx-dw-top">
              <div className="cx-dw-bar">
                <span className="crumb">
                  <b>潛在客戶</b> ／ {drawer.id != null ? '編輯' : '新增'}
                </span>
                <span className="sp" />
                <button className="cx-dw-iconbtn" onClick={() => setDrawer(null)} aria-label="關閉">
                  <IconClose />
                </button>
              </div>
              <div className="cx-emf-hero">
                <h2>{drawer.id != null ? '編輯潛客' : '新增潛客'}</h2>
              </div>
            </div>

            <div className="cx-dw-body cx-emf-body">
              <div className="cx-emf-grid">
                <label className="cx-emf-field span2">
                  <span className="l">姓名</span>
                  <input value={drawer.name} onChange={(e) => setField({ name: e.target.value })} />
                  {drawerTried && drawerErrors?.nameError && (
                    <span className="err">{drawerErrors.nameError}</span>
                  )}
                </label>

                <label className="cx-emf-field span2">
                  <span className="l">公司</span>
                  <input
                    value={drawer.company}
                    onChange={(e) => setField({ company: e.target.value })}
                  />
                  {drawerTried && drawerErrors?.companyError && (
                    <span className="err">{drawerErrors.companyError}</span>
                  )}
                </label>

                <label className="cx-emf-field span2">
                  <span className="l">職稱</span>
                  <input
                    value={drawer.convertTitle}
                    onChange={(e) => setField({ convertTitle: e.target.value })}
                  />
                </label>

                <label className="cx-emf-field">
                  <span className="l">評分</span>
                  <select
                    value={drawer.score}
                    onChange={(e) => setField({ score: e.target.value as Score })}
                  >
                    {(Object.keys(SCORE_LABEL) as Score[]).map((s) => (
                      <option key={s} value={s}>
                        {SCORE_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="cx-emf-field">
                  <span className="l">狀態</span>
                  <select
                    value={drawer.status}
                    onChange={(e) => setField({ status: e.target.value as Status })}
                  >
                    {WORKING_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="cx-emf-field">
                  <span className="l">來源</span>
                  <select
                    value={drawer.source}
                    onChange={(e) => setField({ source: e.target.value })}
                  >
                    {SOURCE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="cx-emf-field">
                  <span className="l">負責人</span>
                  <select
                    value={drawer.assignee}
                    onChange={(e) => setField({ assignee: e.target.value as OwnerId })}
                  >
                    {(Object.keys(OWNERS) as OwnerId[]).map((k) => (
                      <option key={k} value={k}>
                        {OWNERS[k].name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="cx-emf-field span2">
                  <span className="l">聯絡方式</span>
                  <div className="cx-emf-toggle" style={{ gap: 18 }}>
                    {(['email', 'phone'] as ContactMethod[]).map((m) => (
                      <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="checkbox"
                          checked={drawer.contacts.includes(m)}
                          onChange={() =>
                            setField({
                              contacts: drawer.contacts.includes(m)
                                ? drawer.contacts.filter((c) => c !== m)
                                : [...drawer.contacts, m],
                            })
                          }
                        />
                        <span className="t">{m === 'email' ? 'Email' : '電話'}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="cx-emf-foot">
              <button className="cx-btn-outline" onClick={() => setDrawer(null)}>
                取消
              </button>
              <button className="cx-btn-navy" onClick={saveDraft}>
                儲存
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
