'use client';

import { ChevRight, PlusIcon, LockIcon } from '../settings.icons';
import { PERMSETS, PERM_ASSIGNED, USERS, GRAD } from '../settings.data';

export default function PermSetsPanel({
  showToast,
  onNavigate,
  onOpenPermSet,
}: {
  showToast: (msg: string) => void;
  onNavigate: (tab: string) => void;
  onOpenPermSet: (i: number) => void;
}) {
  return (
    <div>
      <div className="cx-crumbs">
        <a onClick={() => onNavigate('hub')}>設定</a>
        <ChevRight />
        <span>使用者管理</span>
        <ChevRight />
        <span>Permission Set 指派</span>
      </div>
      <div className="cx-set-head">
        <div>
          <h1>Permission Set 指派</h1>
          <div className="sub">
            Permission Set 可在 Profile
            基準之上，疊加授予個別使用者額外權限。點擊檢視已啟用權限與指派名單。
          </div>
        </div>
        <div className="actions">
          <button
            className="cx-btn-navy"
            onClick={() => showToast('已開啟「新增 Permission Set」面板')}
          >
            <PlusIcon />
            新增 Permission Set
          </button>
        </div>
      </div>
      <div className="cx-card-grid">
        {PERMSETS.map((p, i) => {
          const assigned = (PERM_ASSIGNED[p.name] || []).slice(0, 4);
          return (
            <div key={p.name} className="cx-obj-card" onClick={() => onOpenPermSet(i)}>
              <div className="cx-oc-head">
                <div className="cx-oc-ic">
                  <LockIcon />
                </div>
                <div className="cx-oc-oh">
                  <div className="t">
                    {p.name} <span className={`cx-type-tag ${p.type}`}>{p.typeL}</span>
                  </div>
                  <div className="s">{p.perms.length} 項權限</div>
                </div>
                <div className="cx-oc-arr">
                  <ChevRight />
                </div>
              </div>
              <div className="cx-oc-desc">{p.desc}</div>
              <div className="cx-oc-foot">
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 6 }}>
                  {assigned.map((idx) => (
                    <div
                      key={idx}
                      className="cx-u-av"
                      style={{
                        width: 24,
                        height: 24,
                        fontSize: 10,
                        background: GRAD[USERS[idx].g],
                        marginLeft: -6,
                        border: '1.5px solid #fff',
                      }}
                    >
                      {USERS[idx].av}
                    </div>
                  ))}
                </div>
                <span className="cx-oc-meta" style={{ marginLeft: 'auto' }}>
                  <b>{p.users}</b> 位已指派
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
