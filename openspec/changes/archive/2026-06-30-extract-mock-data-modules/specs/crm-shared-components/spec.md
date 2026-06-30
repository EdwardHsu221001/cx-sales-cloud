## ADDED Requirements

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
