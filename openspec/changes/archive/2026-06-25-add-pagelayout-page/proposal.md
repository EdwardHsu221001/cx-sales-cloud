## Why

「頁面版面 Page Layout」原本是設定頁裡的 placeholder。已依原型 `CX CRM Setting 0623.html` 1:1 移植成可運作面板（含統計、物件/版面切換、調色盤搜尋、區段/欄位編輯），但當初略過了 `openspec/WORKFLOW.md` 流程。本變更為**補登（retroactive）**：保留現有程式碼，補上 OpenSpec 文件紀錄與邏輯測試，使其符合流程。

## What Changes

- 將設定頁「頁面版面」由 placeholder 換成可運作面板（`PageLayoutPanel()` 內聯渲染，路由 `/settings/pagelayout`）。
- 純函式抽到 `pagelayout.utils.ts`：`pageLayoutStats()`（版面總數／套用物件）、`filterPalette()`（調色盤關鍵字過濾，移除空群組）。
- 面板互動：切換物件 → 版面 pills 隨之更換並重置選取；調色盤搜尋；編輯版面（移除欄位、折疊區段、移除區段）。
- **補測試**：`pagelayout.utils.test.ts`（純函式）、`Settings.pagelayout.test.tsx`（元件行為）。
- 程式碼本身已完成且綠燈，本變更不重寫，只補文件 + 測試。

## Capabilities

### New Capabilities
- `page-layout`: 頁面版面面板的統計摘要、物件/版面切換、調色盤搜尋、版面編輯（移除欄位/折疊區段/移除區段）行為規格。

### Modified Capabilities
<!-- 無。 -->

## Impact

- `src/components/crm/pagelayout.utils.ts`（已新增）：型別 + `pageLayoutStats` / `filterPalette`。
- `src/components/crm/Settings.tsx`（已修改）：`PL_*` 常數、圖示、state/handler、`PageLayoutPanel()`、nav 接線。
- `src/app/crm.css`（已修改）：builder / palette / page-layout 樣式。
- 測試（本變更新增）：`pagelayout.utils.test.ts`、`Settings.pagelayout.test.tsx`。
- 無後端、無新依賴；資料為記憶體 mock。
