## Context

`Leads.tsx` 與 `Accounts.tsx` 在 `add-lead-crud-convert` 與 `add-account-crud-search` 兩個變更後結構趨於對稱，但也暴露重複：兩支各自 inline 定義同形 icon、各自維護 `OWNERS`（同資料、key 名不同：leads 用 `{name,bg,initial}`、accounts 用 `{nm,av,g}`）、刪除確認 modal 與搜尋框幾乎相同。專案已有共用慣例（`crm/icons.tsx` 內含 21 個 icon、`ui/button.tsx`）卻未被沿用。本變更只做 Tier 1 的「真重複」去除，不做更大的元件重塑。

放置慣例：`ui/` 放與業務無關的設計系統原子元件；`crm/` 放領域／綁 `cx-*` 樣式的元件（如既有 `EmptyState.tsx`、`icons.tsx`）。本次四個產出皆綁 CRM 領域或 `cx-*` 樣式，故全部放 `crm/`。

## Goals / Non-Goals

**Goals:**

- 去除 Leads/Accounts 之間的真重複：icons、負責人資料、刪除確認 modal、搜尋框。
- 沿用既有 `crm/icons.tsx`，集中 icon、`IconChevron` 改可定向。
- 行為與視覺保持不變；現有 105 個測試為回歸安全網，須全綠。

**Non-Goals:**

- 不做 Tier 2/3：FormDrawer 外殼、`useRowSelection` hook、Pager、StatBar、詳情抽屜不在此次範圍。
- 不把 `ConfirmModal` 升級為脫離 `cx-*` 的 `ui/` 設計系統元件（屬另一個更大變更）。
- 不更動 Leads 的「轉換 modal」（結構與用途不同）。
- 不改任何使用者可見行為（搜尋語意、刪除流程、負責人顯示一律照舊）。

## Decisions

**1. 四個產出全放 `crm/`。** `owners.ts`、`ConfirmModal.tsx`、`SearchPill.tsx` 新增於 `crm/` 根；icon 擴充既有 `crm/icons.tsx`。
理由：皆綁 CRM 領域或 `cx-*` 樣式，搬到別的 App 不能直接用，符合「能跨 App 用才放 ui/」準則，與既有 `EmptyState.tsx` 放置一致。
替代方案：把 `ConfirmModal` 放 `ui/` —— 但其依賴 `cx-modal-*` 樣式，需重設計成 token 化 Dialog，超出 Tier 1，否決。

**2. `IconChevron` 加 `dir` 參數取代左右版。** 既有 `icons.tsx` 的 `IconChevron` 為向下；改為接受 `dir`（up/down/left/right，預設 down），以單一元件涵蓋四向。
理由：避免再新增 `IconChevronLeft/Right` 三四個近乎相同的檔內函式。
替代方案：分別新增 `IconChevronLeft`、`IconChevronRight` —— 較直白但持續製造同形 icon 多份，與「集中去重」目標相悖。

**3. Icon drift 一律以 `icons.tsx` 版為準。** 形狀相同但 stroke 不同者（如 inline `IconCheck` 用 `strokeWidth=3`、`icons.tsx` 用 `2.4`），統一採共用版，接受極微視覺差異。
理由：一致性即此次目的；保留每頁原樣需把 stroke 參數化，反而把簡單 icon 複雜化。
替代方案：為差異者加 `strokeWidth` prop 保留像素原樣 —— 過度設計，否決。

**4. `owners.ts` 正規結構統一為 `{ name, initial, gradient }`。** 取代 leads 的 `{name,bg,initial}` 與 accounts 的 `{nm,av,g}`。
理由：欄位語意清楚、跨頁一致。呼叫端少（leads 側 3 處、accounts 側約 5 處），改名成本可控。
作法：`leads.utils` 改 `bg→gradient`；`accounts.utils`／`Accounts.tsx` 改 `nm→name`、`av→initial`、`g→gradient`。兩支 utils 由 `owners.ts` import，並 re-export `OwnerId`/`OWNERS` 以降低其他呼叫端 churn。

**5. 共用元件維持既有 DOM／class／aria 結構。** `ConfirmModal` 沿用 `cx-modal-overlay` + `role="dialog"` + `aria-label`；`SearchPill` 沿用 `cx-fpill cx-lead-search` + `type="search"` + `aria-label`。
理由：現有 RTL 測試以 `getByRole('dialog'/'searchbox', { name })`、`確定刪除`、`取消` 查詢；維持結構即可確保零行為回歸、測試免改。

## Risks / Trade-offs

- [Icon path 漂移：直接換成 `icons.tsx` 版可能與原視覺不等價] → 逐一比對被取代的 inline path；非等價者依決策 3 統一，並跑一次 app 目視 Leads/Accounts 無破圖。
- [owner 欄位改名漏改某呼叫端導致編譯錯誤] → 型別檢查（`tsc --noEmit`）會抓出殘留舊欄位；改完跑型別檢查全綠才算完成。
- [抽 `ConfirmModal`/`SearchPill` 不慎改動 DOM 使既有測試紅] → 以「結構不變」為硬約束，重構後先跑現有 105 測試確認全綠，再加新單元測試。
- [一次動到兩支大檔（Leads/Accounts）增加 review 面積] → 範圍嚴守 Tier 1、行為不變，diff 多為機械式 import 替換；以測試全綠佐證等價。

## Migration Plan

純前端、無資料遷移。實作順序：先建 `owners.ts` 與擴充 `icons.tsx`（含 `IconChevron` dir）→ 改 `leads.utils`/`accounts.utils` 用 `owners.ts` → 抽 `ConfirmModal`、`SearchPill` → 兩支頁面改 import 並刪 inline icon、改 owner 欄位名、換用共用元件 → 跑現有測試＋新單元測試＋lint＋型別檢查。回滾即還原這批檔案。

## Open Questions

無（範圍與放置位置已於 brainstorming 收斂並確認）。

