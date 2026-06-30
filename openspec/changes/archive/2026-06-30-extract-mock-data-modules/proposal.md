## Why

四個 CRM 模組（accounts / contacts / leads / opportunities）的 mock 資料目前以數百行 `const` 陣列寫死在各自的元件 `.tsx` 檔最上方，與畫面邏輯混在一起。這使元件檔過長難讀、改一筆假資料要捲過整個元件，且「資料來源」與「畫面」沒有界線——將來要接真 API 時缺少可抽換的接點。先把資料抽成獨立模組，是後續資料真實化（react-query／真 API）的前置基礎，且本身就立即改善可讀性。

## What Changes

- 將 `Accounts.tsx`、`Contacts.tsx`、`Leads.tsx`、`Opportunities.tsx` 內寫死的 mock 資料陣列（如 `ACCOUNTS`、`CONTACTS`、`LEADS`、`opps` 等）搬出到各模組同層的 `*.data.ts` 檔，由元件 `import`。
- 資料模組從對應的 `*.utils.ts` import 既有型別（如 `Lead`、`Account`），不重複定義型別。
- 元件僅改 import 來源；資料內容、初始 `useState` 行為、畫面渲染**完全不變**（純搬移）。
- 確立並文件化「mock 資料分離至 `*.data.ts`」此一共用慣例，納入 `crm-shared-components` 規格。
- 非目標：不引入 async 取得函式（Level 2）、不接 API、不導入 react-query（Level 3）；不改動 `*.utils.ts` 內的純函式。

## Capabilities

### New Capabilities
<!-- 無新增能力 -->

### Modified Capabilities
- `crm-shared-components`: 新增一條要求，規範 CRM 清單頁的 mock 資料 SHALL 置於各模組的 `*.data.ts`，元件 MUST NOT 內嵌寫死資料陣列，且型別由 `*.utils.ts` 提供不重複定義。

## Impact

- 受影響程式碼：`src/components/crm/{accounts,contacts,leads,opportunities}/` 各模組的元件 `.tsx`（移除內嵌資料、改 import）；新增對應的 `*.data.ts`。
- 不影響 `*.utils.ts`（型別與純函式）、不影響任何頁面路由與 `'use client'` 邊界。
- 無新增相依套件；無 API／資料庫變更。
- 既有測試（`*.test.tsx`）行為應維持綠燈，因執行期行為不變。
