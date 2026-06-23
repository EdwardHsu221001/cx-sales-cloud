## 1. 純函式 filterLeads（vitest，TDD）

- [x] 1.1 寫 `src/components/crm/leads.utils.test.ts`：涵蓋依姓名過濾、依公司過濾、不分大小寫、空字串/全空白回傳全部、無相符回傳空陣列；執行 `npm test` 確認**全部紅燈**且失敗原因正確
- [x] 1.2 建立 `src/components/crm/leads.utils.ts`，匯出 `Lead` 型別與 `filterLeads(leads, query)`，寫最少程式碼讓 1.1 測試轉綠
- [x] 1.3 重構（命名/重複），保持綠燈

## 2. Leads 搜尋 UI 行為（@testing-library/react，TDD）

- [x] 2.1 寫 `src/components/crm/Leads.test.tsx`：渲染後輸入關鍵字只剩相符列、清空還原全部、無相符顯示空狀態訊息、「共 N 筆」反映過濾筆數；用 `getByRole`/`getByLabelText` + `userEvent`；執行 `npm test` 確認**紅燈**
- [x] 2.2 修改 `Leads.tsx`：將 `LEADS` 型別改用 `leads.utils` 的 `Lead`，新增 `query` state 與 `aria-label="搜尋潛客"` 的搜尋輸入框
- [x] 2.3 表格改渲染 `filterLeads(LEADS, query)`；「共 N 筆」綁過濾後筆數；無相符時渲染「找不到符合『{query}』的潛客」訊息列，讓 2.1 測試轉綠
- [x] 2.4 重構並保持綠燈

## 3. 驗收

- [x] 3.1 `npm test` 全綠且輸出乾淨（12/12 passed）
- [x] 3.2 `npm run type-check` 通過；本次改動 4 檔 lint 乾淨（全專案另有 Settings.tsx 既有 lint 債，不在本變更範圍）
- [x] 3.3 對照 specs 的每個 scenario 逐一確認皆有對應通過的測試（7/7 covered）
