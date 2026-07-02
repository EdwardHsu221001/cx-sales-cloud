## Why

`Settings.tsx`（2640 行）shell 內剩 `ObjectsPanel`（物件管理員清單）與 `FieldsPanel`（單一物件的欄位清單,route `/settings/objects/:api`）兩個中型面板 + ~1000 行 `DetailDrawer`。二者目前以巢狀函式定義並以 `<Panel />` 渲染,每次 shell re-render 換 identity 而卸載重掛（含搜尋 input 失焦潛在問題）。將其抽為模組層級獨立元件、專屬 state 下放 local,即可獲得穩定 identity 並讓 shell 續瘦身。此批的特點是有 **route 依賴**:`FieldsPanel` 需知道目前選取的物件（route 推導的 `selectedObjApi`）,`ObjectsPanel` 的列點擊會 `router.push` 到物件路由。經探索確認:route 解析已集中於 shell（`usePathname`）,面板只需透過 props 收 route 推導值與導航回呼即可保持純展示、與既有「shell 管路由、面板純展示」範式一致。

## What Changes

- 新增 `settings/objects/ObjectsPanel.tsx`、`settings/fields/FieldsPanel.tsx`,各以 `export default function` 提供。
- 二者內容原樣移入新檔;專屬 state 下放 local:`ObjectsPanel` 的 `objTab`、`FieldsPanel` 的 `fieldSearch`。
- 對 shell 依賴以 props 傳入:
  - `ObjectsPanel`:`{ showToast, onNavigate, onOpenObject }`（`onOpenObject(api)` 由 shell 以 `router.push('/settings/objects/${api}')` 實作,對應列點擊導航）。
  - `FieldsPanel`:`{ showToast, onNavigate, selectedObjApi }`（`selectedObjApi` 由 shell 自 route 推導後傳入;route 解析仍集中於 shell）。
  - `onNavigate` 由 shell 以 `setActiveTab` 傳入（沿用既有範式）。
- 共用資料 `OBJ_ITEMS`（shell `setActiveTab` + 兩面板共用）、`OBJ_ICON_STYLE`（兩面板共用）移至 `settings.data.ts` 並 `export`;其型別 `ObjItem`/`FieldRow`（原內聯於 `Settings.tsx`）移至 `settings.types.ts`。
- `FieldsPanel` 專屬 mock 資料 `FIELDS_DATA`（僅 FieldsPanel 用）隨面板搬入其檔（比照 `PlaceholderPanel` 的 `METADATA`）。
- `Settings.tsx` 移除 2 個巢狀面板定義、其專屬 state（`objTab`/`fieldSearch`）、`OBJ_ITEMS`/`OBJ_ICON_STYLE`/`FIELDS_DATA`/`ObjItem`/`FieldRow` 定義,改 `import` 後以 `<ObjectsPanel ... />` / `<FieldsPanel ... />` 渲染;shell 的 `setActiveTab` 改自 `settings.data` import `OBJ_ITEMS`。
- 順手移除既有死碼:shell 內從未使用的 `const [fieldTab, setFieldTab] = useState('fields')`（eslint 既有 unused warning）。
- 純結構搬移（除移除該死碼外）,MUST NOT 改變執行期行為。

## Capabilities

### New Capabilities
<!-- 無新增 capability -->

### Modified Capabilities
- `crm-shared-components`: 既有 requirement「大型設定頁各模組面板抽為獨立元件」新增一條 scenario,將含 route 依賴的 `ObjectsPanel`/`FieldsPanel` 納入範圍,並敘明「route 解析集中於 shell,面板以 props 收 route 推導值（`selectedObjApi`）與導航回呼（`onOpenObject`）」的分流原則。

## Impact

- `src/components/crm/settings/Settings.tsx`（移除 2 面板、`objTab`/`fieldSearch`/`fieldTab`、`OBJ_ITEMS`/`OBJ_ICON_STYLE`/`FIELDS_DATA`/型別;新增 import 與接線）
- 新增 `src/components/crm/settings/objects/ObjectsPanel.tsx`、`fields/FieldsPanel.tsx`
- `src/components/crm/settings/settings.data.ts`（接收 `OBJ_ITEMS`/`OBJ_ICON_STYLE`）
- `src/components/crm/settings/settings.types.ts`（接收 `ObjItem`/`FieldRow`）
- 無外部 API／相依套件變動;無資料行為變動。
