## 1. accounts 模組

- [x] 1.1 新增 `src/components/crm/accounts/accounts.data.ts`，`import type { Account } from './accounts.utils'`，將 `Accounts.tsx:48` 的 `ACCOUNTS: Account[]` 原樣搬入並 `export`
- [x] 1.2 `Accounts.tsx` 移除內嵌 `ACCOUNTS` 宣告，改 `import { ACCOUNTS } from './accounts.data'`，確認 `useState<Account[]>(ACCOUNTS)` 維持不變
- [x] 1.3 確認 `Accounts.tsx` 內無殘留 `ACCOUNTS` 重複宣告，且型別未在 data 檔重複定義

## 2. contacts 模組

- [x] 2.1 新增 `src/components/crm/contacts/contacts.data.ts`，`import type { Contact } from './contacts.utils'`，將 `Contacts.tsx:25` 的 `CONTACTS: Contact[]` 原樣搬入並 `export`
- [x] 2.2 `Contacts.tsx` 移除內嵌 `CONTACTS` 宣告，改 `import { CONTACTS } from './contacts.data'`，確認 `useState<Contact[]>(CONTACTS)` 維持不變
- [x] 2.3 確認 `Contacts.tsx` 內無殘留 `CONTACTS` 重複宣告，且型別未在 data 檔重複定義

## 3. leads 模組

- [x] 3.1 新增 `src/components/crm/leads/leads.data.ts`，`import type { Lead } from './leads.utils'`，將 `Leads.tsx:50` 的 `LEADS: Lead[]` 原樣搬入並 `export`
- [x] 3.2 `Leads.tsx` 移除內嵌 `LEADS` 宣告，改 `import { LEADS } from './leads.data'`，確認 `useState<Lead[]>(LEADS)` 維持不變
- [x] 3.3 確認 `Leads.tsx` 內無殘留 `LEADS` 重複宣告，且型別未在 data 檔重複定義

## 4. opportunities 模組

> 實作時發現：opportunities **沒有** `opportunities.utils.ts`，型別 `Opp`/`Stage`/`OwnerId`/`CoId` 原本內嵌於 `Opportunities.tsx`。經與使用者確認，採「新增 types 檔」方案，故多一步 4.0。

- [x] 4.0 新增 `src/components/crm/opportunities/opportunities.utils.ts`，將 `Opportunities.tsx` 內嵌的 `Stage`/`OwnerId`/`CoId`/`Opp` 型別搬出並 `export`；`Opportunities.tsx` 改 `import type` 取得
- [x] 4.1 新增 `src/components/crm/opportunities/opportunities.data.ts`，`import type { Opp } from './opportunities.utils'`，將 `INIT_OPPS: Opp[]` 原樣搬入並 `export`（沿用 `INIT_OPPS` 名稱）
- [x] 4.2 `Opportunities.tsx` 移除內嵌 `INIT_OPPS` 宣告，改 `import { INIT_OPPS } from './opportunities.data'`，確認 `useState<Opp[]>(INIT_OPPS)` 維持不變
- [x] 4.3 確認 `Opportunities.tsx` 內無殘留 `INIT_OPPS` 重複宣告，且型別未在 data 檔重複定義

## 5. 驗證

- [x] 5.1 執行 `npm run type-check`（`tsc --noEmit`）確認無型別錯誤 — 通過（exit 0）
- [x] 5.2 執行 `npm test`（vitest）確認既有測試全綠 — 14 檔 147 測試全綠
- [x] 5.3 執行 `npm run lint` 確認無新增 lint 問題 — 變更檔僅 1 個既有 warning（`IconArrowRight` 於 HEAD 即未使用）；現存 errors 全在未觸碰的 `Settings.tsx`
- [x] 5.4 確認四個清單頁初始內容、列數與互動與抽離前一致 — 以「位元組級純搬移」佐證：4 元件僅 +5/−884 行（全為 import 行），各 `*.data.ts` 行數與移除區塊相符；147 項測試（含篩選/新增/編輯/刪除）全綠。視覺人工點選未執行（如需，可啟動 dev server 補做）
