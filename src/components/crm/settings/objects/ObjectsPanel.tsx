'use client';

import { useState } from 'react';
import { ChevRight, PlusIcon } from '../settings.icons';
import { OBJ_ITEMS, OBJ_ICON_STYLE } from '../settings.data';

export default function ObjectsPanel({
  showToast,
  onNavigate,
  onOpenObject,
}: {
  showToast: (msg: string) => void;
  onNavigate: (tab: string) => void;
  onOpenObject: (api: string) => void;
}) {
  const [objTab, setObjTab] = useState<'std' | 'custom'>('std');
  const filtered = OBJ_ITEMS.filter((o) => (objTab === 'std' ? o.std : !o.std));
  const stdCount = OBJ_ITEMS.filter((o) => o.std).length;
  const cusCount = OBJ_ITEMS.filter((o) => !o.std).length;

  return (
    <div>
      <div className="cx-crumbs">
        <a onClick={() => onNavigate('hub')}>設定</a>
        <ChevRight />
        <span>物件與欄位</span>
        <ChevRight />
        <span>物件管理員</span>
      </div>
      <div className="cx-set-head">
        <div>
          <h1>物件管理員</h1>
          <div className="sub">管理標準與自訂物件 — 定義欄位、頁面版面、觸發程序與驗證規則。</div>
        </div>
        <div className="actions">
          <button className="cx-btn-navy" onClick={() => showToast('已開啟「新增自訂物件」精靈')}>
            <PlusIcon />
            新增自訂物件
          </button>
        </div>
      </div>

      <div className="cx-seg" style={{ marginBottom: 18 }}>
        <button className={objTab === 'std' ? 'on' : ''} onClick={() => setObjTab('std')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
            <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
          </svg>
          標準物件
          <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 2 }}>({stdCount})</span>
        </button>
        <button className={objTab === 'custom' ? 'on' : ''} onClick={() => setObjTab('custom')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
          自訂物件
          <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 2 }}>({cusCount})</span>
        </button>
      </div>

      <div className="cx-data-card">
        <table className="cx-dt">
          <colgroup>
            <col />
            <col />
            <col />
            <col />
            <col />
            <col style={{ width: 48 }} />
          </colgroup>
          <thead>
            <tr>
              <th>物件</th>
              <th>API Name</th>
              <th>類型</th>
              <th>紀錄數</th>
              <th>欄位</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((obj) => {
              const ic = OBJ_ICON_STYLE[obj.g];
              return (
                <tr key={obj.api} onClick={() => onOpenObject(obj.api)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <div
                        className="cx-omgmt-icon"
                        style={{
                          background: ic.bg,
                          color: ic.color,
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          fontSize: 13,
                          flexShrink: 0,
                        }}
                      >
                        {obj.icon}
                      </div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{obj.nm}</div>
                    </div>
                  </td>
                  <td
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 11.5,
                      color: 'var(--cx-text-sub)',
                    }}
                  >
                    {obj.api}
                  </td>
                  <td>
                    <span className={`cx-tag-inline${!obj.std ? ' custom' : ''}`}>
                      {obj.std ? '標準' : '自訂'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--cx-text-sub)' }}>{obj.records.toLocaleString()}</td>
                  <td style={{ color: 'var(--cx-text-sub)', fontSize: 12.5 }}>
                    {obj.fields} 個
                    {obj.customFields > 0 && (
                      <span style={{ color: 'var(--cx-text-faint)', marginLeft: 4 }}>
                        ({obj.customFields} 自訂)
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="cx-row-arr">
                      <ChevRight />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="cx-pager">
          <div className="info">
            共 <b>{filtered.length}</b> 個{objTab === 'std' ? '標準' : '自訂'}物件
          </div>
        </div>
      </div>
    </div>
  );
}
