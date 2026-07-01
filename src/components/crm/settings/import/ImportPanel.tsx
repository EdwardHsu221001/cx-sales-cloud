'use client';

import { useState } from 'react';
import { ChevRight } from '../settings.icons';
import type { ImpSrc } from '../settings.types';
import { GRAD, BATCHES, IMP_SOURCE, IMP_STATUS } from '../settings.data';

export default function ImportPanel({
  showToast,
  onNavigate,
  batchOn,
  onOpenBatch,
}: {
  showToast: (msg: string) => void;
  onNavigate: (tab: string) => void;
  batchOn: Record<number, boolean>;
  onOpenBatch: (i: number) => void;
}) {
  const [objFilter, setObjFilter] = useState('');
  const [srcFilter, setSrcFilter] = useState('');
  const [stFilter, setStFilter] = useState('');
  const [impSearch, setImpSearch] = useState('');

  const list = BATCHES.map((b, i) => ({ ...b, on: batchOn[i] ?? b.on, idx: i }));
  const filtered = list.filter((b) => {
    if (objFilter && !b.obj.startsWith(objFilter)) return false;
    if (srcFilter && b.src !== srcFilter) return false;
    if (stFilter && b.status !== stFilter) return false;
    if (impSearch) {
      const q = impSearch.toLowerCase();
      if (!b.name.toLowerCase().includes(q) && !b.file.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalRecs = BATCHES.reduce((s, b) => s + b.ok, 0);
  const pendingCnt = BATCHES.filter(
    (b) => b.status === 'processing' || b.status === 'queued'
  ).length;
  const needAtt = BATCHES.filter((b) => b.status === 'partial' || b.status === 'failed').length;

  const IMP_SRC_ICON: Record<ImpSrc, React.ReactNode> = {
    csv: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h2M8 17h2M14 13h2M14 17h2" />
      </>
    ),
    api: (
      <>
        <path d="M16 18 22 12 16 6" />
        <path d="M8 6 2 12 8 18" />
        <path d="m14 4-4 16" />
      </>
    ),
    manual: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M7 10l5 5 5-5M12 15V3" />
      </>
    ),
  };

  function CountCell({ b }: { b: (typeof filtered)[0] }) {
    if (b.status === 'queued')
      return <span style={{ color: 'var(--cx-text-faint)', fontSize: 12.5 }}>—</span>;
    if (b.status === 'failed')
      return <span style={{ color: '#d6483f', fontSize: 12.5, fontWeight: 500 }}>未匯入</span>;
    if (b.status === 'processing')
      return (
        <div className="cx-miniprog">
          <div className="track">
            <i style={{ width: `${b.prog}%` }} />
          </div>
          <span className="pc">{b.prog}%</span>
        </div>
      );
    return (
      <span className="cx-cnt-cell">
        <span className="ok">{b.ok.toLocaleString()}</span>
        <span className="sep">/</span>
        {b.err > 0 ? (
          <span className="er">{b.err}</span>
        ) : (
          <span style={{ color: 'var(--cx-text-faint)' }}>0</span>
        )}
      </span>
    );
  }

  return (
    <div>
      <div className="cx-crumbs">
        <span>設定</span>
        <ChevRight />
        <span>系統整合</span>
        <ChevRight />
        <span>匯入批次設定</span>
      </div>
      <div className="cx-set-head">
        <div>
          <h1 className="cx-set-title">匯入批次設定</h1>
          <p className="cx-set-desc">
            管理排程與一次性資料匯入、檢視執行結果與錯誤明細，並設定全域重複比對與錯誤處理規則。
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="cx-btn-sec"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}
            onClick={() => showToast('已下載匯入範本（CSV）')}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: 15, height: 15 }}
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
              <path d="M14 2v6h6" />
            </svg>
            下載範本
          </button>
          <button
            className="cx-btn-pri"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}
            onClick={() => onNavigate('importwizard')}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: 15, height: 15 }}
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            匯入精靈
          </button>
        </div>
      </div>

      <div className="cx-stat-bar">
        <div className="cx-sb-item">
          <div className="sic blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M7 10l5 5 5-5M12 15V3" />
            </svg>
          </div>
          <div className="stx">
            <div className="snum">{BATCHES.length}</div>
            <div className="slb">匯入批次</div>
          </div>
        </div>
        <div className="cx-sb-item">
          <div className="sic green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stx">
            <div className="snum green">{totalRecs.toLocaleString()}</div>
            <div className="slb">近 30 日匯入筆數</div>
          </div>
        </div>
        <div className="cx-sb-item">
          <div className="sic orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 12a9 9 0 1 1-6.2-8.5" />
              <path d="M21 3v6h-6" />
            </svg>
          </div>
          <div className="stx">
            <div className="snum orange">{pendingCnt}</div>
            <div className="slb">處理中 / 排隊</div>
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
            <div className={`snum${needAtt > 0 ? ' red' : ''}`}>{needAtt}</div>
            <div className="slb">需處理（失敗 / 部分失敗）</div>
          </div>
        </div>
      </div>

      {/* 預設匯入規則 */}
      <div className="cx-filter-row">
        <select className="cx-fpill" value={objFilter} onChange={(e) => setObjFilter(e.target.value)}>
          <option value="">全部物件</option>
          <option value="名單">名單 Lead</option>
          <option value="客戶帳號">客戶帳號 Account</option>
          <option value="商機">商機 Opportunity</option>
          <option value="聯絡人">聯絡人 Contact</option>
          <option value="產品">產品 Product2</option>
          <option value="保固續約">保固續約 Cisco_Warranty_Renewal__c</option>
        </select>
        <select className="cx-fpill" value={srcFilter} onChange={(e) => setSrcFilter(e.target.value)}>
          <option value="">全部來源</option>
          <option value="csv">CSV 上傳</option>
          <option value="api">API 同步</option>
        </select>
        <select className="cx-fpill" value={stFilter} onChange={(e) => setStFilter(e.target.value)}>
          <option value="">全部狀態</option>
          <option value="scheduled">排程中</option>
          <option value="processing">處理中</option>
          <option value="completed">完成</option>
          <option value="partial">部分失敗</option>
          <option value="failed">失敗</option>
          <option value="queued">排隊中</option>
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
            placeholder="搜尋批次名稱或檔案…"
            value={impSearch}
            onChange={(e) => setImpSearch(e.target.value)}
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
          共 <b>{filtered.length}</b> 個批次
        </div>
      </div>

      <div className="cx-data-card">
        <table className="cx-dt">
          <colgroup>
            <col />
            <col style={{ width: 140 }} />
            <col style={{ width: 138 }} />
            <col style={{ width: 148 }} />
            <col style={{ width: 92 }} />
            <col style={{ width: 148 }} />
            <col style={{ width: 48 }} />
          </colgroup>
          <thead>
            <tr>
              <th>匯入批次</th>
              <th>目標物件</th>
              <th>來源 · 頻率</th>
              <th>筆數（成功 / 失敗）</th>
              <th>狀態</th>
              <th>上次執行</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: '30px',
                    textAlign: 'center',
                    color: 'var(--cx-text-faint)',
                    fontSize: 13,
                    cursor: 'default',
                  }}
                >
                  沒有符合條件的批次
                </td>
              </tr>
            )}
            {filtered.map((b) => (
              <tr key={b.idx} onClick={() => onOpenBatch(b.idx)}>
                <td>
                  <div className="cx-im-name">
                    <div className={`cx-im-tic ${b.src}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {IMP_SRC_ICON[b.src]}
                      </svg>
                    </div>
                    <div className="in-tx">
                      <div className="n">{b.name}</div>
                      <div className="sub">{b.file}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="cx-obj-pill">
                    <span className="od" />
                    {b.obj.split(' ')[0]}
                  </span>
                </td>
                <td style={{ fontSize: 12.5, color: 'var(--cx-text-sub)' }}>
                  {IMP_SOURCE[b.src].tag}
                  <div style={{ fontSize: 11, color: 'var(--cx-text-faint)', marginTop: 2 }}>
                    {b.freq}
                  </div>
                </td>
                <td>
                  <CountCell b={b} />
                </td>
                <td>
                  <span className={`cx-status ${IMP_STATUS[b.status].cls}`}>
                    <span className="pip" />
                    {IMP_STATUS[b.status].lbl}
                  </span>
                </td>
                <td>
                  <div className="cx-fl-lm">
                    <div className="av" style={{ background: GRAD[b.by.g] || '#1e3a5f' }}>
                      {b.by.av}
                    </div>
                    <div className="tx">
                      <div className="n">{b.by.name}</div>
                      <div className="d">{b.by.date}</div>
                    </div>
                  </div>
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
            共 <b>{filtered.length}</b> 個批次
          </div>
        </div>
      </div>
    </div>
  );
}
