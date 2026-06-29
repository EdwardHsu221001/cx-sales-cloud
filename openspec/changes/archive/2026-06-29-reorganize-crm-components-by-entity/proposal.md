## Why

`src/components/crm/` 目前 36 個檔案全部攤平在單一層，實體（accounts/contacts/leads…）、共用元件、頁面框架混雜，瀏覽與定位成本隨模組增加而上升。依「每個物件一個資料夾」重新分組，可讓每個實體自成一個可獨立理解的單元，並為後續新增 CRUD 模組建立一致的落點。

## What Changes

- 將 `src/components/crm/` 依物件/職責分為子資料夾：`accounts/`、`contacts/`、`leads/`、`opportunities/`、`activities/`、`common/`、`settings/`、`dashboard/`；`AppShell.tsx` 留在 `crm/` 根層（它是 CRM 外框，非業務物件）。
- 每個實體資料夾收納其 `*.tsx`、`*.test.tsx` 與對應 `*.utils.ts(+test)`；單檔實體（opportunities/activities）一律也包資料夾，維持一致。
- 共用元件（icons、owners、ConfirmModal、SearchPill、useRowSelection、FormDrawer、EmptyState 及其 test）集中至 `common/`。
- 以 `git mv` 搬移（保留歷史），並更新所有 import：內部跨資料夾相對路徑改為 `../`，外部 10 個 `src/app/(crm)/` 的 `@/components/crm/X` 改為 `@/components/crm/<folder>/X`。**不**新增 barrel（index.ts），維持直接路徑。
- **零行為變更**：僅檔案位置與 import 路徑調整，元件對外行為與 props 一律不動。

## Capabilities

### New Capabilities
<!-- 無新增行為能力 -->

### Modified Capabilities
- `crm-shared-components`: 兩條需求文字內寫死的檔案路徑（`src/components/crm/icons.tsx`、`src/components/crm/owners.ts`）更新為 `common/` 下的新位置，使 spec 與重整後的目錄一致；行為與介面不變。

## Impact

- **搬移檔案**：`src/components/crm/` 下 35 個檔案（AppShell 除外）移入對應子資料夾。
- **import 改動**：crm 內部相對 import；`src/app/(crm)/` 10 個 page/layout 的 `@/components/crm/...` 路徑。
- **不受影響**：`@/` alias、vitest `include: src/**`、元件行為與測試斷言。
- **驗收**：`npm test` 全綠 + `npm run build`／type-check 通過，確保無漏改路徑。
