## MODIFIED Requirements

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
