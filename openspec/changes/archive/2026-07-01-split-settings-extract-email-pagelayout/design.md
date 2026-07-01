## Context

`Settings.tsx`（5000+ 行）的 shell 內仍有多個巢狀 `XxxPanel` 函式。先前 `split-settings-extract-discount` 與 `split-settings-extract-hook-panels` 已建立範式：面板抽為模組層級獨立元件、專屬 state 下放為 local state、跨模組依賴以 props 傳入、共用 icons/型別/資料置於 `settings.icons.tsx`/`settings.types.ts`/`settings.data.ts`。

本次處理 `EmailPanel`、`PageLayoutPanel`。二者目前以內聯呼叫 `EmailPanel()` / `PageLayoutPanel()` 渲染——因其自身不呼叫 hooks、僅讀 shell state，若以 `<Panel />` 渲染會於 shell 重渲時被卸載重掛（搜尋框失焦、捲動重置）。經探索確認：二者所讀的 shell state 皆為自身專屬（`emailTemplates`/`emailSel`/`emailSearch`/`emailDraft`；`plObj`/`plLayout`/`plPalTab`/`plPalSearch`/`plSections`），與 `DetailDrawer` 及其他面板無共用（全檔搜尋 `EMAIL_*`/`PL_*` 之使用點僅落在 module-level 定義與此二面板內）。二者各有自身的編輯 UI（EmailPanel 的 `emailDraft` 編輯抽屜、PageLayoutPanel 的版面編排），與 shell 的共用 `DetailDrawer` 無關。

## Goals / Non-Goals

**Goals:**
- 將 2 個面板抽為獨立元件檔，identity 穩定、消除 `<Panel />` 重掛風險，並移除既有 inline-call 權宜寫法。
- 面板專屬 state 下放為 local state；面板專屬資料常數搬至 `settings.data.ts`、專屬 helper 子元件隨面板搬入新檔。
- 純結構搬移，執行期行為（資料、初始狀態、互動、畫面）完全不變。

**Non-Goals:**
- 不處理其餘與 `DetailDrawer` 共用 state 的面板（`UsersPanel`、含共用 `drawer`/`selectedRows`）— 留待後續 change。
- 不處理小面板 `HubPanel`/`ProfilesPanel`/`PermSetsPanel`/`ObjectsPanel`/`FieldsPanel`。
- 不重構面板內部邏輯、不調整 UI、不改資料內容。

## Decisions

- **檔案位置**：`settings/email/EmailPanel.tsx`、`settings/pagelayout/PageLayoutPanel.tsx`（比照 `discount/DiscountPanel.tsx`、`roles/RolesPanel.tsx` 的子資料夾慣例）。
- **Props 介面**：兩者皆 `{ showToast, onNavigate }`。`onNavigate` 由 shell 以 `setActiveTab` 傳入。因與 `DetailDrawer` 無共用 state，無需額外 props（有別於 `split-settings-extract-hook-panels` 的 `FlowPanel`/`ImportPanel` 需傳 `flowOn`/`batchOn`）。
- **state 下放**：`emailTemplates`/`emailSel`/`emailSearch`/`emailDraft` 移入 `EmailPanel`；`plObj`/`plLayout`/`plPalTab`/`plPalSearch`/`plSections` 及其 setter 移入 `PageLayoutPanel`。原為 shell `useCallback` 的 `togglePlSection`/`removePlField`/`removePlSection`（僅 PageLayoutPanel 使用、操作 `plSections`）隨面板搬入為 local 函式。
- **資料／型別搬移**：面板專屬 module-level 常數移至 `settings.data.ts`（`EMAIL_CATS`/`EMAIL_SENT_30D`/`SIG`/`EMAIL_TEMPLATES_INIT`/`EMAIL_MERGE`、`PL_OBJECTS`/`PL_PILLS`/`PL_PALETTE`/`PL_SECTIONS_INIT`/`PL_REL`/`PL_ASSIGNED`/`PL_UNASSIGNED`）。相關型別（`EmailCategory`/`EmailTemplate`/`EmailMergeGroup`/`EmailSig`、`PLPaletteTab`/`PLPaletteGroup`/`PLSection`/`PLRelCard`）已存在於 `email.utils.ts` / `pagelayout.utils.ts`，`settings.data.ts` 與面板自該處 import。
- **面板專屬 helper**：`EmailIco`/`MergeText`（EmailPanel）、`GripDots`/`PalFieldIcon`/`PLRelIcon`（PageLayoutPanel）隨面板搬入新檔。
- **shell 接線**：移除 2 個巢狀函式定義與 inline-call（`{activeTab === 'email' && EmailPanel()}` → `<EmailPanel showToast={showToast} onNavigate={setActiveTab} />`；`pagelayout` 同理），並移除相關解釋註解。

## Risks / Trade-offs

- **資料常數歸屬判斷錯誤**：某常數實際被 shell/`DetailDrawer` 使用卻被搬走。緩解：搬移前已全檔搜尋 `EMAIL_*`/`PL_*` 使用點，確認僅落在 module-level 定義與此二面板內。
- **行為悄悄改變**：搬移誤動初值或邏輯。緩解：逐檔對照搬移、`type-check` + 既有測試全綠（含 `Settings.email.test.tsx`、`Settings.pagelayout.test.tsx`），並對 Email 範本編輯抽屜、PageLayout 版面編排做人工驗證。
- **測試對渲染方式的耦合**：既有 `Settings.email.test.tsx` / `Settings.pagelayout.test.tsx` 透過 Settings 整體渲染，改為 `<Panel />` 後行為應一致；若測試斷言依賴 inline-call 細節需調整（預期不需，因為對外行為不變）。
