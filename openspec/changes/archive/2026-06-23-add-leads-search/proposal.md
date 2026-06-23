## Why

潛在客戶（Leads）清單目前只能整頁瀏覽，上方的篩選下拉是裝飾性的（只跳 toast、不會真的過濾）。當名單變多時，使用者無法快速定位某個人或某家公司。提供一個會即時運作的搜尋欄，是清單頁最基本、最高頻的需求。

## What Changes

- 在 Leads 清單頁新增一個**即時搜尋輸入框**，輸入時立即過濾表格列。
- 搜尋比對**姓名**與**公司**兩個欄位，**不分大小寫**，採子字串比對。
- 清單上方「共 N 筆」的計數改為反映**過濾後**的筆數（目前為寫死的 32）。
- 當沒有任何相符結果時，顯示空狀態訊息「找不到符合『{關鍵字}』的潛客」。
- 過濾邏輯抽成一個**純函式**，與 UI 分離，便於獨立測試。
- 不更動既有的下拉篩選（維持現狀）。

## Capabilities

### New Capabilities

- `leads-search`: 潛在客戶清單的即時關鍵字搜尋（依姓名與公司過濾、計數同步、無相符的空狀態）。

### Modified Capabilities

<!-- 無既有 spec 需求變更 -->

## Impact

- `src/components/crm/Leads.tsx`：新增搜尋輸入與 query 狀態，表格改渲染過濾結果，計數綁定過濾筆數。
- 新增 `src/components/crm/leads.utils.ts`：純函式 `filterLeads(leads, query)`。
- 新增測試：`leads.utils.test.ts`（vitest）、`Leads.test.tsx`（@testing-library/react）。
- 無新增相依套件（vitest、@testing-library/react、user-event、jest-dom 皆已就緒）。
