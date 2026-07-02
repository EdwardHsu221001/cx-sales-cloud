'use client';

import { useState } from 'react';
import { IconSearch } from '../../common/icons';
import {
  ChevRight,
  CheckIcon,
  PlusIcon,
  ExportIcon,
  UserGrpIcon,
  CheckCircle,
  LicIcon,
  ClockIcon,
} from '../settings.icons';
import { ROLES, USERS, GRAD } from '../settings.data';
import { StatusBadge } from '../settings.components';

function PermChips({ perms }: { perms: string[] }) {
  if (!perms.length) return <span className="cx-perm-none">—</span>;
  const show = perms.slice(0, 2);
  const extra = perms.length - show.length;
  return (
    <div className="cx-perm-chips">
      {show.map((p) => (
        <span key={p} className="cx-perm-chip">
          {p}
        </span>
      ))}
      {extra > 0 && <span className="cx-perm-more">+{extra}</span>}
    </div>
  );
}

export default function UsersPanel({
  showToast,
  onNavigate,
  onOpenUser,
}: {
  showToast: (msg: string) => void;
  onNavigate: (tab: string) => void;
  onOpenUser: (i: number) => void;
}) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [userSearch, setUserSearch] = useState('');

  const filteredUsers = USERS.filter(
    (u) => u.name.includes(userSearch) || u.email.includes(userSearch)
  );
  const activeCount = USERS.filter((u) => u.status === 'active').length;
  const pendingCount = USERS.filter((u) => u.status === 'pending').length;
  const allSel = selectedRows.size === USERS.length;

  function toggleRow(i: number) {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }
  function toggleAll() {
    if (selectedRows.size === USERS.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(USERS.map((_, i) => i)));
  }

  return (
    <div>
      <div className="cx-crumbs">
        <a onClick={() => onNavigate('hub')}>設定</a>
        <ChevRight />
        <span>使用者管理</span>
        <ChevRight />
        <span>使用者清單與角色指派</span>
      </div>
      <div className="cx-set-head">
        <div>
          <h1>使用者清單與角色指派</h1>
          <div className="sub">
            管理系統使用者、指派角色與 Profile、套用 Permission Set。點擊任一列檢視與編輯指派。
          </div>
        </div>
        <div className="actions">
          <button className="cx-btn-outline" onClick={() => showToast('已匯出使用者清單 CSV')}>
            <ExportIcon />
            匯出
          </button>
          <button className="cx-btn-navy" onClick={() => showToast('已開啟「新增使用者」面板')}>
            <PlusIcon />
            新增使用者
          </button>
        </div>
      </div>

      {/* Stat bar */}
      <div className="cx-stat-bar">
        <div className="cx-stat">
          <div className="cx-sic blue">
            <UserGrpIcon />
          </div>
          <div>
            <div className="cx-snum">{USERS.length}</div>
            <div className="cx-slbl">全部使用者</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic green">
            <CheckCircle />
          </div>
          <div>
            <div className="cx-snum green">{activeCount}</div>
            <div className="cx-slbl">啟用中</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic" style={{ background: '#EDE9FE', color: '#6d28d9' }}>
            <LicIcon />
          </div>
          <div>
            <div className="cx-snum">
              {USERS.length}{' '}
              <small style={{ fontSize: 13, color: 'var(--cx-text-faint)', fontWeight: 500 }}>
                / 25
              </small>
            </div>
            <div className="cx-slbl">授權席次已使用</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic orange">
            <ClockIcon />
          </div>
          <div>
            <div className="cx-snum" style={{ color: '#ea7a1e' }}>
              {pendingCount}
            </div>
            <div className="cx-slbl">待啟用</div>
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div className="cx-filter-row">
        <div className="cx-fpill">
          <span className="fl">角色</span>
          <select onChange={(e) => showToast('已套用篩選 · 角色：' + e.target.value)}>
            <option>全部角色</option>
            {Object.values(ROLES).map((r) => (
              <option key={r.name}>{r.name}</option>
            ))}
          </select>
        </div>
        <div className="cx-fpill">
          <span className="fl">狀態</span>
          <select onChange={(e) => showToast('已套用篩選 · 狀態：' + e.target.value)}>
            <option>全部</option>
            <option>啟用中</option>
            <option>停用</option>
            <option>待啟用</option>
          </select>
        </div>
        <div className="cx-fsearch">
          <IconSearch />
          <input
            type="text"
            placeholder="搜尋姓名或 Email…"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
        </div>
        <div className="cx-filter-count">
          共 <b>{filteredUsers.length}</b> 位
        </div>
      </div>

      {/* Table */}
      <div className="cx-data-card">
        <table className="cx-dt">
          <colgroup>
            <col style={{ width: 42 }} />
            <col />
            <col style={{ width: 120 }} />
            <col style={{ width: 108 }} />
            <col style={{ width: 188 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 48 }} />
          </colgroup>
          <thead>
            <tr>
              <th>
                <div className={`cx-chk ${allSel ? 'on' : ''}`} onClick={toggleAll}>
                  {allSel && <CheckIcon />}
                </div>
              </th>
              <th>使用者</th>
              <th>角色</th>
              <th>Profile</th>
              <th>Permission Sets</th>
              <th>狀態</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, idx) => {
              const r = ROLES[u.role];
              const origIdx = USERS.indexOf(u);
              const sel = selectedRows.has(origIdx);
              return (
                <tr key={u.email} className={sel ? 'sel' : ''} onClick={() => onOpenUser(origIdx)}>
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRow(origIdx);
                    }}
                  >
                    <div className={`cx-chk ${sel ? 'on' : ''}`}>{sel && <CheckIcon />}</div>
                  </td>
                  <td>
                    <div className="cx-u-id">
                      <div className="cx-u-av" style={{ background: GRAD[u.g] }}>
                        {u.av}
                      </div>
                      <div className="txt">
                        <div className="nm">{u.name}</div>
                        <div className="em">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="cx-role-tag">
                      <span className="rk" style={{ background: r.color }} />
                      {r.name}
                    </span>
                  </td>
                  <td>
                    <span className="cx-prof-tag">{u.profile}</span>
                  </td>
                  <td>
                    <PermChips perms={u.perms} />
                  </td>
                  <td>
                    <StatusBadge s={u.status} />
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
            顯示 <b>1–{filteredUsers.length}</b> 位，共 <b>{filteredUsers.length}</b> 位
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--cx-text-sub)' }}>每頁 25 筆</div>
        </div>
      </div>
    </div>
  );
}
