import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRowSelection } from './useRowSelection';

describe('useRowSelection', () => {
  it('toggle 加入未選的 id、移除已選的 id，isSelected 反映', () => {
    const { result } = renderHook(() => useRowSelection([1, 2, 3]));

    expect(result.current.isSelected(1)).toBe(false);
    act(() => result.current.toggle(1));
    expect(result.current.isSelected(1)).toBe(true);
    act(() => result.current.toggle(1));
    expect(result.current.isSelected(1)).toBe(false);
  });

  it('toggle 採不可變更新（回傳新的 Set）', () => {
    const { result } = renderHook(() => useRowSelection([1, 2, 3]));
    const before = result.current.selected;
    act(() => result.current.toggle(1));
    expect(result.current.selected).not.toBe(before);
  });

  it('toggleAll 全選與全不選 round-trip', () => {
    const { result } = renderHook(() => useRowSelection([1, 2, 3]));

    act(() => result.current.toggleAll());
    expect(result.current.allSelected).toBe(true);
    expect(result.current.selected).toEqual(new Set([1, 2, 3]));

    act(() => result.current.toggleAll());
    expect(result.current.allSelected).toBe(false);
    expect(result.current.selected.size).toBe(0);
  });

  it('allIds 為空時 allSelected 永遠為 false', () => {
    const { result } = renderHook(() => useRowSelection([]));
    expect(result.current.allSelected).toBe(false);
  });

  it('allSelected 為衍生值：allIds 變動後自動更新', () => {
    const { result, rerender } = renderHook(({ ids }) => useRowSelection(ids), {
      initialProps: { ids: [1, 2] },
    });

    act(() => result.current.toggleAll());
    expect(result.current.allSelected).toBe(true);

    // 清單新增一筆：原選取未涵蓋全部 → allSelected 自動變 false，無需手動同步
    rerender({ ids: [1, 2, 3] });
    expect(result.current.allSelected).toBe(false);

    // 清單縮回 → 又重新涵蓋全部 → 自動變 true
    rerender({ ids: [1, 2] });
    expect(result.current.allSelected).toBe(true);
  });

  it('deselect 移除單一已選 id，其餘不變', () => {
    const { result } = renderHook(() => useRowSelection([1, 2, 3]));
    act(() => result.current.toggleAll());

    act(() => result.current.deselect(2));
    expect(result.current.isSelected(2)).toBe(false);
    expect(result.current.isSelected(1)).toBe(true);
    expect(result.current.isSelected(3)).toBe(true);
  });

  it('clear 清空所有選取', () => {
    const { result } = renderHook(() => useRowSelection([1, 2, 3]));
    act(() => result.current.toggleAll());
    act(() => result.current.clear());
    expect(result.current.selected.size).toBe(0);
  });
});
