'use client';

import { useState } from 'react';
import { ChevRight, PlusIcon, MonitorIcon } from '../settings.icons';
import type { FlowTrig } from '../settings.types';
import { FLOWS, FLOW_TRIGGER } from '../settings.data';

export default function FlowPanel({
  showToast,
  flowOn,
  onOpenFlow,
  onFlowToggle,
}: {
  showToast: (msg: string) => void;
  flowOn: Record<number, boolean>;
  onOpenFlow: (i: number) => void;
  onFlowToggle: (i: number) => void;
}) {
  const [trigFilter, setTrigFilter] = useState<FlowTrig | ''>('');
  const [statusFilter, setStatusFilter] = useState('');
  const [healthFilter, setHealthFilter] = useState('');
  const [flowSearch, setFlowSearch] = useState('');

  const list = FLOWS.map((f, i) => ({ ...f, on: flowOn[i] ?? f.on, idx: i }));
  const filtered = list.filter((f) => {
    if (trigFilter && f.trig !== trigFilter) return false;
    if (statusFilter === 'on' && !f.on) return false;
    if (statusFilter === 'off' && f.on) return false;
    if (healthFilter === 'err' && f.fail7 === 0) return false;
    if (healthFilter === 'ok' && f.fail7 > 0) return false;
    if (flowSearch) {
      const q = flowSearch.toLowerCase();
      if (!f.name.toLowerCase().includes(q) && !f.api.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const activeCount = list.filter((f) => f.on).length;
  const failFlows = list.filter((f) => f.fail7 > 0).length;
  const totalRuns = list.reduce((s, f) => s + f.runs7, 0);

  function TrigSvg({ k }: { k: FlowTrig }) {
    if (k === 'record')
      return (
        <>
          <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />
        </>
      );
    if (k === 'schedule')
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      );
    return (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    );
  }

  const GRAD_FL: Record<string, string> = {
    navy: '#1e3a5f',
    green: '#16a34a',
    violet: '#7c3aed',
    blue: '#2563eb',
    amber: '#b45309',
    rose: '#be123c',
  };

  return (
    <div>
      <div className="cx-crumbs">
        <span>設定</span>
        <ChevRight />
        <span>自動化流程 Flow</span>
      </div>
      <div className="cx-set-head">
        <div>
          <h1 className="cx-set-title">自動化流程 Flow</h1>
          <p className="cx-set-desc">管理記錄觸發、排程與畫面流程，監控執行狀態與錯誤。</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="cx-btn-sec"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}
            onClick={() => showToast('已開啟執行監控')}
          >
            <MonitorIcon />
            執行監控
          </button>
          <button
            className="cx-btn-pri"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}
            onClick={() => showToast('已開啟新增流程精靈')}
          >
            <PlusIcon />
            新增流程
          </button>
        </div>
      </div>

      <div className="cx-stat-bar">
        <div className="cx-sb-item">
          <div className="sic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M9 9h6M9 12h6M9 15h4" />
            </svg>
          </div>
          <div className="stx">
            <div className="snum">{FLOWS.length}</div>
            <div className="slb">流程總數</div>
          </div>
        </div>
        <div className="cx-sb-item">
          <div className="sic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stx">
            <div className="snum">{activeCount}</div>
            <div className="slb">啟用中</div>
          </div>
        </div>
        <div className="cx-sb-item">
          <div className="sic red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="stx">
            <div className={`snum${failFlows > 0 ? ' red' : ''}`}>{failFlows}</div>
            <div className="slb">近 7 日有失敗</div>
          </div>
        </div>
        <div className="cx-sb-item">
          <div className="sic">
            <MonitorIcon />
          </div>
          <div className="stx">
            <div className="snum">{totalRuns.toLocaleString()}</div>
            <div className="slb">近 7 日執行次數</div>
          </div>
        </div>
      </div>

      <div className="cx-filter-row">
        <select
          className="cx-fpill"
          value={trigFilter}
          onChange={(e) => setTrigFilter(e.target.value as FlowTrig | '')}
        >
          <option value="">所有觸發類型</option>
          <option value="record">記錄觸發</option>
          <option value="schedule">排程</option>
          <option value="screen">畫面流程</option>
        </select>
        <select
          className="cx-fpill"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">所有狀態</option>
          <option value="on">啟用中</option>
          <option value="off">已停用</option>
        </select>
        <select
          className="cx-fpill"
          value={healthFilter}
          onChange={(e) => setHealthFilter(e.target.value)}
        >
          <option value="">所有健康度</option>
          <option value="ok">無失敗</option>
          <option value="err">有失敗</option>
        </select>
        <div className="cx-fsearch">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 14, height: 14, color: 'var(--cx-text-faint)' }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            placeholder="搜尋流程名稱或 API Name…"
            value={flowSearch}
            onChange={(e) => setFlowSearch(e.target.value)}
          />
        </div>
        <div
          style={{
            marginLeft: 'auto',
            fontSize: 12,
            color: 'var(--cx-text-faint)',
            whiteSpace: 'nowrap',
            alignSelf: 'center',
          }}
        >
          共 <b>{filtered.length}</b> 個流程
        </div>
      </div>

      <div className="cx-data-card">
        <table className="cx-dt">
          <colgroup>
            <col />
            <col style={{ width: 110 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 80 }} />
            <col />
            <col style={{ width: 64 }} />
            <col style={{ width: 48 }} />
          </colgroup>
          <thead>
            <tr>
              <th>流程</th>
              <th>觸發類型</th>
              <th>近 7 日失敗</th>
              <th>執行次數</th>
              <th>最後修改</th>
              <th>狀態</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.api} onClick={() => onOpenFlow(f.idx)}>
                <td>
                  <div className="cx-fl-name">
                    <div className={`cx-fl-tic ${f.trig}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <TrigSvg k={f.trig} />
                      </svg>
                    </div>
                    <div className="fn-tx">
                      <div className="n">
                        {f.name}
                        <span className="cx-fl-vbadge">v{f.ver}</span>
                      </div>
                      <div className="sub">
                        {f.api} · {f.obj}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`cx-fl-type-tag ${f.trig}`}>{FLOW_TRIGGER[f.trig].tag}</span>
                </td>
                <td>
                  <span className={`cx-fl-err${f.fail7 > 0 ? ' has' : ' none'}`}>
                    {f.fail7 > 0 && <span className="ed" />}
                    {f.fail7 > 0 ? `${f.fail7} 次` : '無'}
                  </span>
                </td>
                <td style={{ color: 'var(--cx-text-sub)' }}>{f.runs7.toLocaleString()}</td>
                <td>
                  <div className="cx-fl-lm">
                    <div className="av" style={{ background: GRAD_FL[f.lm.g] || '#1e3a5f' }}>
                      {f.lm.av}
                    </div>
                    <div className="tx">
                      <div className="n">{f.lm.name}</div>
                      <div className="d">{f.lm.date}</div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    onFlowToggle(f.idx);
                  }}
                >
                  <span className={`cx-fl-toggle${f.on ? '' : ' off'}`} />
                </td>
                <td>
                  <div className="cx-row-arr">
                    <ChevRight />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="cx-pager">
          <div className="info">
            共 <b>{filtered.length}</b> 個流程
          </div>
        </div>
      </div>
    </div>
  );
}
