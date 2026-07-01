## 1. 資料搬移（groundwork）

- [x] 1.1 全檔搜尋確認 `EMAIL_*`/`PL_*` 常數與 helper 之使用點僅落在 module-level 定義與 `EmailPanel`/`PageLayoutPanel` 內（標記面板專屬 vs 其他）
- [x] 1.2 將面板專屬資料常數移入 `settings.data.ts` 並 `export`（`EMAIL_CATS`/`EMAIL_SENT_30D`/`SIG`/`EMAIL_TEMPLATES_INIT`/`EMAIL_MERGE`、`PL_OBJECTS`/`PL_PILLS`/`PL_PALETTE`/`PL_SECTIONS_INIT`/`PL_REL`/`PL_ASSIGNED`/`PL_UNASSIGNED`）；型別自 `email.utils.ts` / `pagelayout.utils.ts` import
- [x] 1.3 `Settings.tsx` 移除原 inline 定義（含 `EmailIco`/`MergeText`、`GripDots`/`PalFieldIcon`/`PLRelIcon` 移出）

## 2. 抽出 EmailPanel

- [x] 2.1 新增 `settings/email/EmailPanel.tsx`：`export default function EmailPanel({ showToast, onNavigate })`
- [x] 2.2 將 `EmailPanel` 內容移入；`emailTemplates`/`emailSel`/`emailSearch`/`emailDraft` 下放為 local state；`setActiveTab` 改 `onNavigate`；`EmailIco`/`MergeText` 專屬 helper 隨面板搬入
- [x] 2.3 自共用模組 import 所需 icons／型別／資料（`settings.icons`、`settings.data`、`email.utils`）

## 3. 抽出 PageLayoutPanel

- [x] 3.1 新增 `settings/pagelayout/PageLayoutPanel.tsx`：`export default function PageLayoutPanel({ showToast, onNavigate })`
- [x] 3.2 將 `PageLayoutPanel` 內容移入；`plObj`/`plLayout`/`plPalTab`/`plPalSearch`/`plSections` 下放為 local state；`togglePlSection`/`removePlField`/`removePlSection` 隨面板搬入為 local 函式；`setActiveTab` 改 `onNavigate`；`GripDots`/`PalFieldIcon`/`PLRelIcon` 專屬 helper 隨面板搬入
- [x] 3.3 自共用模組 import 所需 icons／型別／資料（`settings.icons`、`settings.data`、`pagelayout.utils`）

## 4. shell 接線

- [x] 4.1 `Settings.tsx` 移除 2 個巢狀面板函式定義與其專屬 shell state（`emailTemplates`/`emailSel`/`emailSearch`/`emailDraft`、`plObj`/`plLayout`/`plPalTab`/`plPalSearch`/`plSections`）及 `togglePlSection`/`removePlField`/`removePlSection`
- [x] 4.2 `import` 2 個面板，render 由 inline-call 改為 `<EmailPanel showToast={showToast} onNavigate={setActiveTab} />`、`<PageLayoutPanel showToast={showToast} onNavigate={setActiveTab} />`，移除相關 inline-call 解釋註解

## 5. 驗證

- [x] 5.1 `npm run type-check`（`tsc --noEmit`）`src/` 無型別錯誤
- [x] 5.2 `npm test` 既有測試全綠（含 `Settings.email.test.tsx`、`Settings.pagelayout.test.tsx`）
- [x] 5.3 `npm run lint` 無新增問題（清除新引入的 unused import；預期移除 2 個原 inline-call 面板不影響 `static-components` 計數）
- [x] 5.4 人工驗證：Email 範本清單搜尋焦點不掉、切換範本、開關編輯抽屜並儲存；PageLayout 切換物件/版面、區段收合、移除欄位/區段、拖放 palette 篩選，狀態與畫面正確
