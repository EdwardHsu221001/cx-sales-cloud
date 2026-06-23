## Context

`Settings.tsx`（約 6688 行）以單一大型 client component 承載所有設定頁，每個設定頁為一個內部 panel 函式（`UsersPanel`、`RolesPanel`、`ObjectsPanel`…），透過 `activeTab` state 切換。導覽資料在 `NAV_GROUPS`，其中 `email` 項目標記 `ph:true`（`Settings.tsx:1349`），由通用 `PlaceholderPanel` 渲染。

來源設計 `CX CRM Setting 0623.html` 為原生 HTML/CSS/JS，郵件設定為 `#panel-email`，資料與渲染邏輯在 IIFE 內（`CATS`、`T`、`MERGE`、`SIG`、`renderList/renderDetail/renderMerge`）。本變更將其轉為 React + 既有 CSS 模式，互動深度對齊「忠實視覺移植」。

## Goals / Non-Goals

**Goals:**

- 以與既有 panel 一致的模式新增 `EmailPanel`，1:1 還原 HTML 畫面與版面。
- 移植 mock 資料為 typed 常數，渲染清單/詳情/合併欄位面板。
- 可運作互動：選取範本（local state）、搜尋過濾（local state）、合併欄位 `{{...}}` 高亮。
- `em-*` 樣式移植至 `crm.css`，與 HTML 視覺一致。
- 元件測試覆蓋：渲染、搜尋、選取切換。

**Non-Goals:**

- 後端 / API / 持久化。
- 富文字內文編輯器、新增/編輯表單（動作維持 toast 佔位）。
- 新增相依套件。
- 重構 `Settings.tsx` 既有 panel。

## Decisions

**1. 沿用既有 panel 模式（內部函式 + `activeTab`），不抽獨立檔。**
理由：與全檔現況一致、改動面最小、最省 token。權衡：`Settings.tsx` 會再變大，但抽檔屬於與本目標無關的重構，YAGNI。資料常數（`EMAIL_CATS`、`EMAIL_TEMPLATES`、`EMAIL_MERGE`）放在 `Settings.tsx` 既有資料常數區，與其他 panel 資料一致。

**2. 內文以 typed discriminated union 表示 block，渲染對映元件。**
HTML 內文是 `{greet}|{p}|{cta}|{quote}|{sig}` 的混合陣列。以 TypeScript union type（如 `type EmailBlock = {kind:'greet'|'p'|'cta', text:string} | {kind:'quote', rows, total?} | {kind:'sig', ...}`）取代 HTML 的鴨子型別判斷，渲染時 switch。替代方案：直接搬 `if(b.greet)` 風格——較不型別安全，否決。

**3. 合併欄位高亮以 React 切片渲染，不用 `dangerouslySetInnerHTML`。**
HTML 用字串 replace 包 `<span>`。改為以 regex 將文字切成「一般片段 / `{{token}}` 片段」陣列後渲染 `<span className="em-mf">`，避免 XSS 與 React 反模式。集中為一個 helper（如 `renderMergeText(text)`）供主旨與內文共用。

**4. 互動狀態用元件區域 `useState`（選中 key、搜尋字串）。**
理由：與 `RolesPanel` 等既有 panel 一致；無跨頁共享需求，不需 zustand。

**5. 動作按鈕統一呼叫既有 `showToast`。**
測試寄送/新增/複製/編輯/合併欄位點擊皆 `showToast(...)`，與其他 panel 佔位行為一致。

## Risks / Trade-offs

- [`Settings.tsx` 持續膨脹] → 本變更僅追加聚焦的 panel 與資料常數；抽檔重構另案處理。
- [合併欄位高亮 regex 與信件預覽還原細節易偏離設計] → 以元件測試斷言 `{{...}}` 被包成合併欄位樣式；視覺以 HTML 為對照逐區核對。
- [大量 mock 內文搬移易打錯字] → 直接以 HTML 來源逐筆對應移植，並於 PR 視覺檢查。

## Migration Plan

純前端新增，無資料遷移。Rollback：還原 `email` 項目為 `ph:true` 並移除 `EmailPanel` 即可。
