## Why

客戶帳號頁（`Accounts.tsx`）目前幾乎全是 mock：`ACCOUNTS` 是寫死的 `const`，新增/編輯/刪除按鈕只彈 toast，沒有關鍵字搜尋，「共 N 家」也是寫死數字。`/leads` 已透過 `add-lead-crud-convert` 成熟化（真 CRUD + 真篩選 + 衍生計數 + 純函式分層），客戶帳號應對齊同樣的成熟度，才能成為可操作的模組。

## What Changes

- 將 `ACCOUNTS` 由 `const` 改為元件 state，使資料可被新增/編輯/刪除。
- **BREAKING（內部資料模型）**：為 `Account` 新增 `id` 欄位，並把「選取列」與「詳情抽屜」由陣列索引改為以 `id` 識別，避免新增/刪除後索引位移造成選錯、開錯。
- 抽出 `src/components/crm/accounts.utils.ts`：型別（`Account`、`AccountDraft`、`AccountValidation` 等）與純函式（`filterAccounts`、`validateAccountDraft`、`materializeAccount`、`addAccount`、`editAccount`、`deleteAccount`），全部採不可變更新。
- 新增「表單抽屜」（與既有唯讀詳情抽屜分開）：頭部「新增帳號」開空白表單；詳情抽屜「編輯」開帶值表單。表單收完整公司欄位（名稱、網域、產業、規模、負責業務、健康度、統編/網站/電話/地址/地區/首次合作）。
- 詳情抽屜新增「刪除」入口，點擊先顯示確認 modal，確定才移除。
- 篩選列新增關鍵字搜尋框（名稱／網域子字串比對）；「共 N 家」改為依過濾結果即時衍生計算。
- 衍生值自動推導：`logo`（名稱首字）、`lg`（固定預設漸層）、`star`（新增預設 false）、`amt`/`oppN`（新增為 0、編輯沿用）、`contacts`/`opps`/`acts`（新增為空、編輯沿用）。

## Capabilities

### New Capabilities
- `account-management`: 客戶帳號的建立、編輯、刪除、關鍵字搜尋，以及衍生顯示值的自動推導與身分（id）一致性。

### Modified Capabilities
<!-- 無既有客戶帳號 spec，故不修改既有 capability。 -->

## Impact

- `src/components/crm/Accounts.tsx`：資料改 state、加 id、加搜尋框、表單抽屜、刪除確認 modal、計數改衍生。
- 新檔 `src/components/crm/accounts.utils.ts`（型別 + 純函式）。
- 新測試 `src/components/crm/accounts.utils.test.ts`（vitest）、`src/components/crm/Accounts.test.tsx`（RTL）。
- 不影響後端（本專案無後端）；4 個篩選下拉、統計列四張卡、分頁維持現狀（仍為裝飾）。
