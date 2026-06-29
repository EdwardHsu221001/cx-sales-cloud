'use client';

import { useState } from 'react';

/**
 * CRM 清單頁共用的「列選取」狀態。
 * - `allSelected` 為衍生值（不另存 state），清單變動時自動正確。
 * - 所有更新採不可變（每次回傳新的 Set）。
 * - 不處理 DOM 事件（如 stopPropagation），該責任留給呼叫端。
 *
 * @param allIds 整份清單的 id（作為全選與 allSelected 的基準）
 */
export function useRowSelection(allIds: number[]) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const allSelected = selected.size === allIds.length && allIds.length > 0;

  const isSelected = (id: number) => selected.has(id);

  const toggle = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(allIds));

  const deselect = (id: number) =>
    setSelected((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const clear = () => setSelected(new Set());

  return { selected, isSelected, allSelected, toggle, toggleAll, deselect, clear };
}
