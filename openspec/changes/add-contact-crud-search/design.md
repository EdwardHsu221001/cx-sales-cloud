## Context

聯絡人頁 `src/components/crm/Contacts.tsx`（約 970 行）目前資料為寫死 `const CONTACTS`，CRUD 按鈕只彈 toast，無搜尋，計數寫死，且選取分 list（`selRows`）與 grid（`selCards`）兩組、皆以索引識別。`add-account-crud-search` 已建立可對標的範式（資料移入 state、純邏輯抽到 utils、表單抽屜 + 草稿、刪除確認 modal、即時衍生計數），`extract-crm-shared-components` 與 `extract-userowselection-hook` 又抽出 `ConfirmModal`／`SearchPill`／`owners.ts`／`useRowSelection`。本變更比照範式處理聯絡人，並重用這些共用元件。

`Contact` 內嵌 `opps[]`／`acts[]` 與多個顯示用衍生欄位（`av`/`g`/`last`/`ago`），公司以 `CoId` 列舉搭配 `CO` 對照，負責業務以 `OwnerId` 搭配本地 `ASSIGNEES`。

## Goals / Non-Goals

**Goals:**

- 聯絡人可新增／編輯／刪除，資料由 state 驅動。
- 抽出 `contacts.utils.ts`（型別 + 純函式、不可變更新），元件只留 state／事件／JSX。
- 加入關鍵字搜尋（姓名／公司名／Email），「共 N 位」改為依過濾結果衍生。
- 為 `Contact` 加 `id`，選取與抽屜改以 id 識別；list/grid 兩組選取合併為單一 id 選取。
- 重用 `useRowSelection`、`ConfirmModal`、`SearchPill`、`owners.ts`，驗證共用元件可跨模組。

**Non-Goals:**

- 不抽 `FormDrawer`（留待 `extract-form-drawer`，屆時 Leads/Accounts/Contacts 三方一起）。
- 不碰 Contacts 自己的 inline icons（屬另一輪 icon 整併）。
- 不接後端、不引入新狀態管理函式庫。
- 4 個篩選下拉、統計列、分頁、list/grid 切換維持裝飾。
- 不在本變更編輯聯絡人底下的商機／活動（CRUD 時沿用原值）。
- 不強制「每間公司僅一位主要窗口」（`pri` 為自由 toggle）。

## Decisions

**1. 身分由索引改為 `id`。** 為每筆 `Contact` 加 `id: number`；詳情抽屜改存 `id`（取代 `drawerIdx`）。
理由：新增/刪除會位移索引，沿用會選錯、開錯；leads/accounts 已採 id。

**2. 兩組選取合併為單一 id 選取。** 移除 `selRows`／`selCards`，改用單一 `useRowSelection(filteredIds)`，list 與 grid 共用。
理由：去除重複、用上已抽出的 hook；兩視圖選取同步是更直覺的行為。
替代方案：保留兩組各一個 hook 實例——維持現狀但延續無謂的雙重狀態，否決。

**3. 純函式分層至 `contacts.utils.ts`。** `filterContacts`、`validateContactDraft`、`materializeContact`、`addContact`、`editContact`、`deleteContact`，並定義 `ContactDraft`（僅使用者填欄位）、`ContactValidation`。與 leads/accounts utils 對稱。

**4. 草稿模式。** 編輯時 `structuredClone` 現值成草稿 state，受控元件改草稿，儲存才 `editContact` 寫回，取消即丟棄。與 accounts/leads 一致。

**5. 衍生值於 `materializeContact` 推導。** `id`（新增給號／編輯沿用）、`av`（姓名首字）、`g`（固定預設漸層）、`last`/`ago`（新增「—」／編輯沿用）、`opps`/`acts`（新增空／編輯沿用）。`materializeContact(draft, newId, existing?)` 以選用的 `existing` 承載編輯沿用值。`pri`/`role`/`co`/`owner`/`email`/`phone`/`mobile`/`title` 皆為草稿欄位、直接帶入。

**6. 搜尋即時衍生。** `const filtered = filterContacts(contacts, query)` 現算；list/grid map `filtered`、「共 N 位」用 `filtered.length`；搜尋比對 姓名 + `CO[co].nm` + Email（不分大小寫子字串）。

**7. 重用共用元件。** 刪除確認用 `ConfirmModal`；搜尋框用 `SearchPill`；選取用 `useRowSelection`；負責業務以 `owners.ts` 的 `OWNERS` 取代本地 `ASSIGNEES`（欄位 `nm`/`av`/`g` → `name`/`initial`/`gradient`）。

## Risks / Trade-offs

- [合併兩組選取屬行為變更（兩視圖選取同步）] → 已於 brainstorming 確認採用；屬合理化改善而非缺陷，spec 明列。
- [以 `OWNERS` 取代 `ASSIGNEES` 需改欄位名] → 型別檢查會抓出殘留 `.nm`/`.av`/`.g`；改完跑 `tsc` 全綠。
- [搜尋跨「公司名」需經 `CO[co].nm` 轉換，非直接欄位] → 在 `filterContacts` 內以 `CO` 對照查名；對照表隨 utils 一起測。
- [Contacts 檔大、list+grid 雙視圖使改動面積大] → 純邏輯全進 utils、共用 UI 用共用元件，控制單檔複雜度；以元件測試佐證行為。

## Migration Plan

純前端、記憶體 mock，無資料遷移。實作順序：先建 `contacts.utils.ts` + 單元測試（TDD），再改 `Contacts.tsx`（加 id → state → `OWNERS` 取代 `ASSIGNEES` → 合併選取/搜尋/計數 → 表單抽屜 → 刪除 modal → 詳情抽屜改 id），最後補元件測試。回滾即還原 `Contacts.tsx` 並移除新檔。

## Open Questions

無（範圍、選取合併、欄位與搜尋比對已於 brainstorming 收斂並確認）。
