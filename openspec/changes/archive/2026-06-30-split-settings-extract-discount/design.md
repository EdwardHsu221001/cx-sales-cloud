## Context

`Settings.tsx`（8162 行）結構：頂部約 30 個 icon 元件（27-218）、大量模組資料常數（220-1690）、`DetailDrawer`（1762-3560，含 5 個 `*Content`）、email/pagelayout 資料與 helper（3562-4190）、主元件 `Settings`（4191-8162）。主元件內以 `activeTab` 路由約 15 個巢狀 panel 函式（8124-8144）。

`DiscountPanel`（4777-4902）被選為第一個切片，因其依賴最單純：
- 專屬 state：`discountVals` / `setDiscountVals`（4226，**僅** DiscountPanel 使用）。
- 跨模組依賴：`showToast`（prop）、`setActiveTab`（4206，router.push 包裝，僅用 `setActiveTab('hub')`）。
- 共用資料/型別：`ROLES`、`USERS`、`RoleKey`。
- icons：`ChevRight`、`ResetIcon`、`SaveIcon`、`InfoIcon`。

目前 `DiscountPanel` 為巢狀函式並以 `<DiscountPanel />`（8131）渲染：在折扣輸入框打字 → `setDiscountVals` → `Settings` 重渲 → 巢狀函式 identity 改變 → 面板卸載重掛（輸入失焦）。抽成獨立 import 元件後 identity 穩定，此問題消失。

## Goals / Non-Goals

**Goals:**
- 抽出 `DiscountPanel` 為獨立元件（local `discountVals`、props `{ showToast, onNavigate }`）。
- 建立可重複的拆分範式與共用模組（icons/types/data）。
- shell 縮小；消除 DiscountPanel 的重掛/失焦風險。

**Non-Goals:**
- 不搬其餘 panel、不動 `DetailDrawer` 與 5 個 `*Content`。
- 不改 panel 外觀或互動行為（純結構搬移 + state 歸屬調整）。
- 不一次搬完所有共用型別/資料——只搬本切片需要的（`RoleKey`、`ROLES`、`USERS`），其餘隨後續切片增補。

## Decisions

**決策 1：icons 整批搬到 `settings.icons.tsx`，types/data 只搬本次所需。**
icons 為純元件、無狀態，整批搬移機械且一次到位、利於後續切片；型別與參考資料則避免大爆炸，僅搬 `RoleKey`/`ROLES`/`USERS`，其餘留待需要時再搬（接受暫時性的「定義分散」）。

**決策 2：導航以 `onNavigate: (tab: string) => void` prop 注入，而非讓面板自己接 router。**
`setActiveTab` 含 shell 專屬邏輯（`fields` 特例、`PATH` 表）。面板只需「切到某 tab」的能力，傳入回呼即可，維持面板對路由實作無知、易測。shell 端以 `onNavigate={setActiveTab}` 接上。

**決策 3：`discountVals` 下放為 DiscountPanel local state。**
初始化邏輯（由 `ROLES` 的 `cap` 組成）一併移入元件。shell 移除該 useState。RolesPanel 已有 panel-local state（`rpeople`，4906）作為先例，下放符合既有模式。

**決策 4：本範式是 remount 問題的根治方向，但本次不回收 `fix-settings-panel-remount`。**
那 5 個 `*Content` 屬 `DetailDrawer`，是另一切片；待其抽為獨立元件後，內聯呼叫 workaround 才可改回 `<X />`。本次不碰，避免擴大範圍。

## Risks / Trade-offs

- **[state 下放後行為漂移]** → `discountVals` 的初值與 onChange 邏輯原樣移入；以既有測試 + 人工驗證折扣輸入（多位數連續輸入不失焦）確認。
- **[整批搬 icons 漏接 import]** → 搬移後於 `Settings.tsx` 補 `import { ...all icons } from './settings.icons'`；以 `tsc --noEmit` 與 lint 確認無未定義引用。
- **[共用資料分散（部分在 settings.data.ts、部分仍在 Settings.tsx）]** → 視為漸進拆分的過渡狀態，於後續切片收斂；本次以「只搬所需」換取低風險。
- **[ROLES/USERS 被其他 panel 使用]** → 搬出後 `Settings.tsx` 改 import 回來，其餘 panel 透過 shell 既有引用不受影響。
