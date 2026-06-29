## 1. common/（先搬，其他資料夾會以 `../common/` 引用）

- [x] 1.1 `git mv` 將 icons.tsx、owners.ts、ConfirmModal.tsx(+test)、SearchPill.tsx(+test)、useRowSelection.ts(+test)、FormDrawer.tsx(+test)、EmptyState.tsx 移入 `src/components/crm/common/`
- [x] 1.2 確認 `common/` 內部相對 import 不變（ConfirmModal/FormDrawer 仍 `./icons`；各 test 仍 `./<元件>`），無需修改

## 2. accounts/

- [x] 2.1 `git mv` Accounts.tsx、Accounts.test.tsx、accounts.utils.ts、accounts.utils.test.ts 移入 `src/components/crm/accounts/`
- [x] 2.2 更新 Accounts.tsx 跨資料夾 import：`./ConfirmModal`→`../common/ConfirmModal`、`./SearchPill`→`../common/SearchPill`、`./FormDrawer`→`../common/FormDrawer`、`./useRowSelection`→`../common/useRowSelection`、`./icons`→`../common/icons`（`./accounts.utils` 維持）
- [x] 2.3 更新 accounts.utils.ts：`./owners`→`../common/owners`（Accounts.test.tsx 的 `./Accounts` 維持）

## 3. contacts/

- [x] 3.1 `git mv` Contacts.tsx、Contacts.test.tsx、contacts.utils.ts、contacts.utils.test.ts 移入 `src/components/crm/contacts/`
- [x] 3.2 更新 Contacts.tsx 跨資料夾 import：`./ConfirmModal`/`./SearchPill`/`./FormDrawer`/`./useRowSelection`/`./icons` 全改為 `../common/...`（`./contacts.utils` 維持）
- [x] 3.3 更新 contacts.utils.ts：`./owners`→`../common/owners`

## 4. leads/

- [x] 4.1 `git mv` Leads.tsx、Leads.test.tsx、leads.utils.ts、leads.utils.test.ts 移入 `src/components/crm/leads/`
- [x] 4.2 更新 Leads.tsx 跨資料夾 import：`./ConfirmModal`/`./SearchPill`/`./FormDrawer`/`./useRowSelection`/`./icons` 全改為 `../common/...`（`./leads.utils` 維持）
- [x] 4.3 更新 leads.utils.ts：`./owners`→`../common/owners`

## 5. opportunities/ 與 activities/

- [x] 5.1 `git mv` Opportunities.tsx 移入 `src/components/crm/opportunities/`
- [x] 5.2 `git mv` Activities.tsx 移入 `src/components/crm/activities/`
- [x] 5.3 確認兩檔無 crm 內部相對 import 需更新（若有 `./icons` 等則改為 `../common/...`）

## 6. settings/

- [x] 6.1 `git mv` Settings.tsx、Settings.email.test.tsx、Settings.pagelayout.test.tsx、email.utils.ts(+test)、pagelayout.utils.ts(+test) 移入 `src/components/crm/settings/`
- [x] 6.2 更新 Settings.tsx：`./icons`→`../common/icons`（`./email.utils`、`./pagelayout.utils` 同資料夾維持）；test 的 `./Settings`、utils test 的 `./*.utils` 維持

## 7. dashboard/

- [x] 7.1 `git mv` Dashboard.tsx、HomeDashboard.tsx、Reports.tsx 移入 `src/components/crm/dashboard/`
- [x] 7.2 更新 Dashboard.tsx：`./Leads`→`../leads/Leads`、`./Opportunities`→`../opportunities/Opportunities`、`./Accounts`→`../accounts/Accounts`
- [x] 7.3 更新 HomeDashboard.tsx：`./icons`→`../common/icons`（Reports.tsx 若有 `./icons` 等亦改 `../common/...`）

## 8. AppShell.tsx（留根層）

- [x] 8.1 更新 AppShell.tsx：`./icons`→`./common/icons`

## 9. 外部引用（src/app/(crm)/）

- [x] 9.1 更新 10 個 page/layout 的 `@/components/crm/X`：AppShell 維持；HomeDashboard/Reports→`dashboard/`；Accounts→`accounts/Accounts`；Contacts→`contacts/Contacts`；Leads→`leads/Leads`；Opportunities→`opportunities/Opportunities`；Activities→`activities/Activities`；Settings→`settings/Settings`

## 10. spec 同步

- [x] 10.1 確認 `crm-shared-components` delta（icons.tsx/owners.ts→`common/`）已就緒，於歸檔/同步時併回主 spec

## 11. 驗收（先有證據再宣稱完成）

- [x] 11.1 `npm test` 全綠（co-located 測試驗證所有 import 正確）
- [x] 11.2 `npm run build`／type-check 通過，確認無漏改路徑
- [x] 11.3 `git status` 確認皆為 rename（保留歷史）、無遺漏或誤刪檔案
