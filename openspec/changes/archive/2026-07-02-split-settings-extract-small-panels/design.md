## Context

`Settings.tsx`（3565 行）的 shell 內仍有多個巢狀 `XxxPanel` 函式。先前 `split-settings-extract-discount`、`split-settings-extract-hook-panels`、`split-settings-extract-email-pagelayout` 已建立範式：面板抽為模組層級獨立元件、專屬 state 下放為 local state、跨模組依賴以 props 傳入、共用 icons/型別/資料置於 `settings.icons.tsx`/`settings.types.ts`/`settings.data.ts`。

本次處理一批純展示型小面板：`HubPanel`、`ProfilesPanel`、`PermSetsPanel`、`PlaceholderPanel`。四者皆不呼叫 hooks，目前以巢狀函式定義並以 `<HubPanel />` 等形式渲染——因 identity 隨每次 shell re-render 改變而卸載重掛。`HubPanel` 帶搜尋 input（讀 shell `hubSearch`），故潛藏 focus/scroll 重置風險；其餘三者無輸入元素，重掛目前無外顯症狀，但同屬應消除的結構問題。

探索結論（決定資料歸屬的關鍵）：
- `NAV_GROUPS`：shell 側欄導覽（render 3481）與 `HubPanel`（`filteredGroups` 來源）共用，且**帶 icon JSX**（`icon: <IconGroupUsers />`）。它是「導覽結構設定」而非 mock 業務資料，且含 JSX（`.ts` 不可放）→ 移至新的 `.tsx` 導覽模組，不併入 `settings.data.ts`。
- `PROFILES`/`PERMSETS`/`PERM_ASSIGNED`：除各自面板外，亦被 shell 的 `DetailDrawer`（ProfileContent/PermSetContent，1040/1309/1312）與 badge 計數（727/732/2577/2582）讀取 → 屬共用資料。
- `HUB_ICON_CLS`（僅 HubPanel 2683）、`METADATA`（僅 PlaceholderPanel 3366）、helper `PlaceholderCell`（僅 3427）→ 面板專屬。
- `USERS`/`GRAD` 已在 `settings.data.ts`。

## Goals / Non-Goals

**Goals:**
- 將 4 個小面板抽為獨立元件檔，identity 穩定、消除 `<Panel />` 重掛風險（含 `HubPanel` 搜尋失焦的潛在問題）。
- `HubPanel` 專屬 state `hubSearch`（含衍生 `filteredGroups`）下放為 local state；共用資料常數搬至 `settings.data.ts`；面板專屬常數與 helper 隨面板搬入新檔。
- 純結構搬移，執行期行為（資料、初始狀態、互動、畫面）完全不變。

**Non-Goals:**
- 不處理與 `DetailDrawer` 共用自有 state 的 `UsersPanel`（共用 `drawer`/`selectedRows`/`userSearch`）— 留待後續 change。
- 不處理含 route 依賴的 `ObjectsPanel`/`FieldsPanel` — 留待後續 change。
- 不重構面板內部邏輯、不調整 UI、不改資料內容。

## Decisions

- **檔案位置**：`settings/hub/HubPanel.tsx`、`settings/profiles/ProfilesPanel.tsx`、`settings/permsets/PermSetsPanel.tsx`、`settings/placeholder/PlaceholderPanel.tsx`（比照既有子資料夾慣例）。
- **Props 介面**：
  - `HubPanel`：`{ showToast, onNavigate }`；`hubSearch`（含衍生 `filteredGroups`）下放為 local state。
  - `ProfilesPanel`：`{ showToast, onNavigate, onOpenProfile }`；`onOpenProfile` 由 shell 以 `openProfile` 傳入（開共用 `DetailDrawer`）。
  - `PermSetsPanel`：`{ showToast, onNavigate, onOpenPermSet }`；`onOpenPermSet` 由 shell 以 `openPermSet` 傳入。
  - `PlaceholderPanel`：`{ showToast, onNavigate, activeTab }`；`activeTab` 為 route 推導值，用以查 `METADATA`。
  - 沿用範式：`onNavigate` = shell 的 `setActiveTab`（同 `DiscountPanel`）；開抽屜回呼以 props 傳入（同 `FlowPanel`/`ImportPanel` 的 `onOpenFlow`/`onOpenBatch`）。四者皆不持有與 shell 共用的 state，故僅傳回呼與純值。
- **共用常數／型別搬移（依語意分流）**：
  - `NAV_GROUPS`（含 icon JSX）移至新檔 `settings.nav.tsx`，其專屬型別 `NavItem`/`NavGroup` 就近同置該檔。shell 側欄與 `HubPanel` 自 `settings.nav` import。
  - `PROFILES`/`PERMSETS`/`PERM_ASSIGNED`（純資料）移至 `settings.data.ts` 並 `export`；其型別 `ProfileData`/`PermSetData`（原內聯於 `Settings.tsx`）移至 `settings.types.ts`，`settings.data.ts` 與面板自該處 import。
- **面板專屬常數／helper**：`HUB_ICON_CLS` 隨 `HubPanel`；`METADATA` 與 helper 子元件 `PlaceholderCell` 隨 `PlaceholderPanel` 搬入其檔。
- **shell 接線**：移除 4 個巢狀函式定義與 `HubPanel` 專屬 shell state（`hubSearch` 及衍生 `filteredGroups`）；render 保持 `<HubPanel showToast={showToast} onNavigate={setActiveTab} />`、`<ProfilesPanel showToast={showToast} onNavigate={setActiveTab} onOpenProfile={openProfile} />`、`<PermSetsPanel ... onOpenPermSet={openPermSet} />`、`<PlaceholderPanel ... activeTab={activeTab} />`。shell 側欄改自 `settings.nav` import `NAV_GROUPS`。

## Risks / Trade-offs

- **資料常數歸屬判斷錯誤**：把共用常數誤搬進面板檔，或把導覽設定誤當 mock 資料。緩解：搬移前已全檔搜尋 `NAV_GROUPS`/`PROFILES`/`PERMSETS`/`PERM_ASSIGNED`/`METADATA`/`HUB_ICON_CLS` 使用點並分類（見 Context）；共用者依語意分流（導覽 → `settings.nav.tsx`、mock 資料 → `settings.data.ts`）供雙方 import。`NAV_GROUPS` 含 JSX 故須置於 `.tsx`。
- **行為悄悄改變**：搬移誤動初值或邏輯。緩解：逐檔對照搬移、`type-check` + 既有測試全綠，並對 HubPanel 搜尋（焦點不掉）、Profiles/PermSets 開抽屜、Placeholder 各設計中模組切換做人工驗證。
- **`activeTab` 傳遞**：`PlaceholderPanel` 需以 props 收 `activeTab`（而非讀 shell 閉包變數）；`METADATA` 的 fallback 分支須一併保留。
