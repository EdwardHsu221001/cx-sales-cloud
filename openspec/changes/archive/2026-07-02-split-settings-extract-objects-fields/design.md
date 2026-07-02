## Context

`Settings.tsx`（2640 行）shell 內剩 `ObjectsPanel`、`FieldsPanel` 兩個中型面板 + ~1000 行 `DetailDrawer`。先前多批已建立範式:面板抽為模組層級獨立元件、專屬 state 下放 local、跨模組依賴以 props 傳入、共用資料/型別/子元件置於 `settings.data.ts`/`settings.types.ts`/`settings.components.tsx`。

本次處理 `ObjectsPanel`（物件管理員,route `/settings/objects`,`activeTab==='objects'`）與 `FieldsPanel`（單一物件欄位清單,route `/settings/objects/:api`,`activeTab==='fields'`）。二者為純展示型（不含 hooks,以 `<Panel />` 渲染 → 重掛）。特點是 **route 依賴**。

探索結論（全檔驗證依賴歸屬）:
- **面板專屬（可下放）**:`objTab`（僅 ObjectsPanel:2190/2217/2226/2315）、`fieldSearch`（僅 FieldsPanel:2331/2398/2399）。
- **route 推導值**:`selectedObjApi`（shell 2092 由 `usePathname` segment 推導）→ FieldsPanel 讀它找物件（2325）。
- **route 導航**:ObjectsPanel 列點擊 `router.push('/settings/objects/${obj.api}')`（2260）;breadcrumb 用 `setActiveTab('hub'/'objects')`。
- **共用資料**:`OBJ_ITEMS`（shell `setActiveTab` 2095 + ObjectsPanel + FieldsPanel）、`OBJ_ICON_STYLE`（兩面板 2258/2327）→ `settings.data.ts`。型別 `ObjItem`/`FieldRow`（內聯 108/181）→ `settings.types.ts`。
- **FieldsPanel 專屬資料**:`FIELDS_DATA`（僅 2326）→ 隨面板入檔。
- **死碼**:`fieldTab`/`setFieldTab`（2118）從未使用（eslint unused warning）。

## Goals / Non-Goals

**Goals:**
- 將 `ObjectsPanel`/`FieldsPanel` 抽為獨立元件檔,identity 穩定、消除重掛風險。
- 專屬 state 下放 local;共用資料/型別移至 `settings.data.ts`/`settings.types.ts`;FieldsPanel 專屬 `FIELDS_DATA` 隨面板入檔。
- route 解析集中於 shell,面板以 props 收 route 推導值與導航回呼,保持面板純展示、不直接耦合 Next router。
- 純結構搬移（唯一例外:移除死碼 `fieldTab`）,執行期行為完全不變。

**Non-Goals:**
- 不處理 `DetailDrawer`（~1000 行）— 後續 change。
- 不重構面板內部邏輯、不動 UI、不改資料內容。
- 不改 shell 的 route 解析邏輯（`activeTab`/`selectedObjApi` 推導、`setActiveTab` 的 router.push）— 僅將其結果以 props 下傳。

## Decisions

- **檔案位置**:`settings/objects/ObjectsPanel.tsx`、`settings/fields/FieldsPanel.tsx`（延續每面板一資料夾慣例）。
- **route 處理（方案 A）**:route 解析留在 shell。`FieldsPanel` 以 prop `selectedObjApi: string` 收 shell 推導值;`ObjectsPanel` 以 prop `onOpenObject: (api: string) => void` 收導航回呼（shell 實作為 `router.push('/settings/objects/${api}')`）。面板不 import `next/navigation`。選此而非讓面板自行 `usePathname`,以維持「shell 管路由、面板純展示」的一致範式並保面板可測。
- **Props 介面**:
  - `ObjectsPanel`:`{ showToast, onNavigate, onOpenObject }`;`objTab` 下放為 local state。
  - `FieldsPanel`:`{ showToast, onNavigate, selectedObjApi }`;`fieldSearch` 下放為 local state。
- **資料／型別搬移**:`OBJ_ITEMS`/`OBJ_ICON_STYLE` → `settings.data.ts`（`export`）;`ObjItem`/`FieldRow` → `settings.types.ts`;`settings.data.ts` 與面板自型別模組 import。`FIELDS_DATA`（FieldsPanel 專屬）移入 `FieldsPanel.tsx`,其型別 `FieldRow` 自 `settings.types` import。
- **死碼移除**:刪除 shell 內未使用的 `const [fieldTab, setFieldTab] = useState('fields')`。因其正屬本批處理的 objTab/fieldTab/fieldSearch state 群集且 eslint 已標記 unused,在範圍內一併清除。
- **shell 接線**:移除 2 面板定義與專屬 state;render `{activeTab === 'objects' && <ObjectsPanel showToast={showToast} onNavigate={setActiveTab} onOpenObject={(api) => router.push(\`/settings/objects/${api}\`)} />}`、`{activeTab === 'fields' && <FieldsPanel showToast={showToast} onNavigate={setActiveTab} selectedObjApi={selectedObjApi} />}`;shell 保留 `router`/`usePathname`/`selectedObjApi`/`setActiveTab`,`setActiveTab` 改自 `settings.data` import `OBJ_ITEMS`。

## Risks / Trade-offs

- **route 導航回呼行為改變**:`onOpenObject` 內的 `router.push` 路徑須與原 inline 完全一致（`/settings/objects/${api}`）。緩解:逐字對照;人工驗證點物件列會進到該物件的 fields 頁。
- **`selectedObjApi` 傳遞**:FieldsPanel 的 `OBJ_ITEMS.find(... ?? OBJ_ITEMS[0])` fallback 須保留（route 無 segment 時預設第一個物件）。
- **資料歸屬判斷錯誤**:`OBJ_ITEMS` 被 shell 也用,若誤搬進面板則 shell 無法 import。緩解:已驗證 shell 2095 使用,故移至 `settings.data.ts`。
- **行為悄悄改變**:搬移誤動篩選/計數邏輯（`objTab` 過濾、`fieldSearch` 過濾、fallback）。緩解:逐段對照、`type-check` + 既有測試全綠,人工驗證標準/自訂物件切換、欄位搜尋（焦點不掉）、物件↔欄位導航。
