## Why

`Settings.tsx` 的 `DetailDrawer` 以 `state.type` 條件渲染五個面板時，使用 `<UserContent />`、`<ProfileContent />`、`<PermSetContent />`、`<FlowContent />`、`<BatchContent />`（在 render 過程中把巢狀函式當「元件」建立）。React 會把它們視為不同的元件型別，導致每次重渲／切換時整個面板**卸載重掛**，造成輸入失焦與捲動位置重置；同時觸發 5 個 `react-hooks/static-components` ESLint error（`Settings.tsx:3551-3555`）。此為已知陷阱（見記憶 settings-nested-panel-remount）。

## What Changes

- 將 `Settings.tsx:3551-3555` 的 `<XContent />` 改為**內聯函式呼叫** `XContent()`，使面板 JSX 直接內聯於 `DetailDrawer` 的 render，不再被當成獨立元件，消除卸載重掛。
- 五個 `*Content` 函式定義（`UserContent` 等）維持原處不動；僅改呼叫端寫法。
- 結果：修正切換面板時的失焦／捲動重置，並清除 5 個 `react-hooks/static-components` error。
- 確立並文件化「巢狀面板以內聯呼叫渲染、避免重掛」此一共用慣例，納入 `crm-shared-components` 規格。
- 非目標：不重構 `DetailDrawer` 其他部分、不處理 Settings.tsx 既有的其他 lint warning、不調整面板內容或行為。

## Capabilities

### New Capabilities
<!-- 無新增能力 -->

### Modified Capabilities
- `crm-shared-components`: 新增一條要求，規範 CRM 頁面在 render 中條件呈現的巢狀面板 SHALL 以內聯函式呼叫（`Panel()`）渲染、MUST NOT 以 `<Panel />` 元件形式建立，以避免卸載重掛導致的失焦與捲動位置重置。

## Impact

- 受影響程式碼：`src/components/crm/settings/Settings.tsx` 的 `DetailDrawer`（僅 5 行呼叫端）。
- 風險低：經確認五個 `*Content` 函式內**無任何 hook 呼叫**，故在 `state.type === 'x' &&` 條件下改為直接呼叫不違反 rules-of-hooks。
- 既有測試（`Settings.pagelayout.test.tsx`、`Settings.email.test.tsx`）應維持綠燈。
- 清除 5 個 ESLint error，使 `Settings.tsx` 不再有 error（仍餘既有 warning，本變更不處理）。
