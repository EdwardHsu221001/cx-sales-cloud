## 1. 共用件搬移（groundwork）

- [x] 1.1 全檔搜尋確認歸屬:`StatusBadge`（DetailDrawer 401/505 + UsersPanel 2422 → 共用）、`STATUS_MAP`（StatusBadge 278 + shell 352 → 共用純資料）;`PermChips`（僅 UsersPanel → 專屬）;`selectedRows`/`userSearch`/`filteredUsers`/`activeCount`/`pendingCount`（僅 UsersPanel → 專屬）
- [x] 1.2 將 `STATUS_MAP` 移至 `settings.data.ts` 並 `export`
- [x] 1.3 新增 `settings.components.tsx`:移入 `StatusBadge` 並 `export`,自 `settings.data` import `STATUS_MAP`
- [x] 1.4 `Settings.tsx` shell 改為 import:`STATUS_MAP` 自 `settings.data`（line 352 用處）、`StatusBadge` 自 `settings.components`（DetailDrawer 兩處）;移除原 module-level `STATUS_MAP`/`StatusBadge` 定義

## 2. 抽出 UsersPanel

- [x] 2.1 新增 `settings/users/UsersPanel.tsx`:`export default function UsersPanel({ showToast, onNavigate, onOpenUser })`
- [x] 2.2 將 `UsersPanel` 內容移入;`selectedRows`+`setSelectedRows` 下放 local、`toggleRow`/`toggleAll` 移入為 local 函式、`userSearch`+`setUserSearch` 下放 local、`filteredUsers`/`activeCount`/`pendingCount`/`allSel` 於面板內計算;`setActiveTab` 改 `onNavigate`、`openUser(i)` 改 `onOpenUser(i)`;專屬 helper `PermChips` 隨面板搬入
- [x] 2.3 自共用模組 import:icons（`settings.icons` 的 ExportIcon/PlusIcon/UserGrpIcon/CheckCircle/LicIcon/ClockIcon/CheckIcon/ChevRight）、`IconSearch`（`../../common/icons`）、資料（`settings.data` 的 USERS/ROLES/GRAD）、`StatusBadge`（`settings.components`）

## 3. shell 接線

- [x] 3.1 `Settings.tsx` 移除 `UsersPanel` 巢狀函式定義、其專屬 shell state（`selectedRows`/`setSelectedRows`/`userSearch`/`setUserSearch`、衍生 `filteredUsers`/`activeCount`/`pendingCount`、函式 `toggleRow`/`toggleAll`）、專屬 helper `PermChips`
- [x] 3.2 `import UsersPanel`,render 改為 `{activeTab === 'users' && <UsersPanel showToast={showToast} onNavigate={setActiveTab} onOpenUser={openUser} />}`;保留 shell 的 `openUser`/`drawer`（DetailDrawer 用）
- [x] 3.3 清除因搬移而產生的 unused import（若 shell 不再直接用某些 icon）

## 4. 驗證

- [x] 4.1 `npm run type-check`（`tsc --noEmit`）`src/` 無型別錯誤
- [x] 4.2 `npm test` 既有測試全綠
- [x] 4.3 `npm run lint` 無新增問題（`created during render` error 應較 baseline 減少一個;清除新引入 unused import）
- [x] 4.4 人工驗證（單一 dev server + 清 `.next`）:`/settings/users` 200 且內容渲染;搜尋姓名/Email 焦點不掉、篩選/計數正確;全選與單列勾選正確;點列開右側 DetailDrawer 正確;DetailDrawer 內 StatusBadge 顯示正常
