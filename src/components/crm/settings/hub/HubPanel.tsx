'use client';

import { useState } from 'react';
import { IconSearch } from '../../common/icons';
import { ChevRight, ClipIcon, UserGrpIcon, IconSettingsCenter } from '../settings.icons';
import { NAV_GROUPS } from '../settings.nav';

const HUB_ICON_CLS = ['cx-ic-users', 'cx-ic-objs', 'cx-ic-ui', 'cx-ic-auto', 'cx-ic-int'];

export default function HubPanel({
  showToast,
  onNavigate,
}: {
  showToast: (msg: string) => void;
  onNavigate: (tab: string) => void;
}) {
  const [hubSearch, setHubSearch] = useState('');
  const filteredGroups = hubSearch
    ? NAV_GROUPS.map((g) => ({
        ...g,
        items: g.items.filter((it) => it.label.toLowerCase().includes(hubSearch.toLowerCase())),
      })).filter((g) => g.items.length > 0)
    : NAV_GROUPS;

  return (
    <div>
      <div className="cx-crumbs">
        <span>設定</span>
      </div>
      <div className="cx-set-head">
        <div>
          <h1>設定中心</h1>
          <div className="sub">
            管理使用者、物件與欄位、介面、自動化與系統整合。以下為各設定模組入口。
          </div>
        </div>
      </div>
      <div className="cx-hub-search">
        <IconSearch />
        <input
          type="text"
          placeholder="快速尋找設定…（例如：使用者、Profile、Flow、API）"
          value={hubSearch}
          onChange={(e) => setHubSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') showToast(`搜尋設定：${hubSearch || '（空白）'}`);
          }}
        />
      </div>
      <div className="cx-hub-recent">
        <span className="lab">最近使用</span>
        <span className="cx-hub-chip" onClick={() => onNavigate('users')}>
          <UserGrpIcon />
          使用者清單與角色指派
        </span>
        <span className="cx-hub-chip" onClick={() => onNavigate('profiles')}>
          <ClipIcon />
          Profile 管理
        </span>
        <span className="cx-hub-chip" onClick={() => onNavigate('discount')}>
          <IconSettingsCenter />
          角色折扣上限
        </span>
      </div>
      <div className="cx-hub-grid">
        {filteredGroups.map((g, gi) => (
          <div key={gi} className="cx-hub-card">
            <div className="cx-hc-head">
              <div className={`cx-hc-ic ${HUB_ICON_CLS[gi % 5]}`}>{g.icon}</div>
              <div className="cx-hc-ht">
                <h3>{g.label}</h3>
                <div className="s">{g.items.length} 個設定項目</div>
              </div>
            </div>
            <div className="cx-hc-items">
              {g.items.map((item) => (
                <div key={item.key} className="cx-hc-item" onClick={() => onNavigate(item.key)}>
                  <span className="cx-hc-dotpt" />
                  {item.label}
                  {item.ph ? (
                    <span className="cx-hc-soon">設計中</span>
                  ) : (
                    <span className="cx-hc-chev">
                      <ChevRight />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
