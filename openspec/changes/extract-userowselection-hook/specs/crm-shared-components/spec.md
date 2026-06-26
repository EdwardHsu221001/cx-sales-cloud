## ADDED Requirements

### Requirement: 列選取共用 hook

CRM 清單頁的「列選取」狀態 SHALL 由共用 hook `useRowSelection(allIds)` 提供，回傳 `selected`、`isSelected`、`allSelected`、`toggle`、`toggleAll`、`deselect`、`clear`。`allSelected` MUST 由目前選取數與 `allIds` 衍生（`selected.size === allIds.length && allIds.length > 0`），MUST NOT 另存為獨立狀態。所有更新 MUST 採不可變更新（每次回傳新的 `Set`）。`toggleAll` 與 `allSelected` SHALL 以傳入的整份 `allIds` 為基準。Hook MUST NOT 處理 DOM 事件（如 `stopPropagation`），該責任留給呼叫端。

#### Scenario: 切換單列選取

- **WHEN** 對某 id 呼叫 `toggle`
- **THEN** 該 id 在已選時被移除、未選時被加入，且 `isSelected` 隨之反映

#### Scenario: 全選與全不選

- **WHEN** 在未全選狀態呼叫 `toggleAll`
- **THEN** `allIds` 全部成為已選且 `allSelected` 為真；再次呼叫 `toggleAll` 則全部清空

#### Scenario: allSelected 為衍生值

- **WHEN** 已選集合涵蓋目前 `allIds` 的全部
- **THEN** `allSelected` 為真；當 `allIds` 變動使涵蓋不再成立時，`allSelected` 自動變為假，無需手動同步

#### Scenario: 移除單一已選 id

- **WHEN** 對某已選 id 呼叫 `deselect`
- **THEN** 該 id 自選取集合移除，其餘不變
