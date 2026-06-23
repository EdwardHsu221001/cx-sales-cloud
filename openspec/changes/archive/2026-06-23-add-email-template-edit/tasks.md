## 1. 純函式與型別（email.utils.ts）

- [x] 1.1 新增 `validateTemplateDraft(draft: EmailTemplate)` 回傳 `{ ok, nameError?, subjError? }`，名稱與主旨非空驗證
- [x] 1.2 新增 `applyTemplateEdit(list: EmailTemplate[], draft: EmailTemplate): EmailTemplate[]`，依 `k` 取代對應範本（不可變更新）
- [x] 1.3 為 1.1、1.2 撰寫單元測試（驗證成功/失敗、取代正確列、不變動其他列）

## 2. 範本資料提升為 state（Settings.tsx）

- [x] 2.1 將 `EMAIL_TEMPLATES` 更名為 `EMAIL_TEMPLATES_INIT`
- [x] 2.2 於 `Settings` 元件層新增 `const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(EMAIL_TEMPLATES_INIT)`
- [x] 2.3 新增 `const [emailDraft, setEmailDraft] = useState<EmailTemplate | null>(null)`
- [x] 2.4 `EmailPanel` 內 `emailStats`/`filterEmailTemplates`/`selected` 改讀 `emailTemplates`

## 3. 編輯抽屜 UI（Settings.tsx → EmailPanel）

- [x] 3.1 「編輯範本」按鈕 onClick 改為 `setEmailDraft(structuredClone(selected))`
- [x] 3.2 於 `EmailPanel` 結尾條件渲染 `cx-drawer-scrim` + `cx-drawer`（`emailDraft !== null` 時開啟）
- [x] 3.3 表單欄位：名稱、啟用狀態 toggle、分類 select（EMAIL_CATS）、語言、寄件者、收件對象、主旨，皆 controlled 綁定 `emailDraft`
- [x] 3.4 內文區塊渲染：`greet`/`p`/`cta` 顯示 textarea 綁 `block.text`（以索引不可變更新 body）；`quote`/`sig` 唯讀並標註不可編輯說明；`k` 唯讀顯示
- [x] 3.5 抽屜頁尾「儲存」「取消」按鈕；以 `validateTemplateDraft` 控制儲存停用與必填提示

## 4. 儲存／取消行為接線

- [x] 4.1 儲存：驗證通過 → `setEmailTemplates(applyTemplateEdit(...))`、`showToast('範本已更新')`、`setEmailDraft(null)`
- [x] 4.2 取消與點遮罩：`setEmailDraft(null)`，草稿捨棄
- [x] 4.3 確認新增/複製/測試寄送/合併欄位 chip 仍維持原 toast 佔位

## 5. 元件測試與驗證

- [x] 5.1 測試：點「編輯範本」開啟抽屜，欄位預填選取範本內容
- [x] 5.2 測試：改名稱/主旨/啟用 → 儲存 → 清單列、統計、詳情/預覽反映變更
- [x] 5.3 測試：編輯 `greet`/`p`/`cta` 文字 → 儲存 → 預覽反映；`quote`/`sig` 無可編輯輸入
- [x] 5.4 測試：取消捨棄草稿、來源資料不變
- [x] 5.5 測試：名稱或主旨清空時「儲存」停用且顯示提示
- [x] 5.6 執行 lint、type-check、測試套件全綠（type-check 乾淨；測試 42 全綠；lint 僅既有 5 錯誤，非本次新增）
