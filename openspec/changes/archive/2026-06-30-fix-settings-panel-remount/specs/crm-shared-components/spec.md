## ADDED Requirements

### Requirement: 巢狀面板以內聯呼叫渲染避免重掛

CRM 頁面在 render 中依狀態條件呈現的巢狀面板（如 `Settings.tsx` `DetailDrawer` 內依 `state.type` 切換的設定面板）SHALL 以內聯函式呼叫 `Panel()` 的形式渲染其 JSX，MUST NOT 以 `<Panel />` 元件元素的形式建立。此規範用以避免 React 將其視為獨立元件型別而在重渲或切換時卸載重掛，進而造成輸入失焦與捲動位置重置。採內聯呼叫的面板函式 MUST NOT 自行呼叫 React hook（以免在條件式下違反 rules-of-hooks）。

#### Scenario: 條件面板採內聯呼叫

- **WHEN** 元件在 render 中依狀態條件呈現某巢狀面板
- **THEN** 以 `面板函式()` 內聯呼叫渲染其內容，而非 `<面板函式 />`

#### Scenario: 切換面板不重置狀態

- **WHEN** 使用者在面板輸入或捲動後，外層因狀態更新而重渲
- **THEN** 面板不被卸載重掛，輸入焦點與捲動位置維持不變

#### Scenario: 內聯面板不含 hook

- **WHEN** 某面板函式被以內聯呼叫方式渲染於條件式下
- **THEN** 該函式內不含任何 React hook 呼叫
