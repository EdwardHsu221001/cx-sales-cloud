# 專案學習筆記（onboarding）

> 給剛接觸本專案的人。看 code 卡住時回來對照。
> 重點：先懂「**一個反應迴圈**」和「**純函式 vs 畫面的職責分工**」，其餘都是變化題。

---

## 0. 這是什麼專案

B2B SaaS **CRM 前端原型**（潛客 / 客戶 / 聯絡人 / 商機 / 活動 / 報表 / 設定）。
資料目前都是寫死的 mock（記憶體裡），**沒有後端、沒有資料庫**。階段＝「畫面 + 互動邏輯」。

---

## 1. 技術堆疊（只列現在真的在跑的核心）

| 類別 | 技術 | 版本 |
|------|------|------|
| 框架 | Next.js（App Router） | 16.2.9 |
| UI | React | 19.2.4 |
| 語言 | TypeScript（`strict`） | ^6 |
| 樣式（主力） | 手寫 CSS `src/app/crm.css`，class 前綴 `cx-` | — |
| 樣式（新、漸進導入） | Tailwind v4 + shadcn + @base-ui/react | — |
| 測試 | vitest / @testing-library/react / playwright | — |

⚠️ `package.json` 裡的 react-query、zustand、react-hook-form、zod **已安裝但尚未實際使用**，是為將來接後端預留。別被嚇到。

⚠️ **兩套樣式並存**：畫面主體是手寫 `cx-` class（去 `crm.css` 搜定義）；Tailwind/shadcn 目前只有 `components/ui/button.tsx` 真的用。

---

## 2. 目錄地圖

```
src/
├── app/                       ← Next.js App Router（檔案即路由）
│   ├── layout.tsx             ← 根 layout（<html>、字型、載入全域 CSS）
│   ├── crm.css                ← 8770 行手寫 CSS（cx- class 都在這）
│   └── (crm)/                 ← route group：括號不影響網址，只為共用 layout
│       ├── layout.tsx         ← 包 <AppShell>（側欄+頂欄）
│       ├── leads/page.tsx     ← /leads
│       └── settings/[...slug]/page.tsx  ← /settings/任意深度
├── components/crm/            ← 各模組大元件 + 旁邊的 *.utils.ts / *.test.tsx
└── lib/utils.ts               ← cn()（clsx + tailwind-merge）
```

### 路由速記
- **檔案即路由**：`app/(crm)/leads/page.tsx` → `/leads`。
- **`(資料夾)` route group**：不出現在網址，只為讓底下頁面共用同一個 `layout.tsx`。
- **`[...slug]` catch-all**：接住任意深度網址（如 `/settings/email`），元件內再用 `usePathname()` 切子頁。
- **`layout.tsx`**＝切頁不重繪的外框；**`page.tsx`**＝該網址的內容。

---

## 3. 寫法慣例

- **`'use client'`**（檔首）：宣告 Client Component，才能用 `useState` / 綁事件。本專案互動元件幾乎都是。
- **`@/`** ＝ `src/`（`tsconfig.json` 的 `paths`）。`./xxx` ＝ 同資料夾。
- **`import { type Foo }`**：只匯入型別，編譯後整段刪掉（`isolatedModules: true` 的慣例）。
- **純邏輯抽到 `*.utils.ts`**；UI 與綁 state 的邏輯留在 `*.tsx`。
- **資料先定型別**：看不懂某物件長相，去找它的 `interface` / `type`。
- **讀 TS 函式先看簽名**：括號裡的參數型別 + 回傳型別，就能推出「吃什麼、吐什麼」。

---

## 4. 核心心智模型：單向資料流 + 反應迴圈 ⭐

整個專案 90% 的元件都是這一圈：

```
state ──► 衍生值（現算）──► 畫面(JSX)
  ▲                              │
  └──── setState ◄── 使用者互動 ──┘
```

### `useState` 鐵則
```tsx
const [x, setX] = useState(初始值);
```
- 改 state **一定走 `setX(...)`**，不可 `x = ...`。
- `setX` 會通知 React →「**重新執行整個元件函式**」→ 畫面重畫。直接改變數 React 不知道。

### 衍生值不要另存 state
能從 state 算出來的（過濾結果、統計數字、選中項）**現算就好**，不要再開一個 `useState`，否則容易兩邊不同步。
- 例：`Leads.tsx:279` `const filtered = filterLeads(LEADS, query)`
- 例：`Settings.tsx:5749` `const stats = emailStats(emailTemplates, EMAIL_CATS)`

#### 真實 bug 案例：`allSelected` 的 desync ⭐（重複狀態沒同步）

列表「全選」的勾勾狀態 `allSelected`，**其實是衍生值**：
```
allSelected === 已選數量 等於 清單總數
```

舊版 `Leads.tsx` 卻把它**另外存成一個 state**，只在 `toggleRow`/`toggleAll` 裡手動補算：
```tsx
// ❌ 爛寫法：allSelected 是「第二份真相」，要到處手動同步
const [selectedRows, setSelectedRows] = useState(new Set());
const [allSelected, setAllSelected] = useState(false);

const toggleRow = (id) => {
  setSelectedRows((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    setAllSelected(next.size === leads.length); // 只有這條路徑會補算
    return next;
  });
};
```

**bug 重現**：全選 6 筆（`allSelected=true`）→ 從別的路徑**新增**一筆變 7 筆 → 沒人去重算 `allSelected`，它仍是 `true` → 表頭顯示「全選」打勾，但第 7 筆根本沒選。**畫面騙人。** （`leads` 從非 toggle 的路徑改變，第二份真相就脫節。）

```tsx
// ✅ 好寫法：不存它，每次 render 現算 → 永遠跟現實一致
const allSelected = selected.size === allIds.length && allIds.length > 0;
```

這正是 `extract-userowselection-hook` 把兩頁選取邏輯抽成 `useRowSelection.ts` 時順手修掉的（Accounts 本來就用衍生寫法，Leads 沒有）。

**判斷法**：問「這個值是不是別的 state 的函數？」是 → 用 `const x = 算出來`，不要 `useState`。**一想到「開個 state 然後到處 set 它保持同步」，幾乎就是這個 bug 的前兆。**

### 不可變更新（immutable update）⭐
React 靠「**參考有沒有換**」判斷資料變了沒。
- ✅ 產新物件 / 新陣列：`{ ...old, ...patch }`、`list.map(...)`
- ❌ 原地改：`old.x = 1`、`list[i] = y`（參考沒變 → React 不重畫）
- 例：`applyTemplateEdit`（`email.utils.ts:133`）用 `.map()` 回傳新陣列；測試特地驗 `expect(next).not.toBe(T)`。

---

## 5. 純函式 vs 畫面：職責分工 ⭐

「功能和畫面分開」**不是檔案分開，是職責分開**。

判斷一段邏輯該放哪，問一句：
> **這段邏輯需不需要 React / 需不需要畫面才能跑？**
> - 不需要（同輸入→同輸出、不碰 DOM/state）→ 抽到 `*.utils.ts`（純函式）
> - 需要（要呼叫 `setState`、要畫東西）→ 留在元件

| 抽到 utils（純） | 留在元件 |
|---|---|
| `filterLeads`、`filterEmailTemplates`（過濾） | `useState` / `useEffect` |
| `validateTemplateDraft`（算對錯） | `toggleRow`、`save`（操作 state） |
| `applyTemplateEdit`（算新清單） | JSX 畫面、事件綁定 |
| `interface` / `type` 定義 | 把 utils 結果塞進 `setState` 並畫出來 |

好處：純函式能單獨快速測試（`*.utils.test.ts`，vitest 層）、可重用、讓元件好讀。

---

## 6. 範例一：`/leads` 最短資料流

`page.tsx` → `Leads.tsx` → `leads.utils.ts`

1. `app/(crm)/leads/page.tsx`：薄入口，只負責 `<Leads showToast={...} />`，把 prop 餵進去。
   - **prop ＝ 父給子的參數**。同一元件，父給不同 `showToast`，行為就不同。
2. `Leads.tsx:270` 收 prop：`function Leads({ showToast }: { showToast: (msg: string) => void })`
3. `Leads.tsx:276` state：`const [query, setQuery] = useState('')`
4. `Leads.tsx:279` 衍生：`const filtered = filterLeads(LEADS, query)`（**心臟**）
5. 搜尋框（`Leads.tsx:443`）：`value={query}` + `onChange={e => setQuery(e.target.value)}`
6. 表格（`Leads.tsx:531`）：`{filtered.map(lead => <tr key={lead.id}>...)}`

**迴圈**：打字 → `setQuery` → 重跑 `Leads()` → `filtered` 重算 → 表格 / 「共 N 筆」重畫。

---

## 7. 範例二：郵件範本編輯（utils ↔ state ↔ 畫面 的縫合）⭐

檔案 `Settings.tsx` 的 `EmailPanel`（state 宣告在元件層 `4239` 起）。

### 兩個關鍵 state
```tsx
const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(...) // 真資料
const [emailDraft, setEmailDraft] = useState<EmailTemplate | null>(null)   // 草稿
```
- **真資料 / 草稿分離** ⭐：編輯先動草稿，確認才寫回真資料 → 才能做「取消還原」。
- `emailDraft` 的 `| null` 同時表達「抽屜開不開」+「在編什麼」。

### 衍生值（`Settings.tsx:5749`）
```tsx
const stats    = emailStats(emailTemplates, EMAIL_CATS);            // 統計卡片數字
const filtered = filterEmailTemplates(emailTemplates, EMAIL_CATS, emailSearch);
const selected = emailTemplates.find(t => t.k === emailSel) ?? emailTemplates[0];
```

### 三個動作（`Settings.tsx:6075` 起的抽屜）
- **開編輯**（`5928`）：`setEmailDraft(structuredClone(selected))` — 深拷貝真資料成草稿，動草稿不傷真資料。
- **改欄位**（`6079`）：`setField({name})` → `setEmailDraft(d => ({...d, ...patch}))` — 受控元件：`value={draft.x}` + `onChange`。
- **驗證即時顯示**（`6078`/`6129`）：`const v = validateTemplateDraft(draft)`；`{v.nameError && <span className="err">{v.nameError}</span>}`。
- **儲存**（`6095`）：
  ```tsx
  if (!validateTemplateDraft(draft).ok) return;
  setEmailTemplates(list => applyTemplateEdit(list, draft)); // 草稿寫回真資料
  setEmailDraft(null);                                       // 關抽屜
  ```
  一個 set → 重畫 → `stats`/`filtered`/`selected` 全用新清單重算 → 整頁同步。
- **取消**（`6094`）：`setEmailDraft(null)` — 草稿丟掉，真資料原封不動。

### JSX 中的怪語法
`{emailDraft && (() => { ...宣告... return (<JSX/>) })()}`
＝ 草稿有值才渲染；用**立即執行函式 (IIFE)** 在 JSX 中間開一塊區域放區域變數，再 return 畫面。

---

## 8. 測試怎麼對應（呼應開發流程 WORKFLOW.md）

| 測什麼 | 工具 | 指令 |
|------|------|------|
| 純函式 / 邏輯 | vitest | `npm test` |
| UI / 元件互動 | @testing-library/react + userEvent | `npm test` |
| 跨頁端到端 | playwright | `npm run test:e2e` |

元件測試守則：用 `getByRole` / `getByLabelText`（使用者視角）查詢，避免依賴 class / testid；互動用 `userEvent`；斷言用 jest-dom。

---

## 9. 學習路徑建議

1. React 基礎：`useState`、props、JSX。
2. Next.js App Router：`app/` 路由、`layout`/`page`、`'use client'`。
   （本專案 Next 版本較新，寫 code 前讀 `node_modules/next/dist/docs/`。）
3. TypeScript 基礎：`interface` / `type` / 泛型；養成「先看函式簽名」的習慣。
4. 跟讀最短資料流：`leads/page.tsx → Leads.tsx → leads.utils.ts`（見 §6）。
5. 最後再碰 `Settings.tsx`（8000+ 行巨獸），別一開始硬啃。

---

## 10. 一句話帶走

> **page 餵 props → 元件管 state → 衍生值現算 → 純函式算邏輯 → setState 觸發重畫。**
> 純函式只「算」，元件負責「把結果塞進 setState」和「把結果畫出來」。一律不可變更新。

---

## 12. `Dashboard.tsx` vs `HomeDashboard.tsx`：架構演進與 state 下放 ⭐

兩個檔很像是因為後者源自前者；不一樣是因為中間發生過一次架構演進：**單檔 SPA → App Router 路由 + 拆元件**。

| 面向 | `Dashboard.tsx`（舊・已刪的死碼） | `HomeDashboard.tsx`（活的） |
|------|------|------|
| 管的範圍 | 整個 App：頂欄+側欄+內容+切頁+toast | 只有「首頁內容」 |
| icon | 自己內聯 ~20 個 | `import from '../common/icons'` |
| 切頁 | `activeView` state + 條件渲染，網址不變 | 交給 Next.js 路由（網址即頁面） |
| 外框 | 自己畫 navbar/sidebar | 外框是 `AppShell.tsx`（`(crm)/layout.tsx`） |
| 首頁 state | 內部 HomeDashboard 用 **props 接**（父層持有） | **自己持有** `useState`/`showToast` |

**核心觀念 — state 擺多高，看「有誰共用」**：舊版 toast 是全 App 共用一個，所以 state 上提到最外層父元件（lifting state up），首頁當受控子元件用 props 借用；改用 App Router 後首頁變成獨立路由頁，沒有父層可寄放，state 就下放回自己身上。

**死碼判斷與處置**：`Dashboard.tsx` 全 repo 無人 import（`grep` 確認）→ 屬死碼。在 git 追蹤下刪除安全（可 revert）；刪後 `npm test` 147 全綠、type-check 通過。判斷死碼兩步：(1) grep 全 repo 無引用 (2) 在版控內，刪錯救得回。

---

## 11. 教學進度與待教清單（給 AI：下次從這裡接續）

> 使用者正被「帶讀程式碼」學這個專案。指定本檔即可接續。
> 教學風格：繁中、先實際讀 code 附 `檔案:行號`、逐行拆語法、每關結尾出小練習由使用者作答後確認、用真實範例 + 對照爛/好寫法。

**已教（截至 2026-06-29）**
1. 開發流程（WORKFLOW.md）
2. 測試三層 + 親手重構（class selector → `getByLabelText` + `aria-label`）
3. 技術堆疊 / 目錄 / 路由 / 兩套樣式並存
4. 核心心智模型（單向資料流、`useState`、衍生值現算、不可變更新）— §4
5. 純函式 vs 畫面職責分工 — §5
6. `/leads` 最短資料流 — §6
7. `Settings.tsx` EmailPanel：utils↔state↔畫面縫合（真資料/草稿、`structuredClone`、受控元件、IIFE）— §7
8. 聯合型別 / discriminated union（`EmailBlock` 的 `kind`、型別收窄 narrowing）
9. 衍生 vs 重複狀態：`allSelected` desync 真實 bug（`extract-userowselection-hook` 抽 `useRowSelection` 時修掉）— §4
10. components 依物件分資料夾重整（accounts/contacts/leads/common/… + AppShell 留根層）；`Dashboard.tsx` vs `HomeDashboard.tsx` 架構演進、state 下放、死碼判斷與刪除 — §12

**待教（下次可接）**
- ⏳ 確認上一題小練習：`EmailBlock` 的 `sig` 區塊 → 該加哪行 `if`？為何能存取 `b.sig` 而非 `b.text`？
- `useEffect` 深入（依賴陣列、清理函式；`Leads.tsx` outside-click / Escape）
- TS 工具型別（`Partial` / `Record` / `Pick` / `Omit`）
- 新樣式（shadcn/Tailwind + `cva`，讀 `button.tsx`）vs `cx-` 手寫 CSS
- 跟讀測試怎麼驗證資料流（對照 `*.test.tsx`）
