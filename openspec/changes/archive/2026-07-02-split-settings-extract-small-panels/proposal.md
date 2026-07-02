## Why

`Settings.tsx`（3565 行）shell 內仍有多個巢狀 `XxxPanel`。其中 `HubPanel`、`ProfilesPanel`、`PermSetsPanel`、`PlaceholderPanel` 是一批「純展示型、不呼叫 hooks」的小面板：只讀資料、畫出畫面、呼叫少量回呼。它們目前以巢狀函式定義並以 `<HubPanel />` 形式渲染，因此每次 shell re-render 會換元件 identity 而卸載重掛——`HubPanel` 帶有搜尋 input，因此潛藏 focus/scroll 重置問題（同 [[settings-nested-panel-remount]] 記述）。將這四個面板抽為模組層級元件、把 `HubPanel` 的專屬 state 下放為 local state，即可一次獲得穩定 identity（消除重掛）、讓 shell 顯著瘦身，並延續既有的面板抽離路線。此批風險最低：經探索確認四者皆無與 shell 糾纏的自有狀態，對 shell 的依賴僅為回呼與 route 推導值（以 props 傳入）。

## What Changes

- 新增 `settings/hub/HubPanel.tsx`、`settings/profiles/ProfilesPanel.tsx`、`settings/permsets/PermSetsPanel.tsx`、`settings/placeholder/PlaceholderPanel.tsx`，各以 `export default function` 提供。
- 四面板內容原樣移入新檔；對 shell 的依賴改以 props 傳入：
  - `HubPanel`：`{ showToast, onNavigate }`；其專屬 state `hubSearch`（含衍生值 `filteredGroups`）下放為面板 local state。
  - `ProfilesPanel`：`{ showToast, onNavigate, onOpenProfile }`（`onOpenProfile` 由 shell 以 `openProfile` 傳入，開啟共用 `DetailDrawer`）。
  - `PermSetsPanel`：`{ showToast, onNavigate, onOpenPermSet }`（`onOpenPermSet` 由 shell 以 `openPermSet` 傳入）。
  - `PlaceholderPanel`：`{ showToast, onNavigate, activeTab }`（`activeTab` 為 route 推導值，用以查 `METADATA`）。
  - 沿用既有範式：`onNavigate` 由 shell 以 `setActiveTab` 傳入（同 `DiscountPanel`）；開抽屜回呼以 props 傳入（同 `FlowPanel`/`ImportPanel`）。
- 共用常數自 `Settings.tsx` 移出並 `export`，依語意分流：
  - 導覽結構設定 `NAV_GROUPS`（shell 側欄與 `HubPanel` 共用，帶 icon JSX）移至新檔 **`settings.nav.tsx`**（含其專屬型別 `NavItem`/`NavGroup`）。因其含 JSX 且屬「導覽設定」而非 mock 資料，不併入 `settings.data.ts`。
  - 業務假資料 `PROFILES`、`PERMSETS`、`PERM_ASSIGNED`（皆與 shell `DetailDrawer` 共用，純資料無 JSX）移至 `settings.data.ts`；其型別 `ProfileData`/`PermSetData` 移至 `settings.types.ts`。（`USERS`/`GRAD` 已在 `settings.data.ts`。）
- 面板專屬常數與 helper 隨面板搬入新檔：`HUB_ICON_CLS`（→ `HubPanel`）、`METADATA` 與 helper 子元件 `PlaceholderCell`（→ `PlaceholderPanel`）。
- `Settings.tsx` 移除這 4 個巢狀函式定義（及 `HubPanel` 專屬 shell state `hubSearch` 與衍生 `filteredGroups`），改 `import` 後以 `<HubPanel ... />` 等渲染並接上 props。
- 純結構搬移，MUST NOT 改變執行期行為。

## Capabilities

### New Capabilities
<!-- 無新增 capability -->

### Modified Capabilities
- `crm-shared-components`: 既有 requirement「大型設定頁各模組面板抽為獨立元件」新增一條 scenario，將 `HubPanel`/`ProfilesPanel`/`PermSetsPanel`/`PlaceholderPanel` 納入「獨立 import 元件」範圍，並敘明 `HubPanel` 原以巢狀函式渲染的潛在重掛問題於 state 下放後由穩定 identity 的 `<Panel />` 取代。

## Impact

- `src/components/crm/settings/Settings.tsx`（移除 4 個巢狀面板、`hubSearch`/`filteredGroups`、共用資料常數；新增 import 與接線）
- 新增 `src/components/crm/settings/hub/HubPanel.tsx`、`profiles/ProfilesPanel.tsx`、`permsets/PermSetsPanel.tsx`、`placeholder/PlaceholderPanel.tsx`
- 新增 `src/components/crm/settings/settings.nav.tsx`（接收 `NAV_GROUPS` 與 `NavItem`/`NavGroup` 型別）
- `src/components/crm/settings/settings.data.ts`（接收 `PROFILES`/`PERMSETS`/`PERM_ASSIGNED`）
- `src/components/crm/settings/settings.types.ts`（接收 `ProfileData`/`PermSetData`）
- 無外部 API／相依套件變動；無資料行為變動。
