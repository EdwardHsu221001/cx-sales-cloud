## 1. accounts.utils.ts 型別與純函式（TDD）

- [x] 1.1 建立 `src/components/crm/accounts.utils.ts`，移入/定義型別：`Account`（含新增的 `id`）、`HealthKey`、`OwnerId`、`Contact`、`OppLink`、`Activity`、`AccountDraft`（僅使用者填欄位）、`AccountValidation`，並匯出 `OWNERS`、`HEALTH_META`、預設漸層常數
- [x] 1.2 RED：在 `accounts.utils.test.ts` 寫 `filterAccounts` 測試（名稱/網域子字串、不分大小寫、空字串回全部），先看它失敗
- [x] 1.3 GREEN：實作 `filterAccounts` 使測試通過
- [x] 1.4 RED/GREEN：`validateAccountDraft`（名稱必填，回 `ok`/`nameError`）
- [x] 1.5 RED/GREEN：`materializeAccount(draft, newId, existing?)` — 驗證衍生值：`logo` 首字、`lg` 預設漸層、新增時 `star=false`/`amt='NT$ 0'`/`oppN=0`/空陣列/`age='—'`；編輯時沿用 `existing` 的 `star`/`amt`/`oppN`/`contacts`/`opps`/`acts`/`age` 與原 `id`
- [x] 1.6 RED/GREEN：`addAccount`、`editAccount`、`deleteAccount` — 驗證不可變更新（`expect(next).not.toBe(prev)`、長度與內容正確）
- [x] 1.7 Refactor + 全綠：`npm test -- accounts.utils`

## 2. Accounts.tsx 接上資料模型（id + state）

- [x] 2.1 為 `ACCOUNTS` 每筆加 `id`，並改用 `useState` 持有清單；型別改從 `accounts.utils.ts` 匯入
- [x] 2.2 `selectedRows` 改為 `Set<number>`（以 id 為元素）；`toggleRow`/`toggleAll` 改用 id
- [x] 2.3 詳情抽屜由 `drawerIdx`（索引）改為 `drawerId`（id）；`openDrawer`/`navigate`/Esc 關閉一併改 id
- [x] 2.4 `navigate`（上一筆/下一筆）改走 `filtered` 清單中目前 id 的位置

## 3. 搜尋與計數

- [x] 3.1 篩選列新增關鍵字搜尋框（含可及性 label/aria-label），綁 `query` state
- [x] 3.2 `const filtered = filterAccounts(accounts, query)`；表格改 map `filtered`
- [x] 3.3 「共 N 家」改為 `filtered.length`；查無結果顯示空狀態
- [x] 3.4（保留現狀）確認 4 個下拉、統計列、分頁維持裝飾不動

## 4. 新增/編輯表單抽屜

- [x] 4.1 新增表單抽屜元件/區塊（與唯讀詳情抽屜分離），含 open 與 `draft` state
- [x] 4.2 欄位：名稱、網域、產業、規模、負責業務（下拉）、健康度（下拉）、統編、網站、電話、地址、地區、首次合作（受控元件綁草稿）
- [x] 4.3 頭部「新增帳號」→ 開空白表單；詳情抽屜「編輯」→ `structuredClone` 現值成草稿開帶值表單
- [x] 4.4 即時驗證顯示（名稱必填錯誤）；儲存：驗證不過則擋；通過則 `addAccount`/`editAccount` 寫回並關抽屜
- [x] 4.5 取消/Esc：丟棄草稿、資料不變

## 5. 刪除確認 modal

- [x] 5.1 詳情抽屜新增「刪除」入口
- [x] 5.2 點擊先顯示確認 modal（確定／取消）
- [x] 5.3 確定 → `deleteAccount`、自 `selectedRows` 移除該 id、若抽屜正開該筆則關閉；取消 → 不變

## 6. 元件測試與驗收

- [x] 6.1 `Accounts.test.tsx`（RTL + userEvent）：新增流程（填名稱→儲存→清單+1、計數+1）
- [x] 6.2 編輯流程（改值→儲存→顯示新值、筆數不變）與必填驗證擋存
- [x] 6.3 刪除流程（刪除→確認→移除、計數-1）與取消不刪
- [x] 6.4 搜尋過濾與「共 N 家」即時更新；查無結果空狀態
- [x] 6.5 查詢一律用 `getByRole`/`getByLabelText`；`npm test` 與 `npm run lint`/型別檢查全綠
