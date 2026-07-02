## 1. 資料／型別搬移（groundwork）

- [x] 1.1 全檔搜尋確認歸屬:`OBJ_ITEMS`（shell setActiveTab + 兩面板 → 共用）、`OBJ_ICON_STYLE`（兩面板 → 共用）;`FIELDS_DATA`（僅 FieldsPanel → 專屬）;`objTab`（僅 ObjectsPanel）、`fieldSearch`（僅 FieldsPanel）;`fieldTab`（未使用 → 死碼）
- [x] 1.2 將型別 `ObjItem`/`FieldRow` 移至 `settings.types.ts`
- [x] 1.3 將 `OBJ_ITEMS`/`OBJ_ICON_STYLE` 移至 `settings.data.ts` 並 `export`（型別自 `settings.types.ts` import）
- [x] 1.4 `Settings.tsx` shell 改自 `settings.data` import `OBJ_ITEMS`（setActiveTab 用處）;移除原 module-level `OBJ_ITEMS`/`OBJ_ICON_STYLE`/`FIELDS_DATA`/`ObjItem`/`FieldRow` 定義

## 2. 抽出 ObjectsPanel

- [x] 2.1 新增 `settings/objects/ObjectsPanel.tsx`:`export default function ObjectsPanel({ showToast, onNavigate, onOpenObject })`
- [x] 2.2 將 `ObjectsPanel` 內容移入;`objTab` 下放為 local state;`setActiveTab` 改 `onNavigate`、列點擊 `router.push('/settings/objects/${obj.api}')` 改 `onOpenObject(obj.api)`
- [x] 2.3 自共用模組 import:icons（`settings.icons` 的 ChevRight/PlusIcon）、資料/型別（`settings.data` 的 OBJ_ITEMS/OBJ_ICON_STYLE）

## 3. 抽出 FieldsPanel

- [x] 3.1 新增 `settings/fields/FieldsPanel.tsx`:`export default function FieldsPanel({ showToast, onNavigate, selectedObjApi })`
- [x] 3.2 將 `FieldsPanel` 內容移入;`fieldSearch` 下放為 local state;`selectedObjApi` 改由 props 讀取（保留 `?? OBJ_ITEMS[0]` fallback）;`setActiveTab` 改 `onNavigate`;`FIELDS_DATA` 隨面板搬入,型別 `FieldRow` 自 `settings.types` import
- [x] 3.3 自共用模組 import:icons（`settings.icons` 的 ChevRight/ChevLeft/PlusIcon）、`IconSearch`（`../../common/icons`）、資料/型別（`settings.data` 的 OBJ_ITEMS/OBJ_ICON_STYLE）

## 4. shell 接線與死碼移除

- [x] 4.1 `Settings.tsx` 移除 `ObjectsPanel`/`FieldsPanel` 巢狀函式定義、其專屬 state（`objTab`/`setObjTab`、`fieldSearch`/`setFieldSearch`）
- [x] 4.2 移除未使用的死碼 `const [fieldTab, setFieldTab] = useState('fields')`
- [x] 4.3 `import` 2 個面板,render 接上 props:`{activeTab === 'objects' && <ObjectsPanel showToast={showToast} onNavigate={setActiveTab} onOpenObject={(api) => router.push(\`/settings/objects/${api}\`)} />}`、`{activeTab === 'fields' && <FieldsPanel showToast={showToast} onNavigate={setActiveTab} selectedObjApi={selectedObjApi} />}`;保留 shell 的 `router`/`selectedObjApi`/`setActiveTab`
- [x] 4.4 清除因搬移產生的 unused import

## 5. 驗證

- [x] 5.1 `npm run type-check`（`tsc --noEmit`）`src/` 無型別錯誤
- [x] 5.2 `npm test` 既有測試全綠
- [x] 5.3 `npm run lint` 無新增問題（`created during render` error 應由 2 降為 0;死碼 `fieldTab` warning 消失;清除新引入 unused import）
- [x] 5.4 人工驗證（單一 dev server + 清 `.next`）:`/settings/objects` 標準/自訂物件切換與計數正確;點物件列進入該物件 `/settings/objects/:api` 欄位頁;欄位搜尋焦點不掉、計數正確;麵包屑/返回鈕導航正確;無 404
