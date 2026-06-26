## Why

`Leads.tsx` 與 `Accounts.tsx` 各自重複一套「列選取」邏輯（`selectedRows: Set<number>` + `toggleRow`/`toggleAll`/`allSelected`）。兩份不只重複，還已經漂移：Accounts 的 `allSelected` 是衍生值（永遠正確），Leads 卻把它存成獨立 `useState` 手動同步，清單變動時會 desync。把它抽成共用 hook 可去重並順手修掉這個潛在 bug。這是 Tier 2 第一項（最獨立、風險最低）。

## What Changes

- 新增 `src/components/crm/useRowSelection.ts`：`useRowSelection(allIds)` 回傳 `{ selected, isSelected, allSelected, toggle, toggleAll, deselect, clear }`。
- `allSelected` 一律由 `selected.size === allIds.length && allIds.length > 0` 衍生（採 Accounts 現行做法），**修掉 Leads `allSelected` 獨立 state 的 desync**。
- `stopPropagation` 不放進 hook（屬 DOM 關注點）；Accounts `toggleRow` 內部的 `e.stopPropagation()` 移到 `onClick` 呼叫點（Leads 本就如此）。
- `Leads.tsx`／`Accounts.tsx` 改用 hook，刪除各自重複的 `selectedRows`/`allSelected`/`toggleRow`/`toggleAll`；Accounts 刪除流程改用 `deselect(id)`。
- 行為不變：`toggleAll`／`allSelected` 仍以整份清單為基準（select-all 仍含被搜尋過濾掉的列）。

## Capabilities

### New Capabilities
<!-- 無新增 capability。 -->

### Modified Capabilities
- `crm-shared-components`: 新增「列選取共用 hook」需求 —— 規範 `useRowSelection` 的對外介面與選取行為（衍生 `allSelected`、不可變更新、整份清單為基準）。

## Impact

- 新檔：`src/components/crm/useRowSelection.ts` 與單元測試 `useRowSelection.test.ts(x)`。
- 既有：`Leads.tsx`、`Accounts.tsx`（改用 hook、刪除重複選取邏輯；Accounts `toggleRow` 的 `stopPropagation` 移至呼叫點）。
- 不影響後端（本專案無後端）。範圍僅 Tier 2 第一項；明確排除 FormDrawer 外殼、Pager 與 Tier 3。
- 回歸保證：現有 `Leads.test.tsx`／`Accounts.test.tsx`（112 tests）不需修改而維持全綠。
