import { describe, it, expect } from 'vitest';
import {
  filterLeads,
  filterLeadsByStatus,
  validateLeadDraft,
  materializeLead,
  addLead,
  editLead,
  deleteLead,
  convertLead,
  type Lead,
  type LeadDraft,
} from './leads.utils';

const LEADS: Lead[] = [
  { id: 1, name: '陳雅婷', company: '緯創資通' } as Lead,
  { id: 2, name: '林志明', company: '研華科技' } as Lead,
  { id: 3, name: 'John Smith', company: 'ACME Corp' } as Lead,
  { id: 4, name: '王大明', company: '台積科技' } as Lead,
];

function draft(over: Partial<LeadDraft> = {}): LeadDraft {
  return {
    name: '測試人',
    company: '測試公司',
    convertTitle: '',
    source: '官網',
    score: 'warm',
    status: 'new',
    contacts: ['email'],
    assignee: 'zhang',
    ...over,
  };
}

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

describe('validateLeadDraft', () => {
  it('姓名空白回報 nameError 且 ok 為 false', () => {
    const v = validateLeadDraft(draft({ name: '  ' }));
    expect(v.ok).toBe(false);
    expect(v.nameError).toBeTruthy();
  });

  it('公司空白回報 companyError 且 ok 為 false', () => {
    const v = validateLeadDraft(draft({ company: '' }));
    expect(v.ok).toBe(false);
    expect(v.companyError).toBeTruthy();
  });

  it('姓名與公司皆填則 ok 為 true 且無錯誤', () => {
    const v = validateLeadDraft(draft());
    expect(v.ok).toBe(true);
    expect(v.nameError).toBeUndefined();
    expect(v.companyError).toBeUndefined();
  });
});

describe('materializeLead', () => {
  it('補上衍生欄位（initial、負責人三欄）', () => {
    const lead = materializeLead(draft({ name: '陳雅婷', assignee: 'chen' }), 99);
    expect(lead.id).toBe(99);
    expect(lead.initial).toBe('陳');
    expect(lead.assigneeName).toBe('陳美華');
    expect(lead.assigneeInitial).toBe('陳');
    expect(lead.assigneeBg).toContain('linear-gradient');
  });

  it('canConvert 僅在 status 為 toconvert 時為 true', () => {
    expect(materializeLead(draft({ status: 'toconvert' }), 1).canConvert).toBe(true);
    expect(materializeLead(draft({ status: 'new' }), 1).canConvert).toBe(false);
    expect(materializeLead(draft({ status: 'followed' }), 1).canConvert).toBe(false);
  });

  it('有 id 時沿用草稿 id，否則用 newId', () => {
    expect(materializeLead(draft({ id: 7 }), 99).id).toBe(7);
    expect(materializeLead(draft(), 99).id).toBe(99);
  });
});

describe('filterLeadsByStatus', () => {
  const data: Lead[] = [
    { id: 1, status: 'new' } as Lead,
    { id: 2, status: 'toconvert' } as Lead,
    { id: 3, status: 'converted' } as Lead,
    { id: 4, status: 'new' } as Lead,
  ];

  it("'all' 回傳全部", () => {
    expect(filterLeadsByStatus(data, 'all')).toHaveLength(4);
  });

  it('指定狀態只回傳該狀態', () => {
    expect(filterLeadsByStatus(data, 'new').map((l) => l.id)).toEqual([1, 4]);
    expect(filterLeadsByStatus(data, 'converted').map((l) => l.id)).toEqual([3]);
  });

  it('不修改原始陣列', () => {
    const copy = [...data];
    filterLeadsByStatus(data, 'new');
    expect(data).toEqual(copy);
  });
});

describe('addLead', () => {
  it('回傳新陣列（不可變）且長度 +1', () => {
    const next = addLead(LEADS, draft({ name: '新人', company: '新公司' }), 100);
    expect(next).not.toBe(LEADS);
    expect(next).toHaveLength(LEADS.length + 1);
    expect(next[next.length - 1].name).toBe('新人');
    expect(next[next.length - 1].id).toBe(100);
  });
});

describe('editLead', () => {
  const data: Lead[] = [
    { id: 1, name: '舊名', company: 'A' } as Lead,
    { id: 2, name: '不動', company: 'B' } as Lead,
  ];

  it('回傳新陣列，只更新目標筆', () => {
    const next = editLead(data, draft({ id: 1, name: '新名', company: 'A' }));
    expect(next).not.toBe(data);
    expect(next.find((l) => l.id === 1)!.name).toBe('新名');
    expect(next.find((l) => l.id === 2)!.name).toBe('不動');
  });
});

describe('deleteLead', () => {
  it('回傳新陣列且移除目標筆', () => {
    const next = deleteLead(LEADS, 2);
    expect(next).not.toBe(LEADS);
    expect(next).toHaveLength(LEADS.length - 1);
    expect(next.find((l) => l.id === 2)).toBeUndefined();
  });
});

describe('convertLead', () => {
  const data: Lead[] = [
    { id: 1, status: 'toconvert', canConvert: true } as Lead,
    { id: 2, status: 'new', canConvert: false } as Lead,
  ];

  it('目標筆 status 變 converted 且 canConvert 為 false', () => {
    const next = convertLead(data, 1);
    const target = next.find((l) => l.id === 1)!;
    expect(target.status).toBe('converted');
    expect(target.canConvert).toBe(false);
  });

  it('不可變更新（回傳新陣列、不動其他筆）', () => {
    const next = convertLead(data, 1);
    expect(next).not.toBe(data);
    expect(next.find((l) => l.id === 2)).toEqual(data[1]);
  });
});
