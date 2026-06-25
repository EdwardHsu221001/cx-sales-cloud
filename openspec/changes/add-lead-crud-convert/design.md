## Context

潛客頁（`src/components/crm/Leads.tsx`）目前資料為寫死的 `LEADS` const，只有關鍵字搜尋（`filterLeads`，已有 spec `leads-search`）真正可用；新增/編輯/刪除/轉換皆為 toast 佔位。本專案無後端，資料為記憶體 mock。既有慣例：純邏輯抽到 `*.utils.ts` 並以 vitest 測試，元件只綁 state 與畫 UI（參考 `email.utils.ts` 與 Email 編輯抽屜）。不可變更新為全專案鐵則。

## Goals / Non-Goals

**Goals:**
- 潛客頁具備可用的建立／編輯／刪除（單筆）。
- 「轉換」真的鎖定該潛客（`status` → `converted`、列鎖定），不再只是 toast。
- 狀態下拉接成真的過濾，與關鍵字搜尋並存。
- 邏輯以純函式承載，貼合既有 utils 慣例，可 TDD。

**Non-Goals:**
- 不建立下游 Account／Contact／Opportunity 實體（跨物件共享資料層留待後續變更）。
- 不做批次刪除（已有多選 state，但本次只做單筆）。
- 不接後端、不持久化、不改既有 `leads-search` 需求。
- 不引入 useReducer／custom hook（維持 useState 慣例）。

## Decisions

**1. `LEADS` const → `useState`（地基）。**
所有異動的唯一來源。無此步則 CRUD 無從實作。替代方案（useReducer / useLeads hook）偏離專案現有 useState 慣例、徒增間接層，YAGNI。

**2. 邏輯放純函式（`leads.utils.ts`），元件只綁 state。**
新增：`filterLeadsByStatus`、`validateLeadDraft`、`materializeLead`、`addLead`、`editLead`、`deleteLead`、`convertLead`。全部回新陣列（不可變）。對齊 `email.utils.ts` 的 `applyTemplateEdit` 模式，便於 vitest 單測。

**3. 草稿型別 `LeadDraft` 只含使用者可填欄位。**
顯示用衍生欄位（`initial`、`assigneeBg`、`assigneeInitial`、`assigneeName`、`canConvert`）不進草稿，由 `materializeLead(draft, newId)` 補齊。負責人改用固定三人 `OwnerId`（`'zhang'|'chen'|'lin'`，與其他物件一致），表單為下拉。

**4. `canConvert` 由 `status` 推導，規則：`status === 'toconvert'`。**
移除「手填 canConvert」的不一致來源。`Status` 新增終態 `converted`。狀態為使用者可改欄位，但僅能在編輯抽屜下拉切換工作狀態；`converted` 為終態，只由轉換動作設定，MUST NOT 出現在編輯下拉（否則可繞過轉換或解除鎖定）。篩選下拉含 `converted`（看，不是改）。不做列上快速切換。

**5. 新增／編輯共用單一抽屜，靠 `draft.id` 有無區分。**
複用 Email 編輯抽屜模式：真資料/草稿分離、`structuredClone` 帶入、受控元件 + 即時 `validateLeadDraft` 錯誤訊息、`cx-drawer` CSS。

**6. 刪除與轉換確認複用既有 `cx-modal-overlay`。**
`deleteId: number | null` 表達確認對象與開關；轉換沿用既有 convert modal，`confirmConvert` 改為呼叫 `convertLead` 寫回 state。

**7. ops cell 依 `status` 切換，次要動作收進 kebab 選單。**
避免「轉換＋編輯＋刪除」三顆並排過擠：主動作「轉換」留外面（僅 `toconvert` 列顯示），編輯/刪除收進垂直三點（⋮）下拉選單（複用 `cx-quick-menu`）。
- `toconvert` → 「轉換」鈕 + ⋮（編輯／刪除）。
- 其他工作狀態 → 僅 ⋮（編輯／刪除）。
- `converted` → 「已轉化」徽章，**不顯示選單**（轉換／編輯／刪除入口皆隱藏，達成鎖定）。
- 選單開關以 `rowMenuId` 控制，觸發鈕 `stopPropagation`、document click 關閉、Esc 關閉。

## Risks / Trade-offs

- [轉換後不建下游資料，與直覺「轉換應產生客戶/聯絡人/商機」不符] → 於 spec 與 UI 文案明確標示「本次只鎖 Lead」；下游建立列為後續變更。
- [`materializeLead` 衍生欄位邏輯（頭像字、負責人對照）若與既有 mock 呈現不一致] → 以 `OwnerId → {name,bg,initial}` 常數集中管理，並以單測固定預期值。
- [`LEADS` 改 state 後，既有 `leads-search` 測試若依賴 const 來源] → 保留 `filterLeads` 簽名不變，過濾仍吃傳入清單，降低破壞面；跑既有測試確認綠燈。
- [新增終態 `converted` 影響狀態中文對照與篩選下拉選項] → 同步補 `STATUS_LABELS` 與下拉選項，單測涵蓋。
