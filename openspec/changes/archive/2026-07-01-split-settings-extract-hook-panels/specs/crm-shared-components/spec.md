## MODIFIED Requirements

### Requirement: 大型設定頁各模組面板抽為獨立元件

大型設定頁（如 `Settings.tsx`）的各設定模組面板 SHALL 抽為獨立 import 的元件檔（模組層級函式，identity 穩定），MUST NOT 以巢狀函式定義於父元件內再以 `<Panel />` 形式渲染。面板**專屬**的 state SHALL 下放至該面板元件作為 local state；跨模組共用的回呼與資料（如 `showToast`、導航、共用參考資料）SHALL 以 props 傳入。父元件（shell）僅保留導覽與模組路由。共用 icons、型別與參考資料 SHALL 置於各自的共用模組（如 `settings.icons.tsx`、`settings.types.ts`、`settings.data.ts`），由 shell 與各面板 import。自帶 React hooks 的面板（其 state 本即為自身 local）SHALL 一併抽為獨立元件檔，因其無法以內聯函式呼叫渲染（rules-of-hooks），唯有抽出為穩定 identity 的元件方能避免 `<Panel />` 重掛。

#### Scenario: 面板為獨立 import 元件

- **WHEN** 檢視某設定模組面板（如角色折扣上限）
- **THEN** 其定義位於獨立檔（如 `settings/discount/DiscountPanel.tsx`），由 shell `import` 後以 `<DiscountPanel ... />` 渲染，而非定義為 shell 內的巢狀函式

#### Scenario: 專屬 state 下放、共用以 props 傳入

- **WHEN** 某面板使用僅自身需要的 state（如 `discountVals`）
- **THEN** 該 state 為面板元件的 local state；而 `showToast`、導航等跨模組依賴以 props 傳入

#### Scenario: 穩定 identity 不重掛

- **WHEN** shell 因其他狀態更新而重渲
- **THEN** 已抽出的面板元件因 identity 穩定而不被卸載重掛，面板內輸入焦點與捲動位置維持不變

#### Scenario: 自帶 hooks 的面板亦抽為獨立元件

- **WHEN** 檢視自帶 React hooks 的設定面板（如 `RolesPanel`、`FlowPanel`、`ImportPanel`、`ImportWizardPanel`）
- **THEN** 各自位於獨立檔（`settings/roles/RolesPanel.tsx`、`settings/flow/FlowPanel.tsx`、`settings/import/ImportPanel.tsx`、`settings/import/ImportWizardPanel.tsx`），由 shell `import` 後以 `<Panel ... />` 渲染，其 hooks 與 local state 定義於該元件內，不再為 shell 的巢狀函式
