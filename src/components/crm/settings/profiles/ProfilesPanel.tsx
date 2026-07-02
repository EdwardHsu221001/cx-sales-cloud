'use client';

import { ChevRight, PlusIcon, ClipIcon, UserGrpIcon } from '../settings.icons';
import { PROFILES } from '../settings.data';

export default function ProfilesPanel({
  showToast,
  onNavigate,
  onOpenProfile,
}: {
  showToast: (msg: string) => void;
  onNavigate: (tab: string) => void;
  onOpenProfile: (i: number) => void;
}) {
  return (
    <div>
      <div className="cx-crumbs">
        <a onClick={() => onNavigate('hub')}>設定</a>
        <ChevRight />
        <span>使用者管理</span>
        <ChevRight />
        <span>Profile 管理</span>
      </div>
      <div className="cx-set-head">
        <div>
          <h1>Profile 管理</h1>
          <div className="sub">
            Profile 定義使用者可存取的物件、欄位與系統權限基準。點擊檢視物件存取與欄位層級安全性。
          </div>
        </div>
        <div className="actions">
          <button className="cx-btn-navy" onClick={() => showToast('已開啟「新增 Profile」面板')}>
            <PlusIcon />
            新增 Profile
          </button>
        </div>
      </div>
      <div className="cx-card-grid">
        {PROFILES.map((p, i) => (
          <div key={p.name} className="cx-obj-card" onClick={() => onOpenProfile(i)}>
            <div className="cx-oc-head">
              <div className="cx-oc-ic">
                <ClipIcon />
              </div>
              <div className="cx-oc-oh">
                <div className="t">{p.name}</div>
                <div className="s">
                  {p.access === 'full' ? '完整存取' : p.access === 'ro' ? '唯讀' : '物件讀寫'}
                </div>
              </div>
              <div className="cx-oc-arr">
                <ChevRight />
              </div>
            </div>
            <div className="cx-oc-desc">{p.desc}</div>
            <div className="cx-oc-foot">
              <span className="cx-oc-meta">
                <UserGrpIcon />
                <b>{p.users}</b> 位使用者
              </span>
              <span className={`cx-lic-tag ${p.lic === 'platform' ? 'platform' : ''}`}>
                {p.license}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
