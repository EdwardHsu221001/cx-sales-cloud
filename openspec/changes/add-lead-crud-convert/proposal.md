## Why

潛在客戶頁目前只有「查詢」是真的；新增/編輯/刪除/轉換都只是按鈕加 toast 佔位（`Leads.tsx` 的 `LEADS` 還是寫死 const，無法異動），使用者無法實際管理名單，也無法把談成意願的潛客推進到下一階段。本變更把潛客頁補成可用的 CRUD，並讓「轉換」真的鎖定潛客生命週期。

## What Changes

- 將 `LEADS` 由寫死 const 改為元件 `useState`，作為所有異動的資料來源。
- **新增**：透過「手動新增」開啟空白抽屜表單，填寫後建立一筆潛客。
- **編輯**：列上編輯鈕開啟抽屜（帶入現值），儲存後更新該筆。新增/編輯共用同一抽屜。
- **刪除**：列上刪除鈕 → 確認 modal（確定/取消）→ 移除單筆。
- **轉換**：確認後該筆 `status` → `converted`、`canConvert` → `false`、列顯示「已轉化」徽章並 disable 編輯/刪除（只鎖 Lead，本次不建立下游 Account/Contact/Opportunity 實體）。
- 把上方目前裝飾用的狀態下拉接成真的過濾，可切「全部／各狀態／已轉化」。
- `Status` 列舉新增終態 `converted`；負責人改用固定三人 `OwnerId` 下拉；`canConvert` 由 `status === 'toconvert'` 推導，不再手填。

## Capabilities

### New Capabilities
- `lead-management`: 潛客的建立、編輯、刪除、依狀態篩選，以及「轉換」鎖定（status→converted、列鎖定）的行為規格。

### Modified Capabilities
<!-- 無。leads-search 既有需求（關鍵字搜尋、計數同步、空狀態）不變；狀態篩選為新增的並行過濾，歸入 lead-management。 -->

## Impact

- `src/components/crm/Leads.tsx`：`LEADS` 改 state、新增 drawer/刪除確認/狀態篩選互動、ops cell 依 status 切換。
- `src/components/crm/leads.utils.ts`：`Status` 加 `converted`、新增 `LeadDraft`/`OwnerId`、新增純函式（validate/materialize/add/edit/delete/convert/filterByStatus）。
- 測試：`leads.utils.test.ts`（純函式）、`Leads.test.tsx`（互動流程）。
- CSS：複用既有 `cx-drawer` / `cx-modal-overlay`，預期不新增樣式。
- 無後端、無新依賴；資料仍為記憶體 mock。
