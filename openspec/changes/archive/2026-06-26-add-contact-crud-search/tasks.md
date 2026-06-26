## 1. contacts.utils.ts 型別與純函式（TDD）

- [x] 1.1 建立 `src/components/crm/contacts.utils.ts`，定義型別：`Contact`（含新增 `id`）、`CoId`、`OppLink`、`Activity`、`ActType`、`ContactDraft`（僅使用者填欄位）、`ContactValidation`，並匯出 `CO`、`ROLE_OPTIONS`、預設漸層常數；`OwnerId`/`OWNERS` 自 `owners.ts` 匯入並 re-export
- [x] 1.2 RED/GREEN：`filterContacts`（姓名／公司名（經 `CO`）／Email 子字串、不分大小寫、空字串回全部）
- [x] 1.3 RED/GREEN：`validateContactDraft`（姓名必填，回 `ok`/`nameError`）
- [x] 1.4 RED/GREEN：`materializeContact(draft, newId, existing?)` — 驗證衍生值：`av` 首字、`g` 預設漸層、新增時 `last`/`ago='—'`、`opps`/`acts` 空陣列；編輯時沿用 `existing` 的 `last`/`ago`/`opps`/`acts` 與原 `id`
- [x] 1.5 RED/GREEN：`addContact`、`editContact`、`deleteContact` — 驗證不可變更新（`expect(next).not.toBe(prev)`、長度與內容正確）
- [x] 1.6 Refactor + 全綠：`npm test -- contacts.utils`

## 2. Contacts.tsx 接上資料模型（id + state + owners）

- [x] 2.1 為 `CONTACTS` 每筆加 `id`，改用 `useState` 持有；型別改從 `contacts.utils.ts` 匯入
- [x] 2.2 以 `owners.ts` 的 `OWNERS` 取代本地 `ASSIGNEES`；用到處 `.nm`/`.av`/`.g` → `.name`/`.initial`/`.gradient`
- [x] 2.3 移除 `selRows`/`selCards` 兩組選取，改用單一 `useRowSelection(filtered.map((c) => c.id))`；list 與 grid 的勾選/全選改綁 hook（`isSelected`/`toggle`/`toggleAll`/`allSelected`，`stopPropagation` 留呼叫端）
- [x] 2.4 詳情抽屜由 `drawerIdx` 改 `drawerId`；`openDrawer`/Esc 關閉一併改 id

## 3. 搜尋與計數

- [x] 3.1 篩選列以 `<SearchPill>` 新增關鍵字搜尋框（`aria-label`），綁 `query` state
- [x] 3.2 `const filtered = filterContacts(contacts, query)`；list 與 grid 改 map `filtered`
- [x] 3.3 「共 N 位」改為 `filtered.length`；查無結果顯示空狀態
- [ ] 3.4（保留現狀）確認 4 個下拉、統計列、分頁、list/grid 切換維持裝飾不動

## 4. 新增/編輯表單抽屜

- [x] 4.1 新增表單抽屜區塊（與唯讀詳情抽屜分離），含 open 與 `draft` state
- [x] 4.2 欄位：姓名、職稱、角色（下拉）、公司（下拉 `CO`）、負責業務（下拉 `OWNERS`）、Email、電話、手機、主要窗口（toggle）（受控元件綁草稿）
- [x] 4.3 頭部「新增聯絡人」→ 開空白表單；詳情抽屜「編輯」→ `structuredClone` 現值成草稿開帶值表單
- [x] 4.4 即時驗證顯示（姓名必填錯誤）；儲存：驗證不過則擋；通過則 `addContact`/`editContact` 寫回並關抽屜
- [x] 4.5 取消/Esc：丟棄草稿、資料不變

## 5. 刪除確認 modal

- [x] 5.1 詳情抽屜新增「刪除」入口
- [x] 5.2 點擊以 `<ConfirmModal>` 顯示確認（確定／取消）
- [x] 5.3 確定 → `deleteContact`、自選取 `deselect(id)`、若抽屜正開該筆則關閉；取消 → 不變

## 6. 元件測試與驗收

- [x] 6.1 `Contacts.test.tsx`（RTL + userEvent）：新增流程（填姓名→儲存→清單+1、計數+1）
- [x] 6.2 編輯流程（改值→儲存→顯示新值、筆數不變）與必填驗證擋存
- [x] 6.3 刪除流程（刪除→確認→移除、計數-1）與取消不刪
- [x] 6.4 搜尋過濾與「共 N 位」即時更新；查無結果空狀態
- [x] 6.5 查詢一律用 `getByRole`/`getByLabelText`；`npm test`、`npm run lint`、型別檢查全綠；既有測試不受影響
