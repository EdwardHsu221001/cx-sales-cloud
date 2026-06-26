## Why

聯絡人頁（`Contacts.tsx`）目前幾乎全是 mock：`CONTACTS` 是寫死 `const`、`Contact` 無 `id`、選取用陣列索引（且 list 與 grid 各一組 `selRows`／`selCards`），新增/編輯/刪除按鈕只彈 toast，沒有搜尋，計數寫死。`/leads` 與 `/accounts` 已成熟化（真 CRUD + 真篩選 + 純函式分層 + 共用元件），聯絡人應對齊同樣的成熟度，並順勢驗證並重用已抽出的共用建構元件。

## What Changes

- 為 `Contact` 新增 `id`；`CONTACTS` 由 `const` 改 `useState`，使資料可被新增/編輯/刪除。
- **BREAKING（內部資料模型）**：選取與詳情抽屜由陣列索引改為以 `id` 識別；list 與 grid 兩組選取（`selRows`／`selCards`）**合併成單一 id 選取**，以一個 `useRowSelection` 跨兩視圖共用。
- 抽出 `src/components/crm/contacts.utils.ts`：型別（`Contact`、`ContactDraft`、`ContactValidation`）與純函式（`filterContacts`、`validateContactDraft`、`materializeContact`、`addContact`、`editContact`、`deleteContact`），全部不可變更新。
- 新增「表單抽屜」（與唯讀詳情抽屜分離）：欄位 姓名、職稱、角色（決策者／技術窗口／採購窗口）、公司（`CO` 對照下拉）、負責業務（`OWNERS` 下拉）、Email、電話、手機、主要窗口（toggle）。名稱必填。
- 詳情抽屜新增「刪除」入口，點擊先以 `ConfirmModal` 確認才移除。
- 篩選列新增 `SearchPill` 關鍵字搜尋（姓名／公司名／Email 子字串、不分大小寫）；「共 N 位」改依過濾結果即時衍生；查無結果顯示空狀態。
- 重用既有共用元件：`useRowSelection`、`ConfirmModal`、`SearchPill`、`owners.ts`（以 `OWNERS` 取代本地 `ASSIGNEES`，欄位改 `name`/`initial`/`gradient`）。
- 衍生值自動推導：`av`（名字首字）、`g`（固定預設漸層／編輯沿用）、`last`／`ago`（新增「—」／編輯沿用）、`opps`／`acts`（新增空／編輯沿用）。

## Capabilities

### New Capabilities
- `contact-management`: 聯絡人的建立、編輯、刪除、關鍵字搜尋，以及衍生顯示值的自動推導與身分（id）一致性。

### Modified Capabilities
<!-- 無既有聯絡人 spec，故不修改既有 capability。 -->

## Impact

- `src/components/crm/Contacts.tsx`：資料改 state、加 id、合併選取為 id、加搜尋框、表單抽屜、刪除確認、計數改衍生；以 `OWNERS` 取代 `ASSIGNEES`。
- 新檔 `src/components/crm/contacts.utils.ts`（型別 + 純函式）。
- 新測試 `contacts.utils.test.ts`（vitest）、`Contacts.test.tsx`（RTL）。
- 不影響後端（本專案無後端）。4 個篩選下拉、統計列、分頁、list/grid 視圖切換維持裝飾不動。
- 不在本變更抽 `FormDrawer`（留待後續 `extract-form-drawer`，屆時 Leads/Accounts/Contacts 三方一起抽）。
