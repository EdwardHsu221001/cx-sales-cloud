## Context

四個 CRM 清單頁元件各自在檔頭以 `const` 宣告數百行 mock 種子資料，再餵進 `useState` 當記憶體資料庫：

| 模組 | 種子陣列 | 位置 | 型別來源 |
|---|---|---|---|
| accounts | `ACCOUNTS: Account[]` | `Accounts.tsx:48` | `accounts.utils.ts` |
| contacts | `CONTACTS: Contact[]` | `Contacts.tsx:25` | `contacts.utils.ts` |
| leads | `LEADS: Lead[]` | `Leads.tsx:50` | `leads.utils.ts` |
| opportunities | `INIT_OPPS: Opp[]` | `Opportunities.tsx:50` | `opportunities.utils.ts` |

專案既有慣例已將「型別＋純函式」放在 `*.utils.ts`，唯獨種子資料還黏在元件檔。本變更補上 `*.data.ts` 這一層，使「資料／邏輯／畫面」三分。屬純前端原型階段，資料仍為記憶體 mock，無後端。

## Goals / Non-Goals

**Goals:**
- 將四個模組的種子記錄陣列搬到各自的 `*.data.ts`，元件改 `import`。
- 資料模組型別一律自 `*.utils.ts` import，不重複定義。
- 零執行期行為變更：初始狀態、列數、互動、測試結果一致。

**Non-Goals:**
- 不引入 async 取得函式或 `Promise` 簽名（那是 Level 2）。
- 不接 API、不導入 react-query（Level 3）。
- 不更動 `*.utils.ts` 的純函式。
- 不搬移純呈現用的設定／查表常數（如 `STATUS_LABEL`、`SCORE_LABEL`、`HEALTH_META`、`ROLE_TAG`、`CO`、`ASSIGNEES`、`SOURCE_OPTIONS`、`EMPTY_DRAFT`）——它們是畫面配置而非種子記錄，留在原處以維持最小變更。

## Decisions

**決策 1：新檔命名為 `*.data.ts`，與 `*.utils.ts` 同層。**
沿用既有的「同層、`.<concern>.ts` 後綴」慣例，import 路徑直覺（`./leads.data`）。替代方案 `mock/` 子資料夾或 `*.mock.ts` 後綴均增加慣例分歧，不採。

**決策 2：只搬「成為 `useState` 初始值的種子記錄陣列」。**
範圍即上表四個陣列。查表／標籤常數雖也算廣義資料，但與渲染綁定且非「記錄」，移動它們會擴大 diff 且無助於本次目標（為日後抽換資料來源預備接點）。故明確排除，保持「純搬移、可機械驗證」。

**決策 3：保留識別名稱不變（含 `INIT_OPPS`）。**
搬移後 export 名稱沿用原 `const` 名（`ACCOUNTS`／`CONTACTS`／`LEADS`／`INIT_OPPS`），元件端僅將原宣告替換為 import。不順手改名，以免混入非「純搬移」的變動。

**決策 4（實作時補充）：opportunities 先補 types 檔。**
實作發現 opportunities 不同於另三模組——**無 `opportunities.utils.ts`**，型別 `Opp`/`Stage`/`OwnerId`/`CoId` 內嵌於元件。為滿足 spec「型別由 `*.utils.ts` 提供、不重複定義」，新增 `opportunities.utils.ts` 並把這四個型別原樣搬入 `export`，元件與 data 檔皆 `import type` 取得。替代方案（由 'use client' 元件反向 export 型別給 data 檔）會造成資料反向依賴元件，不採。此為原提案 Impact「不影響 `*.utils.ts`」的有意偏離，已記錄於此。

## Risks / Trade-offs

- **[搬移時誤改內容導致行為漂移]** → 以「剪下原 `const` 區塊、原樣貼入 `*.data.ts`、補上 `import type` 與 `export`」的機械步驟進行；完成後跑 `npm test` 與 `tsc --noEmit` 驗證綠燈。
- **[元件內仍殘留對已搬移識別子的其他引用]** → 各模組搬移後以搜尋確認該 `const` 名稱在元件檔內僅剩 import 與使用處，無重複宣告。
- **[命名不一致（`INIT_OPPS` vs 其餘複數名）]** → 視為既有現況，本次不處理；強行統一會超出「純搬移」範圍，留待後續。
