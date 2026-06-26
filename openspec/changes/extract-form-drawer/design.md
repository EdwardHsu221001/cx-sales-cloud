## Context

`add-lead-crud-convert`、`add-account-crud-search`、`add-contact-crud-search` 各自做了「新增/編輯表單抽屜」，三者的外框（scrim + `cx-drawer` + `cx-dw-bar` 麵包屑 + `cx-emf-hero` 標題 + `cx-dw-body cx-emf-body` + `cx-emf-grid` + `cx-emf-foot` 取消/儲存）幾乎一字不差，只有中間欄位不同。`extract-crm-shared-components`、`extract-userowselection-hook` 已建立「外框/邏輯抽共用、放 `crm/`」的範式（`ConfirmModal`/`SearchPill`/`useRowSelection`）。本變更比照處理表單抽屜外框，屬 Tier 2 第二項，且此時已有三個真實消費者（rule of three）。

## Goals / Non-Goals

**Goals:**

- 抽出 `FormDrawer` 外框元件，去除三頁重複的抽屜外殼。
- 介面以 children 收欄位，外框只關心 chrome（麵包屑/標題/footer）。
- 行為與視覺保持不變；既有 141 測試不需修改而維持綠。

**Non-Goals:**

- 不碰唯讀詳情抽屜（Tier 3，結構與用途不同）。
- 不抽 Pager；不動各頁欄位、`draft`/`setField`/驗證邏輯。
- 不改任何使用者可見行為（開關時機、Escape、儲存/取消流程照舊）。

## Decisions

**1. 由呼叫端條件掛載。** 維持現狀 `{draft && <FormDrawer>…}`，掛載即開啟，不需 `open` prop。
理由：欄位 children 參考 `draft`，掛載時 `draft` 必非空，最單純。
替代方案：永遠掛載 + `open` prop（如 ConfirmModal）——children 需在 `draft` 為空時防呆，較囉嗦，否決。

**2. children = 欄位本身。** `FormDrawer` 提供 `cx-dw-body cx-emf-body` + `cx-emf-grid` 外殼，children 只放欄位 `<label>`。
理由：最大化共用 markup，呼叫端最精簡。

**3. 傳原始值 `crumbRoot`/`noun`/`isEdit`。** 「編輯/新增」文案邏輯收進 `FormDrawer`（`action = isEdit ? '編輯' : '新增'`、`title = action + noun`）。
理由：DRY，文案邏輯只寫一處。
替代方案：傳整串 `title`/`crumb`/`ariaLabel`——`FormDrawer` 更笨更通用，但「編輯/新增」邏輯仍散在三頁，否決。

**4. Escape 不進 FormDrawer。** 三頁本就有全域 keydown 關閉抽屜；`FormDrawer` 不處理鍵盤，與 `ConfirmModal` 一致。

**5. 抽出時順手統一。** 三頁關閉鈕都改用共用 `IconClose`（Contacts 目前用本地 `IcX`，路徑相同）；`sp` spacer 標籤統一一種。
理由：外框抽成單一元件後本就只有一份；對齊不增風險。

## Risks / Trade-offs

- [改寫三頁抽屜外框不慎改動行為/可及性] → 以「既有三頁測試不修改而維持全綠」為硬約束；其中 Leads/Accounts/Contacts 測試已涵蓋開抽屜、填欄位、儲存、必填錯誤、aria-label 查詢。
- [`FormDrawer` 介面過度貼合現況、日後欄位以外的差異（如多步、footer 變化）需逃生艙] → YAGNI；目前三頁 footer/結構一致，待真有差異再加 props。
- [Contacts 關閉鈕 `IcX` → `IconClose` 視覺些微差異] → 兩者 path 相同（`M18 6 6 18M6 6l12 12`），等價。

## Migration Plan

純前端、無資料遷移。順序：先建 `FormDrawer.tsx` + 單元測試 → 改 Leads → 改 Accounts → 改 Contacts（各把抽屜外框替換為 `<FormDrawer>`、欄位留 children、關閉鈕統一 `IconClose`）→ 跑新測試 + 既有 141 測試 + lint + 型別檢查。回滾即還原這批檔案。

## Open Questions

無（介面與統一項已於 brainstorming 收斂並確認）。
