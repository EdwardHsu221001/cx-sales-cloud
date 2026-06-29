import { describe, it, expect } from 'vitest';
import { pageLayoutStats, filterPalette, type PLPaletteGroup } from './pagelayout.utils';

// 對應 Settings.tsx 的 PL_PILLS 結構：4 物件、版面總數 5
const PILLS: Record<string, string[]> = {
  '商機 Opportunity': ['商機 — 業務版面', '商機 — 主管版面'],
  '客戶帳號 Account': ['客戶帳號 — 標準版面'],
  '報價單 Quote__c': ['報價單 — 審核版面'],
  '聯絡人 Contact': ['聯絡人 — 標準版面'],
};

const GROUPS: PLPaletteGroup[] = [
  {
    g: '標準欄位',
    items: [
      { n: '競爭對手', t: '文字(80)' },
      { n: '折扣率', t: '百分比' },
    ],
  },
  {
    g: '自訂欄位',
    items: [
      { n: '產業別', t: '選項清單', c: 'violet' },
      { n: '合約編號', t: '文字(40)', c: 'violet' },
    ],
  },
];

describe('pageLayoutStats', () => {
  it('版面總數=各物件版面數總和、套用物件=物件數', () => {
    expect(pageLayoutStats(PILLS)).toEqual({ layouts: 5, objects: 4 });
  });

  it('空對應表回傳 0/0', () => {
    expect(pageLayoutStats({})).toEqual({ layouts: 0, objects: 0 });
  });
});

describe('filterPalette', () => {
  it('空字串回傳原樣（不過濾）', () => {
    expect(filterPalette(GROUPS, '')).toBe(GROUPS);
  });

  it('全空白回傳原樣（不過濾）', () => {
    expect(filterPalette(GROUPS, '   ')).toBe(GROUPS);
  });

  it('以名稱關鍵字過濾', () => {
    const res = filterPalette(GROUPS, '折扣');
    expect(res).toHaveLength(1);
    expect(res[0].items.map((i) => i.n)).toEqual(['折扣率']);
  });

  it('以型別關鍵字過濾', () => {
    const res = filterPalette(GROUPS, '選項清單');
    expect(res.flatMap((g) => g.items.map((i) => i.n))).toEqual(['產業別']);
  });

  it('大小寫不敏感', () => {
    const groups: PLPaletteGroup[] = [{ g: 'g', items: [{ n: 'PoC 完成', t: '核取方塊' }] }];
    expect(filterPalette(groups, 'poc')[0].items).toHaveLength(1);
  });

  it('過濾後移除空群組', () => {
    const res = filterPalette(GROUPS, '產業');
    expect(res).toHaveLength(1);
    expect(res[0].g).toBe('自訂欄位');
  });

  it('全部不符回傳空陣列', () => {
    expect(filterPalette(GROUPS, 'zzz不存在')).toEqual([]);
  });
});
