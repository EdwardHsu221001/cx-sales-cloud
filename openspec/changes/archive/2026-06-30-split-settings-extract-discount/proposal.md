## Why

`Settings.tsx` 是單檔 8162 行、塞了約 15 個設定模組的巨無霸：難讀、難改、難測。所有 panel 都是 `Settings` 內的巢狀函式，靠閉包共用 state，且以 `<XPanel />` 形式渲染——每次 `Settings` 重渲都產生新的元件型別而卸載重掛（這正是先前 `fix-settings-panel-remount` 處理的同一類問題；`DiscountPanel` 的折扣輸入框 `setDiscountVals` 每次按鍵都會觸發此重掛）。本變更踏出「按模組拆分」的第一步，並確立後續模組可循的範式；把 panel 抽成真正獨立 import 的元件後 identity 穩定，從根本消除該重掛風險。

## What Changes

- 新增 `settings/settings.icons.tsx`：將 `Settings.tsx` 頂部約 30 個本地 icon 元件移入並 `export`，`Settings.tsx` 改 import。
- 新增 `settings/settings.types.ts`：移入本次所需共用型別 `RoleKey`（後續模組再逐步補入其餘）。
- 新增 `settings/settings.data.ts`：移入本次所需共用參考資料 `ROLES`、`USERS`（後續再補）。
- 新增 `settings/discount/DiscountPanel.tsx`：把 `DiscountPanel`（角色折扣上限）抽成獨立元件，介面 `{ showToast, onNavigate }`；其專屬 state `discountVals` 由 shell **下放**為元件 local state；icons/型別/資料改由上述共用模組 import。
- `Settings.tsx`：移除 `DiscountPanel` 函式與 `discountVals` state，改 `import` 並以 `<DiscountPanel showToast={showToast} onNavigate={setActiveTab} />` 渲染。
- 確立並文件化「大型頁面各模組面板 SHALL 為獨立 import 元件（穩定 identity）」的共用慣例，納入 `crm-shared-components`。
- 非目標：不搬其餘 panel（users/profiles/roles/objects/flow/email/…）、不動 `DetailDrawer` 與其 5 個 `*Content`、不改 `email.utils.ts`/`pagelayout.utils.ts`、不改任何畫面外觀或行為。

## Capabilities

### New Capabilities
<!-- 無新增能力 -->

### Modified Capabilities
- `crm-shared-components`: 新增一條要求，規範大型設定頁的各模組面板 SHALL 抽為獨立 import 的元件檔（模組層級、identity 穩定），MUST NOT 以巢狀函式 + `<Panel />` 形式定義於父元件內；面板專屬 state 下放至該元件，跨模組共用者以 props 傳入。

## Impact

- 受影響程式碼：`src/components/crm/settings/Settings.tsx`（移除 icons 定義、`DiscountPanel`、`discountVals`，改 import）；新增 `settings.icons.tsx`、`settings.types.ts`、`settings.data.ts`、`discount/DiscountPanel.tsx`。
- 風險集中在「`discountVals` state 下放」一處；icons/types/data 為機械搬移。
- 與既有變更關係：本範式是 `fix-settings-panel-remount`（內聯呼叫 workaround）的根治方向；惟本次不動 `DetailDrawer`，那 5 個面板留待後續模組切片。
- 既有測試（`Settings.pagelayout.test.tsx`、`Settings.email.test.tsx`、`*.utils.test.ts`）應維持綠燈。
