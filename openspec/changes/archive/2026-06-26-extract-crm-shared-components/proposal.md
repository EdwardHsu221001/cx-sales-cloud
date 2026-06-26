## Why

`Leads.tsx` 與 `Accounts.tsx` 之間有多處**真重複**：各自 inline 定義同形 icon、各自維護一份相同的負責人資料（`OWNERS`，僅 key 名不同）、刪除確認 modal 與搜尋框幾乎一字不差。專案其實已有 `crm/icons.tsx`、`ui/button.tsx` 等共用慣例卻未被沿用。重複造成改一處要改兩處、且兩邊容易視覺/行為漂移。

## What Changes

- Icons 收進既有 `src/components/crm/icons.tsx`：補上兩支 inline 用到但 `icons.tsx` 缺的圖示；`IconChevron` 加 `dir`（up/down/left/right，預設 down）取代左右版。`Leads.tsx`／`Accounts.tsx` 改為 import 並刪除所有 inline icon 函式。
- **BREAKING（內部資料模型）**：新增 `src/components/crm/owners.ts`，合併 `leads.utils`（`{name,bg,initial}`）與 `accounts.utils`（`{nm,av,g}`）兩份重複的 `OwnerId` 型別與 `OWNERS` 資料，正規結構統一為 `{ name, initial, gradient }`；兩支 utils 與 `Accounts.tsx` 的欄位名一併調整。
- 新增 `src/components/crm/ConfirmModal.tsx`：抽出 Leads/Accounts 共通的刪除確認 modal（維持 `cx-modal-overlay` / `role="dialog"` / `aria-label` 結構）。
- 新增 `src/components/crm/SearchPill.tsx`：抽出搜尋框（維持 `cx-fpill cx-lead-search` / `type="search"` / `aria-label`）。
- 行為不變：搜尋語意、刪除確認流程、負責人顯示一律維持現狀；現有測試即回歸安全網。

## Capabilities

### New Capabilities
- `crm-shared-components`: CRM 頁面共用的呈現層建構元件契約 —— 共用 icon 集（含可定向 chevron）、單一負責人登錄（owner registry）、確認對話框、搜尋欄位；規範其對外介面與既有頁面行為的保持。

### Modified Capabilities
<!-- 純內部重構，不改既有使用者可見需求，故不修改既有 capability。 -->

## Impact

- 既有：`src/components/crm/icons.tsx`（擴充）、`Leads.tsx`、`Accounts.tsx`、`leads.utils.ts`、`accounts.utils.ts`（改 import 與欄位名）。
- 新檔：`src/components/crm/owners.ts`、`ConfirmModal.tsx`、`SearchPill.tsx`，及對應輕量單元測試。
- 不影響後端（本專案無後端）。範圍僅 Tier 1；明確排除 Tier 2/3（FormDrawer 外殼、`useRowSelection`、Pager、StatBar、詳情抽屜）。
- 回歸保證：現有 `Leads.test.tsx`／`Accounts.test.tsx`／`*.utils.test.ts`（105 tests）必須全綠。
