'use client'

import { useState, useRef, useCallback } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────
type ActType = 'call' | 'mail' | 'meet' | 'note' | 'task'
type DueCls  = 'over' | 'today' | 'soon' | 'later'
type PriCls  = 'high' | 'mid' | 'low'

interface FeedItem {
  type: ActType; title: string; desc: string
  co: keyof typeof CO | null; person: string | null
  who: keyof typeof ASSIGNEES; time: string
  isTask?: boolean; done?: boolean
}
interface FeedGroup { g: string; items: FeedItem[] }
interface Task { title: string; rel: string; due: string; dueCls: DueCls; pri: PriCls; done: boolean }
interface Meeting { d: string; mo: string; title: string; time: string }

// ── Static data ───────────────────────────────────────────────────────────────
const ASSIGNEES = {
  zhang: { nm: '張志豪', av: '張', g: 'linear-gradient(135deg,#60a5fa,#2563eb)' },
  chen:  { nm: '陳美華', av: '陳', g: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
  lin:   { nm: '林俊傑', av: '林', g: 'linear-gradient(135deg,#fbbf24,#f59e0b)' },
  me:    { nm: '陳小明', av: '明', g: 'linear-gradient(135deg,#34D399,#10b981)' },
}

const CO = {
  tsmc:  { nm: '台積電',   logo: '台', g: 'linear-gradient(135deg,#2563eb,#1e3a5f)' },
  fox:   { nm: '鴻海精密', logo: '鴻', g: 'linear-gradient(135deg,#1e3a5f,#122440)' },
  mtk:   { nm: '聯發科技', logo: '聯', g: 'linear-gradient(135deg,#7c3aed,#5b21b6)' },
  wis:   { nm: '緯創資通', logo: '緯', g: 'linear-gradient(135deg,#0ea5e9,#0369a1)' },
  delta: { nm: '台達電子', logo: '台', g: 'linear-gradient(135deg,#dc2626,#991b1b)' },
  asus:  { nm: '華碩電腦', logo: '華', g: 'linear-gradient(135deg,#0891b2,#0e7490)' },
}

const TYPE_LABEL: Record<ActType, string> = {
  call: '通話', mail: 'Email', meet: '會議', note: '備註', task: '任務',
}

const TYPE_PH: Record<ActType, string> = {
  call: '記錄一次通話… 例如：與王協理確認導入時程',
  mail: '記錄一封 Email… 例如：寄送報價單給李經理',
  meet: '記錄一場會議… 例如：與聯發科技術複審',
  note: '寫下一則備註…',
  task: '新增一項任務… 例如：明天回撥研華林協理',
}

const INIT_FEED: FeedGroup[] = [
  { g: '今天', items: [
    { type: 'task', title: '準備台積電智慧製造平台報價簡報', desc: '整理 POC 成效數據與導入時程，下午 4 點前完成初稿。', co: 'tsmc', person: '王俊傑', who: 'me', time: '09:10', isTask: true, done: false },
    { type: 'call', title: '與王協理電話會議', desc: '確認智慧製造平台導入時程，對方希望 Q3 完成 POC，已同步給 PM。', co: 'tsmc', person: '王俊傑', who: 'zhang', time: '08:40' },
    { type: 'mail', title: '寄送能源儀表板 Demo 連結', desc: '台達電子黃處長對即時能耗視覺化反應正面，下週安排內部簡報。', co: 'delta', person: '黃柏翰', who: 'chen', time: '08:05' },
  ]},
  { g: '昨天', items: [
    { type: 'meet', title: '聯發科雲端研發環境 — 合約協商會議', desc: '對方要求 SLA 提升至 99.9%，已回報主管評估可行性。', co: 'mtk', person: '林佳蓉', who: 'chen', time: '16:30' },
    { type: 'task', title: '回覆鴻海倉儲自動化需求問卷', desc: '採購流程需經三層審核，預留兩週緩衝期。', co: 'fox', person: '吳孟潔', who: 'lin', time: '14:15', isTask: true, done: true },
    { type: 'mail', title: '寄送資安監控系統提案報價單', desc: '報價 NT$ 1.2M，已附導入時程表與服務範圍說明。', co: 'tsmc', person: '李欣怡', who: 'zhang', time: '11:20' },
    { type: 'call', title: '緯創資通初次需求電訪', desc: '了解採購規模與導入時程，對方仍在比較階段，需積極跟進。', co: 'wis', person: '陳雅婷', who: 'zhang', time: '10:05' },
  ]},
  { g: '本週稍早', items: [
    { type: 'meet', title: '華碩全球客服系統 — 成交慶功與後續規劃', desc: '系統正式上線，回應時間縮短 35%，討論 AI 客服第二期合作意向。', co: 'asus', person: '劉雅琪', who: 'zhang', time: '週一 15:00' },
    { type: 'note', title: '研華科技標記為風險帳號', desc: '近 90 天無互動，原合約已到期未續，需主管介入挽回。', co: 'delta', person: '林志明', who: 'lin', time: '週一 09:30' },
    { type: 'task', title: '更新 Q2 業績預測報表', desc: '彙整三位業務的加權管線金額，提交給銷售總監。', co: null, person: null, who: 'me', time: '週一 08:00', isTask: true, done: true },
    { type: 'meet', title: '台達電子導入啟動會議', desc: '確認專案範圍與里程碑，雙方 PM 已建立溝通群組。', co: 'delta', person: '黃柏翰', who: 'chen', time: '週一 11:00' },
    { type: 'mail', title: '寄送聯發科 POC 結果報告', desc: '資料分析平台試行成效良好，查詢效能提升 40%。', co: 'mtk', person: '黃信宏', who: 'chen', time: '週一 10:10' },
  ]},
]

const INIT_TASKS: Task[] = [
  { title: '準備台積電報價簡報',       rel: '台積電 · 智慧製造平台', due: '今天 16:00', dueCls: 'today', pri: 'high', done: false },
  { title: '回撥研華林協理續約事宜',   rel: '研華科技',               due: '逾期 2 天',  dueCls: 'over',  pri: 'high', done: false },
  { title: '寄送鴻海倉儲方案修訂版',   rel: '鴻海精密 · 倉儲自動化', due: '逾期 1 天',  dueCls: 'over',  pri: 'mid',  done: false },
  { title: '安排聯發科技術複審會議',   rel: '聯發科技 · 雲端研發',   due: '明天',       dueCls: 'soon',  pri: 'mid',  done: false },
  { title: '更新緯創商機預估金額',     rel: '緯創資通',               due: '6/18',       dueCls: 'soon',  pri: 'low',  done: false },
  { title: '整理本月活動量週報',       rel: '內部',                   due: '6/20',       dueCls: 'later', pri: 'low',  done: false },
]

const MEETINGS: Meeting[] = [
  { d: '17', mo: '六月', title: '台積電 智慧製造平台複審',  time: '14:00 · 線上會議' },
  { d: '18', mo: '六月', title: '聯發科 合約條款確認',      time: '10:30 · 對方公司' },
  { d: '19', mo: '六月', title: '台達電子 專案週會',        time: '15:00 · 線上會議' },
  { d: '23', mo: '六月', title: '華碩 AI 客服第二期啟動',  time: '11:00 · 內湖總部' },
]

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconPhone() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg> }
function IconMail() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 6.5 9 6 9-6"/></svg> }
function IconCalendar() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg> }
function IconEdit() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg> }
function IconTask() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 11 3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11"/></svg> }
function IconSend() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z"/></svg> }
function IconCheck() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg> }
function IconClock() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg> }
function IconPlus() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg> }

function TypeIcon({ t }: { t: ActType }) {
  return (
    <div className={`cx-fic ${t}`}>
      {t === 'call' && <IconPhone />}
      {t === 'mail' && <IconMail />}
      {t === 'meet' && <IconCalendar />}
      {t === 'note' && <IconEdit />}
      {t === 'task' && <IconTask />}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Activities({ showToast }: { showToast: (msg: string) => void }) {
  const [logType, setLogType]       = useState<ActType>('call')
  const [logVal, setLogVal]         = useState('')
  const [filter, setFilter]         = useState<ActType | 'all'>('all')
  const [feed, setFeed]             = useState<FeedGroup[]>(INIT_FEED)
  const [tasks, setTasks]           = useState<Task[]>(INIT_TASKS)

  const inputRef = useRef<HTMLInputElement>(null)

  const overdue = tasks.filter(t => !t.done && t.dueCls === 'over').length

  const doLog = useCallback(() => {
    const v = logVal.trim()
    if (!v) { showToast('請先輸入內容'); return }
    const label = TYPE_LABEL[logType]
    const snippet = v.length > 14 ? v.slice(0, 14) + '…' : v
    showToast(`已記錄 ${label}：${snippet}`)
    setLogVal('')
    inputRef.current?.focus()
  }, [logVal, logType, showToast])

  function toggleFeedItem(groupIdx: number, itemIdx: number) {
    setFeed(prev => prev.map((g, gi) =>
      gi !== groupIdx ? g : {
        ...g,
        items: g.items.map((it, ii) =>
          ii !== itemIdx ? it : { ...it, done: !it.done }
        ),
      }
    ))
    const item = feed[groupIdx].items[itemIdx]
    showToast(item.done ? '任務已重新開啟' : '任務已完成')
  }

  function toggleTask(i: number) {
    setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, done: !t.done } : t))
    showToast(tasks[i].done ? '任務已重新開啟' : `任務已完成 · ${tasks[i].title}`)
  }

  const visibleFeed: FeedGroup[] = filter === 'all' ? feed : feed.map(g => ({
    ...g, items: g.items.filter(it => it.type === filter),
  })).filter(g => g.items.length > 0)

  const totalCount = feed.reduce((acc, g) => acc + g.items.length, 0)

  return (
    <>
      {/* Header */}
      <div className="cx-lead-head" style={{ marginBottom: 18 }}>
        <div>
          <h1>活動與任務</h1>
          <div className="sub">所有通話、Email、會議與任務的統一時間軸 — 快速記錄每次互動，待辦一目了然。</div>
        </div>
        <div className="actions">
          <button className="cx-btn-outline" onClick={() => showToast('已切換至行事曆檢視')}>
            <IconCalendar />行事曆
          </button>
          <button className="cx-btn-navy" onClick={() => showToast('已開啟「新增任務」面板')}>
            <IconPlus />新增任務
          </button>
        </div>
      </div>

      {/* Stat bar */}
      <div className="cx-stat-bar" style={{ marginBottom: 18 }}>
        <div className="cx-stat">
          <div className="cx-sic blue"><IconTask /></div>
          <div><div className="cx-snum">7</div><div className="cx-slbl">今日待辦</div></div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic red"><IconClock /></div>
          <div><div className="cx-snum red">{overdue}</div><div className="cx-slbl">逾期任務</div></div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic green"><IconCheck /></div>
          <div><div className="cx-snum green">24</div><div className="cx-slbl">本週已完成</div></div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic orange"><IconCalendar /></div>
          <div><div className="cx-snum orange">5</div><div className="cx-slbl">未來 7 天會議</div></div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="cx-act-layout">
        {/* Left: composer + feed */}
        <div>
          {/* Composer */}
          <div className="cx-composer">
            <div className="cx-type-pills">
              {(['call', 'mail', 'meet', 'note', 'task'] as ActType[]).map(t => (
                <div
                  key={t}
                  className={`cx-type-pill${logType === t ? ' on' : ''}`}
                  onClick={() => { setLogType(t); setLogVal('') }}
                >
                  {t === 'call' && <IconPhone />}
                  {t === 'mail' && <IconMail />}
                  {t === 'meet' && <IconCalendar />}
                  {t === 'note' && <IconEdit />}
                  {t === 'task' && <IconTask />}
                  {TYPE_LABEL[t]}
                </div>
              ))}
            </div>
            <div className="cx-crow">
              <input
                ref={inputRef}
                className="cx-cinput"
                value={logVal}
                onChange={e => setLogVal(e.target.value)}
                placeholder={TYPE_PH[logType]}
                onKeyDown={e => { if (e.key === 'Enter') doLog() }}
              />
              <button className="cx-btn-log" onClick={doLog}>
                <IconSend />記錄
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="cx-feed-tabs">
            <div className={`cx-ftab${filter === 'all' ? ' on' : ''}`} onClick={() => setFilter('all')}>
              全部 <span className="tn">{totalCount}</span>
            </div>
            {(['task', 'call', 'mail', 'meet'] as ActType[]).map(t => (
              <div key={t} className={`cx-ftab${filter === t ? ' on' : ''}`} onClick={() => setFilter(t)}>
                {t === 'task' && <IconTask />}
                {t === 'call' && <IconPhone />}
                {t === 'mail' && <IconMail />}
                {t === 'meet' && <IconCalendar />}
                {TYPE_LABEL[t]}
              </div>
            ))}
          </div>

          {/* Feed */}
          <div className="cx-feed-card">
            {visibleFeed.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--cx-text-faint)', fontSize: 13 }}>
                此類型目前沒有活動記錄
              </div>
            ) : visibleFeed.map((group, gi) => {
              const grpIdx = feed.indexOf(group) >= 0 ? feed.indexOf(group) : gi
              return (
                <div key={group.g} className="cx-date-group">
                  <div className="cx-dg-label">
                    {group.g}
                    <span className="dn">{group.items.length} 筆</span>
                  </div>
                  {group.items.map((item, ii) => {
                    const who = ASSIGNEES[item.who]
                    const realGi = feed.findIndex(g => g.g === group.g)
                    const realIi = feed[realGi]?.items.findIndex(
                      it => it.title === item.title && it.time === item.time
                    ) ?? ii
                    return (
                      <div key={ii} className={`cx-fi${item.done ? ' done' : ''}`}>
                        {item.isTask ? (
                          <div
                            className={`cx-tchk${item.done ? ' on' : ''}`}
                            onClick={() => toggleFeedItem(realGi, realIi)}
                          >
                            <IconCheck />
                          </div>
                        ) : (
                          <TypeIcon t={item.type} />
                        )}
                        <div className="cx-fbody">
                          <div className="cx-ftitle">
                            {item.title}
                            <span className="cx-ftype-tag">{TYPE_LABEL[item.type]}</span>
                          </div>
                          <div className="cx-fdesc">{item.desc}</div>
                          <div className="cx-fmeta">
                            {item.co && (
                              <span className="cx-rel-chip">
                                <span className="rl" style={{ background: CO[item.co].g }}>{CO[item.co].logo}</span>
                                {CO[item.co].nm}
                              </span>
                            )}
                            {item.person && (
                              <span className="cx-rel-chip person">
                                <span className="rl">{item.person[0]}</span>
                                {item.person}
                              </span>
                            )}
                            <span className="cx-fwho">
                              <span className="wav" style={{ background: who.g }}>{who.av}</span>
                              {who.nm}
                            </span>
                            <span className="cx-ftime">{item.time}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: tasks + meetings */}
        <div>
          {/* Task panel */}
          <div className="cx-side-card">
            <div className="cx-sc-head">
              <h3>我的待辦</h3>
              {overdue > 0 && <span className="cx-sc-n">{overdue} 逾期</span>}
              <div className="sp" />
              <span className="cx-sc-addt" onClick={() => showToast('已開啟「新增任務」面板')}>
                <IconPlus />新增
              </span>
            </div>
            {tasks.map((t, i) => (
              <div key={i} className={`cx-task${t.done ? ' done' : ''}`}>
                <div
                  className={`cx-tchk${t.done ? ' on' : ''}`}
                  onClick={() => toggleTask(i)}
                >
                  <IconCheck />
                </div>
                <div className="cx-task-body">
                  <div className="cx-tt">{t.title}</div>
                  <div className="cx-task-meta">
                    <span className={`cx-pri ${t.pri}`} />
                    <span className={`cx-due ${t.dueCls}`}>
                      <IconClock />{t.due}
                    </span>
                    <span className="cx-trel">{t.rel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Meetings panel */}
          <div className="cx-side-card">
            <div className="cx-sc-head">
              <h3>即將到來的會議</h3>
            </div>
            {MEETINGS.map((m, i) => (
              <div key={i} className="cx-mtg">
                <div className="cx-mt-date">
                  <div className="d">{m.d}</div>
                  <div className="mo">{m.mo}</div>
                </div>
                <div className="cx-mt-body">
                  <div className="cx-mt-tt">{m.title}</div>
                  <div className="cx-mt-meta">
                    <IconClock />{m.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
