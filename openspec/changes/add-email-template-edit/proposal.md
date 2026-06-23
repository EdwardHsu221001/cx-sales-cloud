## Why

郵件設定頁目前所有動作（測試寄送、新增、複製、編輯範本、合併欄位）皆為 toast 佔位，無法實際維護範本內容。最優先需求是能編輯既有範本，讓使用者調整主旨、內文與啟用狀態，頁面即時反映變更。

## What Changes

- 「編輯範本」由 toast 佔位改為開啟右側 `cx-drawer` slide-over 編輯表單。
- 編輯表單可修改：範本名稱、啟用狀態、分類、語言、寄件者、收件對象、主旨，以及 `greet`/`p`/`cta` 文字內文區塊的內容。
- `quote`/`sig` 區塊維持原結構、於表單中唯讀顯示；範本 API 識別碼（`k`）唯讀。
- 範本資料由模組常數提升為元件記憶體 state（`EMAIL_TEMPLATES` 作為初始 seed），編輯儲存後更新 state。無後端、無持久化，重整頁面回復初始 mock。
- 儲存做輕量驗證：範本名稱與主旨必填，未填時停用「儲存」並顯示提示。
- 儲存後清單列、統計列（啟用中數量等）、詳情與信件預覽即時反映變更；取消或點遮罩則丟棄草稿。
- 新增範本、複製、測試寄送、合併欄位 chip 點擊維持既有 toast 佔位行為（本次不變更）。

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `email-settings`: 「編輯範本」動作由佔位提示改為開啟編輯抽屜並可儲存變更；新增「範本資料以記憶體 state 保存且可編輯」之行為。其餘佔位動作（新增/複製/測試寄送/合併欄位）維持不變。

## Impact

- `src/components/crm/Settings.tsx`：`EmailPanel`（編輯抽屜 UI、動作接線）、Settings 元件層新增 `emailTemplates`/`emailDraft` state；`EMAIL_TEMPLATES` 改為初始 seed。
- `src/components/crm/email.utils.ts`：可能新增純函式（如套用編輯草稿、驗證）以利測試。
- 測試：新增 `EmailPanel` 編輯流程之元件測試與相關純函式單元測試。
- 無新增相依套件、無 API、無資料遷移。
