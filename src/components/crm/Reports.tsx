'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

// ── Data ──────────────────────────────────────────────────────────────────────
const BARS = [
  { m: '1月', actual: 2.1, target: 2.5 },
  { m: '2月', actual: 2.6, target: 2.5 },
  { m: '3月', actual: 2.3, target: 2.8 },
  { m: '4月', actual: 3.0, target: 3.0 },
  { m: '5月', actual: 2.8, target: 3.2 },
  { m: '6月', actual: 2.8, target: 3.5 },
]
const BAR_MAX = 4

const FUNNEL = [
  { nm: '潛在客戶', count: 128, clr: 'linear-gradient(90deg,#7eb0ff,#3B82F6)', conv: '' },
  { nm: '需求分析', count: 62,  clr: 'linear-gradient(90deg,#5b9bff,#2563eb)', conv: '48%' },
  { nm: '提案報價', count: 38,  clr: 'linear-gradient(90deg,#6d8ef0,#4f46e5)', conv: '61%' },
  { nm: '議約談判', count: 21,  clr: 'linear-gradient(90deg,#8b6fe8,#6d28d9)', conv: '55%' },
  { nm: '成交',     count: 13,  clr: 'linear-gradient(90deg,#34D399,#0f9b6c)', conv: '62%' },
]

const SRC = [
  { nm: '官網表單', n: 11, clr: '#3B82F6' },
  { nm: '業務介紹', n: 9,  clr: '#7c3aed' },
  { nm: '展覽活動', n: 7,  clr: '#10b981' },
  { nm: '廣告投放', n: 5,  clr: '#fb923c' },
  { nm: '其他',     n: 2,  clr: '#9aa1ae' },
]
const SRC_TOTAL = SRC.reduce((a, s) => a + s.n, 0)

function buildDonut(items: typeof SRC) {
  let acc = 0
  const segs: string[] = []
  items.forEach(s => {
    const start = (acc / SRC_TOTAL) * 100
    acc += s.n
    const end = (acc / SRC_TOTAL) * 100
    segs.push(`${s.clr} ${start}% ${end}%`)
  })
  return `conic-gradient(${segs.join(',')})`
}

const LB = [
  { who: 'zhang', amt: 'NT$ 3.4M', deals: 6, quota: 112 },
  { who: 'me',    amt: 'NT$ 2.6M', deals: 5, quota: 96  },
  { who: 'chen',  amt: 'NT$ 1.8M', deals: 4, quota: 74  },
  { who: 'lin',   amt: 'NT$ 0.8M', deals: 2, quota: 41  },
]
const ASSIGNEES = {
  zhang: { nm: '張志豪', rl: '資深業務',     av: '張', g: 'linear-gradient(135deg,#60a5fa,#2563eb)' },
  me:    { nm: '陳小明', rl: '資深業務經理', av: '明', g: 'linear-gradient(135deg,#34D399,#10b981)' },
  chen:  { nm: '陳美華', rl: '業務經理',     av: '陳', g: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
  lin:   { nm: '林俊傑', rl: '業務專員',     av: '林', g: 'linear-gradient(135deg,#fbbf24,#f59e0b)' },
}

const PERIODS = ['2026 第二季', '2026 第一季', '本月', '近 12 個月']

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconMoney()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
function IconTarget() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg> }
function IconOpps()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17l5-5 4 3 8-8"/><path d="M16 7h4v4"/></svg> }
function IconClock()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg> }
function IconExport() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 21h14"/></svg> }
function IconUp()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M7 17 17 7M9 7h8v8"/></svg> }
function IconDown()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M7 7 17 17M9 17h8V9"/></svg> }

// ── Component ─────────────────────────────────────────────────────────────────
export default function Reports({ showToast }: { showToast: (msg: string) => void }) {
  const [period, setPeriod] = useState(PERIODS[0])

  const gaugePct = 86
  const gaugeGradient = `conic-gradient(#3B82F6 0% ${gaugePct}%, #EDF1F6 ${gaugePct}% 100%)`
  const donutGradient = buildDonut(SRC)
  const funnelMax = FUNNEL[0].count

  return (
    <>
      {/* Header */}
      <div className="cx-lead-head" style={{ marginBottom: 18 }}>
        <div>
          <h1>報表</h1>
          <div className="sub">業績達成、銷售漏斗與活動量的整體分析 — 即時掌握團隊表現與管線健康度。</div>
        </div>
        <div className="actions">
          <div className="cx-fpill">
            <span className="fl">期間</span>
            <select value={period} onChange={e => { setPeriod(e.target.value); showToast(`已切換期間 · ${e.target.value}`) }}>
              {PERIODS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <button className="cx-btn-outline" onClick={() => showToast('已匯出報表 PDF')}>
            <IconExport />匯出報表
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="cx-rpt-kpi-row">
        <div className="cx-rpt-kpi">
          <div className="kl"><span className="cx-ki blue"><IconMoney /></span>本季營收</div>
          <div className="kv">NT$ 8.6M</div>
          <div className="kd"><span className="cx-trend up"><IconUp />18%</span><span className="muted">較上季</span></div>
        </div>
        <div className="cx-rpt-kpi">
          <div className="kl"><span className="cx-ki green"><IconTarget /></span>目標達成率</div>
          <div className="kv">86%</div>
          <div className="kd"><span className="cx-trend up"><IconUp />6%</span><span className="muted">目標 NT$ 10M</span></div>
        </div>
        <div className="cx-rpt-kpi">
          <div className="kl"><span className="cx-ki violet"><IconOpps /></span>新增商機</div>
          <div className="kv">34</div>
          <div className="kd"><span className="cx-trend up"><IconUp />9 筆</span><span className="muted">本季</span></div>
        </div>
        <div className="cx-rpt-kpi">
          <div className="kl"><span className="cx-ki orange"><IconClock /></span>平均成交週期</div>
          <div className="kv">48 <span className="unit">天</span></div>
          <div className="kd"><span className="cx-trend down"><IconDown />5 天</span><span className="muted">縮短，越短越好</span></div>
        </div>
      </div>

      {/* Row 1: bar chart + gauge */}
      <div className="cx-rpt-g2">
        {/* Bar chart */}
        <div className="cx-chart-card">
          <div className="cx-chart-head">
            <div>
              <h3>業績達成趨勢</h3>
              <div className="csub">每月實際營收 vs 目標 · 單位 NT$ 百萬</div>
            </div>
            <div className="cx-legend">
              <span className="cx-lg"><span className="sw" style={{ background: '#3B82F6' }} />實際</span>
              <span className="cx-lg"><span className="sw" style={{ background: '#dbe3ee' }} />目標</span>
            </div>
          </div>
          <div className="cx-barchart">
            {/* Gridlines */}
            {[0, 1, 2, 3, 4].map(v => (
              <div key={v} className="gridline" style={{ bottom: `${(v / BAR_MAX) * 100}%` }}>
                <span className="glabel">{v}</span>
              </div>
            ))}
            {/* Columns */}
            {BARS.map((b, i) => (
              <div key={b.m} className="cx-bcol">
                <div className="bars">
                  <motion.div
                    className="cx-rbar target"
                    initial={{ height: 0 }}
                    animate={{ height: `${(b.target / BAR_MAX) * 100}%` }}
                    transition={{ duration: 0.7, delay: 0.08 + i * 0.07, ease: [0.4, 0, 0.2, 1] }}
                  />
                  <motion.div
                    className="cx-rbar actual"
                    initial={{ height: 0 }}
                    animate={{ height: `${(b.actual / BAR_MAX) * 100}%` }}
                    transition={{ duration: 0.7, delay: 0.12 + i * 0.07, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <span className="cx-bval">{b.actual}</span>
                  </motion.div>
                </div>
                <div className="cx-blabel">{b.m}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Gauge */}
        <div className="cx-chart-card">
          <div className="cx-chart-head">
            <div>
              <h3>季度目標達成</h3>
              <div className="csub">2026 Q2 · 目標 NT$ 10M</div>
            </div>
          </div>
          <div className="cx-gauge-wrap">
            <div className="cx-gauge" style={{ background: gaugeGradient }}>
              <div className="gc">
                <div className="gv">{gaugePct}%</div>
                <div className="gl">已達成</div>
              </div>
            </div>
            <div className="cx-gauge-foot">
              <div className="gf"><div className="v">NT$ 8.6M</div><div className="l">實際營收</div></div>
              <div className="gf"><div className="v" style={{ color: 'var(--cx-text-sub)' }}>NT$ 1.4M</div><div className="l">尚差</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: funnel + source donut */}
      <div className="cx-rpt-g2b">
        {/* Funnel */}
        <div className="cx-chart-card">
          <div className="cx-chart-head">
            <div><h3>銷售漏斗</h3><div className="csub">本季各階段商機轉換</div></div>
          </div>
          <div className="cx-rfunnel">
            {FUNNEL.map((f, i) => {
              const pct = Math.max(28, (f.count / funnelMax) * 100)
              return (
                <div key={f.nm} className="cx-rfstage">
                  <div className="fmeta">
                    <div className="fl">{f.nm}</div>
                    <div className="fr">{f.count} 筆商機</div>
                  </div>
                  <div className="fbar-wrap">
                    <motion.div
                      className="fbar"
                      style={{ background: f.clr }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <span className="fc">{f.count}</span>
                    </motion.div>
                  </div>
                  <div className="fconv">{f.conv ? `↓ ${f.conv}` : ''}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Source donut */}
        <div className="cx-chart-card">
          <div className="cx-chart-head">
            <div><h3>商機來源分布</h3><div className="csub">依首次接觸管道</div></div>
          </div>
          <div className="cx-src-wrap">
            <div className="cx-donut" style={{ background: donutGradient }}>
              <div className="dc">
                <div className="dv">{SRC_TOTAL}</div>
                <div className="dl">總商機</div>
              </div>
            </div>
            <div className="cx-src-legend">
              {SRC.map(s => (
                <div key={s.nm} className="sl">
                  <span className="sw" style={{ background: s.clr }} />
                  <span className="sn">{s.nm}</span>
                  <span className="sv">{s.n}</span>
                  <span className="sp">{Math.round(s.n / SRC_TOTAL * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="cx-lb-card">
        <div className="cx-lb-head"><h3>業務排行榜</h3></div>
        <table className="cx-lb-tbl">
          <colgroup>
            <col style={{ width: 60 }} /><col /><col style={{ width: 130 }} />
            <col style={{ width: 90 }} /><col style={{ width: 240 }} />
          </colgroup>
          <thead>
            <tr>
              <th>排名</th><th>業務</th><th className="num">已成交營收</th>
              <th className="num">成交數</th><th>目標達成</th>
            </tr>
          </thead>
          <tbody>
            {LB.map((r, i) => {
              const a = ASSIGNEES[r.who as keyof typeof ASSIGNEES]
              const over = r.quota >= 100
              return (
                <tr key={r.who}>
                  <td><span className={`cx-rank r${i + 1}`}>{i + 1}</span></td>
                  <td>
                    <div className="cx-lb-rep">
                      <div className="av" style={{ background: a.g }}>{a.av}</div>
                      <div><div className="nm">{a.nm}</div><div className="rl">{a.rl}</div></div>
                    </div>
                  </td>
                  <td><div className="cx-lb-amt">{r.amt}</div></td>
                  <td><div className="cx-num-cell">{r.deals}</div></td>
                  <td>
                    <div className="cx-lb-quota">
                      <div className="cx-qbar">
                        <span
                          className={over ? 'over' : ''}
                          style={{ width: `${Math.min(100, r.quota)}%` }}
                        />
                      </div>
                      <span className="cx-qpct" style={over ? { color: '#0f9b6c' } : {}}>
                        {r.quota}%
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
