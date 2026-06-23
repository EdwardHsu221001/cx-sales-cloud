## Context

`src/components/crm/Leads.tsx` 是一個 client component，使用 module 層級的靜態 `LEADS` 陣列渲染表格。現有上方篩選 `select` 僅觸發 toast、不會真的過濾。本專案的測試環境已就緒（vitest + jsdom + @testing-library/react + user-event + jest-dom），但目前 `src` 下尚無任何測試。本變更同時作為導入 TDD + testing-library 流程的第一個示範。

## Goals / Non-Goals

**Goals:**

- 在 Leads 頁提供即時、可運作的關鍵字搜尋（姓名 + 公司，不分大小寫）。
- 過濾邏輯與 UI 分離，使其能用 vitest 獨立測試。
- UI 互動可用 @testing-library/react + user-event 測試（無障礙查詢）。
- 計數同步、無相符空狀態。

**Non-Goals:**

- 不更動既有的下拉篩選（評分/狀態/來源/指派）。
- 不做分頁互動、debounce、模糊比對、後端查詢。
- 不調整 stat bar 上的統計數字。

## Decisions

**1. 過濾邏輯抽成純函式 `filterLeads(leads, query)`（放 `leads.utils.ts`）**
而非寫在元件內 inline。理由：純函式無 DOM 依賴，能用 vitest 直接、快速、窮舉式測試各種邊界（空字串、大小寫、無相符）；元件測試則專注互動行為。符合「測行為不測實作」與單元隔離原則。
- 替代方案：直接在元件內用 `useMemo` 過濾 → 邏輯與 render 綁死，邊界測試只能透過 DOM 間接驗證，較脆弱。捨棄。

**2. 搜尋以受控 `useState` query 驅動，render 時即時計算 `filterLeads(LEADS, query)`**
資料量小（靜態），不需 debounce 或 memo 最佳化。

**3. 輸入框提供 `aria-label="搜尋潛客"`**
讓測試以使用者視角查詢（`getByRole('searchbox')` / `getByLabelText`），不依賴 class 或 testid。

**4. 計數綁定 `filtered.length`，空狀態以條件渲染一列訊息**
訊息文字含關鍵字，方便測試斷言。

## Risks / Trade-offs

- [靜態資料下「共 32 筆」與實際 6 列本就不一致] → 本次將計數改綁過濾後實際列數，使其在搜尋情境下行為正確；stat bar 的統計數字屬裝飾、不在範圍內。
- [中文姓名/公司的大小寫對中文字無意義] → `toLowerCase()` 對中文為 no-op，不影響正確性；大小寫不敏感主要保障英數內容（如公司英文名）。
