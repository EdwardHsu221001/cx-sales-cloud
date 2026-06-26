'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  filterContacts,
  validateContactDraft,
  addContact,
  editContact,
  deleteContact,
  CO,
  OWNERS,
  ROLE_OPTIONS,
  type Contact,
  type ContactDraft,
  type CoId,
  type OwnerId,
} from './contacts.utils';
import ConfirmModal from './ConfirmModal';
import SearchPill from './SearchPill';
import { useRowSelection } from './useRowSelection';
import { IconEdit, IconTrash } from './icons';

// ── Static data ───────────────────────────────────────────────────────────────
const CONTACTS: Contact[] = [
  {
    id: 1,
    av: '王',
    g: 'linear-gradient(135deg,#60a5fa,#2563eb)',
    nm: '王俊傑',
    title: '採購部協理',
    role: '決策者',
    co: 'tsmc',
    pri: true,
    owner: 'zhang',
    email: 'jj.wang@tsmc.com',
    phone: '03-5636688 #2201',
    mobile: '0912-345-678',
    last: '電話會議',
    ago: '2 小時前',
    opps: [
      { nm: '2026 智慧製造平台導入', stage: 'negotiate', stageL: '議約談判', amt: 'NT$ 2.4M' },
      { nm: '年度技術支援續約', stage: 'need', stageL: '需求分析', amt: 'NT$ 0.6M' },
    ],
    acts: [
      {
        t: 'call',
        ti: '電話會議',
        d: '確認智慧製造平台導入時程，對方希望 Q3 完成 POC。',
        m: '張志豪 · 2 小時前',
      },
      {
        t: 'mail',
        ti: '寄送會議紀要',
        d: '整理上週技術討論重點與待辦清單。',
        m: '張志豪 · 3 天前',
      },
    ],
  },
  {
    id: 2,
    av: '李',
    g: 'linear-gradient(135deg,#34D399,#10b981)',
    nm: '李欣怡',
    title: '資訊處經理',
    role: '技術窗口',
    co: 'tsmc',
    pri: false,
    owner: 'zhang',
    email: 'hy.lee@tsmc.com',
    phone: '03-5636688 #3310',
    mobile: '0922-118-220',
    last: 'Email 往來',
    ago: '昨天',
    opps: [{ nm: '資安監控系統擴充', stage: 'proposal', stageL: '提案報價', amt: 'NT$ 1.2M' }],
    acts: [
      { t: 'mail', ti: '技術規格確認', d: '回覆資安監控系統的整合介面問題。', m: '張志豪 · 昨天' },
    ],
  },
  {
    id: 3,
    av: '陳',
    g: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
    nm: '陳冠宇',
    title: '營運副總',
    role: '決策者',
    co: 'fox',
    pri: true,
    owner: 'lin',
    email: 'gy.chen@foxconn.com',
    phone: '02-22683466 #1100',
    mobile: '0918-660-330',
    last: '季度會議',
    ago: '1 天前',
    opps: [{ nm: '供應鏈管理系統升級', stage: 'proposal', stageL: '提案報價', amt: 'NT$ 2.0M' }],
    acts: [
      {
        t: 'meet',
        ti: '季度業務檢視會議',
        d: '回顧上半年導入進度，確認下半年擴點計畫。',
        m: '林俊傑 · 1 天前',
      },
    ],
  },
  {
    id: 4,
    av: '吳',
    g: 'linear-gradient(135deg,#60a5fa,#2563eb)',
    nm: '吳孟潔',
    title: '採購經理',
    role: '採購窗口',
    co: 'fox',
    pri: false,
    owner: 'lin',
    email: 'mj.wu@foxconn.com',
    phone: '02-22683466 #1180',
    mobile: '0935-221-447',
    last: '報價討論',
    ago: '4 天前',
    opps: [{ nm: '倉儲自動化整合案', stage: 'need', stageL: '需求分析', amt: 'NT$ 1.1M' }],
    acts: [
      {
        t: 'note',
        ti: '新增備註',
        d: '採購流程需經三層審核，預留兩週緩衝。',
        m: '林俊傑 · 4 天前',
      },
    ],
  },
  {
    id: 5,
    av: '林',
    g: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
    nm: '林佳蓉',
    title: '技術採購總監',
    role: '決策者',
    co: 'mtk',
    pri: true,
    owner: 'chen',
    email: 'jr.lin@mediatek.com',
    phone: '03-5670766 #4400',
    mobile: '0910-882-156',
    last: '合約協商',
    ago: '5 小時前',
    opps: [{ nm: '雲端研發環境建置', stage: 'negotiate', stageL: '議約談判', amt: 'NT$ 1.8M' }],
    acts: [
      {
        t: 'call',
        ti: '合約條款協商',
        d: '對方要求 SLA 提升至 99.9%，已回報主管評估。',
        m: '陳美華 · 5 小時前',
      },
    ],
  },
  {
    id: 6,
    av: '黃',
    g: 'linear-gradient(135deg,#34D399,#10b981)',
    nm: '黃信宏',
    title: 'IT 基礎架構經理',
    role: '技術窗口',
    co: 'mtk',
    pri: false,
    owner: 'chen',
    email: 'sh.huang@mediatek.com',
    phone: '03-5670766 #4520',
    mobile: '0978-330-661',
    last: 'POC 回報',
    ago: '2 天前',
    opps: [{ nm: '資料分析平台導入', stage: 'proposal', stageL: '提案報價', amt: 'NT$ 1.0M' }],
    acts: [
      { t: 'mail', ti: '寄送 POC 結果', d: '資料分析平台查詢效能提升 40%。', m: '陳美華 · 2 天前' },
    ],
  },
  {
    id: 7,
    av: '黃',
    g: 'linear-gradient(135deg,#34D399,#10b981)',
    nm: '黃柏翰',
    title: '數位轉型處長',
    role: '決策者',
    co: 'delta',
    pri: true,
    owner: 'chen',
    email: 'ph.huang@deltaww.com',
    phone: '03-3626301 #500',
    mobile: '0926-771-308',
    last: 'Demo 簡報',
    ago: '6 小時前',
    opps: [{ nm: '能源管理儀表板專案', stage: 'proposal', stageL: '提案報價', amt: 'NT$ 0.9M' }],
    acts: [
      {
        t: 'mail',
        ti: '寄送能源儀表板 Demo',
        d: '處長對即時能耗視覺化反應正面。',
        m: '陳美華 · 6 小時前',
      },
    ],
  },
  {
    id: 8,
    av: '劉',
    g: 'linear-gradient(135deg,#22d3ee,#0891b2)',
    nm: '劉雅琪',
    title: '採購中心總監',
    role: '決策者',
    co: 'asus',
    pri: true,
    owner: 'zhang',
    email: 'yc.liu@asus.com',
    phone: '02-28943447 #700',
    mobile: '0913-558-902',
    last: '成交慶功',
    ago: '4 小時前',
    opps: [
      { nm: '全球客服系統整合', stage: 'won', stageL: '已成交', amt: 'NT$ 1.5M' },
      { nm: 'AI 客服機器人擴充', stage: 'proposal', stageL: '提案報價', amt: 'NT$ 0.6M' },
    ],
    acts: [
      {
        t: 'meet',
        ti: '成交慶功與後續規劃',
        d: '全球客服系統正式上線，討論 AI 客服第二期合作。',
        m: '張志豪 · 4 小時前',
      },
    ],
  },
];

const ROLE_TAG: Record<string, string> = {
  決策者: '決策者',
  採購窗口: '採購',
  技術窗口: '技術',
  使用者: '使用者',
};

// ── Form helpers ──────────────────────────────────────────────────────────────
const EMPTY_DRAFT: ContactDraft = {
  nm: '',
  title: '',
  role: ROLE_OPTIONS[0],
  co: 'tsmc',
  owner: 'zhang',
  email: '',
  phone: '',
  mobile: '',
  pri: false,
};

/** 由完整 Contact 還原成可編輯草稿。 */
function contactToDraft(c: Contact): ContactDraft {
  return {
    id: c.id,
    nm: c.nm,
    title: c.title,
    role: c.role,
    co: c.co,
    owner: c.owner,
    email: c.email,
    phone: c.phone,
    mobile: c.mobile,
    pri: c.pri,
  };
}

// ── SVG icons ─────────────────────────────────────────────────────────────────
const IcPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IcExport = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 15V3M7 8l5-5 5 5" />
    <path d="M5 21h14" />
  </svg>
);
const IcList = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const IcGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IcMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <path d="m3 6.5 9 6 9-6" />
  </svg>
);
const IcPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);
const IcCal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4.5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 2.5v4M16 2.5v4" />
  </svg>
);
const IcNote = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
const IcOpp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 17l5-5 4 3 8-8" />
    <path d="M16 7h4v4" />
  </svg>
);
const IcChevL = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const IcChevR = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const IcX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IcChk = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IcPeople = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.5a3.2 3.2 0 0 1 0 6" />
    <path d="M17.5 14.5a5.5 5.5 0 0 1 3 5" />
  </svg>
);
const IcShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5Z" />
  </svg>
);
const IcAdd = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M19 8v6M22 11h-6" />
  </svg>
);
const IcClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
const IcMobile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <path d="M11 18h2" />
  </svg>
);
const IcBldg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
    <path d="M15 9h3a1 1 0 0 1 1 1v11" />
    <path d="M3 21h18" />
  </svg>
);
const IcUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
  </svg>
);

// ── Main component ────────────────────────────────────────────────────────────
export default function Contacts({ showToast }: { showToast: (msg: string) => void }) {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
  const [drawerId, setDrawerId] = useState<number | null>(null);
  const [activePg, setActivePg] = useState(1);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<ContactDraft | null>(null);
  const [drawerTried, setDrawerTried] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const drawerBodyRef = useRef<HTMLDivElement>(null);

  const filtered = filterContacts(contacts, query);
  const { isSelected, allSelected, toggle, toggleAll, deselect } = useRowSelection(
    filtered.map((c) => c.id),
  );
  const draftErrors = draft ? validateContactDraft(draft) : null;

  const openDrawer = (id: number) => setDrawerId(id);
  const closeDrawer = useCallback(() => setDrawerId(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (deleteId != null) setDeleteId(null);
      else if (draft) setDraft(null);
      else closeDrawer();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeDrawer, deleteId, draft]);

  useEffect(() => {
    if (drawerId !== null && drawerBodyRef.current) drawerBodyRef.current.scrollTop = 0;
  }, [drawerId]);

  const navContact = (dir: 1 | -1) => {
    if (drawerId === null || filtered.length === 0) return;
    const pos = filtered.findIndex((c) => c.id === drawerId);
    if (pos === -1) return;
    setDrawerId(filtered[(pos + dir + filtered.length) % filtered.length].id);
  };

  // ── CRUD 表單抽屜 ──
  const openCreate = () => {
    setDrawerTried(false);
    setDraft({ ...EMPTY_DRAFT });
  };
  const openEdit = (c: Contact) => {
    setDrawerTried(false);
    setDraft(structuredClone(contactToDraft(c)));
  };
  const setField = (patch: Partial<ContactDraft>) => setDraft((d) => (d ? { ...d, ...patch } : d));
  const saveDraft = () => {
    if (!draft) return;
    if (!validateContactDraft(draft).ok) {
      setDrawerTried(true);
      return;
    }
    const isEdit = draft.id != null;
    setContacts((list) =>
      isEdit ? editContact(list, draft) : addContact(list, draft, Date.now()),
    );
    setDraft(null);
    showToast(isEdit ? `已更新 ${draft.nm}` : `已新增 ${draft.nm}`);
  };

  // ── 刪除 ──
  const confirmDelete = () => {
    if (deleteId == null) return;
    const target = contacts.find((c) => c.id === deleteId);
    setContacts((list) => deleteContact(list, deleteId));
    deselect(deleteId);
    if (drawerId === deleteId) setDrawerId(null);
    setDeleteId(null);
    if (target) showToast(`已刪除 ${target.nm}`);
  };

  const contact = drawerId !== null ? contacts.find((c) => c.id === drawerId) ?? null : null;
  const co = contact ? CO[contact.co] : null;
  const own = contact ? OWNERS[contact.owner] : null;

  return (
    <>
      {/* ── Page header ── */}
      <div className="cx-pg-head">
        <div>
          <h1>聯絡人</h1>
          <div className="sub">
            所有客戶窗口的單一名冊 — 每位聯絡人都連結到所屬公司、負責業務與互動紀錄。
          </div>
        </div>
        <div className="actions">
          <button className="cx-btn-outline" onClick={() => showToast('已匯出聯絡人清單 CSV')}>
            <IcExport />
            匯出
          </button>
          <button className="cx-btn-navy" onClick={openCreate}>
            <IcPlus />
            新增聯絡人
          </button>
        </div>
      </div>

      {/* ── Stat bar ── */}
      <div className="cx-stat-bar">
        <div className="cx-stat">
          <div className="cx-sic blue">
            <IcPeople />
          </div>
          <div>
            <div className="cx-snum">126</div>
            <div className="cx-slbl">全部聯絡人</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic violet">
            <IcShield />
          </div>
          <div>
            <div className="cx-snum violet">42</div>
            <div className="cx-slbl">主要窗口</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic green">
            <IcAdd />
          </div>
          <div>
            <div className="cx-snum green">9</div>
            <div className="cx-slbl">本月新增</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic orange">
            <IcClock />
          </div>
          <div>
            <div className="cx-snum orange">11</div>
            <div className="cx-slbl">逾 30 天未互動</div>
          </div>
        </div>
      </div>

      {/* ── Filter row ── */}
      <div className="cx-filter-row">
        <div className="cx-seg">
          <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>
            <IcList />
            列表
          </button>
          <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')}>
            <IcGrid />
            卡片
          </button>
        </div>
        <SearchPill
          value={query}
          onChange={setQuery}
          label="搜尋聯絡人"
          placeholder="搜尋姓名、公司或 Email"
        />
        {(['公司', '職務', '負責業務'] as const).map((label) => (
          <div key={label} className="cx-fpill">
            <span className="fl">{label}</span>
            <select onChange={(e) => showToast(`已套用篩選 · ${label}：${e.target.value}`)}>
              {label === '公司' && (
                <>
                  <option>全部</option>
                  <option>台積電</option>
                  <option>鴻海精密</option>
                  <option>聯發科技</option>
                  <option>台達電子</option>
                  <option>華碩電腦</option>
                </>
              )}
              {label === '職務' && (
                <>
                  <option>全部</option>
                  <option>決策者</option>
                  <option>採購窗口</option>
                  <option>技術窗口</option>
                  <option>使用者</option>
                </>
              )}
              {label === '負責業務' && (
                <>
                  <option>全部業務</option>
                  <option>張志豪</option>
                  <option>陳美華</option>
                  <option>林俊傑</option>
                </>
              )}
            </select>
          </div>
        ))}
        <div className="cx-filter-count">
          共 <b>{filtered.length}</b> 位
        </div>
      </div>

      {/* ── List view ── */}
      {view === 'list' && (
        <div className="cx-ct-card">
          <table className="cx-ct-tbl">
            <colgroup>
              <col style={{ width: 42 }} />
              <col style={{ width: 240 }} />
              <col style={{ width: 170 }} />
              <col />
              <col style={{ width: 88 }} />
              <col style={{ width: 118 }} />
              <col style={{ width: 128 }} />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <div
                    className={`cx-chk${allSelected ? ' on' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAll();
                    }}
                  >
                    <IcChk />
                  </div>
                </th>
                <th>姓名 / 職稱</th>
                <th>所屬公司</th>
                <th>Email</th>
                <th>聯絡</th>
                <th>負責業務</th>
                <th>最近互動</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="cx-empty-row">
                    找不到符合『{query}』的聯絡人
                  </td>
                </tr>
              )}
              {filtered.map((c) => {
                const company = CO[c.co];
                const assignee = OWNERS[c.owner];
                return (
                  <tr
                    key={c.id}
                    className={isSelected(c.id) ? 'sel' : ''}
                    onClick={() => openDrawer(c.id)}
                  >
                    <td>
                      <div
                        className={`cx-chk${isSelected(c.id) ? ' on' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(c.id);
                        }}
                      >
                        <IcChk />
                      </div>
                    </td>
                    <td>
                      <div className="cx-person-id">
                        <div className="cx-av-cir" style={{ background: c.g }}>
                          {c.av}
                        </div>
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
                        <span className="cx-co-logo" style={{ background: company.g }}>
                          {company.logo}
                        </span>
                        <span className="cn">{company.nm}</span>
                      </span>
                    </td>
                    <td>
                      <span className="cx-email-txt">{c.email}</span>
                    </td>
                    <td>
                      <div className="cx-ct-ic">
                        <span
                          title="Email"
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast('已開啟「撰寫郵件」面板');
                          }}
                        >
                          <IcMail />
                        </span>
                        <span
                          title="電話"
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast('已撥號並開啟通話紀錄');
                          }}
                        >
                          <IcPhone />
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="cx-assignee">
                        <div className="av" style={{ background: assignee.gradient }}>
                          {assignee.initial}
                        </div>
                        <span className="nm">{assignee.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cx-last-act">
                        {c.last}
                        <span className="ago">{c.ago}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="cx-pager">
            <div className="info">
              顯示第 <b>1–{filtered.length}</b> 位，共 <b>{filtered.length}</b> 位
            </div>
            <div className="cx-pages">
              <button className="cx-pg nav" disabled>
                <IcChevL />
              </button>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`cx-pg${activePg === p ? ' active' : ''}`}
                  onClick={() => setActivePg(p)}
                >
                  {p}
                </button>
              ))}
              <span className="cx-pg-dots">…</span>
              <button
                className={`cx-pg${activePg === 16 ? ' active' : ''}`}
                onClick={() => setActivePg(16)}
              >
                16
              </button>
              <button className="cx-pg nav">
                <IcChevR />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Card grid ── */}
      {view === 'grid' && (
        <div className="cx-ct-grid">
          {filtered.length === 0 && (
            <div className="cx-empty-row">找不到符合『{query}』的聯絡人</div>
          )}
          {filtered.map((c) => {
            const company = CO[c.co];
            const assignee = OWNERS[c.owner];
            return (
              <div key={c.id} className="cx-pcard" onClick={() => openDrawer(c.id)}>
                {c.pri && <span className="cx-pri-flag">主要窗口</span>}
                <div className="pc-chk">
                  <div
                    className={`cx-chk${isSelected(c.id) ? ' on' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(c.id);
                    }}
                  >
                    <IcChk />
                  </div>
                </div>
                <div className="pc-top">
                  <div className="pc-av" style={{ background: c.g }}>
                    {c.av}
                  </div>
                  <div>
                    <div className="pc-nm">{c.nm}</div>
                    <div className="pc-tt">{c.title}</div>
                  </div>
                </div>
                <div className="pc-co">
                  <span className="cx-co-logo" style={{ background: company.g }}>
                    {company.logo}
                  </span>
                  <span style={{ fontSize: 12.5, color: 'var(--cx-accent)', fontWeight: 500 }}>
                    {company.nm}
                  </span>
                  <span className="cx-tag ind" style={{ marginLeft: 'auto' }}>
                    {company.ind}
                  </span>
                </div>
                <div className="pc-meta">
                  <IcMail />
                  <span className="ml">{c.email}</span>
                </div>
                <div className="pc-foot">
                  <div className="pc-owner">
                    <div className="av" style={{ background: assignee.gradient }}>
                      {assignee.initial}
                    </div>
                    {assignee.name}
                  </div>
                  <div className="ml" style={{ fontSize: 11.5, color: 'var(--cx-text-faint)' }}>
                    {c.ago}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Detail drawer ── */}
      <div
        className={`cx-drawer-scrim${drawerId !== null ? ' open' : ''}`}
        onClick={closeDrawer}
      />
      <aside className={`cx-drawer cx-ct-drawer${drawerId !== null ? ' open' : ''}`}>
        {contact && co && own && (
          <>
            <div className="cx-ct-dw-top">
              {/* Breadcrumb + nav */}
              <div className="cx-dw-bar">
                <span className="crumb">
                  <b>聯絡人</b> ／ {contact.nm}
                </span>
                <div className="sp" style={{ flex: 1 }} />
                <button className="cx-dw-iconbtn" title="上一筆" onClick={() => navContact(-1)}>
                  <IcChevL />
                </button>
                <button className="cx-dw-iconbtn" title="下一筆" onClick={() => navContact(1)}>
                  <IcChevR />
                </button>
                <button className="cx-dw-iconbtn" title="關閉" onClick={closeDrawer}>
                  <IcX />
                </button>
              </div>

              {/* Hero */}
              <div className="cx-ct-dw-hero">
                <div className="logo" style={{ background: contact.g }}>
                  {contact.av}
                </div>
                <div className="h-main">
                  <h2>{contact.nm}</h2>
                  <div className="h-sub">
                    {contact.title} · {co.nm}
                  </div>
                  <div className="h-meta">
                    <span className="cx-tag ind">{ROLE_TAG[contact.role] ?? contact.role}</span>
                    {contact.pri && <span className="cx-tag pri">主要窗口</span>}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="cx-dw-cta">
                <button
                  className="cx-btn-sm pri"
                  onClick={() => showToast('已開啟「撰寫郵件」面板')}
                >
                  <IcMail />
                  寄信
                </button>
                <button className="cx-btn-sm" onClick={() => showToast('已撥號並開啟通話紀錄')}>
                  <IcPhone />
                  致電
                </button>
                <button className="cx-btn-sm" onClick={() => showToast('已開啟「記錄活動」面板')}>
                  <IcCal />
                  記錄
                </button>
                <button className="cx-btn-sm" onClick={() => openEdit(contact)}>
                  <IconEdit />
                  編輯
                </button>
                <button
                  className="cx-btn-sm danger"
                  aria-label="刪除聯絡人"
                  onClick={() => setDeleteId(contact.id)}
                >
                  <IconTrash />
                  刪除
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
                    <div className="cv">
                      <IcMail />
                      <a href="#">{contact.email}</a>
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">公司分機</div>
                    <div className="cv">
                      <IcPhone />
                      {contact.phone}
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">行動電話</div>
                    <div className="cv">
                      <IcMobile />
                      {contact.mobile}
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">所屬公司</div>
                    <div className="cv">
                      <IcBldg />
                      <a href="#">{co.nm}</a>
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">負責業務</div>
                    <div className="cv">
                      <IcUser />
                      {own.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Related opps */}
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3 style={{ fontWeight: 500 }}>相關商機</h3>
                  <span className="sh-n">{contact.opps.length}</span>
                </div>
                {contact.opps.length > 0 ? (
                  contact.opps.map((o, i) => (
                    <div key={i} className="cx-dw-opp-row">
                      <div className="oi">
                        <IcOpp />
                      </div>
                      <div className="om">
                        <div className="on">{o.nm}</div>
                        <div className="od">
                          <span className={`cx-dw-stage ${o.stage}`}>{o.stageL}</span>
                        </div>
                      </div>
                      <div className="oamt">{o.amt}</div>
                    </div>
                  ))
                ) : (
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
                    const tiCls = {
                      call: 'cx-ti-call',
                      mail: 'cx-ti-mail',
                      meet: 'cx-ti-meet',
                      note: 'cx-ti-note',
                    }[ac.t];
                    return (
                      <div key={i} className="cx-tl-item">
                        <div className={`ti ${tiCls}`}>
                          {ac.t === 'call' && <IcPhone />}
                          {ac.t === 'mail' && <IcMail />}
                          {ac.t === 'meet' && <IcCal />}
                          {ac.t === 'note' && <IcNote />}
                        </div>
                        <div className="tc">
                          <div className="tt" style={{ fontWeight: 500 }}>
                            {ac.ti}
                          </div>
                          <div className="td">{ac.d}</div>
                          <div className="tm">{ac.m}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* ── Delete confirm modal ── */}
      <ConfirmModal
        open={deleteId != null}
        title="刪除聯絡人"
        message="確定要刪除這位聯絡人嗎？此動作無法復原。"
        confirmLabel="確定刪除"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* ── Create / Edit form drawer ── */}
      {draft && (
        <>
          <div className="cx-drawer-scrim open" onClick={() => setDraft(null)} />
          <aside className="cx-drawer open" aria-label={draft.id != null ? '編輯聯絡人' : '新增聯絡人'}>
            <div className="cx-dw-top">
              <div className="cx-dw-bar">
                <span className="crumb">
                  <b>聯絡人</b> ／ {draft.id != null ? '編輯' : '新增'}
                </span>
                <div className="sp" style={{ flex: 1 }} />
                <button className="cx-dw-iconbtn" aria-label="關閉" onClick={() => setDraft(null)}>
                  <IcX />
                </button>
              </div>
              <div className="cx-emf-hero">
                <h2>{draft.id != null ? '編輯聯絡人' : '新增聯絡人'}</h2>
              </div>
            </div>

            <div className="cx-dw-body cx-emf-body">
              <div className="cx-emf-grid">
                <label className="cx-emf-field span2">
                  <span className="l">姓名</span>
                  <input value={draft.nm} onChange={(e) => setField({ nm: e.target.value })} />
                  {drawerTried && draftErrors?.nameError && (
                    <span className="err">{draftErrors.nameError}</span>
                  )}
                </label>

                <label className="cx-emf-field">
                  <span className="l">職稱</span>
                  <input value={draft.title} onChange={(e) => setField({ title: e.target.value })} />
                </label>

                <label className="cx-emf-field">
                  <span className="l">角色</span>
                  <select value={draft.role} onChange={(e) => setField({ role: e.target.value })}>
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="cx-emf-field">
                  <span className="l">所屬公司</span>
                  <select
                    value={draft.co}
                    onChange={(e) => setField({ co: e.target.value as CoId })}
                  >
                    {(Object.keys(CO) as CoId[]).map((k) => (
                      <option key={k} value={k}>
                        {CO[k].nm}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="cx-emf-field">
                  <span className="l">負責業務</span>
                  <select
                    value={draft.owner}
                    onChange={(e) => setField({ owner: e.target.value as OwnerId })}
                  >
                    {(Object.keys(OWNERS) as OwnerId[]).map((k) => (
                      <option key={k} value={k}>
                        {OWNERS[k].name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="cx-emf-field span2">
                  <span className="l">Email</span>
                  <input value={draft.email} onChange={(e) => setField({ email: e.target.value })} />
                </label>

                <label className="cx-emf-field">
                  <span className="l">公司分機</span>
                  <input value={draft.phone} onChange={(e) => setField({ phone: e.target.value })} />
                </label>

                <label className="cx-emf-field">
                  <span className="l">行動電話</span>
                  <input
                    value={draft.mobile}
                    onChange={(e) => setField({ mobile: e.target.value })}
                  />
                </label>

                <div className="cx-emf-field span2">
                  <span className="l">主要窗口</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="checkbox"
                      checked={draft.pri}
                      onChange={(e) => setField({ pri: e.target.checked })}
                    />
                    <span className="t">設為此公司主要窗口</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="cx-emf-foot">
              <button className="cx-btn-outline" onClick={() => setDraft(null)}>
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
