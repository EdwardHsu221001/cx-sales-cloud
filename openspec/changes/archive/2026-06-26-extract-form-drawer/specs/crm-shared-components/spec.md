## ADDED Requirements

### Requirement: 共用新增/編輯表單抽屜外框

CRM 頁面的**新增/編輯表單抽屜**（即填欄位、按儲存的那種；**非唯讀的「查看詳情」抽屜**）外框 SHALL 由共用元件 `FormDrawer` 提供，介面為 `crumbRoot`、`noun`、`isEdit`、`onClose`、`onSave` 與 `children`。各頁的唯讀詳情抽屜（hero/分頁/CTA/資訊清單）結構各異，MUST NOT 納入本元件。`FormDrawer` SHALL 由 `isEdit` 推導動作文案（真為「編輯」、否則「新增」），並以「動作 + `noun`」作為 `aria-label` 與標題 `<h2>`、以 `crumbRoot` 與動作組成麵包屑。欄位內容 MUST 由 `children` 提供，`FormDrawer` MUST NOT 知道任何特定實體的欄位。底部 SHALL 提供取消與儲存兩鈕，分別觸發 `onClose` 與 `onSave`；關閉鈕與點擊遮罩 SHALL 觸發 `onClose`。`FormDrawer` MUST NOT 處理鍵盤事件（Escape 由呼叫端負責）。

#### Scenario: 依 isEdit 呈現標題與動作

- **WHEN** 以 `isEdit={false}`、`noun="帳號"` 使用 `FormDrawer`
- **THEN** 標題與 `aria-label` 為「新增帳號」；改 `isEdit={true}` 時為「編輯帳號」

#### Scenario: 渲染呼叫端欄位

- **WHEN** 呼叫端把欄位以 children 傳入 `FormDrawer`
- **THEN** 這些欄位呈現在抽屜內容區

#### Scenario: 取消與儲存

- **WHEN** 使用者按下取消（或關閉鈕）
- **THEN** 觸發 `onClose`；按下儲存則觸發 `onSave`
