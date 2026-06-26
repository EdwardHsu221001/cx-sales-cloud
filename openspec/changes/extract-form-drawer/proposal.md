## Why

> 範圍界定：本變更只處理**新增/編輯表單抽屜**（填欄位→儲存的那種，`cx-emf-*` 外框）；**不碰各頁的唯讀「查看詳情」抽屜**（hero/分頁/CTA/資訊清單，結構各異，屬 Tier 3）。

`Leads.tsx`、`Accounts.tsx`、`Contacts.tsx` 三頁的新增/編輯表單抽屜**外框幾乎一字不差**（scrim + 抽屜 + 麵包屑列 + 標題 + grid 外殼 + 取消/儲存 footer），只有中間欄位不同。在 `add-contact-crud-search` 之後已有三個真實消費者（rule of three），抽成共用元件可去除重複並讓未來模組沿用一致的表單外框。

## What Changes

- 新增 `src/components/crm/FormDrawer.tsx`：負責表單抽屜的外框（chrome），欄位以 `children` 傳入。
- 介面 `<FormDrawer crumbRoot noun isEdit onClose onSave>{fields}</FormDrawer>`；內部計算 `action = isEdit ? '編輯' : '新增'`、`title = action + noun`（用於 `aria-label` 與 `<h2>`）、麵包屑 `<b>{crumbRoot}</b> ／ {action}`；footer 取消（`cx-btn-outline`）/儲存（`cx-btn-navy`）硬寫。
- `Leads.tsx`／`Accounts.tsx`／`Contacts.tsx` 三頁表單抽屜改用 `FormDrawer`，各刪約 30 行重複外框；欄位 labels、`draft`/`setField`/驗證留各頁。
- 抽出時順手統一：三頁關閉鈕都改用共用 `IconClose`（Contacts 目前用本地 `IcX`），`sp` spacer 標籤統一一種。
- 行為不變：開關時機、Escape（仍由各頁全域 keydown 處理）、儲存/取消流程皆照舊。

## Capabilities

### New Capabilities
<!-- 無新增 capability。 -->

### Modified Capabilities
- `crm-shared-components`: 新增「共用新增/編輯表單抽屜外框」需求 —— 規範 `FormDrawer` 的對外介面與外框結構（麵包屑/標題由 `crumbRoot`/`noun`/`isEdit` 推導、欄位由 children 提供、取消/儲存 callback）；明確不含唯讀詳情抽屜。

## Impact

- 新檔：`src/components/crm/FormDrawer.tsx` 與單元測試 `FormDrawer.test.tsx`。
- 既有：`Leads.tsx`、`Accounts.tsx`、`Contacts.tsx`（**僅新增/編輯表單抽屜**改用 FormDrawer，唯讀詳情抽屜不動；Contacts 關閉鈕 `IcX` → `IconClose`）。
- 不影響後端（本專案無後端）。範圍僅 Tier 2 第二項；明確排除 Tier 3（唯讀詳情抽屜）與 Pager。
- 回歸保證：現有三頁 `*.test.tsx` 與 `*.utils.test.ts`（141 tests）不需修改而維持全綠。
