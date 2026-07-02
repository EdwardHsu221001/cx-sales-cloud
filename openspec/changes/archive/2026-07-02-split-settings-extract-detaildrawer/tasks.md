## 1. 型別搬移（groundwork）

- [x] 1.1 將 `DrawerState` 型別（原內聯於 `Settings.tsx`）移至 `settings.types.ts` 並 `export`（原樣搬,含 `type: 'user' | 'profile' | 'permset' | 'flow' | 'batch'` 等欄位）
- [x] 1.2 `Settings.tsx` 的 `useState<DrawerState>` 改自 `settings.types` import `DrawerState`;移除內聯定義

## 2. 抽出 DetailDrawer

- [x] 2.1 新增 `settings/drawer/DetailDrawer.tsx`:`export default function DetailDrawer(...)`,將整個 `DetailDrawer` 函式（含 `len`、5 個巢狀 content、return dispatch）原封移入,內部一字不改
- [x] 2.2 於 `DetailDrawer.tsx` 補齊 import:
  - `settings.data`:USERS/ROLES/GRAD/STATUS_MAP/PROFILES/PERMSETS/PERM_ASSIGNED/FLOWS/FLOW_TRIGGER/FLOW_RUNS/FLOW_VERSIONS/BATCHES/IMP_SOURCE/IMP_STATUS/IMP_ERRORS/IMP_MAPPING/IMP_RECORDS
  - `settings.types`（type import）:DrawerState/DiagramStep/FlowTrig/ImpRecEntry/ImpSrc/MapRow/RunEntry/VerEntry
  - `settings.icons`:ChevRight/ChevLeft/CheckIcon/XIcon/PlusIcon/EditIcon/ClipIcon/LockIcon/LoginIcon
  - `settings.components`:StatusBadge
  - `react`:視 content 內是否用到 Fragment（依實際搬入內容補）

## 3. shell 接線與清理

- [x] 3.1 `Settings.tsx` 移除 `DetailDrawer` 函式定義（原 110–1907）與 `// ── Detail Drawer ──` 相關註解
- [x] 3.2 `import DetailDrawer from './drawer/DetailDrawer'`;保留 `<DetailDrawer state={drawer} ... />` render 與所有 drawer state/callback（`drawer`/`setDrawer`/`openUser`/`openProfile`/`openPermSet`/`openFlow`/`openBatch`/`closeDrawer`/`stepDrawer`/`toggleStates`/`onToggle`/`flowOn`/`onFlowToggle`/`batchOn`/`onBatchToggle`）
- [x] 3.3 以 `tsc` + `eslint` 掃出並清除 shell 內僅被 DetailDrawer 使用、現已 unused 的 import（資料/icons/型別）;保留仍被其他面板接線使用者（如 `FLOWS`/`BATCHES` 供 `flowOn`/`batchOn` 初始化、`ROLES`/`USERS` 等）

## 4. 驗證

- [x] 4.1 `npm run type-check`（`tsc --noEmit`）`src/` 無型別錯誤
- [x] 4.2 `npm test` 既有測試全綠
- [x] 4.3 `npm run lint` 無新增問題（清除新引入/殘留 unused import）
- [x] 4.4 人工驗證（單一 dev server + 清 `.next`）:於 `/settings/users` 點使用者列開抽屜、切 tab（概覽/角色與權限/活動歷程）、上一筆/下一筆、關閉;於 `/settings/profiles`、`/settings/permsets` 開對應抽屜;於 `/settings/flow`、`/settings/import` 開 flow/batch 抽屜。五種抽屜內容、tab、導航、toggle 皆與搬移前一致
- [x] 4.5 確認 `Settings.tsx` 收斂至約 370 行、僅含 shell 職責
