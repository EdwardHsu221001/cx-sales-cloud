'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  IconWarn,
  IconPlus,
  IconPhone,
  IconTask,
  IconCalendar,
  IconOpps,
  IconLeads,
  IconArrowUp,
  IconClock,
  IconCheck,
  IconEmail,
} from './icons';

// ─── Static data ─────────────────────────────────────────────────────────────
const FUNNEL_STAGES = [
  { label: '資格確認', width: '100%', color: '#93C5FD', deals: 8, amount: '$2.1M' },
  { label: '需求分析', width: '75%', color: '#60A5FA', deals: 6, amount: '$4.2M' },
  { label: '提案報價', width: '62.5%', color: '#3B82F6', deals: 5, amount: '$3.8M' },
  { label: '議約談判', width: '37.5%', color: '#2563EB', deals: 3, amount: '$1.9M' },
  { label: '成交', width: '12.5%', color: '#1E40AF', deals: 1, amount: '$0.4M' },
];

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
];

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
];

// ─── Activity icon helper ─────────────────────────────────────────────────────
function ActivityIcon({ type }: { type: 'call' | 'email' | 'meet' | 'over' }) {
  if (type === 'call')
    return (
      <div className="cx-act-ic call">
        <IconPhone />
      </div>
    );
  if (type === 'email')
    return (
      <div className="cx-act-ic email">
        <IconEmail />
      </div>
    );
  if (type === 'meet')
    return (
      <div className="cx-act-ic meet">
        <IconCalendar />
      </div>
    );
  return (
    <div className="cx-act-ic over">
      <IconWarn />
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function HomeDashboard() {
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, msg: '' });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const quickMenuRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToast({ visible: true, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (quickMenuOpen && !quickMenuRef.current?.contains(e.target as Node)) {
        setQuickMenuOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [quickMenuOpen]);

  return (
    <>
      {/* Greeting */}
      <div className="cx-greet">
        <div>
          <h1>
            <span style={{ fontWeight: 400 }}>早安，</span>陳小明 👋
          </h1>
          <div className="cx-greet-sub">
            2026 年 6 月 15 日 · 星期日
            <span className="cx-qtag">Q2 · 第 11 週</span>
          </div>
        </div>
        <div className="cx-greet-actions">
          <div className="cx-overdue-badge" onClick={() => showToast('篩選：顯示 2 件逾期任務')}>
            <IconWarn />
            <b>2</b>&nbsp;件逾期任務
          </div>
          <div className="cx-quick-add-wrap" ref={quickMenuRef}>
            <button
              className="cx-btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                setQuickMenuOpen(!quickMenuOpen);
              }}
            >
              <IconPlus />
              快速新增
            </button>
            <div className={`cx-quick-menu ${quickMenuOpen ? 'open' : ''}`}>
              {[
                {
                  label: '記錄通話',
                  bg: 'var(--cx-accent-soft)',
                  color: 'var(--cx-accent)',
                  Icon: IconPhone,
                },
                {
                  label: '新增任務',
                  bg: 'var(--cx-success-soft)',
                  color: '#0f9b6c',
                  Icon: IconTask,
                },
                { label: '安排會議', bg: '#FEF6E0', color: '#D9A406', Icon: IconCalendar },
              ].map(({ label, bg, color, Icon }) => (
                <div
                  key={label}
                  className="cx-qm-item"
                  onClick={() => {
                    setQuickMenuOpen(false);
                    showToast(`已開啟「${label}」面板`);
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
                    setQuickMenuOpen(false);
                    showToast(`已開啟「${label}」面板`);
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
        <div className="cx-kpi">
          <div className="cx-kpi-title">本月達成率</div>
          <div className="cx-kpi-ring">
            <div className="cx-ring">
              <svg width="78" height="78" viewBox="0 0 78 78">
                <circle cx="39" cy="39" r="32" fill="none" stroke="#EFF1F5" strokeWidth="8" />
                <circle
                  cx="39"
                  cy="39"
                  r="32"
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
              <div className="bar">
                <i />
              </div>
            </div>
          </div>
        </div>

        <div className="cx-kpi">
          <div className="cx-kpi-title">商機總值</div>
          <div className="cx-kpi-num">$12.4M</div>
          <div className="cx-kpi-row2">
            <span className="cx-chip up">
              <IconArrowUp />
              +18%
            </span>
            <span className="cx-kpi-sub">vs 上季</span>
          </div>
          <div className="cx-kpi-foot">
            <b>23</b> 筆進行中商機
          </div>
        </div>

        <div className="cx-kpi">
          <div className="cx-kpi-title">新增潛客</div>
          <div className="cx-kpi-num">18</div>
          <div className="cx-kpi-row2">
            <span className="cx-chip up">
              <IconArrowUp />
              +3
            </span>
            <span className="cx-kpi-sub">vs 上月</span>
          </div>
          <div className="cx-kpi-foot">
            <b>6</b> 筆評分為 Hot 🔥
          </div>
        </div>

        <div className="cx-kpi danger">
          <div className="cx-kpi-title">待辦任務</div>
          <div className="cx-kpi-num">7</div>
          <div className="cx-kpi-row2">
            <span className="cx-chip warn">
              <IconClock />2 件逾期
            </span>
          </div>
          <div className="cx-kpi-foot">
            今日到期 <b>3</b> 件 · 本週 <b>4</b> 件
          </div>
        </div>
      </div>

      {/* Mid grid */}
      <div className="cx-mid-grid">
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
                    transition={{ duration: 0.8, delay: 0.12 + i * 0.09, ease: [0.2, 0.8, 0.2, 1] }}
                  />
                </div>
                <div className="val">
                  <b>{stage.deals}</b> 筆 · {stage.amount}
                </div>
              </div>
            ))}
            <div className="cx-funnel-foot">
              <div className="t">本季 Lead → 成交 轉換率</div>
              <div className="v">12.5%</div>
            </div>
          </div>
        </div>

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
                  <td className="r">
                    <span className="cx-amt">{opp.amount}</span>
                  </td>
                  <td>
                    <span className={`cx-stage-pill ${opp.stageClass}`}>{opp.stageLabel}</span>
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
                      <div className="cx-owner-av" style={{ background: opp.ownerBg }}>
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

      {/* Toast */}
      <div className={`cx-toast ${toast.visible ? 'show' : ''}`}>
        <IconCheck />
        <span>{toast.msg}</span>
      </div>
    </>
  );
}
