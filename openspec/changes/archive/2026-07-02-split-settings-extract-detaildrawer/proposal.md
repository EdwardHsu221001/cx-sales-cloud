## Why

`Settings.tsx`（2169 行）中,單一函式 `DetailDrawer`（模組層級,約 1800 行,含 5 個巢狀 content 子渲染 `UserContent`/`ProfileContent`/`PermSetContent`/`FlowContent`/`BatchContent`）就佔了大半。它已是模組層級元件（identity 穩定,無重掛問題）,內部以 inline-call（`UserContent()`）dispatch,純粹是**體積過大**使 `Settings.tsx` 難以閱讀與維護。將整個 `DetailDrawer` 原封搬到獨立檔 `settings/drawer/DetailDrawer.tsx`,`Settings.tsx` 即可收斂為約 370 行的純 shell（導覽 + 路由 + 各面板接線 + drawer state）。這是低風險的純結構搬移:`DetailDrawer` 的所有相依（資料、型別、icons、`StatusBadge`）皆已在共用模組,搬移後 import 即可。內部 5 個 content 的進一步拆分留待後續 change。

## What Changes

- 新增 `settings/drawer/DetailDrawer.tsx`,以 `export default function DetailDrawer` 提供;整個 `DetailDrawer` 函式（含 5 個巢狀 content 與其 inline-call dispatch）原封移入。
- `DrawerState` 型別（`Settings.tsx` 與 `DetailDrawer` 共用,原內聯於 `Settings.tsx`）移至 `settings.types.ts`。
- `DetailDrawer.tsx` 自共用模組 import 所需相依:
  - 資料（`settings.data`）:`USERS`/`ROLES`/`GRAD`/`STATUS_MAP`/`PROFILES`/`PERMSETS`/`PERM_ASSIGNED`/`FLOWS`/`FLOW_TRIGGER`/`FLOW_RUNS`/`FLOW_VERSIONS`/`BATCHES`/`IMP_SOURCE`/`IMP_STATUS`/`IMP_ERRORS`/`IMP_MAPPING`/`IMP_RECORDS`
  - 型別（`settings.types`）:`DrawerState`/`DiagramStep`/`FlowTrig`/`ImpRecEntry`/`ImpSrc`/`MapRow`/`RunEntry`/`VerEntry`
  - icons（`settings.icons`）:`ChevRight`/`ChevLeft`/`CheckIcon`/`XIcon`/`PlusIcon`/`EditIcon`/`ClipIcon`/`LockIcon`/`LoginIcon`
  - 共用子元件（`settings.components`）:`StatusBadge`
- `Settings.tsx` 移除 `DetailDrawer` 函式定義與內聯 `DrawerState` 型別,改 `import DetailDrawer from './drawer/DetailDrawer'`、`import type { DrawerState } from './settings.types'`;保留既有 drawer state 與回呼（`drawer`/`setDrawer`/`openUser`/`openProfile`/`openPermSet`/`openFlow`/`openBatch`/`closeDrawer`/`stepDrawer`/`toggleStates`/`flowOn`/`batchOn` 及相關 handler）與 `<DetailDrawer ... />` render 不變。
- 清除因搬移而在 shell 變成未使用的 import（僅被 `DetailDrawer` 使用的資料/icons）。
- 純結構搬移,MUST NOT 改變執行期行為。

## Capabilities

### New Capabilities
<!-- 無新增 capability -->

### Modified Capabilities
- `crm-shared-components`: 既有 requirement「大型設定頁各模組面板抽為獨立元件」新增一條 scenario,將已是模組層級但過大的 `DetailDrawer` 納入「抽為獨立檔」範圍,敘明「模組層級但過大的元件亦 SHALL 抽為獨立檔以收斂 shell;其共用型別（如 `DrawerState`）移至 `settings.types.ts`」。

## Impact

- `src/components/crm/settings/Settings.tsx`（移除 ~1800 行 `DetailDrawer` 與內聯 `DrawerState`;新增 import 與清理 unused import;→ 約 370 行 shell）
- 新增 `src/components/crm/settings/drawer/DetailDrawer.tsx`
- `src/components/crm/settings/settings.types.ts`（接收 `DrawerState`）
- 無外部 API／相依套件變動;無資料行為變動。內部 5 個 content 拆分為後續 change。
