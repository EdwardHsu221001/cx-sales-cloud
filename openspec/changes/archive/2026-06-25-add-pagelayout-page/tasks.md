> 標記：[呈現]=免測（視覺驗證）；[邏輯]=要測。已完成的程式碼直接勾 [x]。

## 1. 既有實作（已完成，補登）

- [x] 1.1 [邏輯] `pagelayout.utils.ts`：型別 + `pageLayoutStats()`、`filterPalette()`
- [x] 1.2 [呈現] `Settings.tsx`：`PL_*` 常數、圖示元件
- [x] 1.3 [邏輯] `Settings.tsx`：state（plObj/plLayout/plPalTab/plPalSearch/plSections）、handler（togglePlSection/removePlField/removePlSection）
- [x] 1.4 [呈現] `Settings.tsx`：`PageLayoutPanel()` 內聯渲染 + nav 接線（`/settings/pagelayout`）
- [x] 1.5 [呈現] `crm.css`：builder / palette / page-layout 樣式

## 2. 純函式測試（vitest，pagelayout.utils.test.ts）

- [x] 2.1 `pageLayoutStats(PL_PILLS)` → `{ layouts: 5, objects: 4 }`
- [x] 2.2 `pageLayoutStats({})` → `{ layouts: 0, objects: 0 }`
- [x] 2.3 `filterPalette(groups, '')` 與全空白 → 原樣回傳（不過濾）
- [x] 2.4 `filterPalette` 以名稱關鍵字過濾、以型別關鍵字過濾、大小寫不敏感
- [x] 2.5 `filterPalette` 過濾後移除空群組；全部不符 → 回 `[]`

## 3. 元件行為測試（testing-library，Settings.pagelayout.test.tsx）

- [x] 3.1 進入頁面顯示標題「頁面版面」與統計「版面總數 5」
- [x] 3.2 切換物件 select（商機→客戶帳號）後 pills 數量由 2 變 1
- [x] 3.3 調色盤搜尋相符 → 只剩符合項；輸入不存在字串 → 顯示「查無符合的項目」
- [x] 3.4 點欄位「移除」鈕（`title="移除"`）→ 該欄位文字從畫面消失
- [x] 3.5 點區段標題 → 該區段切換折疊（以 `collapsed` class 斷言）

## 4. 驗收

- [x] 4.1 `npm test`、`npm run type-check`、`npm run lint` 全綠
- [x] 4.2 `superpowers:verification-before-completion`：附證據再宣稱完成
- [x] 4.3 歸檔後刪除 `HANDOFF-pagelayout-backfill.md`
