## Why

`Settings.tsx`（5000+ 行）shell 內仍有多個巢狀 `XxxPanel`。其中 `EmailPanel`、`PageLayoutPanel` 目前必須以內聯呼叫 `EmailPanel()` / `PageLayoutPanel()` 渲染（而非 `<Panel />`），因為它們本身不呼叫 hooks、只讀 shell state，一旦以 `<Panel />` 渲染便會於 shell 重渲時卸載重掛、導致搜尋框失焦與捲動位置重置。這個 inline-call 是既有的權宜寫法。經探索確認：兩者所讀的 shell state（`emailTemplates`/`emailSel`/`emailSearch`/`emailDraft`、`plObj`/`plLayout`/`plPalTab`/`plPalSearch`/`plSections`）皆為**面板專屬**、與 shell 的 `DetailDrawer` 及其他面板無共用。將這兩個面板抽為模組層級元件並把專屬 state 下放為 local state，即可一次獲得穩定 identity（免重掛）、移除 inline-call 權宜寫法，並讓 shell 顯著瘦身。此二者是「state 全為自身專屬、對 shell 無共用 state 牽連」的一批，抽離單純、收益最大（兩者皆為大型面板）。

## What Changes

- 新增 `settings/email/EmailPanel.tsx`、`settings/pagelayout/PageLayoutPanel.tsx`，各以 `export default function` 提供。
- 兩面板的內容原樣移入新檔；其原本讀取的 shell state 下放為面板 local state（`EmailPanel`：`emailTemplates`/`emailSel`/`emailSearch`/`emailDraft`；`PageLayoutPanel`：`plObj`/`plLayout`/`plPalTab`/`plPalSearch`/`plSections`，含專屬 helper `togglePlSection`/`removePlField`/`removePlSection`）。
- 各面板對 shell 的依賴僅為回呼，以 props 傳入：兩者皆收 `{ showToast, onNavigate }`（`onNavigate` 由 shell 以 `setActiveTab` 傳入，沿用 `DiscountPanel` 範式）。因兩面板與 `DetailDrawer` 無共用 state，**不需**傳額外的共用 state props。
- 將兩面板依賴的 module-level 資料常數自 `Settings.tsx` 移至 `settings.data.ts`（`EMAIL_CATS`/`EMAIL_SENT_30D`/`SIG`/`EMAIL_TEMPLATES_INIT`/`EMAIL_MERGE`、`PL_OBJECTS`/`PL_PILLS`/`PL_PALETTE`/`PL_SECTIONS_INIT`/`PL_REL`/`PL_ASSIGNED`/`PL_UNASSIGNED`）。面板專屬 helper 子元件（`EmailIco`/`MergeText`、`GripDots`/`PalFieldIcon`/`PLRelIcon`）隨面板搬入新檔。`email.utils.ts` / `pagelayout.utils.ts` 已是獨立模組，面板直接 import。
- `Settings.tsx` 移除這 2 個巢狀函式定義，改 `import` 後以 `<EmailPanel ... />` / `<PageLayoutPanel ... />` 渲染，**移除原本的 inline-call 權宜寫法與相關註解**。
- 純結構搬移，MUST NOT 改變執行期行為。

## Capabilities

### New Capabilities
<!-- 無新增 capability -->

### Modified Capabilities
- `crm-shared-components`: 既有 requirement「大型設定頁各模組面板抽為獨立元件」新增一條 scenario，明確將 `EmailPanel`/`PageLayoutPanel` 納入「獨立 import 元件」範圍，並敘明其原以 inline-call 渲染的權宜寫法於 state 下放後由 `<Panel />` 穩定 identity 取代。

## Impact

- `src/components/crm/settings/Settings.tsx`（移除 2 個巢狀面板與相關 module-level 資料、移除 inline-call、新增 import 與接線）
- 新增 `src/components/crm/settings/email/EmailPanel.tsx`、`pagelayout/PageLayoutPanel.tsx`
- `src/components/crm/settings/settings.data.ts`（接收搬移過來的常數）
- 無外部 API／相依套件變動；無資料行為變動。
