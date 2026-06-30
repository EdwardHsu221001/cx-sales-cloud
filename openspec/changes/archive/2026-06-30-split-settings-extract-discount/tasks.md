## 1. 共用模組（shell groundwork）

- [x] 1.1 新增 `settings/settings.icons.tsx`，將 24 個 icon 元件原樣移入並逐一 `export`
- [x] 1.2 `Settings.tsx` 移除這些 icon 定義，改 `import { ... } from './settings.icons'`（涵蓋全部使用到的 icon；DiscountPanel 移出後不再使用的 SaveIcon/ResetIcon 已自 import 移除）
- [x] 1.3 新增 `settings/settings.types.ts`，移入 `RoleKey`（及 `USERS` 所需的 `UserData`）並 `export`
- [x] 1.4 新增 `settings/settings.data.ts`，移入 `ROLES`、`USERS`（自 `settings.types` import 型別）並 `export`；`Settings.tsx` 改 import

## 2. 抽出 DiscountPanel

- [x] 2.1 新增 `settings/discount/DiscountPanel.tsx`：`export default function DiscountPanel({ showToast, onNavigate })`
- [x] 2.2 將 `DiscountPanel` 內容移入；`setActiveTab('hub')` 改為 `onNavigate('hub')`
- [x] 2.3 將 `discountVals` 的 `useState`（初值由 `ROLES` 組成）由 shell 下放為 `DiscountPanel` 的 local state
- [x] 2.4 `DiscountPanel.tsx` 從共用模組 import 所需 icons / `RoleKey` / `ROLES` / `USERS`

## 3. shell 接線

- [x] 3.1 `Settings.tsx` 移除巢狀 `DiscountPanel` 函式與 `discountVals` 的 `useState`
- [x] 3.2 `Settings.tsx` import `DiscountPanel`，將 render 改為 `<DiscountPanel showToast={showToast} onNavigate={setActiveTab} />`

## 4. 驗證

- [x] 4.1 `npm run type-check`（`tsc --noEmit`）無型別錯誤 — 通過（exit 0）
- [x] 4.2 `npm test` 既有測試全綠 — 14 檔 147 測試全綠
- [x] 4.3 `npm run lint` 無新增問題 — 變更檔 0 errors；新引入的 3 個 unused warning（SaveIcon/ResetIcon/RoleKey）已清除，餘 11 個皆為既有
- [x] 4.4 人工驗證：開啟「角色折扣上限」，於折扣輸入框連續輸入多位數字 → 焦點不掉、數值正確 — 已確認通過（discountVals 為 DiscountPanel local state，打字只重渲該元件本身、焦點保留）
