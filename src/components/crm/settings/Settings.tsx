'use client';

import { useState, useCallback, Fragment } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevRight,
  ChevLeft,
  CheckIcon,
  XIcon,
  PlusIcon,
  EditIcon,
  ClipIcon,
  LockIcon,
  LoginIcon,
  IconSettingsCenter,
} from './settings.icons';
import {
  ROLES,
  USERS,
  GRAD,
  FLOWS,
  FLOW_TRIGGER,
  FLOW_RUNS,
  FLOW_VERSIONS,
  BATCHES,
  IMP_SOURCE,
  IMP_STATUS,
  IMP_ERRORS,
  IMP_MAPPING,
  IMP_RECORDS,
  PROFILES,
  PERMSETS,
  PERM_ASSIGNED,
  STATUS_MAP,
  OBJ_ITEMS,
} from './settings.data';
import { NAV_GROUPS } from './settings.nav';
import { StatusBadge } from './settings.components';
import type {
  FlowTrig,
  DiagramStep,
  RunEntry,
  VerEntry,
  ImpSrc,
  MapRow,
  ImpRecEntry,
} from './settings.types';
import DiscountPanel from './discount/DiscountPanel';
import RolesPanel from './roles/RolesPanel';
import FlowPanel from './flow/FlowPanel';
import ImportPanel from './import/ImportPanel';
import ImportWizardPanel from './import/ImportWizardPanel';
import EmailPanel from './email/EmailPanel';
import PageLayoutPanel from './pagelayout/PageLayoutPanel';
import HubPanel from './hub/HubPanel';
import ProfilesPanel from './profiles/ProfilesPanel';
import PermSetsPanel from './permsets/PermSetsPanel';
import PlaceholderPanel from './placeholder/PlaceholderPanel';
import UsersPanel from './users/UsersPanel';
import ObjectsPanel from './objects/ObjectsPanel';
import FieldsPanel from './fields/FieldsPanel';

const OBJECTS = [
  { nm: '客戶帳號', api: 'Account' },
  { nm: '聯絡人', api: 'Contact' },
  { nm: '商機', api: 'Opportunity' },
  { nm: '潛在客戶', api: 'Lead' },
  { nm: '活動 / 任務', api: 'Activity' },
  { nm: '報表', api: 'Report' },
];
const ACCESS: Record<string, boolean[][]> = {
  full: OBJECTS.map(() => [true, true, true, true]),
  rw: [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 0],
  ].map((r) => r.map(Boolean)),
  std: [
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
  ].map((r) => r.map(Boolean)),
  support: [
    [1, 0, 1, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
  ].map((r) => r.map(Boolean)),
  ro: OBJECTS.map(() => [true, false, false, false]),
};

// ── Sub-components ────────────────────────────────────────────────────────────

// ── Detail Drawer ─────────────────────────────────────────────────────────────
interface DrawerState {
  open: boolean;
  type: 'user' | 'profile' | 'permset' | 'flow' | 'batch';
  index: number;
  tab: string;
}

function DetailDrawer({
  state,
  onClose,
  onStep,
  onTabChange,
  showToast,
  toggleStates,
  onToggle,
  flowOn,
  onFlowToggle,
  batchOn,
  onBatchToggle,
}: {
  state: DrawerState;
  onClose: () => void;
  onStep: (d: number) => void;
  onTabChange: (tab: string) => void;
  showToast: (msg: string) => void;
  toggleStates: Record<string, boolean>;
  onToggle: (key: string) => void;
  flowOn: Record<number, boolean>;
  onFlowToggle: (i: number) => void;
  batchOn: Record<number, boolean>;
  onBatchToggle: (i: number) => void;
}) {
  if (!state.open) return null;

  const len =
    state.type === 'user'
      ? USERS.length
      : state.type === 'profile'
        ? PROFILES.length
        : state.type === 'flow'
          ? FLOWS.length
          : state.type === 'batch'
            ? BATCHES.length
            : PERMSETS.length;

  function UserContent() {
    const u = USERS[state.index];
    const r = ROLES[u.role];
    const st = STATUS_MAP[u.status];
    const tabs = ['overview', 'assign', 'activity'];
    const tabLabels = ['概覽', '角色與權限', '活動歷程'];

    return (
      <>
        <div className="cx-dw-top">
          <div className="cx-dw-bar">
            <span
              className="crumb"
              style={{ fontSize: '11.5px', color: 'var(--cx-text-faint)', fontWeight: 500 }}
            >
              <b style={{ color: 'var(--cx-text-sub)', fontWeight: 500 }}>使用者</b> ／ {u.name}
            </span>
            <div className="sp" style={{ flex: 1 }} />
            <button className="cx-dw-iconbtn" onClick={() => onStep(-1)}>
              <ChevLeft />
            </button>
            <button className="cx-dw-iconbtn" onClick={() => onStep(1)}>
              <ChevRight />
            </button>
            <button className="cx-dw-iconbtn" onClick={onClose}>
              <XIcon />
            </button>
          </div>
          <div className="cx-dw-hero">
            <div className="logo" style={{ background: GRAD[u.g] }}>
              {u.av}
            </div>
            <div className="h-main" style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontSize: 19,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {u.name}
              </h2>
              <div
                className="h-meta cx-dw-hero"
                style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}
              >
                <span className="cx-role-tag">
                  <span className="rk" style={{ background: r.color }} />
                  {r.name}
                </span>
                <StatusBadge s={u.status} />
              </div>
              <div className="h-sub">
                {u.title} · {u.email}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="cx-btn-sm pri" onClick={() => showToast('已開啟編輯面板')}>
                <EditIcon />
                編輯
              </button>
            </div>
          </div>
          <div className="cx-dw-tabs">
            {tabs.map((t, i) => (
              <div
                key={t}
                className={`cx-dw-tab ${state.tab === t ? 'on' : ''}`}
                onClick={() => onTabChange(t)}
              >
                {tabLabels[i]}
              </div>
            ))}
          </div>
        </div>
        <div className="cx-dw-body">
          {state.tab === 'overview' && (
            <>
              <div className="cx-dw-kpi">
                <div className="k">
                  <div className="v">{r.cap}%</div>
                  <div className="l">折扣核給上限</div>
                </div>
                <div className="k">
                  <div className="v">{u.perms.length}</div>
                  <div className="l">Permission Sets</div>
                </div>
                <div className="k">
                  <div className="v" style={{ fontSize: 13, lineHeight: 1.3, paddingTop: 2 }}>
                    {u.last}
                  </div>
                  <div className="l">最後登入</div>
                </div>
              </div>
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>使用者資訊</h3>
                  <div className="sp" style={{ flex: 1 }} />
                  <span
                    className="add"
                    style={{
                      fontSize: 12,
                      color: 'var(--cx-accent)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    onClick={() => showToast('已開啟編輯面板')}
                  >
                    <EditIcon />
                    編輯
                  </span>
                </div>
                <div className="cx-info-grid">
                  <div className="cell">
                    <div className="cl">姓名</div>
                    <div className="cv">{u.name}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">職稱</div>
                    <div className="cv">{u.title}</div>
                  </div>
                  <div className="cell full">
                    <div className="cl">Email</div>
                    <div className="cv">
                      <a href="#" style={{ color: 'var(--cx-accent)', textDecoration: 'none' }}>
                        {u.email}
                      </a>
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">角色</div>
                    <div className="cv">
                      <span className="cx-role-tag">
                        <span className="rk" style={{ background: r.color }} />
                        {r.name}
                      </span>
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">Profile</div>
                    <div className="cv">
                      <span className="cx-prof-tag">{u.profile}</span>
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">啟用日期</div>
                    <div className="cv">{u.since}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">狀態</div>
                    <div className="cv">
                      <StatusBadge s={u.status} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {state.tab === 'assign' && (
            <>
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>角色與折扣上限</h3>
                </div>
                <div className="cx-info-grid">
                  <div className="cell">
                    <div className="cl">角色</div>
                    <div className="cv">
                      <span className="cx-role-tag">
                        <span className="rk" style={{ background: r.color }} />
                        {r.name}
                      </span>
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">折扣核給上限</div>
                    <div className="cv">
                      <b style={{ fontWeight: 500 }}>{r.cap}%</b>&ensp;
                      <span style={{ color: 'var(--cx-text-faint)', fontSize: 11.5 }}>
                        {r.over === 'unlimited'
                          ? '不受限制'
                          : r.over === 'block'
                            ? '禁止核給'
                            : '自動送審核'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>Profile（權限基準）</h3>
                </div>
                <div className="cx-info-grid">
                  <div className="cell full">
                    <div className="cl">指派的 Profile</div>
                    <div className="cv">
                      <span className="cx-prof-tag">{u.profile}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>Permission Sets（疊加權限）</h3>
                  <span
                    className="sh-n"
                    style={{
                      fontSize: 11,
                      color: 'var(--cx-text-faint)',
                      background: 'var(--cx-bg)',
                      padding: '1px 8px',
                      borderRadius: 20,
                      fontWeight: 500,
                    }}
                  >
                    {u.perms.length}
                  </span>
                  <div className="sp" style={{ flex: 1 }} />
                  <span
                    className="add"
                    style={{
                      fontSize: 12,
                      color: 'var(--cx-accent)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    onClick={() => showToast('已開啟指派面板')}
                  >
                    <PlusIcon />
                    指派
                  </span>
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {u.perms.length ? (
                    u.perms.map((p) => (
                      <span
                        key={p}
                        className="cx-perm-chip"
                        style={{ fontSize: 12, padding: '4px 11px' }}
                      >
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="cx-perm-none">尚未指派任何 Permission Set</span>
                  )}
                </div>
              </div>
            </>
          )}
          {state.tab === 'activity' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>活動歷程</h3>
              </div>
              <div className="cx-tl">
                {[
                  {
                    t: 'cx-ti-login',
                    icon: <LoginIcon />,
                    tt: '登入系統',
                    td: '自 IP 203.74.x.x（台北）登入 Sales Cloud。',
                    m: u.last,
                  },
                  {
                    t: 'cx-ti-role',
                    icon: <ClipIcon />,
                    tt: '角色指派變更',
                    td: '由「業務代表」調整為現任角色，折扣上限同步更新。',
                    m: '王淑芬 · 指派',
                  },
                  {
                    t: 'cx-ti-perm',
                    icon: <LockIcon />,
                    tt: '套用 Permission Set',
                    td: '新增「報表匯出」權限集。',
                    m: '王淑芬 · 指派',
                  },
                ].map((a, i) => (
                  <div key={i} className="cx-tl-item">
                    <div className={`ti ${a.t}`}>{a.icon}</div>
                    <div className="tc">
                      <div className="tt">{a.tt}</div>
                      <div className="td">{a.td}</div>
                      <div className="tm">{a.m}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  function ProfileContent() {
    const p = PROFILES[state.index];
    const acc = ACCESS[p.access];
    const tabs = ['objects', 'fls', 'users'];
    const tabLabels = ['物件存取', '欄位安全性', '指派使用者'];
    const assigned = USERS.filter((u) => u.profile === p.name);

    return (
      <>
        <div className="cx-dw-top">
          <div className="cx-dw-bar">
            <span
              className="crumb"
              style={{ fontSize: '11.5px', color: 'var(--cx-text-faint)', fontWeight: 500 }}
            >
              <b style={{ color: 'var(--cx-text-sub)', fontWeight: 500 }}>Profile</b> ／ {p.name}
            </span>
            <div className="sp" style={{ flex: 1 }} />
            <button className="cx-dw-iconbtn" onClick={() => onStep(-1)}>
              <ChevLeft />
            </button>
            <button className="cx-dw-iconbtn" onClick={() => onStep(1)}>
              <ChevRight />
            </button>
            <button className="cx-dw-iconbtn" onClick={onClose}>
              <XIcon />
            </button>
          </div>
          <div className="cx-dw-hero">
            <div
              className="logo sq"
              style={{
                background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <ClipIcon />
            </div>
            <div className="h-main" style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 19, fontWeight: 500 }}>{p.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
                <span className={`cx-lic-tag ${p.lic === 'platform' ? 'platform' : ''}`}>
                  {p.license}
                </span>
                <span className="cx-prof-tag">{p.users} 位使用者</span>
              </div>
              <div className="h-sub">{p.desc}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="cx-btn-sm pri" onClick={() => showToast('已開啟編輯面板')}>
                <EditIcon />
                編輯
              </button>
            </div>
          </div>
          <div className="cx-dw-tabs">
            {tabs.map((t, i) => (
              <div
                key={t}
                className={`cx-dw-tab ${state.tab === t ? 'on' : ''}`}
                onClick={() => onTabChange(t)}
              >
                {tabLabels[i]}
              </div>
            ))}
          </div>
        </div>
        <div className="cx-dw-body">
          {state.tab === 'objects' && (
            <>
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>物件存取權限</h3>
                  <div className="sp" style={{ flex: 1 }} />
                  <span
                    className="add"
                    style={{
                      fontSize: 12,
                      color: 'var(--cx-accent)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    onClick={() => showToast('已開啟編輯面板')}
                  >
                    <EditIcon />
                    編輯
                  </span>
                </div>
                <table className="cx-oa-tbl">
                  <thead>
                    <tr>
                      <th className="obj">物件</th>
                      <th>讀取</th>
                      <th>建立</th>
                      <th>編輯</th>
                      <th>刪除</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OBJECTS.map((o, oi) => {
                      const a = acc[oi];
                      return (
                        <tr key={o.api}>
                          <td className="obj">
                            {o.nm}
                            <div className="api">{o.api}</div>
                          </td>
                          {a.map((v, vi) => (
                            <td key={vi}>
                              {v ? (
                                <span className="cx-perm-yes">
                                  <CheckIcon />
                                </span>
                              ) : (
                                <span className="cx-perm-no">
                                  <XIcon />
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>系統權限</h3>
                  <span
                    className="sh-n"
                    style={{
                      fontSize: 11,
                      color: 'var(--cx-text-faint)',
                      background: 'var(--cx-bg)',
                      padding: '1px 8px',
                      borderRadius: 20,
                      fontWeight: 500,
                    }}
                  >
                    {p.sys.length}
                  </span>
                </div>
                <div className="cx-perm-list">
                  {p.sys.map((s) => (
                    <div key={s} className="cx-pl-row">
                      <div className="cx-pl-m">
                        <div className="n">{s}</div>
                      </div>
                      <span className="cx-perm-yes">
                        <CheckIcon />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {state.tab === 'fls' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>欄位層級安全性</h3>
                <div className="sp" style={{ flex: 1 }} />
                <span style={{ fontSize: '11.5px', color: 'var(--cx-text-faint)' }}>
                  物件：商機
                </span>
              </div>
              <div className="cx-perm-list">
                {[
                  [
                    '金額',
                    'Amount',
                    p.access === 'full' || p.access === 'rw'
                      ? '可編輯'
                      : p.access === 'ro'
                        ? '隱藏'
                        : '唯讀',
                  ],
                  [
                    '折扣百分比',
                    'Discount__c',
                    p.access === 'full' ? '可編輯' : p.access === 'ro' ? '隱藏' : '唯讀',
                  ],
                  ['預計關閉日', 'CloseDate', '可見'],
                  ['負責業務', 'OwnerId', p.access === 'ro' ? '唯讀' : '可見'],
                  ['成本', 'Cost__c', p.access === 'full' ? '可編輯' : '隱藏'],
                ].map(([nm, api, val]) => {
                  const cls = val === '隱藏' ? 'inactive' : val === '唯讀' ? 'pending' : 'active';
                  return (
                    <div key={api} className="cx-pl-row">
                      <div className="cx-pl-m">
                        <div className="n">{nm}</div>
                        <div className="d">{api}</div>
                      </div>
                      <span className={`cx-status ${cls}`}>
                        <span className="pip" />
                        {val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {state.tab === 'users' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>指派此 Profile 的使用者</h3>
                <span
                  className="sh-n"
                  style={{
                    fontSize: 11,
                    color: 'var(--cx-text-faint)',
                    background: 'var(--cx-bg)',
                    padding: '1px 8px',
                    borderRadius: 20,
                    fontWeight: 500,
                  }}
                >
                  {assigned.length}
                </span>
              </div>
              {assigned.length ? (
                assigned.map((u) => {
                  const r2 = ROLES[u.role];
                  return (
                    <div key={u.email} className="cx-assign-row">
                      <div className="av" style={{ background: GRAD[u.g] }}>
                        {u.av}
                      </div>
                      <div className="am">
                        <div className="n">{u.name}</div>
                        <div className="t">
                          {u.title} · {r2.name}
                        </div>
                      </div>
                      <button
                        className="x"
                        title="移除指派"
                        onClick={() => showToast('已移除指派')}
                      >
                        <XIcon />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    color: 'var(--cx-text-faint)',
                    fontSize: 12.5,
                  }}
                >
                  尚無使用者指派此 Profile
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  function PermSetContent() {
    const p = PERMSETS[state.index];
    const tabs = ['perms', 'users'];
    const tabLabels = ['啟用的權限', '指派使用者'];
    const assigned = (PERM_ASSIGNED[p.name] || []).map((idx) => USERS[idx]);

    return (
      <>
        <div className="cx-dw-top">
          <div className="cx-dw-bar">
            <span
              className="crumb"
              style={{ fontSize: '11.5px', color: 'var(--cx-text-faint)', fontWeight: 500 }}
            >
              <b style={{ color: 'var(--cx-text-sub)', fontWeight: 500 }}>Permission Set</b> ／{' '}
              {p.name}
            </span>
            <div className="sp" style={{ flex: 1 }} />
            <button className="cx-dw-iconbtn" onClick={() => onStep(-1)}>
              <ChevLeft />
            </button>
            <button className="cx-dw-iconbtn" onClick={() => onStep(1)}>
              <ChevRight />
            </button>
            <button className="cx-dw-iconbtn" onClick={onClose}>
              <XIcon />
            </button>
          </div>
          <div className="cx-dw-hero">
            <div
              className="logo sq"
              style={{
                background: 'linear-gradient(135deg,#60a5fa,#2563eb)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <LockIcon />
            </div>
            <div className="h-main" style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontSize: 19,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {p.name} <span className={`cx-type-tag ${p.type}`}>{p.typeL}</span>
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
                <span className="cx-prof-tag">{p.users} 位已指派</span>
              </div>
              <div className="h-sub">{p.desc}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="cx-btn-sm pri" onClick={() => showToast('已開啟編輯面板')}>
                <EditIcon />
                編輯
              </button>
            </div>
          </div>
          <div className="cx-dw-tabs">
            {tabs.map((t, i) => (
              <div
                key={t}
                className={`cx-dw-tab ${state.tab === t ? 'on' : ''}`}
                onClick={() => onTabChange(t)}
              >
                {tabLabels[i]}
              </div>
            ))}
          </div>
        </div>
        <div className="cx-dw-body">
          {state.tab === 'perms' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>此權限集啟用的權限</h3>
                <span
                  className="sh-n"
                  style={{
                    fontSize: 11,
                    color: 'var(--cx-text-faint)',
                    background: 'var(--cx-bg)',
                    padding: '1px 8px',
                    borderRadius: 20,
                    fontWeight: 500,
                  }}
                >
                  {p.perms.length}
                </span>
              </div>
              <div className="cx-perm-list">
                {p.perms.map(([name, desc, on]) => {
                  const k = `${p.name}::${name}`;
                  const active = toggleStates[k] ?? on;
                  return (
                    <div key={name} className="cx-pl-row">
                      <div className="cx-pl-m">
                        <div className="n">{name}</div>
                        <div className="d">{desc}</div>
                      </div>
                      <span
                        className={`cx-toggle ${active ? '' : 'off'}`}
                        onClick={() => onToggle(k)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {state.tab === 'users' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>已指派使用者</h3>
                <span
                  className="sh-n"
                  style={{
                    fontSize: 11,
                    color: 'var(--cx-text-faint)',
                    background: 'var(--cx-bg)',
                    padding: '1px 8px',
                    borderRadius: 20,
                    fontWeight: 500,
                  }}
                >
                  {assigned.length}
                </span>
                <div className="sp" style={{ flex: 1 }} />
                <span
                  className="add"
                  style={{
                    fontSize: 12,
                    color: 'var(--cx-accent)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  onClick={() => showToast('已開啟指派面板')}
                >
                  <PlusIcon />
                  指派
                </span>
              </div>
              {assigned.length ? (
                assigned.map((u) => {
                  const r2 = ROLES[u.role];
                  return (
                    <div key={u.email} className="cx-assign-row">
                      <div className="av" style={{ background: GRAD[u.g] }}>
                        {u.av}
                      </div>
                      <div className="am">
                        <div className="n">{u.name}</div>
                        <div className="t">
                          {u.title} · {r2.name}
                        </div>
                      </div>
                      <button
                        className="x"
                        title="移除指派"
                        onClick={() => showToast('已移除指派')}
                      >
                        <XIcon />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    color: 'var(--cx-text-faint)',
                    fontSize: 12.5,
                  }}
                >
                  尚無指派
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  function FlowContent() {
    const f = FLOWS[state.index];
    const on = flowOn[state.index] ?? f.on;
    const runs =
      (FLOW_RUNS as Record<number | 'default', RunEntry[]>)[state.index] ?? FLOW_RUNS.default;
    const vers =
      (FLOW_VERSIONS as Record<number | 'default', VerEntry[]>)[state.index] ??
      FLOW_VERSIONS.default;
    const okCount = runs.filter((r) => r.ok).length;
    const successRate = runs.length ? Math.round((okCount / runs.length) * 100) : 100;
    const trigInfo = FLOW_TRIGGER[f.trig];

    function TrigSvg({ k }: { k: FlowTrig | string }) {
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
    function NodeSvg({ k }: { k: string }) {
      if (k === 'get')
        return (
          <>
            <ellipse cx="12" cy="6" rx="8" ry="3" />
            <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
            <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
          </>
        );
      if (k === 'decision') return <path d="M12 3 21 12l-9 9-9-9Z" />;
      if (k === 'update')
        return (
          <>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </>
        );
      if (k === 'create')
        return (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M12 8v8M8 12h8" />
          </>
        );
      if (k === 'action')
        return (
          <>
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </>
        );
      if (k === 'screen')
        return (
          <>
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </>
        );
      if (k === 'assign')
        return (
          <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="m16 11 2 2 4-4" />
          </>
        );
      return null;
    }
    const FKIND: Record<string, string> = {
      get: '取得記錄',
      update: '更新記錄',
      create: '建立記錄',
      action: '動作',
      screen: '畫面',
      assign: '指派',
      decision: '決策',
    };

    function FNode({ s }: { s: DiagramStep }) {
      if (s.start)
        return (
          <div className="cx-fnode start">
            <div className="cx-fic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <TrigSvg k={s.trig!} />
              </svg>
            </div>
            <div className="cx-ftx">
              <div className="fl">{trigInfo.kind}</div>
              <div className="ft">{s.label}</div>
              {s.sub && <div className="fs">{s.sub}</div>}
            </div>
          </div>
        );
      if (s.end)
        return (
          <div className={`cx-fnode end${s.stop ? ' stop' : ''}`}>
            <span className="ed" />
            <span className="et">{s.label}</span>
          </div>
        );
      const icCls = s.decision ? 'decision' : s.ic || '';
      return (
        <div className={`cx-fnode${s.decision ? ' decision-node' : ''}`}>
          <div className={`cx-fic ${icCls}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <NodeSvg k={icCls} />
            </svg>
          </div>
          <div className="cx-ftx">
            <div className="fl">{FKIND[icCls] || ''}</div>
            <div className="ft">{s.label}</div>
            {s.sub && <div className="fs">{s.sub}</div>}
          </div>
        </div>
      );
    }

    function FlowDiagram({ steps }: { steps: DiagramStep[] }) {
      return (
        <div className="cx-fdiag">
          {steps.map((s, i) => (
            <Fragment key={i}>
              {i > 0 && <div className="cx-fconn" />}
              <FNode s={s} />
              {s.decision && (
                <>
                  <div className="cx-fconn" />
                  <div className="cx-fbranches">
                    {s.yes && (
                      <div className="cx-flane">
                        <div className="cx-fblabel yes">是</div>
                        {s.yes.map((n, j) => (
                          <Fragment key={j}>
                            <div className="cx-fconn short" />
                            <FNode s={n} />
                          </Fragment>
                        ))}
                      </div>
                    )}
                    {s.no && (
                      <div className="cx-flane">
                        <div className="cx-fblabel no">否</div>
                        {s.no.map((n, j) => (
                          <Fragment key={j}>
                            <div className="cx-fconn short" />
                            <FNode s={n} />
                          </Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </Fragment>
          ))}
        </div>
      );
    }

    const tabDefs = [
      { key: 'overview', label: '概覽' },
      { key: 'versions', label: '版本' },
      { key: 'runs', label: '執行紀錄' },
    ];

    return (
      <>
        <div className="cx-dw-top">
          <div className="cx-dw-bar">
            <span
              className="crumb"
              style={{ fontSize: '11.5px', color: 'var(--cx-text-faint)', fontWeight: 500 }}
            >
              <b style={{ color: 'var(--cx-text-sub)', fontWeight: 500 }}>流程</b> ／ {f.name}
            </span>
            <div className="sp" style={{ flex: 1 }} />
            <button className="cx-dw-iconbtn" onClick={() => onStep(-1)}>
              <ChevLeft />
            </button>
            <button className="cx-dw-iconbtn" onClick={() => onStep(1)}>
              <ChevRight />
            </button>
            <button className="cx-dw-iconbtn" onClick={onClose}>
              <XIcon />
            </button>
          </div>
          <div className="cx-dw-hero">
            <div
              className={`cx-fl-tic ${f.trig} logo sq`}
              style={{ width: 50, height: 50, borderRadius: 14 }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: 24, height: 24 }}
              >
                <TrigSvg k={f.trig} />
              </svg>
            </div>
            <div className="h-main" style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 17, fontWeight: 600 }}>{f.name}</h2>
              <div
                className="h-meta"
                style={{ display: 'flex', gap: 7, marginTop: 6, flexWrap: 'wrap' }}
              >
                <span className={`cx-fl-type-tag ${f.trig}`}>{trigInfo.tag}</span>
                <span className={`cx-status ${on ? 'active' : 'inactive'}`}>
                  {on ? '啟用' : '停用'}
                </span>
                {f.fail7 > 0 && (
                  <span
                    className="cx-status inactive"
                    style={{ background: '#FEF2F2', color: '#d6483f' }}
                  >
                    有失敗
                  </span>
                )}
              </div>
              <div className="h-sub">{f.desc}</div>
            </div>
          </div>
          <div className="cx-dw-tabs">
            {tabDefs.map((t) => (
              <div
                key={t.key}
                className={`cx-dw-tab ${state.tab === t.key ? 'on' : ''}`}
                onClick={() => onTabChange(t.key)}
              >
                {t.label}
              </div>
            ))}
          </div>
        </div>
        <div className="cx-dw-body">
          {state.tab === 'overview' && (
            <>
              <div className="cx-dw-kpi">
                <div className="k">
                  <div className="v">{f.runs7.toLocaleString()}</div>
                  <div className="l">近 7 日執行</div>
                </div>
                <div className="k">
                  <div className={`v${f.fail7 > 0 ? ' red' : ''}`}>{f.fail7}</div>
                  <div className="l">近 7 日失敗</div>
                </div>
                <div className="k">
                  <div className="v">v{f.ver}</div>
                  <div className="l">目前版本</div>
                </div>
              </div>
              {f.fail7 > 0 && (
                <div
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: 10,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d6483f"
                    strokeWidth="2"
                    style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1 }}
                  >
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <div style={{ fontSize: 12.5, color: '#b91c1c', lineHeight: 1.5 }}>
                    近 7 日有 <b>{f.fail7}</b> 次執行失敗，請查閱執行紀錄以了解錯誤詳情。
                  </div>
                </div>
              )}
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>基本資訊</h3>
                </div>
                <div className="cx-info-grid">
                  <div className="cell">
                    <div className="cl">API Name</div>
                    <div className="cv" style={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {f.api}
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">觸發類型</div>
                    <div className="cv">{trigInfo.lbl}</div>
                  </div>
                  <div className="cell full">
                    <div className="cl">關聯物件</div>
                    <div className="cv">{f.obj}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">最後修改</div>
                    <div className="cv">
                      {f.lm.name} · {f.lm.date}
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">狀態</div>
                    <div className="cv" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        className={`cx-fl-toggle${on ? '' : ' off'}`}
                        onClick={() => onFlowToggle(state.index)}
                      />
                      <span style={{ fontSize: 12.5, color: 'var(--cx-text-sub)' }}>
                        {on ? '啟用中' : '已停用'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>流程圖</h3>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <FlowDiagram steps={f.diagram} />
                </div>
              </div>
            </>
          )}
          {state.tab === 'runs' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>近期執行</h3>
              </div>
              <div style={{ padding: '14px 16px 10px' }}>
                <div style={{ fontSize: 12, color: 'var(--cx-text-sub)', marginBottom: 6 }}>
                  成功率 {successRate}%
                </div>
                <div className="cx-rate-bar">
                  <i style={{ width: `${successRate}%` }} />
                  {successRate < 100 && (
                    <span className="rb-fail" style={{ width: `${100 - successRate}%` }} />
                  )}
                </div>
              </div>
              {runs.map((r, i) => (
                <div key={i} className="cx-run-row">
                  <div className={`cx-run-st ${r.ok ? 'ok' : 'fail'}`}>
                    {r.ok ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
                  </div>
                  <div className="cx-run-m">
                    <div className="rt">{r.t}</div>
                    <div className={`rd${r.ok ? '' : ' err'}`}>{r.d}</div>
                  </div>
                  <div className="cx-run-time">
                    {r.time}
                    <span className="dur">{r.dur}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {state.tab === 'versions' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>版本紀錄</h3>
              </div>
              {vers.map((v, i) => (
                <div
                  key={i}
                  style={{
                    padding: '13px 16px',
                    borderBottom: i < vers.length - 1 ? '1px solid var(--cx-border-soft)' : 'none',
                    display: 'flex',
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 500 }}>{v.v}</span>
                      {v.active && (
                        <span
                          className="cx-status active"
                          style={{ fontSize: 10, padding: '1px 7px' }}
                        >
                          使用中
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--cx-text-sub)', lineHeight: 1.4 }}>
                      {v.note}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'right',
                      flexShrink: 0,
                      fontSize: 11.5,
                      color: 'var(--cx-text-faint)',
                      lineHeight: 1.6,
                    }}
                  >
                    <div>{v.date}</div>
                    <div>{v.by}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  function BatchContent() {
    const b = BATCHES[state.index];
    const on = batchOn[state.index] ?? b.on;
    const src = IMP_SOURCE[b.src];
    const st = IMP_STATUS[b.status];
    const errs = IMP_ERRORS[state.index] || [];
    const mapping =
      (IMP_MAPPING as Record<number | 'default', MapRow[]>)[state.index] ?? IMP_MAPPING.default;
    const showErrTab = b.err > 0 || b.status === 'failed';
    const okCount = mapping.filter((m) => m[3] === 'ok').length;

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
    const SRC_BG: Record<ImpSrc, string> = { api: '#2563eb', manual: '#7c3aed', csv: '#16a34a' };

    const objShort = b.obj.split(' ')[0];
    const okV = b.status === 'failed' || b.status === 'queued' ? '—' : b.ok.toLocaleString();
    const errV = b.status === 'failed' || b.status === 'queued' ? '—' : String(b.err);

    function StatusBlock() {
      if (b.status === 'processing')
        return (
          <div className="cx-dw-sec" style={{ marginBottom: 14 }}>
            <div
              className="sh"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 16px',
                borderBottom: '1px solid var(--cx-border-soft)',
              }}
            >
              <h3 style={{ fontSize: 13, fontWeight: 700 }}>匯入進度</h3>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--cx-accent)' }}>
                {b.prog}%
              </span>
            </div>
            <div style={{ padding: '14px 16px 16px' }}>
              <div className="cx-rate-bar">
                <i
                  style={{
                    width: `${b.prog}%`,
                    background: 'linear-gradient(90deg,#60A5FA,#3B82F6)',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 8,
                  fontSize: 11.5,
                  color: 'var(--cx-text-faint)',
                }}
              >
                <span>
                  已處理 {b.ok.toLocaleString()} / {b.total.toLocaleString()} 筆
                </span>
                <span>預估剩餘 約 3 分鐘</span>
              </div>
            </div>
          </div>
        );
      if (b.status === 'queued')
        return (
          <div
            className="cx-disc-note"
            style={{
              borderLeftColor: 'var(--cx-accent)',
              background: 'var(--cx-accent-soft)',
              marginBottom: 14,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                color: 'var(--cx-accent)',
                width: 16,
                height: 16,
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 7v5l3 2" />
            </svg>
            <div>
              此批次正在排隊中，待前一批次完成後將自動開始匯入 <b>{b.total.toLocaleString()}</b>{' '}
              筆資料。
            </div>
          </div>
        );
      if (b.status === 'failed')
        return (
          <div
            className="cx-disc-note"
            style={{
              borderLeftColor: 'var(--cx-danger)',
              background: 'var(--cx-danger-soft)',
              marginBottom: 14,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: '#d6483f', width: 16, height: 16, flexShrink: 0, marginTop: 1 }}
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>{b.failReason}</div>
          </div>
        );
      if (b.err > 0)
        return (
          <div
            className="cx-disc-note"
            style={{
              borderLeftColor: '#FB923C',
              background: 'var(--cx-warn-soft)',
              marginBottom: 14,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: '#c2691e', width: 16, height: 16, flexShrink: 0, marginTop: 1 }}
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              本次匯入有 <b>{b.err}</b> 筆失敗，請於「錯誤明細」檢視並修正後重新匯入。
            </div>
          </div>
        );
      return (
        <div
          className="cx-disc-note"
          style={{
            borderLeftColor: 'var(--cx-success)',
            background: 'var(--cx-success-soft)',
            marginBottom: 14,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: '#0f9b6c', width: 16, height: 16, flexShrink: 0, marginTop: 1 }}
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div>
            匯入完成，共成功 <b>{b.ok.toLocaleString()}</b> 筆
            {b.skip ? `，略過 ${b.skip} 筆重複` : ''}，耗時 {b.dur}。
          </div>
        </div>
      );
    }

    const records =
      (IMP_RECORDS as Record<number | 'default', ImpRecEntry[]>)[state.index] ??
      IMP_RECORDS.default;
    const tabDefs = [
      { key: 'overview', label: '概覽' },
      { key: 'records', label: '匯入記錄' },
      ...(showErrTab ? [{ key: 'errors', label: '錯誤明細' }] : []),
      { key: 'mapping', label: '欄位對應' },
    ];

    return (
      <>
        <div className="cx-dw-top">
          <div className="cx-dw-bar">
            <span
              className="crumb"
              style={{ fontSize: '11.5px', color: 'var(--cx-text-faint)', fontWeight: 500 }}
            >
              <b style={{ color: 'var(--cx-text-sub)', fontWeight: 500 }}>匯入批次</b> ／ {b.name}
            </span>
            <div className="sp" style={{ flex: 1 }} />
            <button className="cx-dw-iconbtn" onClick={() => onStep(-1)}>
              <ChevLeft />
            </button>
            <button className="cx-dw-iconbtn" onClick={() => onStep(1)}>
              <ChevRight />
            </button>
            <button className="cx-dw-iconbtn" onClick={onClose}>
              <XIcon />
            </button>
          </div>
          <div className="cx-dw-hero">
            <div className="logo sq" style={{ background: SRC_BG[b.src] }}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                style={{ width: 23, height: 23 }}
              >
                {IMP_SRC_ICON[b.src]}
              </svg>
            </div>
            <div className="h-main" style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 17, fontWeight: 600 }}>{b.name}</h2>
              <div
                className="h-meta"
                style={{ display: 'flex', gap: 7, marginTop: 6, flexWrap: 'wrap' }}
              >
                <span className={`cx-status ${st.cls}`}>
                  <span className="pip" />
                  {st.lbl}
                </span>
                <span className="cx-prof-tag">{src.tag}</span>
                <span className="cx-prof-tag">{objShort}</span>
              </div>
              <div className="h-sub">
                {b.file} · {b.freq}
              </div>
            </div>
          </div>
          <div className="cx-dw-tabs">
            {tabDefs.map((t) => (
              <div
                key={t.key}
                className={`cx-dw-tab ${state.tab === t.key ? 'on' : ''}`}
                onClick={() => onTabChange(t.key)}
              >
                {t.label}
                {t.key === 'errors' && (
                  <span className="n">{b.status === 'failed' ? '!' : errs.length}</span>
                )}
                {t.key === 'mapping' && <span className="n">{okCount}</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="cx-dw-body">
          {state.tab === 'overview' && (
            <>
              <div className="cx-dw-kpi">
                <div className="k">
                  <div className="v">{b.total.toLocaleString()}</div>
                  <div className="l">來源總筆數</div>
                </div>
                <div className="k">
                  <div className="v" style={{ color: '#0f9b6c' }}>
                    {okV}
                  </div>
                  <div className="l">成功匯入</div>
                </div>
                <div className="k">
                  <div className={`v${b.err > 0 ? ' red' : ''}`}>{errV}</div>
                  <div className="l">失敗</div>
                </div>
              </div>
              <StatusBlock />
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>批次資訊</h3>
                </div>
                <div className="cx-info-grid">
                  <div className="cell full">
                    <div className="cl">來源檔案 / 端點</div>
                    <div className="cv" style={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {b.file}
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">目標物件</div>
                    <div className="cv">{objShort}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">匯入方式</div>
                    <div className="cv">{src.tag}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">頻率</div>
                    <div className="cv">{b.freq}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">略過重複</div>
                    <div className="cv">{b.skip ? `${b.skip} 筆` : '0 筆'}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">執行者</div>
                    <div className="cv">
                      {b.by.name} · {b.by.date}
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">耗時</div>
                    <div className="cv">{b.dur}</div>
                  </div>
                </div>
              </div>
            </>
          )}
          {state.tab === 'records' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>匯入記錄</h3>
                <span className="sh-n">{records.length}</span>
                <div style={{ flex: 1 }} />
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--cx-accent)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  onClick={() => showToast('已匯出完整記錄 CSV')}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ width: 13, height: 13 }}
                  >
                    <path d="M12 15V3M7 8l5-5 5 5" />
                    <path d="M5 21h14" />
                  </svg>
                  匯出
                </span>
              </div>
              <table className="cx-map-tbl">
                <thead>
                  <tr>
                    <th>記錄 ID</th>
                    <th>名稱</th>
                    <th>狀態</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr key={i}>
                      <td className="src">{r.id}</td>
                      <td>{r.name}</td>
                      <td>
                        {r.status === 'ok' ? (
                          <span className="cx-status active" style={{ fontSize: 11 }}>
                            <span className="pip" />
                            成功
                          </span>
                        ) : r.status === 'skip' ? (
                          <span style={{ fontSize: 11.5, color: 'var(--cx-text-faint)' }}>
                            {r.note || '略過'}
                          </span>
                        ) : (
                          <span style={{ fontSize: 11.5, color: '#d6483f' }}>
                            {r.note || '失敗'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '10px 16px', fontSize: 11.5, color: 'var(--cx-text-faint)' }}>
                顯示前 {records.length} 筆 · 完整清單請匯出 CSV
              </div>
            </div>
          )}
          {state.tab === 'errors' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>錯誤明細</h3>
                {b.status !== 'failed' && <span className="sh-n">{errs.length}</span>}
                <div style={{ flex: 1 }} />
                <span
                  className="add"
                  style={{
                    fontSize: 12,
                    color: 'var(--cx-accent)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  onClick={() => showToast('已匯出錯誤清單')}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ width: 13, height: 13 }}
                  >
                    <path d="M12 15V3M7 8l5-5 5 5" />
                    <path d="M5 21h14" />
                  </svg>
                  匯出錯誤清單
                </span>
              </div>
              {b.status === 'failed' ? (
                <div style={{ padding: '16px' }}>
                  <div className="cx-run-row" style={{ border: 'none', padding: 0 }}>
                    <div className="cx-run-st fail">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                    <div className="cx-run-m">
                      <div className="rt">匯入未啟動</div>
                      <div className="rd err">{b.failReason}</div>
                    </div>
                  </div>
                </div>
              ) : (
                errs.map((er, i) => (
                  <div key={i} className="cx-run-row">
                    <div className="cx-run-st fail">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                    <div className="cx-run-m">
                      <div className="rt">
                        第 {er.row} 列 · {er.id}
                      </div>
                      <div className="rd err">{er.reason}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {state.tab === 'mapping' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>欄位對應</h3>
                <span className="sh-n">{okCount}</span>
                <div style={{ flex: 1 }} />
                <span
                  className="add"
                  style={{
                    fontSize: 12,
                    color: 'var(--cx-accent)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  onClick={() => showToast('已開啟欄位對應編輯')}
                >
                  <EditIcon />
                  編輯對應
                </span>
              </div>
              <table className="cx-map-tbl">
                <thead>
                  <tr>
                    <th>來源欄位</th>
                    <th></th>
                    <th>目標欄位</th>
                  </tr>
                </thead>
                <tbody>
                  {mapping.map((m, i) =>
                    m[3] === 'skip' ? (
                      <tr key={i}>
                        <td className="src">{m[0]}</td>
                        <td className="arr">
                          <ChevRight />
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: 11,
                              color: 'var(--cx-text-faint)',
                              fontStyle: 'italic',
                            }}
                          >
                            略過 — 不匯入
                          </span>
                        </td>
                      </tr>
                    ) : (
                      <tr key={i}>
                        <td className="src">{m[0]}</td>
                        <td className="arr">
                          <ChevRight />
                        </td>
                        <td>
                          <div className="tgt">
                            {m[1]}
                            <div className="api">{m[2]}</div>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="cx-drawer-scrim open" onClick={onClose} />
      <aside className="cx-drawer open">
        {state.type === 'user' && UserContent()}
        {state.type === 'profile' && ProfileContent()}
        {state.type === 'permset' && PermSetContent()}
        {state.type === 'flow' && FlowContent()}
        {state.type === 'batch' && BatchContent()}
      </aside>
    </>
  );
}

// ── Main Settings component ───────────────────────────────────────────────────

export default function Settings({ showToast }: { showToast: (msg: string) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const _segs = pathname
    .replace(/^\/settings\/?/, '')
    .split('/')
    .filter(Boolean);
  const _first = _segs[0] ?? '';
  const activeTab =
    _first === 'objects' && _segs.length >= 2
      ? 'fields'
      : _first === 'import' && _segs[1] === 'importwizard'
        ? 'importwizard'
        : _first || 'hub';
  const selectedObjApi = _first === 'objects' && _segs.length >= 2 ? _segs[1] : '';
  const setActiveTab = (tab: string) => {
    if (tab === 'fields') {
      router.push(`/settings/objects/${selectedObjApi || OBJ_ITEMS[0].api}`);
      return;
    }
    const PATH: Record<string, string> = {
      hub: '/settings',
      users: '/settings/users',
      roles: '/settings/roles',
      profiles: '/settings/profiles',
      permsets: '/settings/permsets',
      discount: '/settings/discount',
      objects: '/settings/objects',
      importwizard: '/settings/import/importwizard',
    };
    router.push(PATH[tab] ?? `/settings/${tab}`);
  };
  const [drawer, setDrawer] = useState<DrawerState>({
    open: false,
    type: 'user',
    index: 0,
    tab: 'overview',
  });
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});

  const [flowOn, setFlowOn] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(FLOWS.map((f, i) => [i, f.on]))
  );
  const [batchOn, setBatchOn] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(BATCHES.map((b, i) => [i, b.on]))
  );

  const openUser = useCallback(
    (i: number) => setDrawer({ open: true, type: 'user', index: i, tab: 'overview' }),
    []
  );
  const openProfile = useCallback(
    (i: number) => setDrawer({ open: true, type: 'profile', index: i, tab: 'objects' }),
    []
  );
  const openPermSet = useCallback(
    (i: number) => setDrawer({ open: true, type: 'permset', index: i, tab: 'perms' }),
    []
  );
  const openFlow = useCallback(
    (i: number) => setDrawer({ open: true, type: 'flow', index: i, tab: 'overview' }),
    []
  );
  const openBatch = useCallback(
    (i: number) => setDrawer({ open: true, type: 'batch', index: i, tab: 'overview' }),
    []
  );
  const closeDrawer = useCallback(() => setDrawer((d) => ({ ...d, open: false })), []);
  const stepDrawer = useCallback((d: number) => {
    setDrawer((prev) => {
      const len =
        prev.type === 'user'
          ? USERS.length
          : prev.type === 'profile'
            ? PROFILES.length
            : prev.type === 'flow'
              ? FLOWS.length
              : prev.type === 'batch'
                ? BATCHES.length
                : PERMSETS.length;
      const ni = (prev.index + d + len) % len;
      const tab =
        prev.type === 'user'
          ? 'overview'
          : prev.type === 'profile'
            ? 'objects'
            : prev.type === 'flow' || prev.type === 'batch'
              ? 'overview'
              : 'perms';
      return { ...prev, index: ni, tab };
    });
  }, []);
  const changeTab = useCallback((tab: string) => setDrawer((d) => ({ ...d, tab })), []);
  const handleToggle = useCallback((key: string) => {
    setToggleStates((prev) => ({ ...prev, [key]: !(prev[key] ?? true) }));
  }, []);
  const handleFlowToggle = useCallback((i: number) => {
    setFlowOn((prev) => ({ ...prev, [i]: !prev[i] }));
  }, []);
  const handleBatchToggle = useCallback(
    (i: number) => {
      setBatchOn((prev) => ({ ...prev, [i]: !prev[i] }));
      showToast(`「${BATCHES[i].name}」排程已${batchOn[i] ? '暫停' : '啟用'}`);
    },
    [batchOn]
  );

  // ── Render ────────────────────────────────────────────────────────────────
  const isFullPanel = [
    'hub',
    'users',
    'roles',
    'profiles',
    'permsets',
    'discount',
    'objects',
    'fields',
    'flow',
    'import',
    'importwizard',
    'pagelayout',
    'email',
  ].includes(activeTab);

  return (
    <>
      <div className="cx-settings-shell">
        {/* ── Left Navigation Rail (DO NOT CHANGE) ── */}
        <nav className="cx-set-nav">
          <div
            className={`cx-sn-home ${activeTab === 'hub' ? 'active' : ''}`}
            onClick={() => setActiveTab('hub')}
          >
            <div className="cx-h-ic">
              <IconSettingsCenter />
            </div>
            <div className="cx-h-tx">
              <div className="t">設定中心</div>
              <div className="s">所有設定模組</div>
            </div>
          </div>

          {NAV_GROUPS.map((group, groupIdx) => (
            <div className="cx-set-group" key={groupIdx}>
              <div className="cx-set-group-label">
                {group.icon}
                {group.label}
              </div>
              {group.items.map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <div
                    key={item.key}
                    className={`cx-sn-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.key)}
                  >
                    <span className="cx-sn-lab">{item.label}</span>
                    {item.ph && <span className="cx-ph-dot" title="設計中" />}
                    {item.cnt && <span className="cnt">{item.cnt}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── Right Content Pane ── */}
        <div className="cx-set-content">
          <div className="cx-set-inner">
            {activeTab === 'hub' && <HubPanel showToast={showToast} onNavigate={setActiveTab} />}
            {activeTab === 'users' && (
              <UsersPanel showToast={showToast} onNavigate={setActiveTab} onOpenUser={openUser} />
            )}
            {activeTab === 'roles' && (
              <RolesPanel showToast={showToast} onNavigate={setActiveTab} />
            )}
            {activeTab === 'profiles' && (
              <ProfilesPanel
                showToast={showToast}
                onNavigate={setActiveTab}
                onOpenProfile={openProfile}
              />
            )}
            {activeTab === 'permsets' && (
              <PermSetsPanel
                showToast={showToast}
                onNavigate={setActiveTab}
                onOpenPermSet={openPermSet}
              />
            )}
            {activeTab === 'discount' && (
              <DiscountPanel showToast={showToast} onNavigate={setActiveTab} />
            )}
            {activeTab === 'objects' && (
              <ObjectsPanel
                showToast={showToast}
                onNavigate={setActiveTab}
                onOpenObject={(api) => router.push(`/settings/objects/${api}`)}
              />
            )}
            {activeTab === 'fields' && (
              <FieldsPanel
                showToast={showToast}
                onNavigate={setActiveTab}
                selectedObjApi={selectedObjApi}
              />
            )}
            {activeTab === 'flow' && (
              <FlowPanel
                showToast={showToast}
                flowOn={flowOn}
                onOpenFlow={openFlow}
                onFlowToggle={handleFlowToggle}
              />
            )}
            {activeTab === 'import' && (
              <ImportPanel
                showToast={showToast}
                onNavigate={setActiveTab}
                batchOn={batchOn}
                onOpenBatch={openBatch}
              />
            )}
            {activeTab === 'importwizard' && (
              <ImportWizardPanel showToast={showToast} onNavigate={setActiveTab} />
            )}
            {activeTab === 'pagelayout' && (
              <PageLayoutPanel showToast={showToast} onNavigate={setActiveTab} />
            )}
            {activeTab === 'email' && (
              <EmailPanel showToast={showToast} onNavigate={setActiveTab} />
            )}
            {!isFullPanel && (
              <PlaceholderPanel
                showToast={showToast}
                onNavigate={setActiveTab}
                activeTab={activeTab}
              />
            )}
          </div>
        </div>
      </div>

      <DetailDrawer
        state={drawer}
        onClose={closeDrawer}
        onStep={stepDrawer}
        onTabChange={changeTab}
        showToast={showToast}
        toggleStates={toggleStates}
        onToggle={handleToggle}
        flowOn={flowOn}
        onFlowToggle={handleFlowToggle}
        batchOn={batchOn}
        onBatchToggle={handleBatchToggle}
      />
    </>
  );
}
