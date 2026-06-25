## 1. 型別與常數（leads.utils.ts）

- [x] 1.1 `Status` 新增終態 `'converted'`；補 `STATUS_LABELS`（或對等對照）加入 `converted → '已轉化'`
- [x] 1.2 新增 `LeadDraft` 介面（使用者可填欄位：id?、name、company、convertTitle、source、score、status、contacts、assignee:OwnerId）
- [x] 1.3 新增 `OwnerId` 型別與 `OWNERS` 對照常數（`OwnerId → { name, bg, initial }`，三人 zhang/chen/lin）
- [x] 1.4 新增 `LeadValidation` 介面（ok、nameError?、companyError?）

## 2. 純函式 + vitest（先紅後綠，leads.utils.ts / leads.utils.test.ts）

- [x] 2.1 `validateLeadDraft(draft)`：name/company 必填；測 三種情形（空 name、空 company、皆填）
- [x] 2.2 `materializeLead(draft, newId)`：補 initial／assignee*／canConvert；測 `canConvert` 僅 `status==='toconvert'` 為 true、衍生欄位正確
- [x] 2.3 `filterLeadsByStatus(leads, status|'all')`：測 'all' 回全部、指定狀態只回該狀態
- [x] 2.4 `addLead(leads, draft, newId)`：測 回新陣列（`not.toBe`）、長度 +1、內容正確
- [x] 2.5 `editLead(leads, draft)`：測 回新陣列、目標筆更新、其餘不變
- [x] 2.6 `deleteLead(leads, id)`：測 回新陣列、長度 -1、移除正確筆
- [x] 2.7 `convertLead(leads, id)`：測 目標筆 `status='converted'` 且 `canConvert=false`、不可變
- [x] 2.8 跑 `npm test -- leads.utils` 全綠

## 3. 元件狀態地基（Leads.tsx）

- [x] 3.1 `LEADS` const → `const [leads, setLeads] = useState<Lead[]>(LEADS)`
- [x] 3.2 新增 state：`statusFilter`、`drawer`（LeadDraft|null）、`deleteId`（number|null）
- [x] 3.3 衍生值改為 `filterLeadsByStatus(filterLeads(leads, query), statusFilter)`
- [x] 3.4 確認既有 `leads-search` 測試仍綠（`filterLeads` 簽名不變）

## 4. UI：狀態篩選

- [x] 4.1 上方狀態下拉（`Leads.tsx:465` 附近）接 `value`/`onChange` → `setStatusFilter`，選項含「全部」與各狀態（含已轉化）

## 5. UI：新增 / 編輯抽屜（共用）

- [x] 5.1 建立抽屜元件/區塊（複用 `cx-drawer` 與 Email 編輯抽屜模式：受控元件 + 即時錯誤）
- [x] 5.2 「手動新增」(`Leads.tsx:373`) → `setDrawer(空白草稿)`；負責人為 OWNERS 下拉
- [x] 5.3 列上編輯鈕(`Leads.tsx:598`，移除 toast) → `setDrawer(structuredClone 該筆→草稿)`
- [x] 5.4 欄位 onChange → `setDrawer(d => ({...d, ...patch}))`；即時顯示 `validateLeadDraft` 錯誤
- [x] 5.5 儲存：驗證通過 → `setLeads(addLead/editLead)`（依 draft.id 有無）→ `setDrawer(null)`
- [x] 5.6 取消 / Esc → `setDrawer(null)`
- [x] 5.7 抽屜狀態下拉只列工作狀態（排除 `converted`）；篩選下拉才含已轉化

## 6. UI：刪除確認

- [x] 6.1 列上新增刪除鈕 → `setDeleteId(id)`
- [x] 6.2 確認 modal（複用 `cx-modal-overlay`）：確定 → `setLeads(deleteLead)` → `setDeleteId(null)`；取消 → 僅關閉

## 7. UI：轉換鎖定

- [x] 7.1 `confirmConvert`(`Leads.tsx:323`) 改為 `setLeads(convertLead(leads, id))` 後再 toast
- [x] 7.2 ops cell 依 status 切換：`toconvert`→轉換鈕；其餘工作狀態→編輯/刪除；`converted`→「已轉化」徽章且操作入口隱藏
- [x] 7.3 次要動作收進 kebab（⋮）下拉：轉換留外面、編輯/刪除進選單；`converted` 列不顯示選單；外點/Esc 關閉

## 8. 元件互動測試（Leads.test.tsx，testing-library + userEvent）

- [x] 8.1 新增流程：開抽屜→填→存→清單 +1、「共 N 筆」+1
- [x] 8.2 編輯流程：改名→存→該列更新
- [x] 8.3 刪除流程：刪除→確認→該列消失
- [x] 8.4 轉換流程：轉換→確認→該列「已轉化」且編輯/刪除 disabled
- [x] 8.5 狀態篩選：選定狀態只顯示該狀態列
- [x] 8.6 抽屜狀態下拉不含「已轉化」選項

## 9. 驗收

- [x] 9.1 `npm test` 全綠（純函式 + 元件 + 既有 leads-search）
- [x] 9.2 `superpowers:verification-before-completion`：附證據（測試輸出）再宣稱完成
