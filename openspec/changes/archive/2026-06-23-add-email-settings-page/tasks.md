## 1. 資料模型與型別移植

- [x] 1.1 在 `Settings.tsx` 定義郵件相關型別：`EmailCategory`、`EmailBlock`（discriminated union: greet/p/cta/quote/sig）、`EmailTemplate`、`EmailMergeGroup`
- [x] 1.2 移植 `EMAIL_CATS`（5 分類，含名稱/色碼/variant）常數
- [x] 1.3 移植 `EMAIL_TEMPLATES`（12 範本，含 key/cat/icon/on/used/from/to/lang/subj/body）常數，逐筆對照 HTML 來源
- [x] 1.4 移植 `EMAIL_MERGE`（5 群組合併欄位）與簽名預設常數
- [x] 1.5 移植範本中文名稱對映（`tplName`）與圖示

## 2. 合併欄位高亮 helper（TDD）

- [x] 2.1 RED：為 `renderMergeText` 寫測試——一般文字保留、`{{Token}}` 切為合併欄位片段、混合字串順序正確
- [x] 2.2 GREEN：實作以 regex 將文字切片並渲染 `<span className="em-mf">` 的 helper（純函式 + 渲染）

## 3. EmailPanel 元件

- [x] 3.1 實作 `EmailPanel`：crumbs、set-head（標題 + 測試寄送/新增範本按鈕）
- [x] 3.2 統計列：範本總數/啟用中/分類數由資料推導，近 30 日寄送沿用設計常數
- [x] 3.3 左側清單：依分類分組渲染、列出名稱/分類/最後使用/啟用狀態指示
- [x] 3.4 搜尋框 + 即時過濾（名稱/主旨/分類名），空群組隱藏，無結果顯示提示
- [x] 3.5 右側詳情：名稱+啟用徽章、中繼資料格、主旨、信件預覽（各 block 渲染）+ 合併欄位套用高亮
- [x] 3.6 合併欄位面板：依群組渲染可點擊欄位標籤
- [x] 3.7 選取狀態以 `useState`（預設第一個範本）；點清單列切換詳情
- [x] 3.8 動作按鈕（測試寄送/新增/複製/編輯/合併欄位點擊）一律呼叫 `showToast`

## 4. 接線與導覽

- [x] 4.1 移除 `email` 項目的 `ph:true`（`NAV_GROUPS`）
- [x] 4.2 render 區加入 `{activeTab === 'email' && <EmailPanel />}`
- [x] 4.3 `isFullPanel` 陣列加入 `'email'`（避免落入 PlaceholderPanel）

## 5. 樣式移植

- [x] 5.1 將 HTML 的 `em-*` 樣式（統計列、em-split、清單、詳情卡、信件預覽、合併欄位面板）移植至 `src/app/crm.css`

## 6. 元件測試（TDD）

- [x] 6.1 RED：測試——進入郵件設定頁顯示標題，預設選取第一個範本並顯示其主旨
- [x] 6.2 測試——搜尋過濾：輸入關鍵字後僅顯示符合範本；無結果顯示「查無符合的範本」
- [x] 6.3 測試——點選另一範本後右側詳情更新
- [x] 6.4 GREEN：使測試通過，確認 `npm test` 與 `npm run type-check` 綠燈

## 7. 驗收

- [x] 7.1 `npm run lint`、`npm run type-check`、`npm test` 全綠
- [x] 7.2 視覺對照 HTML 來源逐區核對（統計列/清單/詳情/合併欄位）
