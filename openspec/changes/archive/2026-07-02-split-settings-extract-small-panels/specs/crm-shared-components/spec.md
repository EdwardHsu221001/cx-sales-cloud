## MODIFIED Requirements

### Requirement: 大型設定頁各模組面板抽為獨立元件

大型設定頁（如 `Settings.tsx`）的各設定模組面板 SHALL 抽為獨立 import 的元件檔（模組層級函式，identity 穩定），MUST NOT 以巢狀函式定義於父元件內再以 `<Panel />` 形式渲染。面板**專屬**的 state SHALL 下放至該面板元件作為 local state；跨模組共用的回呼與資料（如 `showToast`、導航、共用參考資料）SHALL 以 props 傳入。父元件（shell）僅保留導覽與模組路由。共用 icons、型別與參考資料 SHALL 置於各自的共用模組（如 `settings.icons.tsx`、`settings.types.ts`、`settings.data.ts`），由 shell 與各面板 import。自帶 React hooks 的面板（其 state 本即為自身 local）SHALL 一併抽為獨立元件檔，因其無法以內聯函式呼叫渲染（rules-of-hooks），唯有抽出為穩定 identity 的元件方能避免 `<Panel />` 重掛。原本因不含 hooks 而以內聯函式呼叫（`Panel()`）渲染以規避重掛的面板，於其專屬 state 下放為 local state 後 SHALL 抽為獨立元件並改以 `<Panel />` 穩定 identity 渲染，移除該 inline-call 權宜寫法。純展示型（不含 hooks、原以巢狀函式定義並以 `<Panel />` 渲染）的面板同樣 SHALL 抽為模組層級獨立元件以獲得穩定 identity；其面板專屬 state（如 `HubPanel` 的 `hubSearch`）SHALL 一併下放為 local state，跨模組共用常數 SHALL 依語意分流後供 shell 與面板共同 import：導覽結構設定（如帶 icon JSX 的 `NAV_GROUPS`）SHALL 置於 `.tsx` 導覽模組（`settings.nav.tsx`），mock 業務資料（如 `PROFILES`、`PERMSETS`、`PERM_ASSIGNED`）SHALL 置於 `settings.data.ts`。

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

#### Scenario: 原以 inline-call 渲染的面板改為獨立元件

- **WHEN** 檢視原本因不含 hooks、以內聯函式呼叫（如 `EmailPanel()`、`PageLayoutPanel()`）渲染以規避重掛的面板
- **THEN** 其專屬 state（如 `emailTemplates`/`emailDraft`、`plObj`/`plSections`）下放為該面板元件的 local state，面板位於獨立檔（`settings/email/EmailPanel.tsx`、`settings/pagelayout/PageLayoutPanel.tsx`），由 shell `import` 後以 `<EmailPanel ... />` / `<PageLayoutPanel ... />` 渲染，不再使用 inline-call 權宜寫法

#### Scenario: 純展示型小面板抽為獨立元件

- **WHEN** 檢視原以巢狀函式定義並以 `<Panel />` 渲染的純展示型小面板（`HubPanel`、`ProfilesPanel`、`PermSetsPanel`、`PlaceholderPanel`）
- **THEN** 各自位於獨立檔（`settings/hub/HubPanel.tsx`、`settings/profiles/ProfilesPanel.tsx`、`settings/permsets/PermSetsPanel.tsx`、`settings/placeholder/PlaceholderPanel.tsx`），由 shell `import` 後以 `<Panel ... />` 渲染；`HubPanel` 的專屬 state `hubSearch`（含衍生 `filteredGroups`）下放為 local state，共用導覽設定 `NAV_GROUPS` 移至 `settings.nav.tsx`、共用 mock 資料 `PROFILES`/`PERMSETS`/`PERM_ASSIGNED` 移至 `settings.data.ts`（型別 `ProfileData`/`PermSetData` 移至 `settings.types.ts`），面板專屬常數與 helper（`HUB_ICON_CLS`、`METADATA`、`PlaceholderCell`）隨面板搬入其檔，開抽屜回呼（`onOpenProfile`/`onOpenPermSet`）與 `onNavigate`、`activeTab` 以 props 傳入
