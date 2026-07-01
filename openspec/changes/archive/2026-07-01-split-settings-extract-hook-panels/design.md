## Context

`Settings.tsx`（7700+ 行）的 shell 內仍有 13 個巢狀 `XxxPanel` 函式。先前 `split-settings-extract-discount` 已抽出 `DiscountPanel` 並建立範式：面板抽為模組層級獨立元件、專屬 state 下放為 local state、跨模組依賴以 props 傳入、共用 icons/型別/資料置於 `settings.icons.tsx`/`settings.types.ts`/`settings.data.ts`。

本次處理「自帶 hooks」的 4 個面板：`RolesPanel`、`FlowPanel`、`ImportPanel`、`ImportWizardPanel`。它們在巢狀函式內呼叫 React hooks，無法以內聯 `Panel()` 渲染（rules-of-hooks），目前只能以 `<Panel />` 渲染而有重掛風險。經探索確認：四者的 state 皆為自身 local、對 shell 無共用 state 牽連，僅透過 `showToast` / `setActiveTab` 兩個回呼與 shell 互動（`RolesPanel` 的「drawer」是其自身的 side-drawer，由 local `selectedRole`/`drawerTab` 控制，與 shell 的共用 `DetailDrawer` 無關）。

## Goals / Non-Goals

**Goals:**
- 將 4 個面板抽為獨立元件檔，identity 穩定、消除 `<Panel />` 重掛風險。
- 面板依賴的 module-level 資料常數／型別搬至共用模組，shell 與面板（及 `DetailDrawer`）共用同一份。
- 純結構搬移，執行期行為（資料、初始狀態、互動、畫面）完全不變。

**Non-Goals:**
- 不處理其餘讀 shell 共用 state 的中型面板（`UsersPanel`/`EmailPanel`/`PageLayoutPanel`/`ObjectsPanel`/`FieldsPanel`）— 留待後續 change。
- 不重構面板內部邏輯、不調整 UI、不改資料內容。

## Decisions

- **檔案位置**：`settings/roles/RolesPanel.tsx`、`settings/flow/FlowPanel.tsx`、`settings/import/ImportPanel.tsx`、`settings/import/ImportWizardPanel.tsx`。`ImportWizardPanel` 與 `ImportPanel` 同屬匯入流程，放同一 `import/` 資料夾。
- **Props 介面**：`RolesPanel` 與 `ImportWizardPanel` 為 `{ showToast, onNavigate }`；`onNavigate` 由 shell 以 `setActiveTab` 傳入（沿用 `DiscountPanel` 範式）。
  - **修正（實作時發現）**：`FlowPanel` 與 `ImportPanel` 並非「僅透過 `showToast`/`setActiveTab` 與 shell 互動」。`flowOn`／`batchOn` 為 shell 與 `DetailDrawer` 共用的切換狀態（單一真實來源），且兩面板會呼叫 `openFlow`／`openBatch`（開啟 shell 的 `DetailDrawer`）與 `handleFlowToggle`。若把這些 state 下放為面板 local state，會與 `DetailDrawer` 失去同步 → 改變執行期行為，違反「MUST NOT 改變執行期行為」。故實際 props 為：
    - `FlowPanel`：`{ showToast, flowOn, onOpenFlow, onFlowToggle }`
    - `ImportPanel`：`{ showToast, onNavigate, batchOn, onOpenBatch }`（`ImportPanel` 只讀 `batchOn` 並開 drawer，不直接切換）
  - shell 傳入：`onOpenFlow={openFlow}`、`onFlowToggle={handleFlowToggle}`、`onOpenBatch={openBatch}`。`flowOn`/`batchOn`/`openFlow`/`openBatch`/`handleFlowToggle`/`handleBatchToggle` 續留 shell（`DetailDrawer` 亦使用）。
- **資料／型別搬移**：把各面板專用的 module-level 常數與型別自 `Settings.tsx` 移至 `settings.data.ts`／`settings.types.ts`。`DetailDrawer` 仍在 shell，但對共用常數（如 `FLOWS`、`BATCHES`）改為自共用模組 import，避免重複定義。
- **面板專屬 helper**：僅該面板使用的 helper 函式／子元件（如 `flattenRoleNames`、RolesPanel 的 side-drawer JSX）隨面板搬入新檔；跨面板共用者留在共用模組。
- **shell 接線**：移除 4 個巢狀函式定義，`import` 後以 `<RolesPanel showToast={showToast} onNavigate={setActiveTab} />` 等渲染。

## Risks / Trade-offs

- **資料常數歸屬判斷錯誤**：某常數實際上跨面板/被 shell 使用卻被搬進單一面板檔，會造成重複定義或 import 迴圈。緩解：搬移前以全檔搜尋每個常數的使用點，跨用者一律放 `settings.data.ts`。
- **行為悄悄改變**：搬移過程誤動初值或邏輯。緩解：逐檔對照搬移、`type-check` + 既有測試全綠，並對 RolesPanel side-drawer、Import wizard 多步驟流程做人工驗證。
- **import 路徑層級**：新檔在子資料夾，import 共用模組需 `../settings.data` 等相對路徑，比照 `discount/DiscountPanel.tsx` 既有寫法。
