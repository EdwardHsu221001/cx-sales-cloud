## 1. useRowSelection hook（TDD）

- [x] 1.1 建立 `src/components/crm/useRowSelection.ts`：`useRowSelection(allIds: number[])` 回傳 `{ selected, isSelected, allSelected, toggle, toggleAll, deselect, clear }`，`allSelected` 衍生、所有更新採不可變
- [x] 1.2 RED/GREEN：`useRowSelection.test.tsx`（renderHook）— `toggle` 加入/移除、`isSelected` 反映
- [x] 1.3 RED/GREEN：`toggleAll` 全選/全不選 round-trip；`allSelected` 為衍生（`allIds` 變動後自動更新）
- [x] 1.4 RED/GREEN：`deselect(id)` 移除單一已選；`clear()` 清空
- [x] 1.5 全綠：`npm test -- useRowSelection`

## 2. Leads.tsx 改用 hook

- [x] 2.1 以 `useRowSelection(leads.map((l) => l.id))` 取代 `selectedRows`/`allSelected` 兩個 state 與 `toggleRow`/`toggleAll`
- [x] 2.2 表頭全選鈕改綁 `toggleAll`/`allSelected`；列 checkbox 改綁 `isSelected`/`toggle`（`stopPropagation` 維持在 `onClick`）
- [x] 2.3 刪除 Leads 內已不再使用的選取相關程式碼

## 3. Accounts.tsx 改用 hook

- [x] 3.1 以 `useRowSelection(accounts.map((a) => a.id))` 取代 `selectedRows`、衍生 `allSelected` 與 `toggleRow`/`toggleAll`
- [x] 3.2 列 checkbox `onClick` 自行 `e.stopPropagation()` 後呼叫 `toggle(id)`（移除原 `toggleRow` 內部的 `stopPropagation`）；表頭綁 `toggleAll`/`allSelected`；選取判斷改 `isSelected`
- [x] 3.3 `confirmDelete` 內移除選取改用 `deselect(deleteId)`

## 4. 驗收

- [x] 4.1 既有回歸安全網不修改而全綠：`Leads.test.tsx`／`Accounts.test.tsx`
- [x] 4.2 `npm test`（含新 `useRowSelection` 測試）、`npm run lint`、型別檢查全綠
