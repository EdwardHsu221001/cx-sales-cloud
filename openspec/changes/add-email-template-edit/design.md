## Context

郵件設定頁（`EmailPanel`，位於 `src/components/crm/Settings.tsx`）目前為唯讀視覺移植：範本資料為模組層常數 `EMAIL_TEMPLATES`、`EMAIL_CATS`、`EMAIL_MERGE`，所有動作（測試寄送/新增/複製/編輯/合併欄位）皆 `showToast` 佔位。`emailSel`、`emailSearch` 兩個 state 已於 `Settings` 元件層宣告。內文為 typed discriminated union `EmailBlock`（`greet|p|cta|quote|sig`），合併欄位以 `splitMergeText` + `MergeText` 高亮。

既有可借鏡的模式：`cx-drawer`/`cx-drawer-scrim` slide-over（`DetailDrawer`、Role drawer）；`RolesPanel` 以區域 `useState`（`rpeople`）編輯資料；面板以 `XPanel()` 內聯呼叫（非 `<XPanel/>`）避免重掛失焦（見專案記憶）。

## Goals / Non-Goals

**Goals:**

- 「編輯範本」開啟右側 `cx-drawer` 編輯表單，可改中繼資料與 `greet`/`p`/`cta` 文字內文。
- 範本資料提升為記憶體 state，編輯儲存後清單/統計/詳情/預覽即時反映。
- 編輯作用於草稿副本，取消可乾淨捨棄；名稱與主旨必填驗證。
- 純函式（套用草稿、驗證）抽至 `email.utils.ts` 便於單元測試；元件測試覆蓋開啟/編輯/儲存/取消/驗證。

**Non-Goals:**

- 後端 / API / 持久化（localStorage 亦不做）。
- 新增範本、複製、測試寄送、合併欄位插入（維持 toast 佔位）。
- `quote`/`sig` 區塊的結構化編輯（新增/刪除/排序區塊、多列報價、簽名欄位）——本版唯讀。
- 富文字編輯器、新增相依套件、重構其他 panel。

## Decisions

**1. 範本資料提升為 `Settings` 元件層 state。**
`const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(EMAIL_TEMPLATES_INIT)`，`EMAIL_TEMPLATES` 更名為 `EMAIL_TEMPLATES_INIT` 作為初始 seed。`EmailPanel` 內 `emailStats`/`filterEmailTemplates`/`selected` 改讀 `emailTemplates`。理由：與 `RolesPanel`（`rpeople`）一致、最小改動、編輯後天然 reactive。替代：context/zustand——無跨頁需求，YAGNI，否決。

**2. 編輯草稿用獨立 state，作用於深拷貝副本。**
`const [emailDraft, setEmailDraft] = useState<EmailTemplate | null>(null)`；`null` 代表抽屜關閉。點「編輯範本」時 `setEmailDraft(structuredClone(selected))`。理由：草稿與來源隔離，取消即丟棄、不污染 `emailTemplates`。`body` 為巢狀陣列，需深拷貝（`structuredClone`）避免共享參照。

**3. 抽屜沿用既有 `cx-drawer` 模式，置於 `EmailPanel` 回傳結尾。**
條件渲染 `emailDraft && (<scrim/> + <aside>表單</aside>)`。表單欄位皆 controlled，綁定 `emailDraft`，以 `setEmailDraft(d => ({...d, 欄位: 值}))` 更新；內文區塊以索引更新對應 block 的 `text`。理由：與全頁視覺/互動一致、無新樣式體系。

**4. 內文編輯僅限文字型區塊，型別守門。**
渲染 `emailDraft.body` 時，`greet`/`p`/`cta` 顯示 `<textarea>` 綁 `block.text`；`quote`/`sig` 以唯讀區塊呈現並標註「此區塊維持原結構，本版不可編輯」。更新某 block 時以 `map`+索引產生新 `body` 陣列（不可變更新）。

**5. 套用草稿與驗證抽為純函式置於 `email.utils.ts`。**
如 `applyTemplateEdit(list, draft): EmailTemplate[]`（依 `k` 取代）與 `validateTemplateDraft(draft): { ok: boolean; nameError?; subjError? }`（名稱、主旨非空）。理由：與 `filterEmailTemplates`/`emailStats` 一致、可單元測試、UI 僅接線。

**6. 儲存/取消行為。**
儲存：驗證通過才 `setEmailTemplates(applyTemplateEdit(...))`、`showToast('範本已更新')`、`setEmailDraft(null)`。驗證未過時「儲存」停用並顯示提示。取消或點遮罩：`setEmailDraft(null)`。

## Risks / Trade-offs

- [`Settings.tsx` 持續膨脹] → 本次僅追加聚焦的抽屜 UI 與少量 state；邏輯外移至 `email.utils.ts` 控制行數；抽檔重構另案。
- [`structuredClone` 環境支援] → Node 18+/現代瀏覽器皆支援；專案測試環境（Vitest/jsdom）亦支援，必要時以 `JSON.parse(JSON.stringify())` 退路（body 純資料可序列化）。
- [內文區塊僅部分可編輯造成使用者預期落差] → 唯讀區塊明確標註不可編輯之說明文字；完整區塊編輯列為後續變更。
- [記憶體 state 重整即失] → 屬刻意設計（無後端），於 proposal/spec 明示；提案保留日後接後端的擴充空間。

## Migration Plan

純前端記憶體行為變更，無資料遷移。Rollback：將「編輯範本」按鈕還原為 `showToast`、移除編輯抽屜與 `emailDraft` state、`emailTemplates` 還原為模組常數即可。
