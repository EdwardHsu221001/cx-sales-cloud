'use client';

import { useState } from 'react';
import { ChevRight, ResetIcon, SaveIcon, InfoIcon } from '../settings.icons';
import type { RoleKey } from '../settings.types';
import { ROLES, USERS } from '../settings.data';

export default function DiscountPanel({
  showToast,
  onNavigate,
}: {
  showToast: (msg: string) => void;
  onNavigate: (tab: string) => void;
}) {
  const [discountVals, setDiscountVals] = useState<Record<string, number>>(() =>
    Object.fromEntries(Object.entries(ROLES).map(([k, r]) => [k, r.cap]))
  );

  return (
    <div>
      <div className="cx-crumbs">
        <a onClick={() => onNavigate('hub')}>設定</a>
        <ChevRight />
        <span>使用者管理</span>
        <ChevRight />
        <span>角色折扣上限</span>
      </div>
      <div className="cx-set-head">
        <div>
          <h1>角色折扣上限</h1>
          <div className="sub">
            設定各角色於商機 / 報價單可核給的最高折扣百分比。超過上限的報價將自動觸發審核流程。
          </div>
        </div>
        <div className="actions">
          <button
            className="cx-btn-outline"
            onClick={() => {
              setDiscountVals(
                Object.fromEntries(Object.entries(ROLES).map(([k, r]) => [k, r.cap]))
              );
              showToast('已還原為預設值');
            }}
          >
            <ResetIcon />
            還原
          </button>
          <button className="cx-btn-navy" onClick={() => showToast('已儲存角色折扣上限')}>
            <SaveIcon />
            儲存變更
          </button>
        </div>
      </div>

      <div className="cx-disc-note">
        <InfoIcon />
        <div>
          折扣上限與「業務自動化 ›
          審核流程」連動：當業務於報價輸入的折扣超過其角色上限，系統將自動送出審核給上一層主管。系統管理員不受上限限制。
        </div>
      </div>

      <div className="cx-data-card">
        <table className="cx-dt">
          <colgroup>
            <col />
            <col style={{ width: 90 }} />
            <col style={{ width: 300 }} />
            <col style={{ width: 150 }} />
          </colgroup>
          <thead>
            <tr>
              <th>角色</th>
              <th className="num">人數</th>
              <th>折扣上限</th>
              <th>超限行為</th>
            </tr>
          </thead>
          <tbody>
            {(Object.entries(ROLES) as [RoleKey, (typeof ROLES)[RoleKey]][]).map(([k, r]) => {
              const cnt = USERS.filter((u) => u.role === k).length;
              const val = discountVals[k] ?? r.cap;
              const overBadge =
                r.over === 'unlimited' ? (
                  <span className="cx-status active">
                    <span className="pip" />
                    不受限制
                  </span>
                ) : r.over === 'block' ? (
                  <span className="cx-status inactive">
                    <span className="pip" />
                    禁止核給
                  </span>
                ) : (
                  <span className="cx-status pending">
                    <span className="pip" />
                    自動送審核
                  </span>
                );
              return (
                <tr key={k} className="no-hover">
                  <td>
                    <span className="cx-role-tag">
                      <span className="rk" style={{ background: r.color }} />
                      {r.name}
                    </span>
                  </td>
                  <td className="num" style={{ color: 'var(--cx-text-sub)' }}>
                    {cnt}
                  </td>
                  <td>
                    <div className="cx-disc-cap">
                      <div className="track">
                        <i style={{ width: `${val}%` }} />
                      </div>
                      <div className="cx-disc-input">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={val}
                          disabled={r.over === 'unlimited'}
                          onChange={(e) =>
                            setDiscountVals((prev) => ({
                              ...prev,
                              [k]: Math.max(0, Math.min(100, +e.target.value || 0)),
                            }))
                          }
                        />
                        <span className="pct">%</span>
                      </div>
                    </div>
                  </td>
                  <td>{overBadge}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
