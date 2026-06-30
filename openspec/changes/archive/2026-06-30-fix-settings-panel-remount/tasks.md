## 1. 內聯化面板呼叫

- [x] 1.1 `Settings.tsx:3551-3555` 將 `<UserContent />`、`<ProfileContent />`、`<PermSetContent />`、`<FlowContent />`、`<BatchContent />` 改為 `UserContent()`、`ProfileContent()`、`PermSetContent()`、`FlowContent()`、`BatchContent()`，保留 `state.type === 'x' &&` 條件短路
- [x] 1.2 確認五個 `*Content` 函式定義未被更動（僅改呼叫端）

## 2. 驗證

- [x] 2.1 執行 `npm run lint` 確認 `Settings.tsx` 的 5 個 `react-hooks/static-components` error 消失，且無新增問題 — Settings.tsx 由 5 errors → 0 errors（11 個既有 warning 保留，不在本變更範圍）
- [x] 2.2 執行 `npm run type-check`（`tsc --noEmit`）確認無型別錯誤 — 通過（exit 0）
- [x] 2.3 執行 `npm test`（vitest）確認既有測試全綠（含 `Settings.pagelayout.test.tsx`、`Settings.email.test.tsx`）— 14 檔 147 測試全綠
- [ ] 2.4 人工驗證：開啟 user/profile/permset/flow/batch 五種設定詳情面板，於欄位輸入並捲動後觸發重渲，確認焦點與捲動位置維持不變 — **未執行**（需啟動 dev server 實際操作；可代為跑）
