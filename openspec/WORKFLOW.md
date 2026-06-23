# 開發流程：Superpowers × OpenSpec

> 本專案的標準開發流程。任何「新功能 / 行為變更 / 較大的修改」都依此進行。
> 一句話原則：**OpenSpec 管「做什麼 + 狀態」(WHAT)，Superpowers 管「每一步怎麼做到夠好」(HOW)。**

## 角色分工

| 面向 | 由誰負責 |
|------|----------|
| 需求、規格、變更提案、任務清單、狀態記錄 | **OpenSpec**（`openspec/` 為 single source of truth） |
| 探索意圖、TDD、除錯、平行化、審查、驗收、收尾 | **Superpowers** skills |

## 五個階段

### Phase 0 — 探索（Superpowers 主導）
- 入口一律先用 `superpowers:brainstorming` 挖意圖、需求、限制與 red flags。
- 調查既有問題時，它也當作 thinking partner。
- **不直接跳 `openspec-explore` 當入口**；brainstorming 結論才往下交棒。
- 產出：釐清後的意圖與需求重點。

### Phase 1 — 落檔 / Propose（OpenSpec）
- 把 brainstorming 結論交給 `openspec-propose`，產生 change（proposal / design / specs / **tasks**）。
- ⚠️ **OpenSpec 的 tasks 是唯一計劃準則**。不另開 `superpowers:writing-plans`，避免兩份計劃失同步。

### Phase 2 — 實作（OpenSpec apply + Superpowers 紀律）
- 用 `openspec-apply-change` 依 tasks 逐項推進。
- 每個 task **內部**套 `superpowers:test-driven-development`（Red → Green → Refactor）。
- 卡關 → `superpowers:systematic-debugging`，不要憑猜測改。
- 多個彼此獨立的 task → `superpowers:using-git-worktrees` + `superpowers:dispatching-parallel-agents`。
- 每個 task 收工前 → `superpowers:verification-before-completion`（先有證據再宣稱完成）。

#### 測試套件對應（TDD 寫測試時選對層級）

| 要測的東西 | 工具 | 指令 |
|------------|------|------|
| React 元件 / UI 行為（render、互動、可及性） | **`@testing-library/react`** + `@testing-library/user-event` + `jest-dom` matchers | `npm test` |
| 純函式 / 邏輯 / hooks（無 DOM） | `vitest` | `npm test` |
| 跨頁面端到端流程 | `playwright` | `npm run test:e2e` |

- 測試檔放在受測檔旁，命名 `*.test.ts` / `*.test.tsx`（vitest `include` 已涵蓋 `src/**`）。
- 環境已備妥：`jsdom`、`globals: true`、`src/test/setup.ts` 已 import `@testing-library/jest-dom`，**測試裡不必再重複設定**。
- 元件測試守則（呼應 testing-library 哲學，也呼應 TDD「測行為不測實作」）：
  - 用 `screen.getByRole` / `getByLabelText` 等**使用者視角**查詢，避免依賴 class、testid、內部 state。
  - 互動一律用 `userEvent`（非 `fireEvent`），貼近真實操作。
  - 斷言用 `jest-dom`（`toBeInTheDocument`、`toBeDisabled`…）。
  - RED 階段同樣要**親眼看它失敗**：`npm test -- <檔名>`。

### Phase 3 — 審查（Superpowers）
- 視為可合併前，先 `superpowers:requesting-code-review`。
- 收到回饋用 `superpowers:receiving-code-review` 嚴謹處理（驗證而非盲從）。
- 審查結果回頭更新 OpenSpec 的 task 狀態。

### Phase 4 — 收尾（OpenSpec + Superpowers）
- spec 生命週期：`openspec-archive-change` 歸檔；需要併回主 spec 時 `openspec-sync-specs`。
- 分支 / PR / 合併：`superpowers:finishing-a-development-branch`。

## 衝突解決原則（兩套打架時看這裡）

1. **計劃文件衝突** → 永遠以 OpenSpec tasks 為準，不開平行的 writing-plans。
2. **探索入口衝突** → brainstorming 先行，結論才進 openspec-propose。
3. **判斷依據** → 「這是 WHAT 還是 HOW？」WHAT 歸 OpenSpec，HOW 歸 Superpowers。

## 流程速查

```
brainstorming ──▶ openspec-propose ──▶ openspec-apply ──▶ requesting-code-review ──▶ openspec-archive
  (探索)           (落檔/tasks)         (TDD/debug         (審查)                    + finishing-branch
                                          /verify 內嵌)                               (收尾)
```
