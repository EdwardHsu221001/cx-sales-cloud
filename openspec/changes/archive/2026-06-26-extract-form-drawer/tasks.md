## 1. FormDrawer 元件（TDD）

- [x] 1.1 建立 `src/components/crm/FormDrawer.tsx`：介面 `crumbRoot`/`noun`/`isEdit`/`onClose`/`onSave`/`children`；渲染 scrim + `aside.cx-drawer.open`（`aria-label`=動作+noun）+ `cx-dw-bar`（麵包屑 + `IconClose` 關閉鈕）+ `cx-emf-hero`（h2）+ `cx-dw-body cx-emf-body` + `cx-emf-grid`{children} + `cx-emf-foot`（取消/儲存）
- [x] 1.2 RED/GREEN：`FormDrawer.test.tsx` — `isEdit` 切換時 `aria-label`/標題為「新增{noun}」/「編輯{noun}」
- [x] 1.3 RED/GREEN：children 欄位渲染於內容區；按關閉鈕/取消觸發 `onClose`、按儲存觸發 `onSave`

## 2. Leads.tsx 新增/編輯表單抽屜改用 FormDrawer（唯讀詳情抽屜不動）

- [x] 2.1 將新增/編輯抽屜 `{drawer && (…表單外框…)}` 換成 `<FormDrawer crumbRoot="潛在客戶" noun="潛客" isEdit={drawer.id != null} onClose={() => setDrawer(null)} onSave={saveDraft}>`，欄位 labels 作為 children
- [x] 2.2 刪除原本表單抽屜的 scrim/aside/bar/hero/body/grid/foot 外框與不再使用的 import（不動唯讀詳情抽屜）

## 3. Accounts.tsx 新增/編輯表單抽屜改用 FormDrawer（唯讀詳情抽屜不動）

- [x] 3.1 同上，`crumbRoot="客戶帳號"`、`noun="帳號"`、`isEdit={draft.id != null}`、`onClose={() => setDraft(null)}`、`onSave={saveDraft}`
- [x] 3.2 刪除原本表單抽屜外框與不再使用的 import（不動唯讀詳情抽屜）

## 4. Contacts.tsx 新增/編輯表單抽屜改用 FormDrawer（唯讀詳情抽屜不動）

- [x] 4.1 同上，`crumbRoot="聯絡人"`、`noun="聯絡人"`、`isEdit={draft.id != null}`、`onClose={() => setDraft(null)}`、`onSave={saveDraft}`
- [x] 4.2 刪除原本表單抽屜外框（不動唯讀詳情抽屜）；關閉鈕由 `IcX` 改為共用 `IconClose`（若 `IcX` 因此不再使用則移除）

## 5. 驗收

- [x] 5.1 既有回歸安全網不修改而全綠：`Leads.test.tsx`／`Accounts.test.tsx`／`Contacts.test.tsx`
- [x] 5.2 `npm test`（含新 `FormDrawer` 測試）、`npm run lint`、型別檢查全綠
