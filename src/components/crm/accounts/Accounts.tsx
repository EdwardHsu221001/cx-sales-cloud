'use client';

import { useState, useEffect, useRef } from 'react';
import {
  filterAccounts,
  validateAccountDraft,
  addAccount,
  editAccount,
  deleteAccount,
  OWNERS,
  HEALTH_META,
  type Account,
  type AccountDraft,
  type Contact,
  type Activity,
  type HealthKey,
  type OwnerId,
} from './accounts.utils';
import ConfirmModal from '../common/ConfirmModal';
import SearchPill from '../common/SearchPill';
import FormDrawer from '../common/FormDrawer';
import { useRowSelection } from '../common/useRowSelection';
import {
  IconExport,
  IconPlus,
  IconCheck,
  IconClose,
  IconEdit,
  IconCalendar,
  IconOpps,
  IconEmail,
  IconPhone,
  IconLink,
  IconPin,
  IconList,
  IconGrid,
  IconArrowRight,
  IconTrash,
  IconChevron,
  IconDotsV,
} from '../common/icons';

// ── Types ─────────────────────────────────────────────────────────────────────
type TabId = 'overview' | 'contacts' | 'opps' | 'activity';
type ActType = 'call' | 'mail' | 'meet' | 'note';

// ── Static data ───────────────────────────────────────────────────────────────
const ACCOUNTS: Account[] = [
  {
    id: 1,
    logo: '台',
    lg: 'linear-gradient(135deg,#2563eb,#1e3a5f)',
    name: '台積電',
    star: true,
    domain: 'tsmc.com',
    ind: '半導體',
    size: '73,000+ 人',
    sizeShort: '73,000+',
    amt: 'NT$ 4.2M',
    oppN: 3,
    owner: 'zhang',
    health: 'good',
    info: {
      stat: '22099131',
      web: 'tsmc.com',
      phone: '03-5636688',
      addr: '新竹市力行六路 8 號',
      region: '新竹',
      since: '2023 年 11 月',
    },
    age: '2.4 年',
    contacts: [
      {
        nm: '王俊傑',
        title: '採購部協理',
        pri: true,
        g: 'linear-gradient(135deg,#60a5fa,#2563eb)',
        av: '王',
      },
      { nm: '李欣怡', title: '資訊處經理', g: 'linear-gradient(135deg,#34D399,#10b981)', av: '李' },
      { nm: '張庭瑋', title: '供應鏈專員', g: 'linear-gradient(135deg,#a78bfa,#7c3aed)', av: '張' },
    ],
    opps: [
      {
        nm: '2026 智慧製造平台導入',
        stage: 'negotiate',
        stageL: '議約談判',
        close: '2026/07/30',
        amt: 'NT$ 2.4M',
      },
      {
        nm: '資安監控系統擴充',
        stage: 'proposal',
        stageL: '提案報價',
        close: '2026/08/15',
        amt: 'NT$ 1.2M',
      },
      {
        nm: '年度技術支援續約',
        stage: 'need',
        stageL: '需求分析',
        close: '2026/09/10',
        amt: 'NT$ 0.6M',
      },
    ],
    acts: [
      {
        t: 'call',
        ti: '與王協理電話會議',
        d: '確認智慧製造平台導入時程，對方希望 Q3 完成 POC。',
        m: '張志豪 · 2 小時前',
      },
      {
        t: 'mail',
        ti: '寄送提案報價單',
        d: '資安監控系統擴充 — 報價 NT$ 1.2M，已附導入時程表。',
        m: '張志豪 · 昨天',
      },
      {
        t: 'meet',
        ti: '現場需求訪談',
        d: '與資訊處 3 位窗口討論年度技術支援範圍。',
        m: '陳美華 · 3 天前',
      },
    ],
  },
  {
    id: 2,
    logo: '鴻',
    lg: 'linear-gradient(135deg,#1e3a5f,#122440)',
    name: '鴻海精密',
    star: false,
    domain: 'foxconn.com',
    ind: '電子製造',
    size: '80,000+ 人',
    sizeShort: '80,000+',
    amt: 'NT$ 3.1M',
    oppN: 2,
    owner: 'lin',
    health: 'stable',
    info: {
      stat: '04541302',
      web: 'foxconn.com',
      phone: '02-22683466',
      addr: '新北市土城區自由街 2 號',
      region: '新北',
      since: '2024 年 03 月',
    },
    age: '2.1 年',
    contacts: [
      {
        nm: '陳冠宇',
        title: '營運副總',
        pri: true,
        g: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
        av: '陳',
      },
      { nm: '吳孟潔', title: '採購經理', g: 'linear-gradient(135deg,#60a5fa,#2563eb)', av: '吳' },
    ],
    opps: [
      {
        nm: '供應鏈管理系統升級',
        stage: 'proposal',
        stageL: '提案報價',
        close: '2026/08/05',
        amt: 'NT$ 2.0M',
      },
      {
        nm: '倉儲自動化整合案',
        stage: 'need',
        stageL: '需求分析',
        close: '2026/09/22',
        amt: 'NT$ 1.1M',
      },
    ],
    acts: [
      {
        t: 'meet',
        ti: '季度業務檢視會議',
        d: '回顧上半年導入進度，雙方確認下半年擴點計畫。',
        m: '林俊傑 · 1 天前',
      },
      {
        t: 'note',
        ti: '新增備註',
        d: '對方資安政策嚴格，導入需經三層審核，預留兩週緩衝。',
        m: '林俊傑 · 4 天前',
      },
    ],
  },
  {
    id: 3,
    logo: '聯',
    lg: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
    name: '聯發科技',
    star: true,
    domain: 'mediatek.com',
    ind: 'IC 設計',
    size: '19,000+ 人',
    sizeShort: '19,000+',
    amt: 'NT$ 2.8M',
    oppN: 2,
    owner: 'chen',
    health: 'good',
    info: {
      stat: '23100417',
      web: 'mediatek.com',
      phone: '03-5670766',
      addr: '新竹市篤行一路 1 號',
      region: '新竹',
      since: '2023 年 06 月',
    },
    age: '3.0 年',
    contacts: [
      {
        nm: '林佳蓉',
        title: '技術採購總監',
        pri: true,
        g: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
        av: '林',
      },
      {
        nm: '黃信宏',
        title: 'IT 基礎架構經理',
        g: 'linear-gradient(135deg,#34D399,#10b981)',
        av: '黃',
      },
    ],
    opps: [
      {
        nm: '雲端研發環境建置',
        stage: 'negotiate',
        stageL: '議約談判',
        close: '2026/07/18',
        amt: 'NT$ 1.8M',
      },
      {
        nm: '資料分析平台導入',
        stage: 'proposal',
        stageL: '提案報價',
        close: '2026/08/28',
        amt: 'NT$ 1.0M',
      },
    ],
    acts: [
      {
        t: 'call',
        ti: '合約條款協商',
        d: '雲端研發環境 — 對方要求 SLA 提升至 99.9%，已回報主管評估。',
        m: '陳美華 · 5 小時前',
      },
      {
        t: 'mail',
        ti: '寄送 POC 結果報告',
        d: '資料分析平台試行成效良好，查詢效能提升 40%。',
        m: '陳美華 · 2 天前',
      },
    ],
  },
  {
    id: 4,
    logo: '緯',
    lg: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
    name: '緯創資通',
    star: false,
    domain: 'wistron.com',
    ind: '電子製造',
    size: '1,000+ 人',
    sizeShort: '1,000+',
    amt: 'NT$ 0.9M',
    oppN: 1,
    owner: 'zhang',
    health: 'watch',
    info: {
      stat: '16668113',
      web: 'wistron.com',
      phone: '02-66128000',
      addr: '台北市內湖區瑞光路 158 號',
      region: '台北',
      since: '2026 年 06 月',
    },
    age: '14 天',
    contacts: [
      {
        nm: '陳雅婷',
        title: '採購經理',
        pri: true,
        g: 'linear-gradient(135deg,#f87171,#dc2626)',
        av: '陳',
      },
    ],
    opps: [
      {
        nm: '緯創資通 — 新商機',
        stage: 'need',
        stageL: '需求分析',
        close: '2026/07/15',
        amt: 'NT$ 0.9M',
      },
    ],
    acts: [
      {
        t: 'note',
        ti: '由潛客轉換建立',
        d: '自潛在客戶「陳雅婷」一鍵轉換，已建立帳號、聯絡人與商機。',
        m: '陳小明 · 剛剛',
      },
      {
        t: 'call',
        ti: '初次需求電訪',
        d: '了解採購規模與導入時程，對方仍在比較階段，需積極跟進。',
        m: '張志豪 · 1 天前',
      },
    ],
  },
  {
    id: 5,
    logo: '台',
    lg: 'linear-gradient(135deg,#dc2626,#991b1b)',
    name: '台達電子',
    star: false,
    domain: 'deltaww.com',
    ind: '電源管理',
    size: '10,000+ 人',
    sizeShort: '10,000+',
    amt: 'NT$ 1.4M',
    oppN: 2,
    owner: 'chen',
    health: 'stable',
    info: {
      stat: '22018156',
      web: 'deltaww.com',
      phone: '03-3626301',
      addr: '桃園市龜山區興邦路 31-1 號',
      region: '桃園',
      since: '2024 年 09 月',
    },
    age: '1.8 年',
    contacts: [
      {
        nm: '黃柏翰',
        title: '數位轉型處長',
        pri: true,
        g: 'linear-gradient(135deg,#34D399,#10b981)',
        av: '黃',
      },
      { nm: '蘇怡君', title: '採購副理', g: 'linear-gradient(135deg,#60a5fa,#2563eb)', av: '蘇' },
    ],
    opps: [
      {
        nm: '能源管理儀表板專案',
        stage: 'proposal',
        stageL: '提案報價',
        close: '2026/08/12',
        amt: 'NT$ 0.9M',
      },
      {
        nm: 'IoT 設備監控擴充',
        stage: 'need',
        stageL: '需求分析',
        close: '2026/09/30',
        amt: 'NT$ 0.5M',
      },
    ],
    acts: [
      {
        t: 'mail',
        ti: '寄送能源儀表板 Demo',
        d: '處長對即時能耗視覺化反應正面，下週安排內部簡報。',
        m: '陳美華 · 6 小時前',
      },
      {
        t: 'meet',
        ti: '導入啟動會議',
        d: '確認專案範圍與里程碑，雙方 PM 已建立溝通群組。',
        m: '陳美華 · 3 天前',
      },
    ],
  },
  {
    id: 6,
    logo: '研',
    lg: 'linear-gradient(135deg,#059669,#047857)',
    name: '研華科技',
    star: false,
    domain: 'advantech.com',
    ind: '工業電腦',
    size: '8,000+ 人',
    sizeShort: '8,000+',
    amt: 'NT$ 0',
    oppN: 0,
    owner: 'lin',
    health: 'risk',
    info: {
      stat: '25081353',
      web: 'advantech.com',
      phone: '02-27927818',
      addr: '台北市內湖區瑞光路 26 巷',
      region: '台北',
      since: '2023 年 02 月',
    },
    age: '3.3 年',
    contacts: [
      {
        nm: '林志明',
        title: '資訊部協理',
        pri: true,
        g: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
        av: '林',
      },
    ],
    opps: [],
    acts: [
      {
        t: 'note',
        ti: '標記為風險帳號',
        d: '近 90 天無互動，原合約已到期未續，需主管介入挽回。',
        m: '林俊傑 · 1 週前',
      },
      {
        t: 'call',
        ti: '續約跟進未接',
        d: '撥打協理手機未接，已留言並改寄 Email。',
        m: '林俊傑 · 2 週前',
      },
    ],
  },
  {
    id: 7,
    logo: '華',
    lg: 'linear-gradient(135deg,#0891b2,#0e7490)',
    name: '華碩電腦',
    star: true,
    domain: 'asus.com',
    ind: '消費電子',
    size: '15,000+ 人',
    sizeShort: '15,000+',
    amt: 'NT$ 2.1M',
    oppN: 2,
    owner: 'zhang',
    health: 'good',
    info: {
      stat: '23638577',
      web: 'asus.com',
      phone: '02-28943447',
      addr: '台北市北投區立德路 15 號',
      region: '台北',
      since: '2022 年 12 月',
    },
    age: '3.5 年',
    contacts: [
      {
        nm: '劉雅琪',
        title: '採購中心總監',
        pri: true,
        g: 'linear-gradient(135deg,#22d3ee,#0891b2)',
        av: '劉',
      },
      {
        nm: '鄭凱文',
        title: '系統整合經理',
        g: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
        av: '鄭',
      },
    ],
    opps: [
      {
        nm: '全球客服系統整合',
        stage: 'won',
        stageL: '已成交',
        close: '2026/06/01',
        amt: 'NT$ 1.5M',
      },
      {
        nm: 'AI 客服機器人擴充',
        stage: 'proposal',
        stageL: '提案報價',
        close: '2026/08/20',
        amt: 'NT$ 0.6M',
      },
    ],
    acts: [
      {
        t: 'meet',
        ti: '成交慶功與後續規劃',
        d: '全球客服系統正式上線，討論 AI 客服第二期合作意向。',
        m: '張志豪 · 4 小時前',
      },
      {
        t: 'mail',
        ti: '寄送上線成效報告',
        d: '客服回應時間縮短 35%，滿意度提升至 4.6 分。',
        m: '張志豪 · 昨天',
      },
    ],
  },
];

// ── Form helpers ──────────────────────────────────────────────────────────────
const EMPTY_DRAFT: AccountDraft = {
  name: '',
  domain: '',
  ind: '',
  size: '',
  owner: 'zhang',
  health: 'good',
  stat: '',
  web: '',
  phone: '',
  addr: '',
  region: '',
  since: '',
};

/** 由完整 Account 還原成可編輯草稿（攤平 info 子欄位）。 */
function accountToDraft(a: Account): AccountDraft {
  return {
    id: a.id,
    name: a.name,
    domain: a.domain,
    ind: a.ind,
    size: a.size,
    owner: a.owner,
    health: a.health,
    stat: a.info.stat,
    web: a.info.web,
    phone: a.info.phone,
    addr: a.info.addr,
    region: a.info.region,
    since: a.info.since,
  };
}

function ActIcon({ t }: { t: ActType }) {
  const cls = { call: 'cx-ti-call', mail: 'cx-ti-mail', meet: 'cx-ti-meet', note: 'cx-ti-note' }[t];
  return (
    <div className={`ti ${cls}`}>
      {t === 'call' && <IconPhone />}
      {t === 'mail' && <IconEmail />}
      {t === 'meet' && <IconCalendar />}
      {t === 'note' && <IconEdit />}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Accounts({ showToast }: { showToast: (msg: string) => void }) {
  const [accounts, setAccounts] = useState<Account[]>(ACCOUNTS);
  const [drawerId, setDrawerId] = useState<number | null>(null);
  const [drawerTab, setDrawerTab] = useState<TabId>('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<AccountDraft | null>(null);
  const [drawerTried, setDrawerTried] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [rowMenuId, setRowMenuId] = useState<number | null>(null);
  const drawerBodyRef = useRef<HTMLDivElement>(null);

  const filtered = filterAccounts(accounts, query);
  const { isSelected, allSelected, toggle, toggleAll, deselect } = useRowSelection(
    accounts.map((a) => a.id)
  ); //useRowSelection會把帳戶id抓下來變成[陣列]
  const account = drawerId !== null ? (accounts.find((a) => a.id === drawerId) ?? null) : null;
  const draftErrors = draft ? validateAccountDraft(draft) : null;

  function openDrawer(id: number) {
    setDrawerId(id);
    setDrawerTab('overview');
    setTimeout(() => drawerBodyRef.current?.scrollTo?.(0, 0), 0);
  }

  function navigate(dir: 1 | -1) {
    if (drawerId === null || filtered.length === 0) return;
    const pos = filtered.findIndex((a) => a.id === drawerId);
    if (pos === -1) return;
    const next = filtered[(pos + dir + filtered.length) % filtered.length];
    setDrawerId(next.id);
    setDrawerTab('overview');
    setTimeout(() => drawerBodyRef.current?.scrollTo?.(0, 0), 0);
  }

  // ── CRUD 表單抽屜 ──
  function openCreate() {
    setDrawerTried(false);
    setDraft({ ...EMPTY_DRAFT });
  }
  function openEdit(a: Account) {
    setDrawerTried(false);
    setDraft(structuredClone(accountToDraft(a)));
  }
  function setField(patch: Partial<AccountDraft>) {
    setDraft((d) => (d ? { ...d, ...patch } : d));
  }
  function saveDraft() {
    if (!draft) return;
    if (!validateAccountDraft(draft).ok) {
      setDrawerTried(true);
      return;
    }
    const isEdit = draft.id != null;
    setAccounts((list) =>
      isEdit ? editAccount(list, draft) : addAccount(list, draft, Date.now())
    );
    setDraft(null);
    showToast(isEdit ? `已更新 ${draft.name}` : `已新增 ${draft.name}`);
  }

  // ── 刪除 ──
  function confirmDelete() {
    if (deleteId == null) return;
    const target = accounts.find((a) => a.id === deleteId);
    setAccounts((list) => deleteAccount(list, deleteId));
    deselect(deleteId);
    if (drawerId === deleteId) setDrawerId(null);
    setDeleteId(null);
    if (target) showToast(`已刪除 ${target.name}`);
  }

  // 列操作選單：點任意處關閉（觸發鈕已 stopPropagation，不會立即關回）
  useEffect(() => {
    if (rowMenuId == null) return;
    const handler = () => setRowMenuId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [rowMenuId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (rowMenuId != null) setRowMenuId(null);
      else if (deleteId != null) setDeleteId(null);
      else if (draft) setDraft(null);
      else if (drawerId !== null) setDrawerId(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [drawerId, draft, deleteId, rowMenuId]);

  return (
    <>
      {/* Page header */}
      <div className="cx-lead-head" style={{ marginBottom: 20 }}>
        <div>
          <h1>客戶帳號</h1>
          <div className="sub">
            已成交與往來中的企業客戶 — 從這裡掌握每家公司的聯絡人、進行中商機與互動歷程。
          </div>
        </div>
        <div className="actions">
          <button className="cx-btn-outline" onClick={() => showToast('已匯出帳號清單 CSV')}>
            <IconExport />
            匯出
          </button>
          <button className="cx-btn-navy" onClick={openCreate}>
            <IconPlus />
            新增帳號
          </button>
        </div>
      </div>

      {/* Stat bar */}
      <div className="cx-stat-bar">
        <div className="cx-stat">
          <div className="cx-sic blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
              <path d="M15 9h3a1 1 0 0 1 1 1v11" />
              <path d="M3 21h18M8 8h2M8 12h2M8 16h2" />
            </svg>
          </div>
          <div>
            <div className="cx-snum">48</div>
            <div className="cx-slbl">全部帳號</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" />
              <path d="M22 4 12 14.1l-3-3" />
            </svg>
          </div>
          <div>
            <div className="cx-snum green">31</div>
            <div className="cx-slbl">活躍往來中</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic violet">
            <IconOpps />
          </div>
          <div>
            <div className="cx-snum violet money">NT$ 12.4M</div>
            <div className="cx-slbl">進行中商機金額</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          </div>
          <div>
            <div className="cx-snum orange">4</div>
            <div className="cx-slbl">健康度待關注</div>
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div className="cx-filter-row">
        <div className="cx-seg">
          <button className="on">
            <IconList />
            列表
          </button>
          <button onClick={() => showToast('卡片檢視設計中')}>
            <IconGrid />
            卡片
          </button>
        </div>
        <SearchPill
          value={query}
          onChange={setQuery}
          label="搜尋帳號"
          placeholder="搜尋名稱或網域"
        />
        {[
          {
            label: '產業',
            options: ['全部', '半導體', '電子製造', 'IC 設計', '電源管理', '工業電腦'],
          },
          { label: '規模', options: ['全部', '1000 人以下', '1000–10000 人', '10000 人以上'] },
          { label: '健康度', options: ['全部', '良好', '穩定', '待關注', '風險'] },
          { label: '負責業務', options: ['全部業務', '張志豪', '陳美華', '林俊傑'] },
        ].map(({ label, options }) => (
          <div key={label} className="cx-fpill">
            <span className="fl">{label}</span>
            <select onChange={(e) => showToast(`已套用篩選 · ${label}：${e.target.value}`)}>
              {options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        ))}
        <div className="cx-filter-count">
          共 <b>{filtered.length}</b> 家
        </div>
      </div>

      {/* Table */}
      <div className="cx-acc-card">
        <table className="cx-acc-tbl">
          <colgroup>
            <col style={{ width: 42 }} />
            <col />
            <col style={{ width: 104 }} />
            <col style={{ width: 92 }} />
            <col style={{ width: 132 }} />
            <col style={{ width: 118 }} />
            <col style={{ width: 104 }} />
            <col style={{ width: 54 }} />
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
                  <IconCheck />
                </div>
              </th>
              <th>帳號名稱</th>
              <th>產業</th>
              <th>規模</th>
              <th className="num">進行中商機</th>
              <th>負責業務</th>
              <th>健康度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="cx-empty-row">
                  找不到符合『{query}』的帳號
                </td>
              </tr>
            )}
            {filtered.map((a) => {
              const own = OWNERS[a.owner];
              const h = HEALTH_META[a.health];
              return (
                <tr
                  key={a.id}
                  className={isSelected(a.id) ? 'sel' : ''}
                  onClick={() => openDrawer(a.id)}
                >
                  <td>
                    <div
                      className={`cx-chk row-chk${isSelected(a.id) ? ' on' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(a.id);
                      }}
                    >
                      <IconCheck />
                    </div>
                  </td>
                  <td>
                    <div className="cx-acc-id">
                      <div className="cx-acc-logo" style={{ background: a.lg }}>
                        {a.logo}
                      </div>
                      <div className="txt">
                        <div className="nm">
                          {a.name}
                          {a.star && <span className="star">★</span>}
                        </div>
                        <div className="co">{a.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="cx-ind-tag">{a.ind}</span>
                  </td>
                  <td>
                    <span className="cx-size-txt">{a.sizeShort}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {a.oppN > 0 ? (
                      <div className="cx-opp-cell">
                        <div className="amt">{a.amt}</div>
                        <div className="cnt">{a.oppN} 筆進行中</div>
                      </div>
                    ) : (
                      <div className="cx-opp-cell">
                        <div className="amt" style={{ color: 'var(--cx-text-faint)' }}>
                          —
                        </div>
                        <div className="cnt">無進行中</div>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="cx-assignee">
                      <div className="av" style={{ background: own.gradient }}>
                        {own.initial}
                      </div>
                      <span className="nm">{own.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`cx-health ${a.health}`}>
                      <span className="pip" />
                      {h.lbl}
                    </span>
                  </td>
                  <td className="cx-op-cell">
                    <div className="cx-op-menu-wrap">
                      <button
                        className="cx-op-ic"
                        aria-haspopup="menu"
                        aria-expanded={rowMenuId === a.id}
                        onClick={(e) => {
                          e.stopPropagation(); // ← 別讓事件冒泡
                          setRowMenuId((id) => (id === a.id ? null : a.id)); // ← 切換開/關
                        }}
                      >
                        <IconDotsV />
                      </button>
                      <div
                        className={`cx-quick-menu${rowMenuId === a.id ? ' open' : ''}`}
                        role="menu"
                      >
                        <div
                          className="cx-qm-item"
                          role="menuitem"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRowMenuId(null);
                            openEdit(a);
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setRowMenuId(null);
                            setDeleteId(a.id);
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="cx-pager">
          <div className="info">
            顯示第 <b>1–{filtered.length}</b> 家，共 <b>{filtered.length}</b> 家
          </div>
          <div className="cx-pages">
            <button className="cx-pg nav" disabled>
              <IconChevron dir="left" />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`cx-pg${currentPage === n ? ' active' : ''}`}
                onClick={() => setCurrentPage(n)}
              >
                {n}
              </button>
            ))}
            <span className="cx-pg-dots">…</span>
            <button
              className={`cx-pg${currentPage === 7 ? ' active' : ''}`}
              onClick={() => setCurrentPage(7)}
            >
              7
            </button>
            <button className="cx-pg nav" onClick={() => showToast('下一頁')}>
              <IconChevron dir="right" />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer scrim */}
      <div
        className={`cx-drawer-scrim${drawerId !== null ? ' open' : ''}`}
        onClick={() => setDrawerId(null)}
      />

      {/* Drawer */}
      <aside className={`cx-drawer${drawerId !== null ? ' open' : ''}`}>
        {account && (
          <>
            <div className="cx-dw-top">
              {/* Breadcrumb bar */}
              <div className="cx-dw-bar">
                <span className="crumb">
                  <b>客戶帳號</b> ／ {account.name}
                </span>
                <div className="sp" />
                <button className="cx-dw-iconbtn" title="上一筆" onClick={() => navigate(-1)}>
                  <IconChevron dir="left" />
                </button>
                <button className="cx-dw-iconbtn" title="下一筆" onClick={() => navigate(1)}>
                  <IconChevron dir="right" />
                </button>
                <button className="cx-dw-iconbtn" title="關閉" onClick={() => setDrawerId(null)}>
                  <IconClose />
                </button>
              </div>

              {/* Hero */}
              <div className="cx-dw-hero">
                <div className="logo" style={{ background: account.lg }}>
                  {account.logo}
                </div>
                <div className="h-main">
                  <h2>
                    {account.name}
                    {account.star && <span className="star">★</span>}
                  </h2>
                  <div className="h-meta">
                    <span className="cx-ind-tag">{account.ind}</span>
                    <span className={`cx-health ${account.health}`}>
                      <span className="pip" />
                      {HEALTH_META[account.health].lbl}
                    </span>
                  </div>
                </div>
                <div className="h-actions">
                  <button className="cx-btn-sm" onClick={() => showToast('已開啟「記錄活動」面板')}>
                    <IconCalendar />
                    記錄活動
                  </button>
                  <button className="cx-btn-sm pri" onClick={() => openEdit(account)}>
                    <IconEdit />
                    編輯
                  </button>
                  <button
                    className="cx-btn-sm danger"
                    aria-label="刪除帳號"
                    onClick={() => setDeleteId(account.id)}
                  >
                    <IconTrash />
                    刪除
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="cx-dw-tabs">
                {(
                  [
                    { id: 'overview', label: '概覽' },
                    { id: 'contacts', label: '聯絡人', n: account.contacts.length },
                    { id: 'opps', label: '商機', n: account.opps.length },
                    { id: 'activity', label: '活動歷程' },
                  ] as { id: TabId; label: string; n?: number }[]
                ).map((tab) => (
                  <div
                    key={tab.id}
                    className={`cx-dw-tab${drawerTab === tab.id ? ' on' : ''}`}
                    onClick={() => setDrawerTab(tab.id)}
                  >
                    {tab.label}
                    {tab.n !== undefined && <span className="n">{tab.n}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="cx-dw-body" ref={drawerBodyRef}>
              {/* Overview */}
              <div className={`cx-dw-pane${drawerTab === 'overview' ? ' on' : ''}`}>
                <div className="cx-dw-kpi">
                  <div className="k">
                    <div className={`v${account.oppN > 0 ? ' green' : ''}`}>
                      {account.oppN > 0 ? account.amt : 'NT$ 0'}
                    </div>
                    <div className="l">進行中商機</div>
                  </div>
                  <div className="k">
                    <div className="v">{account.oppN}</div>
                    <div className="l">開放商機數</div>
                  </div>
                  <div className="k">
                    <div className="v">{account.age}</div>
                    <div className="l">合作年資</div>
                  </div>
                </div>

                <div className="cx-dw-sec">
                  <div className="sh">
                    <h3>公司資訊</h3>
                    <div className="sp" />
                    <span className="add" onClick={() => openEdit(account)}>
                      <IconEdit />
                      編輯
                    </span>
                  </div>
                  <div className="cx-info-grid">
                    <InfoCell label="統一編號" val={account.info.stat} />
                    <InfoCell label="產業別" val={account.ind} />
                    <InfoCell label="官方網站" val={account.info.web} link icon={<IconLink />} />
                    <InfoCell label="聯絡電話" val={account.info.phone} icon={<IconPhone />} />
                    <InfoCell label="員工規模" val={account.size} />
                    <InfoCell label="所在地區" val={account.info.region} />
                    <InfoCell label="公司地址" val={account.info.addr} full icon={<IconPin />} />
                    <InfoCell label="首次合作" val={account.info.since} />
                    <InfoCell label="負責業務" val={OWNERS[account.owner].name} />
                  </div>
                </div>

                <div className="cx-dw-sec">
                  <div className="sh">
                    <h3>主要聯絡人</h3>
                    <span className="sh-n">{account.contacts.length}</span>
                    <div className="sp" />
                    <span className="add" onClick={() => setDrawerTab('contacts')}>
                      查看全部
                    </span>
                  </div>
                  <ContactList contacts={account.contacts.slice(0, 2)} showToast={showToast} />
                </div>

                <div className="cx-dw-sec">
                  <div className="sh">
                    <h3>最近活動</h3>
                    <div className="sp" />
                    <span className="add" onClick={() => setDrawerTab('activity')}>
                      查看全部
                    </span>
                  </div>
                  <ActivityList acts={account.acts.slice(0, 2)} />
                </div>
              </div>

              {/* Contacts */}
              <div className={`cx-dw-pane${drawerTab === 'contacts' ? ' on' : ''}`}>
                <div className="cx-dw-sec">
                  <div className="sh">
                    <h3>聯絡人</h3>
                    <span className="sh-n">{account.contacts.length}</span>
                    <div className="sp" />
                    <span className="add" onClick={() => showToast('已開啟「新增聯絡人」面板')}>
                      <IconPlus />
                      新增聯絡人
                    </span>
                  </div>
                  <ContactList contacts={account.contacts} showToast={showToast} />
                </div>
              </div>

              {/* Opps */}
              <div className={`cx-dw-pane${drawerTab === 'opps' ? ' on' : ''}`}>
                <div className="cx-dw-sec">
                  <div className="sh">
                    <h3>進行中商機</h3>
                    <span className="sh-n">{account.opps.length}</span>
                    <div className="sp" />
                    <span className="add" onClick={() => showToast('已開啟「新增商機」面板')}>
                      <IconPlus />
                      新增商機
                    </span>
                  </div>
                  {account.opps.length > 0 ? (
                    account.opps.map((o, i) => (
                      <div key={i} className="cx-dw-opp-row">
                        <div className="oi">
                          <IconOpps />
                        </div>
                        <div className="om">
                          <div className="on">{o.nm}</div>
                          <div className="od">
                            <span className={`cx-dw-stage ${o.stage}`}>{o.stageL}</span>
                            <span>預計關閉 {o.close}</span>
                          </div>
                        </div>
                        <div className="oamt">{o.amt}</div>
                      </div>
                    ))
                  ) : (
                    <div className="cx-dw-empty">目前沒有進行中的商機</div>
                  )}
                </div>
              </div>

              {/* Activity */}
              <div className={`cx-dw-pane${drawerTab === 'activity' ? ' on' : ''}`}>
                <div className="cx-dw-sec">
                  <div className="sh">
                    <h3>活動歷程</h3>
                    <div className="sp" />
                    <span className="add" onClick={() => showToast('已開啟「記錄活動」面板')}>
                      <IconPlus />
                      記錄活動
                    </span>
                  </div>
                  <ActivityList acts={account.acts} />
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* ── Delete confirm modal ── */}
      <ConfirmModal
        open={deleteId != null}
        title="刪除帳號"
        message="確定要刪除這筆客戶帳號嗎？此動作無法復原。"
        confirmLabel="確定刪除"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* ── Create / Edit form drawer ── */}
      {draft && (
        <FormDrawer
          crumbRoot="客戶帳號"
          noun="帳號"
          isEdit={draft.id != null}
          onClose={() => setDraft(null)}
          onSave={saveDraft}
        >
          <label className="cx-emf-field span2">
            <span className="l">名稱</span>
            <input value={draft.name} onChange={(e) => setField({ name: e.target.value })} />
            {drawerTried && draftErrors?.nameError && (
              <span className="err">{draftErrors.nameError}</span>
            )}
          </label>

          <label className="cx-emf-field">
            <span className="l">網域</span>
            <input value={draft.domain} onChange={(e) => setField({ domain: e.target.value })} />
          </label>

          <label className="cx-emf-field">
            <span className="l">產業</span>
            <input value={draft.ind} onChange={(e) => setField({ ind: e.target.value })} />
          </label>

          <label className="cx-emf-field">
            <span className="l">規模</span>
            <input value={draft.size} onChange={(e) => setField({ size: e.target.value })} />
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

          <label className="cx-emf-field">
            <span className="l">健康度</span>
            <select
              value={draft.health}
              onChange={(e) => setField({ health: e.target.value as HealthKey })}
            >
              {(Object.keys(HEALTH_META) as HealthKey[]).map((k) => (
                <option key={k} value={k}>
                  {HEALTH_META[k].lbl}
                </option>
              ))}
            </select>
          </label>

          <label className="cx-emf-field">
            <span className="l">統一編號</span>
            <input value={draft.stat} onChange={(e) => setField({ stat: e.target.value })} />
          </label>

          <label className="cx-emf-field">
            <span className="l">官方網站</span>
            <input value={draft.web} onChange={(e) => setField({ web: e.target.value })} />
          </label>

          <label className="cx-emf-field">
            <span className="l">聯絡電話</span>
            <input value={draft.phone} onChange={(e) => setField({ phone: e.target.value })} />
          </label>

          <label className="cx-emf-field">
            <span className="l">所在地區</span>
            <input value={draft.region} onChange={(e) => setField({ region: e.target.value })} />
          </label>

          <label className="cx-emf-field span2">
            <span className="l">公司地址</span>
            <input value={draft.addr} onChange={(e) => setField({ addr: e.target.value })} />
          </label>

          <label className="cx-emf-field span2">
            <span className="l">首次合作</span>
            <input value={draft.since} onChange={(e) => setField({ since: e.target.value })} />
          </label>
        </FormDrawer>
      )}
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function InfoCell({
  label,
  val,
  link,
  icon,
  full,
}: {
  label: string;
  val: string;
  link?: boolean;
  icon?: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`cell${full ? ' full' : ''}`}>
      <div className="cl">{label}</div>
      <div className="cv">
        {icon}
        {link ? (
          <a href="#" onClick={(e) => e.preventDefault()}>
            {val}
          </a>
        ) : (
          val
        )}
      </div>
    </div>
  );
}

function ContactList({
  contacts,
  showToast,
}: {
  contacts: Contact[];
  showToast: (m: string) => void;
}) {
  return (
    <>
      {contacts.map((c, i) => (
        <div key={i} className="cx-person">
          <div className="av" style={{ background: c.g }}>
            {c.av}
          </div>
          <div className="pm">
            <div className="pn">
              {c.nm}
              {c.pri && <span className="pri-tag">主要窗口</span>}
            </div>
            <div className="pt">{c.title}</div>
          </div>
          <div className="pacts">
            <div className="pic" title="Email" onClick={() => showToast(`寄送 Email 給 ${c.nm}`)}>
              <IconEmail />
            </div>
            <div className="pic" title="電話" onClick={() => showToast(`撥打電話給 ${c.nm}`)}>
              <IconPhone />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function ActivityList({ acts }: { acts: Activity[] }) {
  return (
    <div className="cx-tl">
      {acts.map((a, i) => (
        <div key={i} className="cx-tl-item">
          <ActIcon t={a.t} />
          <div className="tc">
            <div className="tt">{a.ti}</div>
            <div className="td">{a.d}</div>
            <div className="tm">{a.m}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
