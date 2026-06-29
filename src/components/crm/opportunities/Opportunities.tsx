'use client';

import { useState, useRef } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Stage = 'need' | 'proposal' | 'negotiate' | 'won' | 'lost';
type OwnerId = 'zhang' | 'chen' | 'lin';
type CoId = 'tsmc' | 'fox' | 'mtk' | 'wis' | 'delta' | 'asus';

interface Opp {
  id: number;
  title: string;
  co: CoId;
  amt: number;
  prob: number;
  close: string;
  owner: OwnerId;
  stage: Stage;
}

// ── Static data ───────────────────────────────────────────────────────────────
const ASSIGNEES: Record<OwnerId, { nm: string; av: string; g: string }> = {
  zhang: { nm: '張志豪', av: '張', g: 'linear-gradient(135deg,#60a5fa,#2563eb)' },
  chen: { nm: '陳美華', av: '陳', g: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
  lin: { nm: '林俊傑', av: '林', g: 'linear-gradient(135deg,#fbbf24,#f59e0b)' },
};

const CO: Record<CoId, { nm: string; logo: string; g: string }> = {
  tsmc: { nm: '台積電', logo: '台', g: 'linear-gradient(135deg,#2563eb,#1e3a5f)' },
  fox: { nm: '鴻海精密', logo: '鴻', g: 'linear-gradient(135deg,#1e3a5f,#122440)' },
  mtk: { nm: '聯發科技', logo: '聯', g: 'linear-gradient(135deg,#7c3aed,#5b21b6)' },
  wis: { nm: '緯創資通', logo: '緯', g: 'linear-gradient(135deg,#0ea5e9,#0369a1)' },
  delta: { nm: '台達電子', logo: '台', g: 'linear-gradient(135deg,#dc2626,#991b1b)' },
  asus: { nm: '華碩電腦', logo: '華', g: 'linear-gradient(135deg,#0891b2,#0e7490)' },
};

const STAGES: { key: Stage; nm: string; color: string; barclr: string }[] = [
  { key: 'need', nm: '需求分析', color: '#0ea5e9', barclr: '#0ea5e9' },
  { key: 'proposal', nm: '提案報價', color: '#3B82F6', barclr: '#3B82F6' },
  { key: 'negotiate', nm: '議約談判', color: '#7c3aed', barclr: '#7c3aed' },
  { key: 'won', nm: '成交', color: '#10b981', barclr: '#10b981' },
  { key: 'lost', nm: '流失', color: '#f87171', barclr: '#f87171' },
];

const STAGE_MAP = Object.fromEntries(STAGES.map((s) => [s.key, s])) as Record<
  Stage,
  (typeof STAGES)[0]
>;

const INIT_OPPS: Opp[] = [
  {
    id: 1,
    title: '2026 智慧製造平台導入',
    co: 'tsmc',
    amt: 2400,
    prob: 65,
    close: '2026/07/30',
    owner: 'zhang',
    stage: 'negotiate',
  },
  {
    id: 2,
    title: '雲端研發環境建置',
    co: 'mtk',
    amt: 1800,
    prob: 60,
    close: '2026/07/18',
    owner: 'chen',
    stage: 'negotiate',
  },
  {
    id: 3,
    title: '資安監控系統擴充',
    co: 'tsmc',
    amt: 1200,
    prob: 45,
    close: '2026/08/15',
    owner: 'zhang',
    stage: 'proposal',
  },
  {
    id: 4,
    title: '供應鏈管理系統升級',
    co: 'fox',
    amt: 2000,
    prob: 40,
    close: '2026/08/05',
    owner: 'lin',
    stage: 'proposal',
  },
  {
    id: 5,
    title: '能源管理儀表板專案',
    co: 'delta',
    amt: 900,
    prob: 50,
    close: '2026/08/12',
    owner: 'chen',
    stage: 'proposal',
  },
  {
    id: 6,
    title: '資料分析平台導入',
    co: 'mtk',
    amt: 1000,
    prob: 35,
    close: '2026/08/28',
    owner: 'chen',
    stage: 'proposal',
  },
  {
    id: 7,
    title: '年度技術支援續約',
    co: 'tsmc',
    amt: 600,
    prob: 25,
    close: '2026/09/10',
    owner: 'zhang',
    stage: 'need',
  },
  {
    id: 8,
    title: '倉儲自動化整合案',
    co: 'fox',
    amt: 1100,
    prob: 20,
    close: '2026/09/22',
    owner: 'lin',
    stage: 'need',
  },
  {
    id: 9,
    title: 'IoT 設備監控擴充',
    co: 'delta',
    amt: 500,
    prob: 15,
    close: '2026/09/30',
    owner: 'chen',
    stage: 'need',
  },
  {
    id: 10,
    title: '緯創資通 — 新商機',
    co: 'wis',
    amt: 900,
    prob: 10,
    close: '2026/07/15',
    owner: 'zhang',
    stage: 'need',
  },
  {
    id: 11,
    title: '全球客服系統整合',
    co: 'asus',
    amt: 1500,
    prob: 100,
    close: '2026/06/01',
    owner: 'zhang',
    stage: 'won',
  },
  {
    id: 12,
    title: '舊機房維運轉案',
    co: 'fox',
    amt: 700,
    prob: 0,
    close: '2026/05/20',
    owner: 'lin',
    stage: 'lost',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtM(k: number): string {
  if (k >= 1000) return 'NT$ ' + (k / 1000).toFixed(1).replace(/\.0$/, '') + 'M';
  return 'NT$ ' + k + 'K';
}

function isSoon(dateStr: string): boolean {
  const d = new Date(dateStr.replace(/\//g, '-') + 'T00:00:00');
  const now = new Date('2026-06-16');
  const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 30 && diff >= 0;
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconExport() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 15V3M7 8l5-5 5 5" />
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
function IconBoard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="6" height="18" rx="1" />
      <rect x="11" y="3" width="6" height="12" rx="1" />
      <rect x="19" y="3" width="2" height="9" rx="1" />
    </svg>
  );
}
function IconList() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
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
function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 12 22 2" />
      <path d="M12 7v5h5" />
    </svg>
  );
}
function IconCheckMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 7 10 17l-5-5" />
    </svg>
  );
}
function IconBarChart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <rect x="7" y="11" width="3" height="6" />
      <rect x="13" y="7" width="3" height="10" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Opportunities({ showToast }: { showToast: (msg: string) => void }) {
  const [view, setView] = useState<'board' | 'list'>('board');
  const [opps, setOpps] = useState<Opp[]>(INIT_OPPS);
  const [dragOver, setDragOver] = useState<Stage | null>(null);
  const dragId = useRef<number | null>(null);

  function handleDrop(toStage: Stage) {
    const id = dragId.current;
    if (id === null) return;
    const opp = opps.find((o) => o.id === id);
    if (!opp || opp.stage === toStage) return;
    setOpps((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const updated = { ...o, stage: toStage };
        if (toStage === 'won') updated.prob = 100;
        if (toStage === 'lost') updated.prob = 0;
        return updated;
      })
    );
    showToast(opp.title + ' → ' + STAGE_MAP[toStage].nm);
  }

  return (
    <>
      {/* Page header */}
      <div className="cx-lead-head" style={{ marginBottom: 18 }}>
        <div>
          <h1>商機</h1>
          <div className="sub">
            拖曳卡片即可推進銷售階段 — 看板掌握整體管線，列表深入每筆商機的金額、勝率與預計成交日。
          </div>
        </div>
        <div className="actions">
          <button className="cx-btn-outline" onClick={() => showToast('已匯出商機清單 CSV')}>
            <IconExport />
            匯出
          </button>
          <button className="cx-btn-navy" onClick={() => showToast('已開啟「新增商機」面板')}>
            <IconPlus />
            新增商機
          </button>
        </div>
      </div>

      {/* Stat bar */}
      <div className="cx-stat-bar">
        <div className="cx-stat">
          <div className="cx-sic blue">
            <IconTrendUp />
          </div>
          <div>
            <div className="cx-snum money">NT$ 12.4M</div>
            <div className="cx-slbl">開放管線總額</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic violet">
            <IconTarget />
          </div>
          <div>
            <div className="cx-snum violet money">NT$ 6.8M</div>
            <div className="cx-slbl">加權預測金額</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic green">
            <IconCheckMark />
          </div>
          <div>
            <div className="cx-snum green money">NT$ 1.5M</div>
            <div className="cx-slbl">本季已成交</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic orange">
            <IconBarChart />
          </div>
          <div>
            <div className="cx-snum orange">38%</div>
            <div className="cx-slbl">平均勝率</div>
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div className="cx-filter-row">
        <div className="cx-seg">
          <button className={view === 'board' ? 'on' : ''} onClick={() => setView('board')}>
            <IconBoard />
            看板
          </button>
          <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>
            <IconList />
            列表
          </button>
        </div>
        {[
          { label: '負責業務', options: ['全部業務', '張志豪', '陳美華', '林俊傑'] },
          { label: '金額', options: ['全部', 'NT$ 1M 以上', 'NT$ 0.5–1M', 'NT$ 0.5M 以下'] },
          { label: '關閉時間', options: ['本季', '本月', '下季', '全部'] },
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
          共 <b>{opps.length}</b> 筆商機
        </div>
      </div>

      {/* Board view */}
      {view === 'board' && (
        <div className="cx-board">
          {STAGES.map((stage) => {
            const items = opps.filter((o) => o.stage === stage.key);
            const sum = items.reduce((a, o) => a + o.amt, 0);
            return (
              <div
                key={stage.key}
                className={`cx-col${dragOver === stage.key ? ' drag-over' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(stage.key);
                }}
                onDragLeave={(e) => {
                  if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
                    setDragOver(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(null);
                  handleDrop(stage.key);
                  dragId.current = null;
                }}
              >
                <div className="cx-col-head">
                  <div className="ch-top">
                    <span className="dotc" style={{ background: stage.color }} />
                    <span className="ch-nm">{stage.nm}</span>
                    <span className="ch-n">{items.length}</span>
                  </div>
                  <div className="ch-sum">
                    <b>{fmtM(sum)}</b>
                  </div>
                </div>
                <div className="cx-col-body">
                  {items.map((opp) => {
                    const co = CO[opp.co];
                    const own = ASSIGNEES[opp.owner];
                    const soon = opp.stage !== 'won' && opp.stage !== 'lost' && isSoon(opp.close);
                    return (
                      <div
                        key={opp.id}
                        className="cx-ocard"
                        draggable
                        onDragStart={(e) => {
                          dragId.current = opp.id;
                          e.dataTransfer.effectAllowed = 'move';
                          setTimeout(() => {
                            (e.target as HTMLElement).classList.add('dragging');
                          }, 0);
                        }}
                        onDragEnd={(e) => {
                          (e.target as HTMLElement).classList.remove('dragging');
                          dragId.current = null;
                          setDragOver(null);
                        }}
                      >
                        <div className="oc-tagline" style={{ background: stage.color }} />
                        <div className="oc-co">
                          <span className="oc-logo" style={{ background: co.g }}>
                            {co.logo}
                          </span>
                          <span className="oc-coname">{co.nm}</span>
                        </div>
                        <div className="oc-title">{opp.title}</div>
                        <div className="oc-amt">{fmtM(opp.amt)}</div>
                        <div className="oc-prob">
                          <div className="bar">
                            <span style={{ width: `${opp.prob}%`, background: stage.barclr }} />
                          </div>
                          <span className="pct">{opp.prob}%</span>
                        </div>
                        <div className="oc-foot">
                          <span className={`oc-close${soon ? ' soon' : ''}`}>
                            <IconCalendar />
                            {opp.close.slice(5)}
                          </span>
                          <div className="oc-owner" style={{ background: own.g }} title={own.nm}>
                            {own.av}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="cx-opp-list-card">
          <table className="cx-op-tbl">
            <colgroup>
              <col />
              <col style={{ width: 128 }} />
              <col style={{ width: 116 }} />
              <col style={{ width: 132 }} />
              <col style={{ width: 108 }} />
              <col style={{ width: 108 }} />
            </colgroup>
            <thead>
              <tr>
                <th>商機 / 客戶</th>
                <th>階段</th>
                <th className="num">金額</th>
                <th>勝率</th>
                <th>預計關閉</th>
                <th>負責業務</th>
              </tr>
            </thead>
            <tbody>
              {[...opps]
                .sort((a, b) => b.amt - a.amt)
                .map((opp) => {
                  const co = CO[opp.co];
                  const own = ASSIGNEES[opp.owner];
                  const stage = STAGE_MAP[opp.stage];
                  return (
                    <tr key={opp.id} onClick={() => showToast('開啟商機 · ' + opp.title)}>
                      <td>
                        <div className="cx-op-co">
                          <div className="lg" style={{ background: co.g }}>
                            {co.logo}
                          </div>
                          <div className="txt">
                            <div className="on">{opp.title}</div>
                            <div className="cn">{co.nm}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`cx-op-stage ${opp.stage}`}>
                          <span className="pip" />
                          {stage.nm}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="cx-op-amt">{fmtM(opp.amt)}</span>
                      </td>
                      <td>
                        <div className="cx-op-prob">
                          <div className="bar">
                            <span style={{ width: `${opp.prob}%`, background: stage.barclr }} />
                          </div>
                          <span className="pct">{opp.prob}%</span>
                        </div>
                      </td>
                      <td>
                        <span className="cx-op-close">{opp.close}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                          <div
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              background: own.g,
                              display: 'grid',
                              placeItems: 'center',
                              color: '#fff',
                              fontSize: 11,
                              fontWeight: 500,
                              flexShrink: 0,
                            }}
                          >
                            {own.av}
                          </div>
                          <span
                            style={{
                              fontSize: 12.5,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {own.nm}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
