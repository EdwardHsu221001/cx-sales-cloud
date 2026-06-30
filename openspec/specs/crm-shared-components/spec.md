# crm-shared-components Specification

## Purpose
TBD - created by archiving change extract-crm-shared-components. Update Purpose after archive.
## Requirements
### Requirement: 共用 icon 集

CRM 頁面使用的圖示 SHALL 集中於 `src/components/crm/common/icons.tsx`，由各頁面 import 使用，MUST NOT 在頁面元件內 inline 重複定義同一圖示。方向性箭頭 `IconChevron` SHALL 透過 `dir`（`up` / `down` / `left` / `right`，預設 `down`）參數決定指向，取代各自的左右版本。形狀相同但 stroke 寬度或方向不同者，SHALL 統一採 `common/icons.tsx` 的版本。

#### Scenario: 頁面改用共用 icon

- **WHEN** `Leads.tsx` 或 `Accounts.tsx` 需要某圖示
- **THEN** 該圖示由 `common/icons.tsx` 匯入，頁面檔內不再保留同一圖示的 inline 定義

#### Scenario: 可定向 chevron

- **WHEN** 以 `dir="left"` 或 `dir="right"` 使用 `IconChevron`
- **THEN** 箭頭呈現對應方向；未指定 `dir` 時呈現預設向下

### Requirement: 單一負責人登錄

負責業務（owner）資料 SHALL 由單一模組 `src/components/crm/common/owners.ts` 提供，匯出 `OwnerId` 型別與 `OWNERS`，其每筆正規結構為 `{ name, initial, gradient }`。潛客與客戶帳號頁 MUST 皆由此模組取得負責人資料，MUST NOT 各自維護重複的副本。

#### Scenario: 兩頁共用同一份負責人資料

- **WHEN** 潛客頁與客戶帳號頁顯示同一位負責人
- **THEN** 兩頁取得一致的姓名、縮寫與漸層，且資料來源為同一個 `common/owners.ts`

### Requirement: 共用刪除確認對話框

刪除確認 SHALL 由共用元件 `ConfirmModal` 提供，介面為 `open`、`title`、`message`、`confirmLabel`、`onConfirm`、`onCancel`、`ariaLabel`。`open` 為真時 SHALL 呈現 `role="dialog"` 並套用指定的 `aria-label`。按下確認 SHALL 觸發 `onConfirm`；按下取消 SHALL 觸發 `onCancel` 且 MUST NOT 執行刪除。

#### Scenario: 確認後執行

- **WHEN** 對話框開啟且使用者按下確認鈕
- **THEN** 觸發 `onConfirm` 回呼

#### Scenario: 取消不執行

- **WHEN** 對話框開啟且使用者按下取消鈕
- **THEN** 觸發 `onCancel`，且不發生刪除

### Requirement: 共用搜尋欄位

關鍵字搜尋框 SHALL 由共用元件 `SearchPill` 提供，介面為 `value`、`onChange`、`label`、`placeholder`，並 SHALL 渲染為 `type="search"` 且以 `label` 作為 `aria-label`，使其可被無障礙查詢（searchbox 角色＋名稱）。

#### Scenario: 輸入觸發變更

- **WHEN** 使用者在搜尋框輸入文字
- **THEN** 以新值觸發 `onChange` 回呼

#### Scenario: 可及性可查詢

- **WHEN** 以 searchbox 角色加上 `label` 名稱查詢該欄位
- **THEN** 能取得對應的搜尋輸入元素

### Requirement: 列選取共用 hook

CRM 清單頁的「列選取」狀態 SHALL 由共用 hook `useRowSelection(allIds)` 提供，回傳 `selected`、`isSelected`、`allSelected`、`toggle`、`toggleAll`、`deselect`、`clear`。`allSelected` MUST 由目前選取數與 `allIds` 衍生（`selected.size === allIds.length && allIds.length > 0`），MUST NOT 另存為獨立狀態。所有更新 MUST 採不可變更新（每次回傳新的 `Set`）。`toggleAll` 與 `allSelected` SHALL 以傳入的整份 `allIds` 為基準。Hook MUST NOT 處理 DOM 事件（如 `stopPropagation`），該責任留給呼叫端。

#### Scenario: 切換單列選取

- **WHEN** 對某 id 呼叫 `toggle`
- **THEN** 該 id 在已選時被移除、未選時被加入，且 `isSelected` 隨之反映

#### Scenario: 全選與全不選

- **WHEN** 在未全選狀態呼叫 `toggleAll`
- **THEN** `allIds` 全部成為已選且 `allSelected` 為真；再次呼叫 `toggleAll` 則全部清空

#### Scenario: allSelected 為衍生值

- **WHEN** 已選集合涵蓋目前 `allIds` 的全部
- **THEN** `allSelected` 為真；當 `allIds` 變動使涵蓋不再成立時，`allSelected` 自動變為假，無需手動同步

#### Scenario: 移除單一已選 id

- **WHEN** 對某已選 id 呼叫 `deselect`
- **THEN** 該 id 自選取集合移除，其餘不變

### Requirement: 共用新增/編輯表單抽屜外框

CRM 頁面的**新增/編輯表單抽屜**（即填欄位、按儲存的那種；**非唯讀的「查看詳情」抽屜**）外框 SHALL 由共用元件 `FormDrawer` 提供，介面為 `crumbRoot`、`noun`、`isEdit`、`onClose`、`onSave` 與 `children`。各頁的唯讀詳情抽屜（hero/分頁/CTA/資訊清單）結構各異，MUST NOT 納入本元件。`FormDrawer` SHALL 由 `isEdit` 推導動作文案（真為「編輯」、否則「新增」），並以「動作 + `noun`」作為 `aria-label` 與標題 `<h2>`、以 `crumbRoot` 與動作組成麵包屑。欄位內容 MUST 由 `children` 提供，`FormDrawer` MUST NOT 知道任何特定實體的欄位。底部 SHALL 提供取消與儲存兩鈕，分別觸發 `onClose` 與 `onSave`；關閉鈕與點擊遮罩 SHALL 觸發 `onClose`。`FormDrawer` MUST NOT 處理鍵盤事件（Escape 由呼叫端負責）。

#### Scenario: 依 isEdit 呈現標題與動作

- **WHEN** 以 `isEdit={false}`、`noun="帳號"` 使用 `FormDrawer`
- **THEN** 標題與 `aria-label` 為「新增帳號」；改 `isEdit={true}` 時為「編輯帳號」

#### Scenario: 渲染呼叫端欄位

- **WHEN** 呼叫端把欄位以 children 傳入 `FormDrawer`
- **THEN** 這些欄位呈現在抽屜內容區

#### Scenario: 取消與儲存

- **WHEN** 使用者按下取消（或關閉鈕）
- **THEN** 觸發 `onClose`；按下儲存則觸發 `onSave`

### Requirement: Mock 資料分離至資料模組

CRM 清單頁的 mock 資料（如帳號、聯絡人、潛客、商機的初始陣列）SHALL 置於各模組同層的 `*.data.ts` 檔（如 `accounts.data.ts`、`contacts.data.ts`、`leads.data.ts`、`opportunities.data.ts`），由元件 `import` 後作為 `useState` 初始值。元件檔 MUST NOT 內嵌寫死的資料陣列。資料模組 SHALL 從對應的 `*.utils.ts` import 既有型別，MUST NOT 重複定義型別。此分離為純結構搬移，MUST NOT 改變執行期行為（資料內容、初始狀態、畫面渲染一致）。

#### Scenario: 元件不再內嵌資料

- **WHEN** 檢視 `Leads.tsx` 或 `Accounts.tsx` 等清單頁元件
- **THEN** 元件不含寫死的資料陣列定義，而是從同層 `*.data.ts` import 取得

#### Scenario: 資料模組沿用既有型別

- **WHEN** `leads.data.ts` 宣告其匯出陣列的型別
- **THEN** 該型別（如 `Lead`）自 `leads.utils.ts` import，資料模組內不另定義同名型別

#### Scenario: 搬移不改變行為

- **WHEN** 完成資料抽離後執行既有測試與畫面
- **THEN** 清單初始內容、列數與互動行為與抽離前一致

