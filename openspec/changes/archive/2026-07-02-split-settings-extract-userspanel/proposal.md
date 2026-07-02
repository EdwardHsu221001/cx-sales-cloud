## Why

`Settings.tsx`（2895 行）shell 內仍有巢狀 `UsersPanel`（約 200 行）——「使用者清單與角色指派」頁,含統計列、篩選列、可勾選的使用者表格。它目前以巢狀函式定義並以 `<UsersPanel />` 渲染,每次 shell re-render 會換 identity 而卸載重掛（含搜尋 input 失焦的潛在問題）。將其抽為模組層級獨立元件、把專屬 state 下放為 local state,即可獲得穩定 identity 並讓 shell 續瘦身,延續既有面板抽離路線。經全檔驗證:`selectedRows`/`userSearch`/`filteredUsers`/`activeCount`/`pendingCount` 皆為 UsersPanel 專屬（未被 shell/`DetailDrawer` 使用,可乾淨下放）;對 shell 的唯一跨模組牽連是開啟共用 `DetailDrawer` 的 `openUser` 回呼與一個共用的展示型子元件 `StatusBadge`（同時被 `DetailDrawer` 使用）。

## What Changes

- 新增 `settings/users/UsersPanel.tsx`,以 `export default function` 提供。
- `UsersPanel` 內容原樣移入新檔;其專屬 state 下放為 local state:`selectedRows`（含 `toggleRow`/`toggleAll`）、`userSearch`,以及衍生值 `filteredUsers`/`activeCount`/`pendingCount`/`allSel`。
- 對 shell 依賴以 props 傳入:`{ showToast, onNavigate, onOpenUser }`（`onNavigate` 由 shell 以 `setActiveTab` 傳入、`onOpenUser` 由 shell 以 `openUser` 傳入,沿用既有範式）。
- 共用的展示型子元件 `StatusBadge`（`DetailDrawer` 與 `UsersPanel` 皆用）移至**新檔** `settings.components.tsx`;其依賴的 `STATUS_MAP`（`StatusBadge` 與 shell 皆用,純資料）移至 `settings.data.ts`。兩者由 shell 與面板共同 import。
- UsersPanel 專屬 helper `PermChips`（僅 UsersPanel 用）隨面板搬入新檔。
- `Settings.tsx` 移除 `UsersPanel` 巢狀函式定義、其專屬 shell state（`selectedRows`/`userSearch` 及衍生 `filteredUsers`/`activeCount`/`pendingCount`、`toggleRow`/`toggleAll`）、`StatusBadge`/`PermChips`/`STATUS_MAP` 定義,改 `import` 後以 `<UsersPanel ... />` 渲染並接上 props;`DetailDrawer` 改自 `settings.components` import `StatusBadge`。
- 純結構搬移,MUST NOT 改變執行期行為。

## Capabilities

### New Capabilities
<!-- 無新增 capability -->

### Modified Capabilities
- `crm-shared-components`: 既有 requirement「大型設定頁各模組面板抽為獨立元件」新增一條 scenario,將 `UsersPanel` 納入「獨立 import 元件」範圍,並敘明「與 `DetailDrawer` 共用的展示型子元件（`StatusBadge`）SHALL 抽至共用元件模組 `settings.components.tsx` 供兩者 import」的分流原則。

## Impact

- `src/components/crm/settings/Settings.tsx`（移除 UsersPanel、專屬 state、`StatusBadge`/`PermChips`/`STATUS_MAP`;新增 import 與接線;`DetailDrawer` 改 import `StatusBadge`）
- 新增 `src/components/crm/settings/users/UsersPanel.tsx`
- 新增 `src/components/crm/settings/settings.components.tsx`（共用展示型子元件,首個為 `StatusBadge`）
- `src/components/crm/settings/settings.data.ts`（接收 `STATUS_MAP`）
- 無外部 API／相依套件變動;無資料行為變動。
