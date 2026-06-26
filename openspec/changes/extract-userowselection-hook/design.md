## Context

`Leads.tsx` 與 `Accounts.tsx` 各自重複一套列選取邏輯。兩者已漂移：Accounts 的 `allSelected` 是衍生值，Leads 把它存成獨立 `useState` 並在 `toggleRow`/`toggleAll` 內手動同步——清單筆數變動（如刪除）時不會自動更新，是潛在 desync bug。`add-account-crud-search` 與 `extract-crm-shared-components` 已建立「純邏輯抽離、共用元件放 `crm/`」的範式，本變更比照處理列選取，屬 Tier 2 第一項（最獨立）。

## Goals / Non-Goals

**Goals:**

- 抽出 `useRowSelection(allIds)` 共用 hook，去除兩頁重複的選取邏輯。
- 以衍生 `allSelected` 統一兩頁，順手修掉 Leads 的 desync bug。
- 行為與既有測試保持不變（112 tests 全綠，且不需修改）。

**Non-Goals:**

- 不碰 Tier 2 其餘項（FormDrawer 外殼、Pager）與 Tier 3。
- 不改 select-all 語意（仍以整份清單為基準，含被搜尋過濾掉的列）。
- 不為其他頁面新增選取功能。
- hook 不處理 DOM 事件。

## Decisions

**1. `allSelected` 一律衍生。** `selected.size === allIds.length && allIds.length > 0`，採 Accounts 現行做法。
理由：消除 Leads 獨立 state 的 desync；單一真實來源。
替代方案：保留獨立 state 並在更多地方同步——脆弱，否決。

**2. `stopPropagation` 留在呼叫端。** hook 的 `toggle(id)` 只收 id；DOM 事件由 `onClick` 處理。
理由：hook 應為純狀態邏輯、可單測，不依賴 `React.MouseEvent`。
影響：Accounts 現行 `toggleRow(id, e)` 內部的 `e.stopPropagation()` 移到 `onClick`（Leads 本就如此）。

**3. 提供 `deselect(id)`。** 供 Accounts `confirmDelete` 在刪除後把該 id 自選取移除，保留現行行為。Leads 不需要（其刪除流程未動選取）。
替代方案：hook 自動依 `allIds` 修剪選取——較隱晦且改變現行時機，否決；明確 `deselect` 較直白。

**4. `allIds` 為整份清單。** 兩頁傳入 `accounts`／`leads` 的全部 id（非 `filtered`），維持 select-all 現狀。
理由：本變更為純重構，不改使用者可見行為；改 filtered 屬另一個 UX 決策。

## Risks / Trade-offs

- [改寫兩頁選取相關 JSX 不慎改動行為] → 以「現有 Leads/Accounts 測試不修改而維持全綠」為硬約束驗證等價。
- [Accounts `stopPropagation` 移位若遺漏，點 checkbox 會誤觸開抽屜] → 既有 Accounts 測試涵蓋列點擊與抽屜開啟，迴歸可捕捉；改完跑全測試。
- [hook 單元測試需 renderHook] → 採 `@testing-library/react` 的 `renderHook`（已是相依）；若不可用則以極小測試元件驗證。

## Migration Plan

純前端、無資料遷移。順序：先建 `useRowSelection.ts` + 單元測試 → 改 `Leads.tsx` 用 hook（刪獨立 `allSelected`）→ 改 `Accounts.tsx` 用 hook（`stopPropagation` 移呼叫點、刪除流程改 `deselect`）→ 跑新測試 + 既有 112 測試 + lint + 型別檢查。回滾即還原這批檔案。

## Open Questions

無（介面與 select-all 語意已於 brainstorming 收斂並確認）。
