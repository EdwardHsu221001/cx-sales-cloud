# crm-shared-components Specification

## Purpose
TBD - created by archiving change extract-crm-shared-components. Update Purpose after archive.
## Requirements
### Requirement: 共用 icon 集

CRM 頁面使用的圖示 SHALL 集中於 `src/components/crm/icons.tsx`，由各頁面 import 使用，MUST NOT 在頁面元件內 inline 重複定義同一圖示。方向性箭頭 `IconChevron` SHALL 透過 `dir`（`up` / `down` / `left` / `right`，預設 `down`）參數決定指向，取代各自的左右版本。形狀相同但 stroke 寬度或方向不同者，SHALL 統一採 `icons.tsx` 的版本。

#### Scenario: 頁面改用共用 icon

- **WHEN** `Leads.tsx` 或 `Accounts.tsx` 需要某圖示
- **THEN** 該圖示由 `icons.tsx` 匯入，頁面檔內不再保留同一圖示的 inline 定義

#### Scenario: 可定向 chevron

- **WHEN** 以 `dir="left"` 或 `dir="right"` 使用 `IconChevron`
- **THEN** 箭頭呈現對應方向；未指定 `dir` 時呈現預設向下

### Requirement: 單一負責人登錄

負責業務（owner）資料 SHALL 由單一模組 `src/components/crm/owners.ts` 提供，匯出 `OwnerId` 型別與 `OWNERS`，其每筆正規結構為 `{ name, initial, gradient }`。潛客與客戶帳號頁 MUST 皆由此模組取得負責人資料，MUST NOT 各自維護重複的副本。

#### Scenario: 兩頁共用同一份負責人資料

- **WHEN** 潛客頁與客戶帳號頁顯示同一位負責人
- **THEN** 兩頁取得一致的姓名、縮寫與漸層，且資料來源為同一個 `owners.ts`

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

