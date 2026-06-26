## Context

客戶帳號頁 `src/components/crm/Accounts.tsx`（約 1245 行）目前資料為寫死 `const ACCOUNTS`，CRUD 按鈕只彈 toast，無搜尋，計數寫死。`/leads` 已於 `add-lead-crud-convert` 成熟化，建立了可對標的範式：資料移入 state、純邏輯抽到 `leads.utils.ts`、新增/編輯共用抽屜表單 + 草稿（`structuredClone`）、刪除確認 modal、`filterLeads` 即時衍生計數。本變更比照該範式處理客戶帳號。

關鍵約束：`Account` 是重型別，內嵌 `contacts[]`／`opps[]`／`acts[]` 與多個顯示用衍生欄位，且目前**無 `id`**，選取列與抽屜皆以陣列索引識別。

## Goals / Non-Goals

**Goals:**

- 客戶帳號可新增／編輯／刪除，資料由 state 驅動。
- 抽出 `accounts.utils.ts`（型別 + 純函式、不可變更新），元件只留 state／事件／JSX。
- 加入關鍵字搜尋（名稱／網域），「共 N 家」改為依過濾結果衍生。
- 為 `Account` 加 `id`，選取與抽屜改以 id 識別，確保 CRUD 後不錯位。
- 新增/編輯共用「表單抽屜」，與既有唯讀詳情抽屜分離；刪除走確認 modal。

**Non-Goals:**

- 不接後端、不引入新狀態管理函式庫。
- 4 個篩選下拉、統計列四張卡、分頁維持裝飾（不衍生、不接邏輯）。
- 不在本變更內編輯帳號底下的聯絡人／商機／活動（這些於抽屜另管，CRUD 時沿用原值）。
- 不解析金額字串：`amt`/`oppN` 不從表單計算，新增為 0、編輯沿用。
- 不計算合作年資：移除 age 推導，新增顯示「—」、編輯沿用。

## Decisions

**1. 身分由索引改為 `id`。** 為每筆 `Account` 加 `id: number`；`selectedRows` 改 `Set<id>`、詳情抽屜改存 `id`（取代 `drawerIdx`）。
理由：新增/刪除會位移陣列索引，沿用索引會選錯、開錯。leads 已採 id。
替代方案：維持索引並在每次變更後重算——脆弱且與 leads 不一致，否決。

**2. 純函式分層至 `accounts.utils.ts`。** 提供 `filterAccounts`、`validateAccountDraft`、`materializeAccount`、`addAccount`、`editAccount`、`deleteAccount`，並定義 `AccountDraft`（僅使用者填的欄位）、`AccountValidation`。
理由：呼應專案職責分工（純邏輯可單測、元件好讀），與 `leads.utils.ts` 對稱。

**3. 草稿（draft）模式。** 編輯時 `structuredClone` 現值成草稿 state，受控元件改草稿，儲存才 `editAccount` 寫回，取消即丟棄。
理由：支援「取消還原」，與 EmailPanel／leads 一致。

**4. 表單抽屜與詳情抽屜分離。** 既有詳情抽屜維持唯讀（分頁式）；新增/編輯用獨立的表單抽屜（各自 open 狀態）。
理由：兩者結構與用途不同，分離較單純，避免把唯讀抽屜改造成雙模式。

**5. 衍生值於 `materializeAccount` 推導。** `id`（新增給號／編輯沿用）、`logo`（名稱首字）、`lg`（固定預設漸層常數）、`star`（新增 false／編輯沿用）、`amt`/`oppN`（新增 0／編輯沿用）、`contacts`/`opps`/`acts`（新增空／編輯沿用）、`age`（新增「—」／編輯沿用）。`materializeAccount(draft, newId, existing?)` 以選用的 `existing` 參數承載編輯沿用值。

**6. 搜尋即時衍生。** `const filtered = filterAccounts(accounts, query)` 現算；表格 map `filtered`、「共 N 家」用 `filtered.length`；抽屜上一筆/下一筆走 `filtered` 的 id 順序。

## Risks / Trade-offs

- [詳情抽屜原以索引導覽，改 id 後導覽需改走 filtered 清單] → 以 `filtered` 中目前 id 的位置計算前/後一筆；搜尋使清單變動時行為自然。
- [表單欄位多（含 6 個公司資訊欄）易使 Accounts.tsx 更臃腫] → 將表單抽屜與子欄位拆為小元件，純邏輯全進 utils，控制單檔複雜度。
- [既有資料 `amt` 是人工字串、與 opps 不一定一致] → 本變更明確不解析金額，amt/oppN 僅沿用或歸零，避免引入字串解析錯誤。
- [統計列數字仍寫死，與真實筆數不符] → 屬非目標（YAGNI），於 proposal/spec 明確排除，避免誤解為缺陷。

## Migration Plan

純前端、記憶體 mock，無資料遷移。實作順序：先建 `accounts.utils.ts` + 單元測試（TDD），再改 `Accounts.tsx`（加 id → state → 搜尋/計數 → 表單抽屜 → 刪除 modal），最後補元件測試。回滾即還原這兩個檔案。

## Open Questions

無（範圍已於 brainstorming 收斂並確認）。