## Why

`Settings.tsx` 達 7700+ 行，仍有多個巢狀 `XxxPanel` 函式定義於 shell 內。其中 `RolesPanel`、`FlowPanel`、`ImportPanel`、`ImportWizardPanel` 各自呼叫 React hooks，無法以內聯 `Panel()` 呼叫渲染（違反 rules-of-hooks），只能以 `<Panel />` 渲染，因而面臨 shell 重渲時被卸載重掛、輸入失焦／捲動重置的風險。將其抽為模組層級獨立元件可一次解決重掛問題並讓 shell 顯著瘦身。這 4 個是「自帶 hooks、state 本就 local、對 shell 無共用 state 牽連」的一批，抽離最單純、收益最大。

## What Changes

- 新增 `settings/roles/RolesPanel.tsx`、`settings/flow/FlowPanel.tsx`、`settings/import/ImportPanel.tsx`、`settings/import/ImportWizardPanel.tsx`，各以 `export default function` 提供。
- 4 個面板的內容（含各自專屬 local state 與專屬 helper／side-drawer JSX）原樣移入新檔。
- 各面板對 shell 的依賴以 props 傳入：`RolesPanel`/`ImportWizardPanel` 收 `{ showToast, onNavigate }`。`FlowPanel` 收 `{ showToast, flowOn, onOpenFlow, onFlowToggle }`、`ImportPanel` 收 `{ showToast, onNavigate, batchOn, onOpenBatch }`——因 `flowOn`／`batchOn` 為 shell 與 `DetailDrawer` 共用之切換狀態（單一真實來源），須以 props 傳入方能保持行為不變（詳見 design.md）。
- 將這 4 個面板依賴的 module-level 資料常數與型別自 `Settings.tsx` 移至共用模組 `settings.data.ts` / `settings.types.ts`（如 `RPEOPLE_INIT`/`ROLE_HIER`/`flattenRoleNames`、`FLOWS`/`FLOW_TRIGGER`/`FLOW_RUNS`/`FLOW_VERSIONS`、`IMP_*`/`BATCHES`、`IMP_MAPPING`/`IMP_RECORDS` 及對應 types）；shell 的 `DetailDrawer` 也共用部分常數（如 `FLOWS`、`BATCHES`），改為同自共用模組 import。
- `Settings.tsx` 移除這 4 個巢狀函式定義，改 `import` 後以 `<RolesPanel ... />` 等渲染。
- 純結構搬移，MUST NOT 改變執行期行為。

## Capabilities

### New Capabilities
<!-- 無新增 capability -->

### Modified Capabilities
- `crm-shared-components`: 既有 requirement「大型設定頁各模組面板抽為獨立元件」新增一條 scenario，明確將 `RolesPanel`/`FlowPanel`/`ImportPanel`/`ImportWizardPanel` 4 個自帶 hooks 的面板納入「獨立 import 元件」範圍。

## Impact

- `src/components/crm/settings/Settings.tsx`（移除 4 個巢狀面板與相關 module-level 資料、新增 import 與接線）
- 新增 `src/components/crm/settings/roles/RolesPanel.tsx`、`flow/FlowPanel.tsx`、`import/ImportPanel.tsx`、`import/ImportWizardPanel.tsx`
- `src/components/crm/settings/settings.data.ts`、`settings.types.ts`（接收搬移過來的常數與型別）
- 無外部 API／相依套件變動；無資料行為變動。
