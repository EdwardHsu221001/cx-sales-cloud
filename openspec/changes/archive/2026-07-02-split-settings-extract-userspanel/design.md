## Context

`Settings.tsx`（2895 行）shell 內剩 `UsersPanel`、`ObjectsPanel`、`FieldsPanel` 三個巢狀面板 + ~1000 行 `DetailDrawer`。先前多批已建立範式:面板抽為模組層級獨立元件、專屬 state 下放 local、跨模組依賴以 props 傳入、共用 icons/型別/資料/導覽置於 `settings.icons.tsx`/`settings.types.ts`/`settings.data.ts`/`settings.nav.tsx`。

本次處理 `UsersPanel`。它是純展示型（不含 hooks,目前以 `<UsersPanel />` 渲染 → 每次 shell re-render 重掛,搜尋 input 有失焦潛在問題）。

探索結論（全檔驗證依賴歸屬）:
- **UsersPanel 專屬（可下放）**:`selectedRows`+`setSelectedRows`（僅 UsersPanel 表格勾選）、`toggleRow`/`toggleAll`（僅 UsersPanel 呼叫）、`userSearch`+`setUserSearch`、衍生 `filteredUsers`/`activeCount`/`pendingCount`。**實測皆未被 shell/`DetailDrawer`/其他面板使用**（修正舊路線圖「與 shell 共用 selectedRows/userSearch」之誤記）。
- **開共用 DetailDrawer**:`openUser`（shell `useCallback`,設定 `drawer` state）→ 以 prop `onOpenUser` 傳入。
- **共用子元件 `StatusBadge`**:module-level fn,用於 `DetailDrawer`（UserContent 的 2 處）與 `UsersPanel`（表格狀態欄）→ 不能塞進 UsersPanel（shell 需 import,會循環）→ 移至共用元件模組。其依賴 `STATUS_MAP`（`StatusBadge` + shell 一處共用,純資料）。
- **UsersPanel 專屬 helper `PermChips`**:僅 UsersPanel 用 → 隨面板搬。
- `USERS`/`ROLES`/`GRAD` 已在 `settings.data.ts`。

## Goals / Non-Goals

**Goals:**
- 將 `UsersPanel` 抽為獨立元件檔,identity 穩定、消除重掛風險。
- 專屬 state 下放 local;共用子元件 `StatusBadge` 移至新的共用元件模組 `settings.components.tsx`,`STATUS_MAP` 移至 `settings.data.ts`,供 shell 與面板共同 import。
- 純結構搬移,執行期行為（資料、初始狀態、互動、畫面）完全不變。

**Non-Goals:**
- 不處理 `ObjectsPanel`/`FieldsPanel`（route 依賴）— 後續 change。
- 不處理 `DetailDrawer`（~1000 行）本身的拆分 — 後續 change。本次僅改其對 `StatusBadge` 的 import 來源。
- 不重構 UsersPanel 內部邏輯、不動 UI、不改資料內容。不清理既有無用區域變數（如 shell 內 `const st = STATUS_MAP[...]` 死碼）— 超出本批範圍。

## Decisions

- **檔案位置**:`settings/users/UsersPanel.tsx`（比照既有子資料夾慣例）。
- **共用子元件模組**:新增 `settings.components.tsx`,放跨 shell/面板共用的展示型子元件,首個為 `StatusBadge`（`export`）。命名與 `settings.icons.tsx`/`settings.data.ts`/`settings.nav.tsx` 一致。選此而非塞進 `settings.icons.tsx`,因 `StatusBadge` 非 icon,語意分明,且為後續共用子元件預留家。
- **Props 介面**:`UsersPanel` = `{ showToast, onNavigate, onOpenUser }`。`onNavigate`=`setActiveTab`；`onOpenUser`=`openUser`。因專屬 state 全下放,無需傳共用 state（有別於 flow/import 需傳 `flowOn`/`batchOn`）。
- **state 下放**:`selectedRows`/`userSearch` 移入 UsersPanel 為 local state;`toggleRow`/`toggleAll` 移入為 local 函式;`filteredUsers`/`activeCount`/`pendingCount`/`allSel` 於面板內就 `USERS`/`userSearch` 計算。
- **資料搬移**:`STATUS_MAP` 移至 `settings.data.ts` 並 `export`;`settings.components.tsx`（StatusBadge）與 shell（line 352 用處）自該處 import。
- **shell 接線**:移除 `UsersPanel` 巢狀定義、專屬 state 與 `StatusBadge`/`PermChips`/`STATUS_MAP` 定義;render `{activeTab === 'users' && <UsersPanel showToast={showToast} onNavigate={setActiveTab} onOpenUser={openUser} />}`;`DetailDrawer` 兩處 `<StatusBadge/>` 改自 `settings.components` import。

## Risks / Trade-offs

- **共用子元件判斷錯誤**:誤把 `StatusBadge` 當 UsersPanel 專屬而搬進面板 → shell/DetailDrawer 無法 import（循環）。緩解:已全檔搜尋 `<StatusBadge` 確認 401/505（DetailDrawer）+ 2422（UsersPanel）皆用,故移至共用模組。
- **`STATUS_MAP` 歸屬**:同被 shell（352）與 StatusBadge（278）用 → 移至 `settings.data.ts`（純資料層）供雙方 import。
- **行為悄悄改變**:搬移誤動初值或邏輯（尤其 `filteredUsers`/勾選）。緩解:逐段對照搬移、`type-check` + 既有測試全綠,並人工驗證使用者搜尋（焦點不掉）、全選/單選勾選、點列開右側 DetailDrawer。
- **既有死碼**:shell 內 `const st = STATUS_MAP[u.status]`（未使用,eslint 既有 warning）本批**不動**,僅確保它仍能 import `STATUS_MAP`;避免擴大範圍。
