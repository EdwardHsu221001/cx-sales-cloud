import { describe, it, expect } from 'vitest';
import { filterLeads, type Lead } from './leads.utils';

const LEADS: Lead[] = [
  { id: 1, name: '陳雅婷', company: '緯創資通' } as Lead,
  { id: 2, name: '林志明', company: '研華科技' } as Lead,
  { id: 3, name: 'John Smith', company: 'ACME Corp' } as Lead,
  { id: 4, name: '王大明', company: '台積科技' } as Lead,
];

describe('filterLeads', () => {
  it('依姓名過濾，只回傳姓名相符的潛客', () => {
    const result = filterLeads(LEADS, '雅婷');
    expect(result.map((l) => l.id)).toEqual([1]);
  });

  it('依公司過濾，只回傳公司相符的潛客', () => {
    const result = filterLeads(LEADS, '研華');
    expect(result.map((l) => l.id)).toEqual([2]);
  });

  it('比對不分大小寫', () => {
    const result = filterLeads(LEADS, 'acme');
    expect(result.map((l) => l.id)).toEqual([3]);
  });

  it('採子字串部分相符', () => {
    const result = filterLeads(LEADS, 'Smith');
    expect(result.map((l) => l.id)).toEqual([3]);
  });

  it('一個關鍵字可同時命中多筆（OR 跨欄、子字串）', () => {
    const result = filterLeads(LEADS, '科技');
    expect(result.map((l) => l.id)).toEqual([2, 4]);
  });

  it('空字串回傳全部', () => {
    expect(filterLeads(LEADS, '')).toHaveLength(LEADS.length);
  });

  it('全空白字串回傳全部', () => {
    expect(filterLeads(LEADS, '   ')).toHaveLength(LEADS.length);
  });

  it('無相符回傳空陣列', () => {
    expect(filterLeads(LEADS, '不存在的關鍵字')).toEqual([]);
  });

  it('不修改原始陣列', () => {
    const copy = [...LEADS];
    filterLeads(LEADS, '雅婷');
    expect(LEADS).toEqual(copy);
  });
});
