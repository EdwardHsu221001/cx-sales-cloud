## Context

`src/components/crm/` 現有 36 個檔案攤平於單層，混雜業務實體（accounts/contacts/leads/opportunities/activities）、共用元件（icons/owners/ConfirmModal/SearchPill/useRowSelection/FormDrawer/EmptyState）、頁面框架（AppShell/Settings/Dashboard/HomeDashboard/Reports）與各自的 `*.utils.ts` 與測試。

引用關係已盤點：
- **外部**：`src/app/(crm)/` 下 10 個 page/layout，全用 `@/components/crm/X` alias。
- **內部**：實體 import 自身 utils 與 `common` 元件、icons；utils import owners；`Dashboard` import Leads/Opportunities/Accounts；`Settings` import icons/email.utils/pagelayout.utils；`ConfirmModal`/`FormDrawer` import icons。

約束：`@/` alias 指向 `src/`；vitest `include: src/**`、測試與受測檔 co-located；專案鐵則為不可變更新與行為不變。

## Goals / Non-Goals

**Goals:**
- 依物件/職責將 `crm/` 分為子資料夾，使每個實體自成可獨立理解的單元。
- 為後續新增 CRUD 模組建立一致的落點與範式。
- 全程零行為變更，靠既有測試與 build 證明等價。

**Non-Goals:**
- 不改任何元件行為、props、樣式或邏輯。
- 不新增 barrel（index.ts）；維持直接檔案路徑 import。
- 不做與本次分組無關的重構（不合併檔案、不重寫 Settings 巨檔）。
- 不調整 `AppShell.tsx` 位置（留 `crm/` 根層）。

## Decisions

**目錄分組**：`accounts/`、`contacts/`、`leads/`、`opportunities/`、`activities/`、`common/`、`settings/`、`dashboard/`，`AppShell.tsx` 留根層。
- 替代方案：依「層」分（components/hooks/utils）。否決——CRM 是以實體為核心的領域，依物件分組讓相關檔案聚在一起，符合既有 `*.utils.ts` 緊鄰元件的慣例。

**單檔實體也包資料夾**（opportunities/activities）：一致性優先，未來長出 utils/test 不必再搬。
- 替代方案：單檔留根層。否決——半套（有些包有些不包）才是真正的混亂來源。

**不加 barrel，直接路徑**：與現狀一致（目前無任何 index.ts），import 來源一目了然，少一層維護。

**共用資料夾命名 `common/`**（依使用者指定，非 `shared/`）。只放真正跨模組共用者，守住界線、不當雜物抽屜。

**搬移用 `git mv`**：保留檔案歷史，利於日後 blame/追溯。

## Risks / Trade-offs

- **漏改 import 路徑** → 以 `npm run build`／type-check 全量驗證；TypeScript 會抓出任何斷掉的相對或 alias 路徑。
- **co-located 測試路徑變動致失敗** → 測試檔隨受測檔一起 `git mv`，相對 import 同步更新；`npm test` 全綠作為等價證據。
- **spec 與目錄不同步**（icons.tsx/owners.ts 路徑寫死於 `crm-shared-components`）→ 本 change 含該 spec 的 delta，同步更新路徑文字。
- **逐資料夾搬移中途 import 暫時斷裂** → 每搬一組即更新其 import 並在最後一次性跑測試與 build，不在半完成狀態宣稱完成。

## Migration Plan

1. 建立子資料夾，以 `git mv` 將各檔（含 `*.test.*`）搬入對應資料夾；`AppShell.tsx` 不動。
2. 更新 `crm/` 內部 import：同資料夾維持 `./`，跨資料夾改 `../<folder>/X`。
3. 更新 `src/app/(crm)/` 10 個 page/layout 的 `@/components/crm/X` → `@/components/crm/<folder>/X`。
4. 更新 `crm-shared-components` 主 spec 路徑（透過 sync/archive 流程）。
5. 驗收：`npm test` 全綠、`npm run build`／type-check 通過。
- 回退策略：純檔案搬移，必要時 `git revert` 即可完整還原。
