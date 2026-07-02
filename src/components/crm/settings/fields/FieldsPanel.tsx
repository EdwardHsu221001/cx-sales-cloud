'use client';

import { useState } from 'react';
import { IconSearch } from '../../common/icons';
import { ChevRight, ChevLeft, PlusIcon } from '../settings.icons';
import { OBJ_ITEMS, OBJ_ICON_STYLE } from '../settings.data';
import type { FieldRow } from '../settings.types';

// 各物件的欄位清單 mock 資料（FieldsPanel 專屬）。
const FIELDS_DATA: Record<string, { total: number; custom: number; rows: FieldRow[] }> = {
  Account: {
    total: 148,
    custom: 12,
    rows: [
      { label: 'Account Name', api: 'Name', type: 'Text(255)', status: 'STANDARD' },
      { label: 'Industry', api: 'Industry', type: 'Picklist', status: 'STANDARD' },
      { label: 'SLA Expiration Date', api: 'SLAExpirationDate__c', type: 'Date', status: 'CUSTOM' },
      { label: 'Tier Level', api: 'TierLevel__c', type: 'Picklist (Multi)', status: 'CUSTOM' },
      { label: 'Total Value', api: 'TotalValue__c', type: 'Currency(16,2)', status: 'CUSTOM' },
      { label: 'Website', api: 'Website', type: 'URL', status: 'STANDARD' },
    ],
  },
  Contact: {
    total: 62,
    custom: 5,
    rows: [
      { label: 'First Name', api: 'FirstName', type: 'Text(40)', status: 'STANDARD' },
      { label: 'Last Name', api: 'LastName', type: 'Text(80)', status: 'STANDARD' },
      { label: 'Email', api: 'Email', type: 'Email', status: 'STANDARD' },
      { label: 'Phone', api: 'Phone', type: 'Phone', status: 'STANDARD' },
      { label: 'LINE ID', api: 'LINE_ID__c', type: 'Text(100)', status: 'CUSTOM' },
      { label: 'Priority', api: 'Priority__c', type: 'Picklist', status: 'CUSTOM' },
    ],
  },
  Opportunity: {
    total: 54,
    custom: 8,
    rows: [
      { label: 'Opportunity Name', api: 'Name', type: 'Text(120)', status: 'STANDARD' },
      { label: 'Amount', api: 'Amount', type: 'Currency', status: 'STANDARD' },
      { label: 'Stage', api: 'StageName', type: 'Picklist', status: 'STANDARD' },
      { label: 'Close Date', api: 'CloseDate', type: 'Date', status: 'STANDARD' },
      { label: 'Discount', api: 'Discount__c', type: 'Percent(0–100)', status: 'CUSTOM' },
      { label: 'Cisco Call ID', api: 'CiscoCallId__c', type: 'Text(64)', status: 'CUSTOM' },
    ],
  },
  Lead: {
    total: 43,
    custom: 3,
    rows: [
      { label: 'First Name', api: 'FirstName', type: 'Text(40)', status: 'STANDARD' },
      { label: 'Last Name', api: 'LastName', type: 'Text(80)', status: 'STANDARD' },
      { label: 'Company', api: 'Company', type: 'Text(255)', status: 'STANDARD' },
      { label: 'Status', api: 'Status', type: 'Picklist', status: 'STANDARD' },
      { label: 'Lead Source', api: 'LeadSource', type: 'Picklist', status: 'STANDARD' },
      { label: 'Score', api: 'Score__c', type: 'Number(3,0)', status: 'CUSTOM' },
    ],
  },
  Quote__c: {
    total: 28,
    custom: 28,
    rows: [
      { label: 'Quote Name', api: 'Name', type: 'Auto Number', status: 'STANDARD' },
      { label: 'Status', api: 'Status__c', type: 'Picklist', status: 'CUSTOM' },
      { label: 'Total Amount', api: 'TotalAmount__c', type: 'Currency(16,2)', status: 'CUSTOM' },
      { label: 'Discount', api: 'Discount__c', type: 'Percent(0–100)', status: 'CUSTOM' },
      { label: 'Valid Until', api: 'ValidUntil__c', type: 'Date', status: 'CUSTOM' },
      { label: 'Approval Status', api: 'ApprovalStatus__c', type: 'Picklist', status: 'CUSTOM' },
    ],
  },
  ServiceContract__c: {
    total: 22,
    custom: 22,
    rows: [
      { label: 'Contract Name', api: 'Name', type: 'Auto Number', status: 'STANDARD' },
      { label: 'Status', api: 'Status__c', type: 'Picklist', status: 'CUSTOM' },
      { label: 'Start Date', api: 'StartDate__c', type: 'Date', status: 'CUSTOM' },
      { label: 'End Date', api: 'EndDate__c', type: 'Date', status: 'CUSTOM' },
      {
        label: 'Contract Value',
        api: 'ContractValue__c',
        type: 'Currency(16,2)',
        status: 'CUSTOM',
      },
      { label: 'Auto Renew', api: 'AutoRenew__c', type: 'Checkbox', status: 'CUSTOM' },
    ],
  },
};

export default function FieldsPanel({
  showToast,
  onNavigate,
  selectedObjApi,
}: {
  showToast: (msg: string) => void;
  onNavigate: (tab: string) => void;
  selectedObjApi: string;
}) {
  const [fieldSearch, setFieldSearch] = useState('');

  const obj = OBJ_ITEMS.find((o) => o.api === selectedObjApi) ?? OBJ_ITEMS[0];
  const fd = FIELDS_DATA[obj.api] ?? { total: obj.fields, custom: obj.customFields, rows: [] };
  const ic = OBJ_ICON_STYLE[obj.g];

  const filteredRows = fd.rows.filter(
    (r) =>
      !fieldSearch ||
      r.label.toLowerCase().includes(fieldSearch.toLowerCase()) ||
      r.api.toLowerCase().includes(fieldSearch.toLowerCase())
  );

  return (
    <div>
      {/* 麵包屑 */}
      <div className="cx-crumbs">
        <a onClick={() => onNavigate('hub')}>設定</a>
        <ChevRight />
        <span>物件與欄位</span>
        <ChevRight />
        <a onClick={() => onNavigate('objects')}>物件管理員</a>
        <ChevRight />
        <span>{obj.nm}</span>
      </div>

      {/* 標頭與動作按鈕 */}
      <div className="cx-set-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            className="cx-omgmt-icon"
            style={{
              background: ic.bg,
              color: ic.color,
              width: 46,
              height: 46,
              borderRadius: 13,
              fontSize: 17,
              flexShrink: 0,
            }}
          >
            {obj.icon}
          </div>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              {obj.nm}
              <span style={{ fontSize: 14, color: 'var(--cx-text-faint)', fontWeight: 400 }}>
                ({obj.api})
              </span>
            </h1>
            <div className="sub">管理 {obj.nm} 物件的欄位定義、資料類型與欄位層級安全性。</div>
          </div>
        </div>
        <div className="actions" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            className="cx-btn-outline"
            onClick={() => onNavigate('objects')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <ChevLeft /> 物件管理員
          </button>
          <button className="cx-btn-navy" onClick={() => showToast('已開啟「新增欄位」精靈')}>
            <PlusIcon />
            新增欄位
          </button>
        </div>
      </div>

      {/* 篩選與搜尋列 */}
      <div className="cx-filter-row">
        <div className="cx-fsearch" style={{ flex: 1, maxWidth: 280 }}>
          <IconSearch />
          <input
            type="text"
            placeholder="篩選欄位名稱或 API…"
            value={fieldSearch}
            onChange={(e) => setFieldSearch(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div className="cx-filter-count">
          共 <b>{filteredRows.length}</b> 個欄位
        </div>
      </div>

      {/* 資料表格 */}
      <div className="cx-data-card">
        <table className="cx-dt">
          <colgroup>
            <col style={{ width: '28%' }} />
            <col style={{ width: '28%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '8%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>欄位標籤</th>
              <th>API 名稱</th>
              <th>資料類型</th>
              <th>類型</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.api} onClick={() => showToast(`開啟欄位：${row.label}`)}>
                <td style={{ fontWeight: 500, color: 'var(--cx-accent)', cursor: 'pointer' }}>
                  {row.label}
                </td>
                <td
                  style={{ fontFamily: 'monospace', fontSize: 11.5, color: 'var(--cx-text-sub)' }}
                >
                  {row.api}
                </td>
                <td style={{ color: 'var(--cx-text-sub)', fontSize: 12.5 }}>{row.type}</td>
                <td>
                  <span className={`cx-field-status ${row.status === 'CUSTOM' ? 'custom' : 'std'}`}>
                    {row.status === 'CUSTOM' ? '自訂' : '標準'}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--cx-accent)',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast(`編輯欄位：${row.label}`);
                    }}
                  >
                    Edit
                  </span>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr className="no-hover">
                <td
                  colSpan={5}
                  style={{
                    textAlign: 'center',
                    padding: '28px 0',
                    color: 'var(--cx-text-faint)',
                    fontSize: 13,
                  }}
                >
                  找不到符合的欄位
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 分頁器 */}
        <div className="cx-pager">
          <div className="info">
            顯示 <b>1–{filteredRows.length}</b>，共 <b>{fd.total}</b> 個欄位
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="cx-pg nav" disabled>
              <ChevLeft />
            </button>
            <button className="cx-pg nav" onClick={() => showToast('下一頁')}>
              <ChevRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
