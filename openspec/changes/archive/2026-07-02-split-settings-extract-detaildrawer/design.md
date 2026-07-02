## Context

Settings.tsx 分拆計畫已完成 14 個面板的抽離,`Settings.tsx` 從 7737 降至 2169 行。最後一塊是 `DetailDrawer`——一個**模組層級**函式（110–1907,約 1800 行）,以 `state.type` 多型顯示 5 種詳情內容（user/profile/permset/flow/batch）,每種為一個巢狀 content 函式,以 inline-call（`UserContent()`）dispatch。

探索結論:
- `DetailDrawer` 已是模組層級 → **無 shell 重掛問題**;5 個 content 以 inline-call 渲染 → **無內部重掛問題**。它純粹體積過大。
- 專案慣例:唯讀詳情抽屜各模組自行實作（Accounts 亦有自己的 inline 詳情抽屜）,共用的 `common/FormDrawer.tsx` 僅供**表單**用途（docstring 明載「非唯讀詳情抽屜」）。故 `DetailDrawer` 維持 settings 專屬,不與 FormDrawer 合併。
- 相依全在共用模組:資料（`settings.data` 17 項）、型別（`settings.types` 7 項）、icons（`settings.icons` 9 項）、`StatusBadge`（`settings.components`）。唯 `DrawerState` 型別內聯於 `Settings.tsx` 且 shell 與 DetailDrawer 共用。

## Goals / Non-Goals

**Goals:**
- 將整個 `DetailDrawer`（含 5 個巢狀 content、inline-call dispatch）原封搬至 `settings/drawer/DetailDrawer.tsx`,收斂 `Settings.tsx` 為約 370 行 shell。
- `DrawerState` 移至 `settings.types.ts` 供 shell 與 DetailDrawer 共同 import。
- 純結構搬移,執行期行為完全不變。

**Non-Goals:**
- **不拆 5 個 content**（`UserContent` 等仍巢狀於 `DetailDrawer.tsx` 內、仍 inline-call）— 留待後續 change。因拆 content 需將其閉包所讀的 `state`/各 callback 一一改為 props,工較細,獨立處理較安全。
- 不與 `common/FormDrawer.tsx` 合併或抽共用 drawer chrome（YAGNI + 破壞既有分層）。
- 不改 shell 的 drawer state 結構與 render。

## Decisions

- **檔案位置**:`settings/drawer/DetailDrawer.tsx`（延續子資料夾慣例,drawer 自成一層）。
- **搬移範圍**:`DetailDrawer` 函式全體（110–1907）原封移入,含 `len` 衍生值、5 個巢狀 content 與 return 的 dispatch。內部一字不改。
- **`DrawerState` 歸屬**:移至 `settings.types.ts` 並 `export`。`Settings.tsx` 的 `useState<DrawerState>` 與 `DetailDrawer` 的 `state: DrawerState` 皆自該處 import。（`DrawerState` 含 `type: 'user' | 'profile' | 'permset' | 'flow' | 'batch'` 等欄位,原樣搬。）
- **import 清單**:`DetailDrawer.tsx` 依探索清單 import 17 項資料、7 項型別（含 DrawerState）、9 個 icon、`StatusBadge`。
- **shell 清理**:移除 `DetailDrawer` 與內聯 `DrawerState` 後,`Settings.tsx` 內僅被 DetailDrawer 使用的 import 會變 unused（如部分 `FLOW_*`/`IMP_*`/icons）;以 `tsc` + `eslint` 掃出後移除。仍被 shell 或其他面板接線使用者（如 `FLOWS`/`BATCHES` 供 `flowOn`/`batchOn` 初始化）保留。
- **render 不變**:`<DetailDrawer state={drawer} onClose={closeDrawer} ... />` 與所有 drawer state/callback 留在 shell。

## Risks / Trade-offs

- **搬移遺漏相依**:漏 import 某個資料/型別/icon → 編譯錯。緩解:已用全檔掃描列出完整清單;`tsc --noEmit` 會抓出任何漏網。
- **shell unused import 清理過頭**:誤刪仍被其他面板接線使用的 import。緩解:僅依 `eslint` 標記的 unused 清除,清除後再跑一次 `tsc` + 測試確認。
- **`DrawerState` 移動破壞型別**:shell 與 DetailDrawer 對 `DrawerState` 的引用須同步改為 import。緩解:`tsc` 驗證。
- **行為改變**:純搬移風險極低（不動 DetailDrawer 內部一字）。驗證:`tsc` + 既有測試全綠 + 人工驗證五種抽屜（點 user/profile/permset/flow/batch 列開抽屜、切 tab、上一筆/下一筆、關閉）皆正常。
