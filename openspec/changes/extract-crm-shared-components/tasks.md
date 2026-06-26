## 1. owners.ts（單一負責人登錄）

- [x] 1.1 新增 `src/components/crm/owners.ts`，匯出 `OwnerId` 型別與 `OWNERS`，正規結構 `{ name, initial, gradient }`（沿用現有三人資料與漸層）
- [x] 1.2 `leads.utils.ts` 改為從 `owners.ts` import `OwnerId`/`OWNERS` 並 re-export；`materializeLead` 內 `owner.bg → owner.gradient`（`assigneeBg` 來源）；移除本檔重複的 `OWNERS`/`OwnerId` 定義
- [x] 1.3 `accounts.utils.ts` 改為從 `owners.ts` import `OwnerId`/`OWNERS` 並 re-export；移除本檔重複的 `OWNERS`/`OwnerId` 定義
- [x] 1.4 `Accounts.tsx` 內 owner 欄位改名：`OWNERS[...].nm → .name`、`own.av → .initial`、`own.g → .gradient`
- [x] 1.5 `npm test -- leads.utils accounts.utils` 與型別檢查全綠（確認改名無殘留）

## 2. icons.tsx（集中與可定向 chevron）

- [x] 2.1 `IconChevron` 加 `dir?: 'up'|'down'|'left'|'right'`（預設 `down`），以單一元件涵蓋四向
- [x] 2.2 將 Leads/Accounts inline 用到但 `icons.tsx` 缺的圖示補進 `icons.tsx`（如 `IconTrash`、`IconClose`、`IconEdit`、`IconExport`、`IconList`、`IconGrid`、`IconArrowRight`、`IconLink`、`IconPin`、`IconDotsV`、`IconPersonAdd`、`IconCardScan`、`IconFileCsv`、`IconTarget`、`IconClockCircle`、`IconCheckFat`、`IconArrowUpRight`、`IconBuilding`、`IconPerson`、`IconTrendUp`、`IconArrowDown` 等）
- [x] 2.3 逐一比對被取代的 inline path 與 `icons.tsx` 版是否視覺等價；不等價者依「統一採 icons.tsx 版」政策處理（`IconCheck` 全站 2.4；`IconOpps` Accounts 改用共用 strokeless 版，列入目視檢查）

## 3. ConfirmModal 與 SearchPill（共用元件 + 單元測試）

- [x] 3.1 新增 `src/components/crm/ConfirmModal.tsx`：介面 `open`/`title`/`message`/`confirmLabel`/`onConfirm`/`onCancel`/`ariaLabel`，維持 `cx-modal-overlay` + `role="dialog"` + `aria-label` 結構
- [x] 3.2 RED/GREEN：`ConfirmModal.test.tsx` — open 時呈現 `role="dialog"`；按確認觸發 `onConfirm`；按取消觸發 `onCancel`
- [x] 3.3 新增 `src/components/crm/SearchPill.tsx`：介面 `value`/`onChange`/`label`/`placeholder`，渲染 `cx-fpill cx-lead-search` + `type="search"` + `aria-label={label}`
- [x] 3.4 RED/GREEN：`SearchPill.test.tsx` — 以 `getByRole('searchbox', { name })` 取得；輸入觸發 `onChange`

## 4. 接上頁面（Leads / Accounts）

- [x] 4.1 `Leads.tsx`：改 import `icons.tsx` 的圖示並刪除所有 inline icon 函式；左右 chevron 改用 `IconChevron dir=...`
- [x] 4.2 `Leads.tsx`：刪除確認 modal 換用 `<ConfirmModal>`；搜尋框換用 `<SearchPill>`（「轉換 modal」維持不動）
- [x] 4.3 `Accounts.tsx`：改 import `icons.tsx` 的圖示並刪除所有 inline icon 函式；左右 chevron 改用 `IconChevron dir=...`
- [x] 4.4 `Accounts.tsx`：刪除確認 modal 換用 `<ConfirmModal>`；搜尋框換用 `<SearchPill>`

## 5. 驗收

- [x] 5.1 現有回歸安全網全綠：`Leads.test.tsx`／`Accounts.test.tsx`／`*.utils.test.ts`
- [x] 5.2 `npm test`（含新 `ConfirmModal`/`SearchPill` 測試）、`npm run lint`、型別檢查全綠
- [x] 5.3 跑一次 app 目視 Leads 與 Accounts 頁面，確認無破圖、圖示方向正確（含 `IconOpps` Accounts 改用共用版後的線條粗細）
