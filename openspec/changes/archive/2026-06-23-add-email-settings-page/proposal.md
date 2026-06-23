## Why

設定中心的「郵件設定」目前是 `ph:true` 佔位，點擊只顯示 PlaceholderPanel，與已實作的其他設定頁（使用者、角色、物件…）落差明顯。`CX CRM Setting 0623.html` 已備妥完整的郵件範本管理畫面設計，需轉換成專案程式碼，讓此頁達到與其他設定頁一致的成熟度。

## What Changes

- 將設定導覽中的 `email` 項目從佔位（`ph:true`）改為正式頁面。
- 新增 `EmailPanel`：忠實還原 HTML 設計（統計列、左右分割的「可搜尋範本清單 + 範本詳情預覽 + 合併欄位面板」）。
- 移植 HTML 內的 mock 資料為 typed 常數：5 個範本分類、12 個郵件範本（啟用狀態 / 寄收件者 / 主旨 / block 內文）、5 組合併欄位。
- 可運作的前端互動：點選範本切換詳情、搜尋即時過濾清單、信件預覽中 `{{...}}` 合併欄位高亮。
- 動作按鈕（測試寄送 / 新增範本 / 複製 / 編輯範本 / 點合併欄位）維持 toast 佔位，留待後續變更實作。
- 移植 `em-*` 樣式至 `crm.css`。

## Capabilities

### New Capabilities
- `email-settings`: 設定中心的郵件範本管理頁，提供範本清單瀏覽、分類分組、搜尋過濾、範本詳情與信件預覽、合併欄位面板等唯讀檢視能力。

### Modified Capabilities
<!-- 無 spec 層級的既有能力變更 -->

## Impact

- `src/components/crm/Settings.tsx`：移除 `email` 的 `ph:true`；新增 `EmailPanel` 函式與資料常數；render 區加 `{activeTab === 'email' && <EmailPanel />}`；`isFullPanel` 陣列加入 `'email'`。
- `src/app/crm.css`：新增 `em-*` 樣式。
- 新增元件測試（`@testing-library/react`）：渲染清單、搜尋過濾、點選切換詳情。
- 無後端、無持久化、無新增相依套件。
