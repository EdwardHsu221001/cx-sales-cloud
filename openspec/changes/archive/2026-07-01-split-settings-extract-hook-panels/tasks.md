## 1. 資料／型別搬移（groundwork）

- [x] 1.1 盤點 4 個面板使用的 module-level 常數與型別，逐一以全檔搜尋確認使用點（標記「面板專屬」vs「跨面板／shell 共用」）
- [x] 1.2 將跨用或 shell（含 `DetailDrawer`）共用的常數移入 `settings.data.ts`、型別移入 `settings.types.ts` 並 `export`（如 `FLOWS`/`FLOW_TRIGGER`/`FLOW_RUNS`/`FLOW_VERSIONS`、`BATCHES`/`IMP_*`、`RPEOPLE_INIT`/`ROLE_HIER` 等及對應 types）
- [x] 1.3 `Settings.tsx` 與 `DetailDrawer` 改自共用模組 import 這些常數／型別，移除原 inline 定義

## 2. 抽出 RolesPanel

- [x] 2.1 新增 `settings/roles/RolesPanel.tsx`：`export default function RolesPanel({ showToast, onNavigate })`
- [x] 2.2 將 `RolesPanel` 內容（含 local state、side-drawer JSX、`flattenRoleNames` 等專屬 helper）移入；`setActiveTab` 改 `onNavigate`
- [x] 2.3 自共用模組 import 所需 icons／型別／資料

## 3. 抽出 FlowPanel

- [x] 3.1 新增 `settings/flow/FlowPanel.tsx`：`export default function FlowPanel({ showToast, flowOn, onOpenFlow, onFlowToggle })`（詳見 design.md「Decisions — Props 介面」：`flowOn` 與 shell `DetailDrawer` 共用，需以 props 傳入方能保持行為不變）
- [x] 3.2 將 `FlowPanel` 內容（含 local state 與專屬 helper）移入；`openFlow`／`handleFlowToggle` 改 `onOpenFlow`／`onFlowToggle`
- [x] 3.3 自共用模組 import 所需 icons／型別／資料

## 4. 抽出 ImportPanel

- [x] 4.1 新增 `settings/import/ImportPanel.tsx`：`export default function ImportPanel({ showToast, onNavigate, batchOn, onOpenBatch })`（`batchOn` 與 shell `DetailDrawer` 共用，需以 props 傳入）
- [x] 4.2 將 `ImportPanel` 內容移入；`setActiveTab` 改 `onNavigate`、`openBatch` 改 `onOpenBatch`
- [x] 4.3 自共用模組 import 所需 icons／型別／資料

## 5. 抽出 ImportWizardPanel

- [x] 5.1 新增 `settings/import/ImportWizardPanel.tsx`：`export default function ImportWizardPanel({ showToast, onNavigate })`
- [x] 5.2 將 `ImportWizardPanel` 內容（含多步驟 wizard 的 local state 與專屬 helper）移入；`setActiveTab` 改 `onNavigate`
- [x] 5.3 自共用模組 import 所需 icons／型別／資料

## 6. shell 接線

- [x] 6.1 `Settings.tsx` 移除 4 個巢狀面板函式定義
- [x] 6.2 `import` 4 個面板，render 改為 `<RolesPanel showToast={showToast} onNavigate={setActiveTab} />`、`<FlowPanel showToast={showToast} flowOn={flowOn} onOpenFlow={openFlow} onFlowToggle={handleFlowToggle} />`、`<ImportPanel showToast={showToast} onNavigate={setActiveTab} batchOn={batchOn} onOpenBatch={openBatch} />`、`<ImportWizardPanel showToast={showToast} onNavigate={setActiveTab} />`

## 7. 驗證

- [x] 7.1 `npm run type-check`（`tsc --noEmit`）無型別錯誤（`src/` 無錯誤；`.next/dev/types` 產生檔之既有問題與本次無關）
- [x] 7.2 `npm test` 既有測試全綠（147 passed）
- [x] 7.3 `npm run lint` 無新增問題（清除新引入的 `useRef`／`InfoIcon`／`MonitorIcon` unused import；反而移除 4 個原巢狀面板的 `static-components` error）
- [x] 7.4 人工驗證：RolesPanel 開關 side-drawer、切換角色不重置；Flow/Import 篩選與搜尋輸入焦點不掉；Import wizard 逐步操作至完成，狀態正確
