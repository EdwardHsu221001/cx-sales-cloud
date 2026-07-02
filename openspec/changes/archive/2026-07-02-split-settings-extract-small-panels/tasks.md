## 1. 資料搬移（groundwork）

- [x] 1.1 全檔搜尋確認歸屬：`NAV_GROUPS`（shell 側欄 + HubPanel 共用，帶 icon JSX → 導覽設定）、`PROFILES`/`PERMSETS`/`PERM_ASSIGNED`（面板 + DetailDrawer + badge 計數共用，純 mock 資料）為共用；`HUB_ICON_CLS`、`METADATA`、`PlaceholderCell` 為面板專屬
- [x] 1.2a 新增 `settings.nav.tsx`：移入 `NAV_GROUPS` 與其專屬型別 `NavItem`/`NavGroup`（含 icon JSX，故置於 `.tsx`），`export`；自 `settings.icons` import group icons
- [x] 1.2b 將 `ProfileData`/`PermSetData` 型別移至 `settings.types.ts`；`PROFILES`/`PERMSETS`/`PERM_ASSIGNED` 移至 `settings.data.ts` 並 `export`（型別自 `settings.types.ts` import）
- [x] 1.3 `Settings.tsx` shell 改為 import：側欄 `NAV_GROUPS` 自 `settings.nav`；`DetailDrawer`/badge 用的 `PROFILES`/`PERMSETS`/`PERM_ASSIGNED` 自 `settings.data`；移除原 module-level 定義（含 `NavItem`/`NavGroup`/`ProfileData`/`PermSetData` 內聯型別）

## 2. 抽出 HubPanel

- [x] 2.1 新增 `settings/hub/HubPanel.tsx`：`export default function HubPanel({ showToast, onNavigate })`
- [x] 2.2 將 `HubPanel` 內容移入；`hubSearch` 下放為 local state、`filteredGroups` 於面板內就 `NAV_GROUPS` 計算；`setActiveTab` 改 `onNavigate`；`HUB_ICON_CLS` 隨面板搬入
- [x] 2.3 自共用模組 import 所需 icons／型別／資料（`settings.icons`、`settings.nav` 的 `NAV_GROUPS`）

## 3. 抽出 ProfilesPanel

- [x] 3.1 新增 `settings/profiles/ProfilesPanel.tsx`：`export default function ProfilesPanel({ showToast, onNavigate, onOpenProfile })`
- [x] 3.2 將 `ProfilesPanel` 內容移入；`setActiveTab` 改 `onNavigate`、`openProfile(i)` 改 `onOpenProfile(i)`
- [x] 3.3 自共用模組 import 所需 icons／型別／資料（`PROFILES`）

## 4. 抽出 PermSetsPanel

- [x] 4.1 新增 `settings/permsets/PermSetsPanel.tsx`：`export default function PermSetsPanel({ showToast, onNavigate, onOpenPermSet })`
- [x] 4.2 將 `PermSetsPanel` 內容移入；`setActiveTab` 改 `onNavigate`、`openPermSet(i)` 改 `onOpenPermSet(i)`
- [x] 4.3 自共用模組 import 所需 icons／型別／資料（`PERMSETS`/`PERM_ASSIGNED`/`USERS`/`GRAD`）

## 5. 抽出 PlaceholderPanel

- [x] 5.1 新增 `settings/placeholder/PlaceholderPanel.tsx`：`export default function PlaceholderPanel({ showToast, onNavigate, activeTab })`
- [x] 5.2 將 `PlaceholderPanel` 內容移入；`activeTab` 改由 props 讀取（保留 `METADATA[activeTab] || {...}` fallback）；`setActiveTab` 改 `onNavigate`；`METADATA` 與 helper `PlaceholderCell` 隨面板搬入
- [x] 5.3 自共用模組 import 所需 icons／型別（`settings.icons`、`settings.types`）

## 6. shell 接線

- [x] 6.1 `Settings.tsx` 移除 4 個巢狀面板函式定義、`HubPanel` 專屬 shell state（`hubSearch` 及衍生 `filteredGroups`）、面板專屬常數/helper（`HUB_ICON_CLS`/`METADATA`/`PlaceholderCell`）
- [x] 6.2 `import` 4 個面板，render 接上 props：`<HubPanel showToast={showToast} onNavigate={setActiveTab} />`、`<ProfilesPanel showToast={showToast} onNavigate={setActiveTab} onOpenProfile={openProfile} />`、`<PermSetsPanel showToast={showToast} onNavigate={setActiveTab} onOpenPermSet={openPermSet} />`、`<PlaceholderPanel showToast={showToast} onNavigate={setActiveTab} activeTab={activeTab} />`

## 7. 驗證

- [x] 7.1 `npm run type-check`（`tsc --noEmit`）`src/` 無型別錯誤
- [x] 7.2 `npm test` 既有測試全綠
- [x] 7.3 `npm run lint` 無新增問題（清除新引入的 unused import）
- [x] 7.4 人工驗證：Hub 搜尋輸入焦點不掉、快捷/卡片點擊跳頁正確；Profiles/PermSets 點卡片開右側抽屜正確；Placeholder 切換各「設計中」模組標題/表格正確；`/settings` 與各子路由（`/settings/profiles`、`/settings/permsets`）無 404
