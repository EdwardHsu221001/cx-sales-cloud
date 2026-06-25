## Context

面板程式碼已 off-process 完成並綠燈（`pagelayout.utils.ts` + `Settings.tsx` 的 `PageLayoutPanel()` + `crm.css`），設計定於原型 `CX CRM Setting 0623.html`。本變更為補登：不重寫程式碼，只補 OpenSpec 文件與邏輯測試。沿用專案慣例：純邏輯抽 `*.utils.ts` 並以 vitest 測，元件行為以 testing-library 測。

## Goals / Non-Goals

**Goals:**
- 補齊 OpenSpec change 文件（proposal/design/spec/tasks）使面板符合 WORKFLOW。
- 對「邏輯」補測試：`pageLayoutStats`、`filterPalette`（純函式）、以及切換/搜尋/編輯的元件行為。
- 完成後歸檔並同步主 spec。

**Non-Goals:**
- 不重寫或重構既有面板程式碼（僅在測試驅動下做必要微調）。
- 不測純呈現（SVG、靜態欄位文字、樣式）—交給視覺驗證。
- 不接後端、不持久化。

## Decisions

**1. 純函式留在 `pagelayout.utils.ts`，補測試使其「名正言順」。**
`pageLayoutStats(pills)` 由版面對應表推導 `{layouts, objects}`；`filterPalette(groups, search)` 關鍵字過濾並移除空群組。皆無副作用，vitest 直接測。

**2. 面板以 `PageLayoutPanel()` 內聯呼叫渲染（非 `<PageLayoutPanel />`）。**
刻意為之，避免面板卸載重掛導致失焦/捲動重置（同 EmailPanel 的已知陷阱）。測試與重構時保留此寫法。

**3. 區段折疊為 CSS 驅動（`.collapsed` class），欄位不移出 DOM。**
因此「折疊」的元件測試以 section 容器的 `collapsed` class 切換來斷言（CSS 隱藏，jsdom 不套用樣式，無法用 not-in-document）。「移除欄位/區段」則為真正的 state 移除，可用 not-in-document 斷言。

## Risks / Trade-offs

- [折疊測試需依賴 `collapsed` class，略偏離「不依賴 class」原則] → 折疊本質是 CSS 行為，class 斷言為合理折衷；其餘查詢仍用 role/text/title。
- [`PageLayoutPanel()` 內聯寫法易被誤改成元件標籤] → 於 design 與程式碼註解標明原因，測試保留現寫法。
- [補登測試可能揭露既有實作小瑕疵] → 若 RED 後發現實作不符預期，依 systematic-debugging 處理，必要時微調實作。
