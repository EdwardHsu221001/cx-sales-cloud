## Context

`Settings.tsx` 的 `DetailDrawer`（`function DetailDrawer` 起於 1762 行）內定義五個渲染輔助函式並在 return 中條件呈現：

```
{state.type === 'user'    && <UserContent />}      // 3551
{state.type === 'profile' && <ProfileContent />}   // 3552
{state.type === 'permset' && <PermSetContent />}   // 3553
{state.type === 'flow'    && <FlowContent />}       // 3554
{state.type === 'batch'   && <BatchContent />}      // 3555
```

函式定義位置：`UserContent` 1800、`ProfileContent` 2105、`PermSetContent` 2374、`FlowContent` 2566、`BatchContent` 3004——皆為 `DetailDrawer` 的巢狀閉包，使用其 `state`/`props`。以 `<X />` 形式使用時，React 在每次 `DetailDrawer` 重渲都建立新的元件型別實例，導致面板子樹卸載重掛（失焦、捲動重置），並觸發 `react-hooks/static-components` error。

## Goals / Non-Goals

**Goals:**
- 將 5 個面板由 `<X />` 改為 `X()` 內聯呼叫，消除卸載重掛。
- 清除 `Settings.tsx:3551-3555` 的 5 個 ESLint error。
- 修正切換／重渲時的失焦與捲動位置重置。

**Non-Goals:**
- 不更動五個 `*Content` 函式的內容或定義位置。
- 不重構 `DetailDrawer` 其餘部分。
- 不處理 `Settings.tsx` 既有的其他 lint warning（未使用變數、exhaustive-deps、no-unused-expressions）。

## Decisions

**決策 1：採內聯呼叫 `X()` 而非把函式提升為穩定元件。**
最小且符合既有慣例（記憶 settings-nested-panel-remount 即此解）。替代方案「將 `*Content` 提為 `DetailDrawer` 外的獨立元件並以 props 傳入 state」需重接大量閉包變數，改動面遠大於本次目標，不採。

**決策 2：維持 `state.type === 'x' && X()` 的條件結構。**
僅把 `<X />` 換成 `X()`，條件短路不變。前置已驗證五個函式內**無 hook**，故條件式下直接呼叫安全，不違反 rules-of-hooks。

## Risks / Trade-offs

- **[未來有人在 `*Content` 內加入 hook]** → 因其以條件內聯呼叫，會違反 rules-of-hooks。緩解：spec 明訂「內聯面板函式 MUST NOT 含 hook」，並保留條件短路語意；如未來面板需自有狀態，應改提升為獨立元件。
- **[行為回歸（面板內容變動）]** → 內聯呼叫產生的 JSX 與 `<X />` 相同，僅 reconciliation 身分不同。緩解：跑既有 `Settings.*.test.tsx`，並人工驗證切換五種設定面板、編輯欄位時焦點與捲動維持。
